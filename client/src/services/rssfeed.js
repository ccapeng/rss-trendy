import Request from "./request";

const RssFeedService = {
  list: (topic) => {
    let url;
    if (topic) {
      url = "api/rss?topic=" + topic;
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