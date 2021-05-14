//process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';

import { db } from "../services/db.js";
//import { initFeed } from "../services/rss.js";
import { server } from '../server.js';

let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('RSS Feed', () => {
    
    /*
    * Test the /GET route
    */

    describe('/GET feed', () => {

        it('it should GET rss items', () => {
            chai.request(server)
            .get('/')
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('array');
                console.log("Get items:", res.body.length);
                res.body.length.should.be.gt(0);

                resolve();
            });
        });

    });

    // describe('/GET blank feed', () => {

    //     it('it should GET empty rss items', () => {
    //         return new Promise(function(resolve){
    //             db.collection("rsssource").drop().then(()=>{
    //                 console.log("source dropped");
    //                 db.collection("rssitem").drop().then(()=> {
    //                     console.log("item dropped");
    //                 });
    //                 return Promise.resolve("drop both");
    //             }).then(()=>{
    //                 console.log("Get blank???");
                    
    //                 chai.request(server)
    //                     .get('/')
    //                     .end((err, res) => {
                            
    //                         res.should.have.status(200);
    //                         res.body.should.be.a('array');
    //                         console.log("Get items:", res.body.length);
    //                         res.body.length.should.be.gt(0);

    //                         resolve();
    //                     });

    //             });
    //         });
    //     });
    // });

    // describe('/GET news items', () => {
    //     it('it should GET all rss items after loaded', () => {
    //         return new Promise(function(resolve){
    //             initFeed().then(()=> {
    //                 console.log("reloaded");
    //                 return Promise.resolve("resolved reload");
    //             }).then(() => {
    //                 chai.request(server)
    //                     .get('/')
    //                     .end((err, res) => {
    //                         res.should.have.status(200);
    //                         res.body.should.be.a('array');
    //                         res.body.length.should.be.gt(0);
    //                         resolve();
    //                 });
    //             });
    //         });
    //     });
    // });

});