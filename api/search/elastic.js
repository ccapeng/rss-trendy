import { Client } from '@elastic/elasticsearch';

const ES_HOST = process.env.ES_HOST || 'http://localhost:9200';
const client = new Client({
	node: ES_HOST,
	log: 'trace'
});

const INDEX_RSS = "RSS";

// check that elasticsearch is up and running
const pingElastic = async() => {
    try {
        await client.ping();
        console.log('Elasticsearch Ready:', ES_HOST);
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}

// insert data in bulk
const indexSearch = async(items) => {

    try {
        let body = items.flatMap(
            obj => [{ index: { _index: INDEX_RSS } }, obj]
        );
        let results = await client.bulk({ 
            refresh: true,
            body
        });
        console.log('data indexed:', results.body.items.length);
    } catch (e) {
        console.err("indexSearch error:", e);
    }
}

export {
    indexSearch,
	pingElastic
}