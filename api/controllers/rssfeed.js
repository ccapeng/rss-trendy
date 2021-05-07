import { db } from "../services/db.js";
import { dateTimeFormatter } from "../services/logger.js";

const getRssFeeds = async (req, res) => {
    console.log("getRssFeeds", req.params);
    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();
    let topicSet = new Set();
    let topic = req.query.topic;
    console.log("query:", topic);

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
        console.log(obj);
        if (topic) { // if topic specified
            if (obj.topics && obj.topics.includes(topic)) {
                outputItems.push(obj); 
            }
        } else {
            outputItems.push(obj);
        }
    });
    let output = {
        "list": outputItems
    }

    // current topic
    if (topic) {
        output.topic = topic;
    }

    // all topics
    if (topicSet.size>0){
        output.topicList = Array.from(topicSet).sort();
    }

    res.json(output);
};

export {
    getRssFeeds
}