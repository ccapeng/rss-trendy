import fs from 'fs';
import cron from 'node-cron';
import Parser from "rss-parser";
import { db } from "./db.js";
import { setTopicModeling } from "./topicModeling.js";
import { dateTimeFormatter } from "./logger.js";

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

    //special cases in nytimes
    if (url.indexOf("nytimes.com") > -1) {
        feed.items.forEach((item, index, object) => {
            // remove bad data
            delete item.categories;
            // items excluded
            if (
                item.link.indexOf("/crosswords") > -1 ||
                item.link.indexOf("/puzzles/") > -1
            ) {
                object.splice(index, 1);
            }
        });
    }
    feed.items = feed.items.filter(item => {
        if (item.pubDate != null) {

            // use isoDate as pubDate
            try {
                if (item.isoDate != null) {
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
    console.log("Loading items:", dateTimeFormatter.format(Date.now()));
    const itemCollection = db.collection("rssitem");
    let feedSources = await getFeedSources();
    let feedItems = await getFeedItems(itemCollection);

    // Put existing rss item uniqe link into set
    // in order to validate if duplicated in new load items.
    const linkSet = new Set();
    for (const item of feedItems) {
        linkSet.add(item.link);
    }
    console.log("Current items:", linkSet.size);

    let insertedCount = 0;
    for (const source of feedSources) {
        try {
            let feed = await parser.parseURL(source.url);
            feed = filterData(feed, source.url);

            let newItems = [];
            feed.items.forEach(item => {
                // check link if not in the existing rss item
                if (!linkSet.has(item.link)) {
                    let topics = setTopicModeling(item.title);
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
            }
        } catch(e) {
            console.error("source error:", e);
        }
    }
    console.log(
        "Inserted items:", insertedCount, 
        "at:", dateTimeFormatter.format(Date.now())
    );
};

// task scheduling
let minutes =  process.env.rssReloadInterval || 5;
const reloadFeedItems = async() => {
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
    console.log("Schedule Pattern:", schedulePattern);
    cron.schedule(schedulePattern, () => {
        loadFeedItems();
    });
}

export {
    reloadFeedItems,
    loadFeedItems
}