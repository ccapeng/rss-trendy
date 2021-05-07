# RSS API

- What's in this project?
    - Load RSS news from New York Times, Washington Post, CNN in cron job.
    - Some data filtering.
    - Save data into MongoDB.
    - Output REST API data.
    - Save access log and rotate daily.
    - Machine learning: topic modeling. The current model still need to improve.
    - Elastic search (coming).

- To start `npm run dev`

- REST URL end points
    - http://127.0.0.1:5000/
    - http://127.0.0.1:5000/api/rssfeeds

- REST URL access log is under `log` folder.