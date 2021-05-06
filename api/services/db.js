import { default as mongodb } from 'mongodb';
const MongoClient = mongodb.MongoClient;

let mongoDBServer =  process.env.mongoDBServer || "localhost";
//const mongoUrl = 'mongodb://localhost:27017/';
//const mongoUrl = 'mongodb://mongodb:27017/';
const mongoUrl = `mongodb://${mongoDBServer}:27017/`;
console.log("mongoUrl:", mongoUrl);

var client, db;

const initDB = async(dbName) => {
    console.log("init DB:", dbName);
    try{
        client = await MongoClient.connect(
            mongoUrl, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        //db = client.db('rss-feed');
        db = client.db(dbName);
    }
    catch(err) {
        console.error(err); 
        client.close();
    }
}

//await initDB();

export {
    client,
    db,
    initDB
}
