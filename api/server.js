import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import logger from './services/logger.js';
import routes from './routes/rssfeed.js';
import { initDB } from "./services/db.js";
import { initFeed } from "./services/rss.js";

let envFileName;
console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
if (process.env && process.env.NODE_ENV) {
  envFileName = '.env.' + process.env.NODE_ENV;
} else {
  envFileName = '.env.dev';
}
console.log("env:", envFileName);
dotenv.config({path: envFileName});

// init database and backend server
await initDB();
await initFeed();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log
app.use(morgan('combined', {stream: logger.stream}));

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

// routes
app.use('/', routes);

const printRoutes = (routes) => {
  routes.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log("server route:",r.route.path);
    }
  })
}

let port = process.env.PORT || 5000;
let host = process.env.HOST || "127.0.0.1";
export const server = app.listen(port, () => {
  console.log(`server start: ${host}:${port}`);
  printRoutes(routes);
});