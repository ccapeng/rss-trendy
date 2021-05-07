# RSS
RSS news feed from New York Times, Washington Post, CNN.

## Database MongoDB  
- Run your MongoDB in the localhost port 27017.

## Backend  
- It's nodejs.
- Run at local host port 5000.
- REST URL end points
    - http://127.0.0.1:5000/
    - http://127.0.0.1:5000/api/rssfeeds
- REST URL access log is under `log` folder.
- Features :
    - Cron job to load RSS news from New York Times, Washington Post, CNN.
    - Data filtering.
    - Save data into MongoDB.
    - Output REST API data.
    - Save access log and rotate daily.
    - Machine learning: topic modeling. The current model still need to improve.
    - Elastic search (coming).


## Frontend  
- It's React.
- Run at local host port 3000.

## Docker Composer  
- Clone the project: `git clone https://github.com/ccapeng/rss-trendy.git`

- To build: `docker-compose build`  
    I only test it in windos WSL.

- To run: `docker-compose up`
    - Backend nodejs run at port 5000.
    - Frontend react run at port 3000.
    - To check it, open browaser [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Enhancements
Some other features are coming soon.
- Elastic Search.
- Web server.