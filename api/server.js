import { initDB } from "./db.js";
import app from "./app.js";
import { reloadFeedItems } from "./load.js";

let db = process.env.DB || "rss-feed";
await initDB(db);
await reloadFeedItems();

let port = process.env.PORT || 5000;
export const server = app.listen(port, () => {
  console.log(`Server start: ${server.address().port}`);
});  