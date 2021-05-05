import Request from "./request";

const RssFeedService = {
  list: () => {
    let url = "api/rssfeeds";
    return Request.get(url);
  },
  get: (guid) => {
    let url = `api/rssfeeds/${guid}`;
    return Request.get(url);
  }
}

export default RssFeedService;