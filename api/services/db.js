import { default as mongodb } from 'mongodb';
const MongoClient = mongodb.MongoClient;

let mongoDBServer =  process.env.mongoDBServer || "localhost";
//const mongoUrl = 'mongodb://localhost:27017/';
//const mongoUrl = 'mongodb://mongodb:27017/';
const mongoUrl = `mongodb://${mongoDBServer}:27017/`;
let client, db;

const initDB = async(dbName) => {
    try {
        dbName = dbName || process.env.DB || "rss-feed";
        
        console.log("db url:", mongoUrl);
        client = await MongoClient.connect(
            mongoUrl, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        db = client.db(dbName);
        console.log("db connected:", dbName);
    } catch(e) {
        console.error("database initialized error:", e); 
        client.close();
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
