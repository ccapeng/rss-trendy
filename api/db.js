import { default as mongodb } from 'mongodb';
const MongoClient = mongodb.MongoClient;

//const mongoUrl = 'mongodb://localhost:27017/';
const mongoUrl = 'mongodb://mongodb:27017/';

var client, db;

const initDB = async() => {
    console.log("initDB");
    try{
        client = await MongoClient.connect(
            mongoUrl, 
            {useNewUrlParser: true}
        );
        db = client.db('rss-feed');
    }
    catch(err) {
        console.error(err); 
        client.close();
    }
}

await initDB();

export {
    client,
    db
}
