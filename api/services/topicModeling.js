import lda from 'lda';

//set topic modeling
const setTopicModeling = (sentence) => {
    let documents = sentence.match(/[^\.!\?]+[\.!\?]+/g);
    let result = lda(documents, 2, 5);
    
    let topics = [];
    let termSet = new Set()
    for (let items of result) {
        for (let item of items) {
            if (item.probability > 0.3) {
                termSet.add(item.term);
            }
        }
    }
    if (termSet.size > 0) {
        topics = Array.from(termSet);
    }
    return topics;
}

export {
    setTopicModeling
}