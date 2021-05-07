import lda from 'lda';

// set topic modeling
// still looking a way to improve.
const setTopicModeling = (title, content, categories) => {

    const getTopics = (sentence, probability) => {
        let topics = [];
        let doc = sentence.match(/[^\.!\?]+[\.!\?]+/g);
        let results = lda(doc, 2, 5);
        for (let items of results) {
            for (let item of items) {
                if (item.probability > probability) {
                    topics.push(item.term);
                }
            }
        }
        return topics;
    }

    let topics = [];
    let termSet = new Set()

    let titleTopics = getTopics(title, 0.3);
    titleTopics.forEach(topic=>termSet.add(topic));

    // content topic modeling, only take probability higher than 0.2
    if (content) {
        let contentTopics = getTopics(content, 0.3);
        contentTopics.forEach(topic=>termSet.add(topic));
    }

    // categories topic modeling, only take probability higher than 0.3
    // since from news source, should have higher accuracy
    if (categories) {
        let categoryTopics = getTopics(categories.join(" "), 0.3);
        categoryTopics.forEach(topic=>termSet.add(topic));
    }

    if (termSet.size > 0) {
        topics = Array.from(termSet);
        topics.sort();
    }
    return topics;
}

export {
    setTopicModeling
}