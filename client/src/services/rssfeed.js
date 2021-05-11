import Request from "./request";

const RssFeedService = {
  list: (obj) => {
    let url;
    if (typeof(obj) !== "undefined") {
      if (obj.topic) {
        url = "api/rss?topic=" + obj.topic;
      } else if (obj.search) {
        url = "api/rss?search=" + obj.search;
      } else {
        url = "api/rss";  
      }
    } else {
      url = "api/rss";
    }
    console.log("url", url);
    return Request.get(url);
  },
  get: (guid) => {
    let url = `api/rss/${guid}`;
    return Request.get(url);
  }
}

export default RssFeedService;