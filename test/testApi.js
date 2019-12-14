process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

beforeEach(function () {
    var db = require('../db/db')();
    console.log("Before each test")
  });

describe('/POST comment', () =>{
    it('It should Post the comments successfully', (done)=>{
        let body = {
            comment: "Testing the post comment API"
        }
        chai.request(server)
            .post('/orgs/test_org/comment')
            .send(body)
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('error').eql(false);
                res.body.should.have.property('message').eql('The comment has been successfully posted.');
            done();
            })
    })
})

describe('/GET comment', () =>{
    it('It should Fetch the comments successfully', (done)=>{
        chai.request(server)
            .get('/orgs/test_org/comment')
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('error').eql(false);
                res.body.should.have.property('message').eql('The comments have been fetched.');
                res.body.data.should.be.a('array');
            done();
            })
    })
})

describe('/DELETE comment', () =>{
    it('It should Delete all the comments of test_org successfully', (done)=>{
        chai.request(server)
            .delete('/orgs/test_org/comment')
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('error').eql(false);
                res.body.should.have.property('message').eql('The comments have been soft deleted.');
            done();
            })
    })
})

describe('/GET members', () =>{
    it('It should Get all members of the org successfully', (done)=>{
        chai.request(server)
            .get('/orgs/test_org/members')
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('error').eql(false);
                res.body.should.have.property('message').eql('Members have been successfully fetched.');
            done();
            })
    })
})