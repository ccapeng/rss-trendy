import { default as mongodb } from 'mongodb';
const MongoClient = mongodb.MongoClient;

let mongoDBServer =  process.env.mongoDBServer || "localhost";
//const mongoUrl = 'mongodb://localhost:27017/';
//const mongoUrl = 'mongodb://mongodb:27017/';
const mongoUrl = `mongodb://${mongoDBServer}:27017/`;
let client, db;

const initDB = async(dbName) => {
    try{
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

export {
    client,
    db,
    initDB
}
