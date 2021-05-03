import Parser from "rss-parser";
import { db } from "./db.js";
import fs from 'fs';

const parser = new Parser();

const getFeedSources = async() => {
    let sources = await db.collection("rsssource").find().toArray();
    if (sources.length == 0) {
        try {
            const data = fs.readFileSync('./rss-source.json', 'utf8');
            sources = JSON.parse(data);
            const sourceCollection = db.collection("rsssource")
            await sourceCollection.insertMany(sources);
            console.log("Insert sources:", sources);
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
            if (item.isoDate != null) {
                item.pubDate = new Date(item.isoDate);
            } else {
                item.pubDate = item.pubDate
                    .replace(/ GMT/,"")
                    .replace(/ \+0000/,"");
            }
            return item;
        }
    });
    return feed;
}

const loadFeedItems = async() => {
    console.log("Loading items:", Date());
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
        let feed = await parser.parseURL(source.url);
        feed = filterData(feed, source.url);

        let newItems = [];
        feed.items.forEach(item => {
            // check link if not in the existing rss item
            if (!linkSet.has(item.link)) {
                newItems.push(item);
            }
        });

        // Batch insert
        if (newItems.length > 1) {
            insertedCount += newItems.length;
            const result = await itemCollection.insertMany(newItems);
            if (result && result.insertedIds) {
                console.log(`Inserted items from ${source.url}`, result.insertedIds);
            }
        }
    }
    console.log("Inserted items:", insertedCount);
};

// load rss news in every 3 minutes
// let minutes = 3;
let minutes =  process.env.rssReloadInterval || 3;
console.log("RSS reload interval:", minutes);
const reloadInterval = minutes * 60 * 1000;
const reloadFeedItems = async() => {
    loadFeedItems();
    setInterval(function() {
        loadFeedItems();
    }, reloadInterval);
}

export {
    reloadFeedItems
}