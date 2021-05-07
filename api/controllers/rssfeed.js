import { db } from "../services/db.js";
import { dateTimeFormatter } from "../services/logger.js";

const getRssFeeds = async (req, res) => {
    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();
    let topicSet = new Set();
    let topic = req.query.topic;

    let outputItems = [];
    feedItems.forEach(item =>{
        let pubDate = dateTimeFormatter.format(item.pubDate);
        let obj = {
            title: item.title,
            link: item.link,
            pubDate: pubDate
        };
        if (item.topics) {
            item.topics.forEach(topic=>topicSet.add(topic));
            obj.topics = item.topics;
        }

        if (topic) { // if topic specified
            if (obj.topics && obj.topics.includes(topic)) {
                outputItems.push(obj); 
            }
        } else {
            outputItems.push(obj);
        }
    });

    let output;
    if (topic) {
        output = {
            "listByTopic": outputItems
        }
        output.topic = topic;
    } else {
        output = {
            "list": outputItems
        }
        // list all topics
        if (topicSet.size>0){
            output.topicList = Array.from(topicSet).sort();
        }
    }
    res.json(output);
};

export {
    getRssFeeds
}