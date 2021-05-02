import { db } from "../db.js";

const getRssFeeds = async (req, res) => {
    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();
    let outputItems = feedItems.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleString("en-US", {timeZone:"EST"})
    }));
    console.log("Get Feeds", outputItems.length);
    res.json(outputItems);
};

export {
    getRssFeeds
}