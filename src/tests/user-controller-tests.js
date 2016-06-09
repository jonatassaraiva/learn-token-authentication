'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

let server = require('../app');

describe('appInfo', function() {
  it('to have status 200 on / GET', (done) => {
    chai.request(server)
      .get('/')
      .end(function (error, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('to be object json appInfo on /GET', (done) => {
    chai.request(server)
      .get('/')
      .end(function (error, res) {
        expect(res).to.be.json;
        expect(res).to.be.an('object');
        done();
      });
  }); 
});