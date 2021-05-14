import lda from 'lda';

// set topic modeling
// still looking a way to improve.
const setModeling = (title, content, categories) => {

    const getTopicsFromResults = (results, probability) => {
        for (let items of results) {
            for (let item of items) {
                if (item.probability > probability) {
                    topics.push(item.term);
                }
            }
        }
        return topics;
    }

    const getTitleTopics = (sentence, probability) => {
        let doc;
        if (sentence.indexOf(".") > -1) {
            doc = sentence.match(/[^\.!\?]+[\.!\?]+/g);
        } else {
            doc = [sentence];
        }
        let results = lda(doc, 2, 5);
        return getTopicsFromResults(results, probability);
    }

    const getContentTopics = (sentence) => {
        let doc;
        if (sentence.indexOf(".") > -1) {
            doc = sentence.match(/[^\.!\?]+[\.!\?]+/g);
        } else {
            doc = [sentence];
        }
        let results = lda(doc, 2, 5);
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            if (result.length > 0) {
                for (let j = 0; j < result.length; j++) {
                    if (j == 0) {
                        topics.push(result[0].term);
                    } else {
                        if (result[j].probability > 0.15) {
                            topics.push(result[j].term);
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        return topics;
    }

    // const getArrayTopics = (arr, probability) => {
    //     let results = lda(arr, 2, 5);
    //     return getTopicsFromResults(results, probability);
    // }

    let topics = [];
    let termSet = new Set()

    // since from news source, should have higher accuracy
    if (categories) {
        // let categoryTopics = getArrayTopics(categories, 0.3);
        // categoryTopics.forEach(topic=>termSet.add(topic));
        // add special rule to avoid long category name
        categories.forEach(category=>{
            category = category.replace(/\(|\)/g,"").trim();
            if (category.split(" ").length < 3) {
                termSet.add(category)
            }
        });
    } else {
        let titleTopics = getTitleTopics(title, 0.3);
        titleTopics.forEach(topic=>termSet.add(topic));

        // content topic modeling, only take probability higher than 0.2
        if (content) {
            let contentTopics = getContentTopics(content);
            contentTopics.forEach(topic=>termSet.add(topic));
        }
    }

    if (termSet.size > 0) {
        topics = Array.from(termSet);
        topics.sort();
    }
    return topics;
}

export {
    setModeling
}