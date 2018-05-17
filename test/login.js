process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
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
                    expect(res).to.have.status(401);
                })
        });
    });
    describe('with valid credentials', () => {
        it('should return a user object', () => {
            return chai.request(server).post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('user');
                    expect(res.body.user).to.be.a('object');
                    expect(res.body.user).to.have.property('roles');
                    expect(res.body.user.roles).to.be.a('array');
                    expect(res.body.user.roles).to.include('WSTADMIN');
                });
        });
    });
})
