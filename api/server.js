import app from "./app.js";
import { reloadFeedItems } from "./load.js";

// loadFeedItems();
// var minutes = 3, reloadInterval = minutes * 60 * 1000;
// setInterval(function() {
//   loadFeedItems();
// }, reloadInterval);
reloadFeedItems();

const server = app.listen(8080, () => {
  console.log(`Server start: ${server.address().port}`);
});