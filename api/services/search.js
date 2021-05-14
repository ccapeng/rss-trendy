import { Client } from '@elastic/elasticsearch';

const ESServer =  process.env.ESServer || 'localhost';
const ESUrl = `http://${ESServer}:9200/`;
const client = new Client({
	node: ESUrl,
	log: 'trace'
});

const INDEX = process.env.ESIndex || "rss";

// check that elasticsearch is up and running
const ping = async() => {
    try {
        await client.ping();
        console.log('elasticsearch ready:', ESUrl);
        let result = await client.indices.exists({index: INDEX});
        if (result && result.statusCode === 200) {
            console.log(`elasticsearch index ${INDEX} exist`);
        } else if (result.statusCode === 404) {
            await client.indices.create( {index: INDEX});
            console.log(`elasticsearch index ${INDEX} created`);
        }
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

// index data in bulk
const index = async(url, items) => {

    try {
        let body = items.flatMap(
            obj => {
                let _id = obj._id;
                delete obj._id; //avoid _id duplicated in body
                return [
                    { 
                        index: { 
                            _index: INDEX,
                            _id
                        } 
                    }, 
                    obj
                ]
            }
        );
        let results = await client.bulk({ 
            refresh: true,
            body
        });
        console.log('elastic indexed:', results.body.items.length, url);
    } catch (e) {
        console.error("indexSearch error:", JSON.stringify(e, null, 4));
    }
}

const getSearchItems = async(search) => {

    let cond = {
        index: INDEX
    }
    if (typeof(search) === "string") {
        cond.body = {
            query: {
                multi_match : {
                    query: search,
                    fields: [
                        "title", 
                        "description", 
                        "categories",
                        "content",
                        "contentSinppet"
                    ]
                }
            }
        }
    }
    let { body } = await client.search(cond);
    return body.hits.hits;

}

export {
    index as indexSearch,
	ping as pingSearch,
    getSearchItems
}