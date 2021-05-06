import { db } from "../services/db.js";
import { dateTimeFormatter } from "../services/logger.js";

const getRssFeeds = async (req, res) => {
    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();
    //pubDate: new Date(item.pubDate).toLocaleString("en-US", {timeZone:"EST"})
    let outputItems = feedItems.map(item =>{
        let obj = {
            title: item.title,
            link: item.link,
            pubDate: dateTimeFormatter.format(item.pubDate)
        };
        if (item.topics) {
            obj.topics = item.topics;
        }
        return obj;
    });
    console.log("Get Feeds", outputItems.length);
    res.json(outputItems);
};

export {
    getRssFeeds
}