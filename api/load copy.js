import { default as mongodb } from 'mongodb';
import Parser from "rss-parser";

const MongoClient = mongodb.MongoClient;
const parser = new Parser();

// let db = null;

// const loadDB = async(callback) => {
//     MongoClient.connect(
//         'mongodb://localhost:27017/', 
//         function(err, dbClient) {
//             if(err) { 
//                 console.error(err);
//             }
//             db = dbClient.db('rss-feed');
//             if (callback && typeof(callback) === "function") {
//                 callback(dbClient);
//             }
//         }
//     );
// }

const mongoUrl = 'mongodb://localhost:27017/';
let client, db;

const initDB = async() => {
    try{
        client = await MongoClient.connect(
            mongoUrl, 
            {useNewUrlParser: true}
        );
        db = client.db('rss-feed');
    }
    catch(err){
        console.error(err); 
    } finally{ 
        //client.close(); 
    }
}

const getFeedSources = async() => {
    return await db.collection("rsssource").find().toArray();
}

const getFeedItems = async() => {
    return await db.collection("rssitem").find().toArray();
}

const filterData = (feed, url) => {
    if (url.indexOf("nytimes.com") > -1) {
        feed.items.forEach(item => {
            delete item.categories;
        });
    }
    return feed;
}

//const loadFeedItems = async(dbClient) => {
const loadFeedItems = async() => {

    let feedSources = await getFeedSources();
    let feedItems = await getFeedItems();

    const guidSet = new Set();
    for (const item of feedItems) {
        guidSet.add(item.guid);
    }
    console.log("guidSet", guidSet.size)
    for (const source of feedSources) {
        let feed = await parser.parseURL(source.url);
        feed = filterData(feed, source.url);
        let j = 1;
        feed.items.forEach(item => {
            if (!guidSet.has(item.guid)) {
                db.collection("rssitem").insert(item,
                    function(err, res) {
                        if (err) {
                            //console.log(item);
                            console.error(err);
                        } else {
                            console.log("Inserted:", res.insertedIds);
                        }
                    }
                );
            }
        });
    }
    //dbClient.close();
};

// let callback = loadFeedItems;
// loadDB(callback);

await initDB();
//await loadFeedItems(client);
await loadFeedItems();
client.close();