import app from "./app.js";
import { reloadFeedItems } from "./load.js";

reloadFeedItems();

const server = app.listen(5000, () => {
  console.log(`Server start: ${server.address().port}`);
});