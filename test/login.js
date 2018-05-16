process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

after((done) => {
    // Close pending connections
    var p1 = new Promise(resolve => {
        connection.close(() => { resolve(); });
    });
    var p2 = new Promise(resolve => {
        redisClient.on('end', () => { resolve(); });
        redisClient.quit();
    });
    Promise.all([p1, p2]).then(() => { done(); });
});


describe('POST /api/login', () => {
    describe('with invalid credentials', () => {
        it('should return status 401', () => {
            return chai.request(server).post('/api/login')
                .send({ userName: 'administrator', password: 'invalidpassword' })
                .then(res => {
                    res.should.have.status(401);
                })
        });
    });
    describe('with valid credentials', () => {
        it('should return a user object', () => {
            return chai.request(server).post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('roles');
                    res.body.user.roles.should.be.a('array');
                    res.body.user.roles.should.include('WSTADMIN');
                });
        });
    });
})
