import { db } from "../services/db.js";
import { dateTimeFormatter } from "../services/logger.js";

const getOutputObj = (item) => {
    let obj = {
        title: item.title,
        link: item.link,
        pubDate: dateTimeFormatter.format(item.pubDate)
    };
    return obj;
}

const getAll = async(req, res) => {
    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();
    let topicSet = new Set();

    let outputItems = [];
    feedItems.forEach(item =>{
        let obj = getOutputObj(item);
        if (item.topics) {
            item.topics.forEach(topic=>topicSet.add(topic));
            obj.topics = item.topics;
        }
        outputItems.push(obj);
    });

    res.json({
        list: outputItems,
        topicList: Array.from(topicSet).sort()
    });
}

const getTopicList = async(req, res, topic) => {

    const itemCollection = db.collection("rssitem");
    let feedItems = await itemCollection.find().sort({pubDate:-1}).toArray();

    let outputItems = [];
    feedItems.forEach(item =>{
        if (item.topics && item.topics.includes(topic)) {
            let obj = getOutputObj(item);
            obj.topics = item.topics;
            outputItems.push(obj); 
        }
    });

    res.json({
        listByTopic: outputItems,
        topic: topic
    });

}

const getSearchList = async(req, res, search) => {
    let outputItems = [];
    res.json({
        listBySearch: outputItems,
        search
    });
}

const getRssFeeds = async (req, res) => {
    let topic = req.query.topic;
    let search = req.query.search;
    console.log("query", topic, search);
    if (typeof(search) !=="undefined") {
        return getSearchList(req, res, search);
    } else if (typeof(topic) !=="undefined") {
        return getTopicList(req, res, topic);
    } else {
        return getAll(req, res);
    }

};

export {
    getRssFeeds
}