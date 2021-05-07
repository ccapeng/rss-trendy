import lda from 'lda';

//set topic modeling
const setTopicModeling = (title, content) => {

    let topics = [];
    let termSet = new Set()

    // title topic modeling,, only take probability higher than 0.3
    let titleDoc = title.match(/[^\.!\?]+[\.!\?]+/g);
    let titleResults = lda(titleDoc, 2, 5);
    for (let items of titleResults) {
        for (let item of items) {
            if (item.probability > 0.3) {
                termSet.add(item.term);
            }
        }
    }

    // content top modeling, only take probability higher than 0.2
    if (content) {
        let contentDoc = content.match(/[^\.!\?]+[\.!\?]+/g);
        let contentResults = lda(contentDoc, 2, 5);
        for (let items of contentResults) {
            for (let item of items) {
                if (item.probability > 0.2) {
                    termSet.add(item.term);
                }
            }
        }
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