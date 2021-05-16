import fs from 'fs';
import cron from 'node-cron';
import Parser from "rss-parser";
import { db } from "./db.js";
import { setModeling } from "./topic.js";
import { dateTimeFormatter } from "./logger.js";
import { pingSearch, indexSearch } from './search.js';

const parser = new Parser();

const getFeedSources = async() => {
    let sources = await db.collection("rsssource").find().toArray();
    if (sources.length == 0) {
        try {
            const data = fs.readFileSync('./rss-source.json', 'utf8');
            sources = JSON.parse(data);
            const sourceCollection = db.collection("rsssource")
            await sourceCollection.insertMany(sources);
            console.log("Insert sources:", sources.length);
        } catch (err) {
            console.log(`Error sources: ${err}`);
        }
    }
    return sources;
}

const getFeedItems = async(itemCollection) => {
    return await itemCollection.find().toArray();
}

const filterData = (feed, url) => {
    const parseCategories = (list) => {
        let newList = [];
        list.forEach( item => {
            if (item._) {
                newList.push(item._);
            }
        });
        return newList;
    }

    //special cases in nytimes
    if (url.indexOf("nytimes.com") > -1) {
        let index = feed.items.length - 1;
        while (index >= 0){
            const item = feed.items[index];
            if (item.categories) {
                item.categories = parseCategories(item.categories);
            }
            if (
                item.link.indexOf("/crosswords") > -1 ||
                item.link.indexOf("/puzzles/") > -1
            ) {
                feed.items.splice(index, 1);
            }
            index -= 1;
        }

    }
    feed.items = feed.items.filter(item => {
        if (item.pubDate != null) {
            try {
                if (item.isoDate != null) { // use isoDate as pubDate
                    item.pubDate = new Date(item.isoDate);
                } else {
                    item.pubDate = new Date(item.pubDate
                        .replace(/ GMT/,"")
                        .replace(/ \+0000/,"")
                    );
                }
            } catch(e) {
                console.error(e);
            }
            return item;
        }
    });
    return feed;
}

// Load RSS feed items. 
// Use dateTimeFormatter.format() for the consistency and better performance().
const loadFeedItems = async() => {

    let isSearchRunning = await pingSearch();
    console.log("db loading items:", dateTimeFormatter.format(Date.now()));
    const itemCollection = db.collection("rssitem");
    let feedSources = await getFeedSources();
    let feedItems = await getFeedItems(itemCollection);

    // Put existing rss item uniqe link into set
    // in order to validate if duplicated in new load items.
    const linkSet = new Set();
    for (const item of feedItems) {
        linkSet.add(item.link);
    }
    console.log("db current items:", linkSet.size);

    let insertedCount = 0;
    for (const source of feedSources) {
        try {
            let feed = await parser.parseURL(source.url);
            feed = filterData(feed, source.url);

            let newItems = [];
            feed.items.forEach(item => {
                // check link if not in the existing rss item
                if (!linkSet.has(item.link)) {
                    let title = item.title;
                    let content, categories;
                    if (item.contentSinppet) {
                        content = item.contentSinppet;
                    } else if (item.content) {
                        content = item.content.replace(/<\/?[^>]+(>|$)/g, "");
                    } else if (item.description) {
                        content = item.description.replace(/<\/?[^>]+(>|$)/g, "");
                    }
                    if (item.categories) {
                        categories = item.categories;
                    }
                    let topics = setModeling(title, content, categories);
                    if (topics.length > 0) {
                        item.topics = topics;
                    }
                    newItems.push(item);
                }

            });

            // batch insert
            if (newItems.length > 1) {
                insertedCount += newItems.length;
                const result = await itemCollection.insertMany(newItems);
                // if (result && result.insertedIds) {
                //     console.log(`Inserted items from ${source.url}`);
                // }
                if (isSearchRunning) {
                    indexSearch(source.url, newItems);
                }
            }
        } catch(e) {
            console.error("source error:", source.url);
            console.error(e);
        }
    }
    console.log(
        "db inserted items:", insertedCount, 
        "at:", dateTimeFormatter.format(Date.now())
    );
};

// task scheduling by minutes
let minutes =  process.env.rssReloadInterval || 5;
const initFeed = async() => {
    await loadFeedItems();
    let now = new Date().getMinutes();
    let mod = now % minutes;
    let i = mod;
    let minuteList = [];
    do {
        minuteList.push(i);
        i = i + minutes;
    } while (i < 60);
    let minuteListStr = minuteList.join(",");
    let schedulePattern = `${minuteListStr} * * * *`;
    console.log("rss cron job schedule pattern:", schedulePattern);
    cron.schedule(schedulePattern, () => {
        loadFeedItems();
    });
}

export {
    initFeed,
    loadFeedItems
}