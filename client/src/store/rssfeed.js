import { atom } from "jotai";

export const initialRssState = {
    status: "init",
    type: "",
    topic: "",
    search: "", 
    list: [],
    listByTopic: [],
    listBySearch: []
}

export const initiarRssSearchState = {
    search: ""
}

export const rssAtom = atom(initialRssState)
export const rssSearchAtom = atom(initiarRssSearchState)