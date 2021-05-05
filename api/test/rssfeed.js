//process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';

import { db } from "../db.js";
import { reloadFeedItems } from "../load.js";
import { server } from '../server.js';

let should = chai.should();

//await db.collection("rsssource").drop();
//await db.collection("rsssitem").drop();

chai.use(chaiHttp);

//Before each test we empty the database
// const cleanData = async() => {
//     // await db.collection("rsssource").drop();
//     // await db.collection("rsssitem").drop();
// }

//Our parent block
describe('RSS Feed', () => {
    
    /*
    * Test the /GET route
    */
    // describe('/GET blank feed', () => {
    //     it('it should GET empty rss items', (done) => {
    //     chai.request(server)
    //         .get('/')
    //         .end((err, res) => {
                    
    //             res.should.have.status(200);
    //             res.body.should.be.a('array');
    //             res.body.length.should.be.eql(0);

    //             done();
    //         });
    //     });
    // });

    //reloadFeedItems();

    describe('/GET news items', () => {
        //it('it should GET all rss items after loaded', (done) => {
        it('it should GET all rss items after loaded', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('array');
                //res.body.length.should.be.eql(0);

                done();
            });
        });
    });

});