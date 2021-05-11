# RSS API

- What's in this project?
    - Cron job to load RSS news from New York Times, Washington Post, CNN.
    - Data filtering.
    - Save data into MongoDB.
    - Output REST API data.
    - Save access log and rotate daily.
    - Machine learning: topic modeling.  
      The current model still need to improve.
      Use [lda](https://github.com/primaryobjects/lda) base on [Latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation) algorithm. In here, I just present the idea.
    - Elastic search (coming).

- To start `npm run dev`

- REST URL end points
    - http://127.0.0.1:5000/
    - http://127.0.0.1:5000/api/rss

- REST URL access log is under `logs` folder.