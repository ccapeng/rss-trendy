import { getItems } from "../services/db.js";
import { getSearchItems } from "../services/search.js";
import { dateTimeFormatter } from "../services/logger.js";

const getOutputObj = (item) => {
    let obj = {
        title: item.title,
        link: item.link,
        pubDate: dateTimeFormatter.format(item.pubDate)
    };
    return obj;
}

const getSearchOutputObj = (item) => {
    // convert pubDate from string to Date, then format it
    let pubDate = new Date(item.pubDate
        .replace(/ GMT/,"")
        .replace(/ \+0000/,"")
    );
    let obj = {
        title: item.title,
        link: item.link,
        pubDate: dateTimeFormatter.format(pubDate)
    };
    if (item.topics) {
        obj.topics = item.topics;
    }
    return obj;
}

const getAll = async(req, res) => {

    let feedItems = await getItems();
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

    let feedItems = await getItems();
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
    let feedItems = await getSearchItems(search);
    let outputItems = [];
    let outputSet = new Set();
    feedItems.forEach(item =>{
        if (!outputSet.has(item._source.link)) {
            outputSet.add(item._source.link);
            let obj = getSearchOutputObj(item._source);
            outputItems.push(obj);
        }
    });
    res.json({
        listBySearch: outputItems,
        search
    });
}

const getRssFeeds = async (req, res) => {
    let topic = req.query.topic;
    let search = req.query.search;
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