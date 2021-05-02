import express from 'express';
import routes from './routes/rssfeed.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// import our routes
app.use('/', routes);
routes.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log("Route:", r.route.path)
    }
});

// export the app
export default app;