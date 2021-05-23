import { default as mongodb } from 'mongodb';
const MongoClient = mongodb.MongoClient;

let mongoDBServer =  process.env.mongoDBServer || "localhost";
//const mongoUrl = 'mongodb://localhost:27017/';
//const mongoUrl = 'mongodb://mongodb:27017/';
const mongoUrl = `mongodb://${mongoDBServer}:27017/`;
let client, db;
const SOCKET_TIME_OUT_MS = 10000; 
const CONNECTION_TIMEOUT_MS = 10000;

const initDB = async(dbName) => {

    const _init = async()=> {
        
        console.log("db url:", mongoUrl, "loading...");
        client = await MongoClient.connect(
            mongoUrl, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                socketTimeoutMS: SOCKET_TIME_OUT_MS, 
                connectTimeoutMS: CONNECTION_TIMEOUT_MS                 
            }
        );

        db = client.db(dbName);
        console.log("db connected:", dbName);

    }

    let count = 0, maxTrial = 10, sleepInterval = 5000;
    dbName = dbName || process.env.DB || "rss-feed";
    try {
        await _init();
    } catch(e) {

        if (count < maxTrial) {
            console.error("db error:", e);
            console.log("db not ready");
            count++;
            await new Promise(resolve => setTimeout(resolve, sleepInterval));
            console.log("sleep:", sleepInterval)
            await _init();
        } else {
            console.error("db initialized error:", e); 
            client.close();
        }
    }
}

const getItems = async() => {
    const itemCollection = db.collection("rssitem");
    let items = await itemCollection.find().sort({pubDate:-1}).toArray();
    return items;
}

export {
    client,
    db,
    initDB,
    getItems
}
