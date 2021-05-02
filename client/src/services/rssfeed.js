import Request from "./request";

const RssFeedService = {
  list: () => {
    let url = "api/rssFeeds";
    return Request.get(url);
  },
  get: (guid) => {
    let url = `api/rssFeeds/${guid}`;
    return Request.get(url);
  }
}

export default RssFeedService;