# RSS
RSS news feed from New York Times, Washington Post, CNN.

## Database MongoDB  
- Run MongoDB in the localhost port 27017.

## Elastic Search
- Run Elastic Search in the localhost port 9200.

## Backend  
- It's nodejs.
- Run at local host port 5000.
- REST URL end points
    - http://127.0.0.1:5000/
    - http://127.0.0.1:5000/api/rss
- REST URL access log is under `log` folder.
- Features :
    - Cron job to load RSS news from New York Times, Washington Post, CNN.
    - Data filtering.
    - Save data into MongoDB.
    - Index search data into Elastic Search
    - Output REST API data.
    - Save access log and rotate daily.
    - Machine learning: topic modeling.  
      The current model still need to improve.

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
    - Use nginx as web server.  
      To check it, open browser [http://127.0.0.1/](http://127.0.0.1/)
    - If one of services can't start up,  
      please run `docker-compose restart.`  
      nginx, mongoDB and elastic search images take a while to download.  
      That is the main reason to timeout.
      To avoid that, you can set `export COMPOSE_HTTP_TIMEOUT=360`  
      Or, put a higher number.
