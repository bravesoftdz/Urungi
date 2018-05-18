process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;
const assert = chai.assert;
var CryptoJS = require('crypto-js');
chai.use(chaiHttp);
var agent = chai.request.agent(server);
var Users = connection.model('Users');
after((done) => {
	agent.close();
    // Close pending connections
    var p1 = new Promise(resolve => {

        connection.close(() => { resolve(); });
    });
    var p2 = new Promise(resolve => {
        redisClient.on('end', () => { resolve(); });
        if (redisClient.connected) {
      		  redisClient.quit();}
        else{
        	resolve();
       								}
    });
   Promise.all([p1, p2]).then(() => { done(); }).catch(() => { done(); });
});
describe ('get /api/admin/users/find-all',function(){
	it ('should return status 200',function(){
		return agent.post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                    expect(res).to.have.status(200);
                    return agent.get('/api/admin/users/find-all')
               			.then(res => {
                    	expect(res).to.have.status(200);
                    	console.log(decrypt(res.text));
                    	var decrypted = decrypt(res.text);
                    	expect (decrypted).to.be.a('object');
                    	expect(decrypted).to.have.property('result');
                    	expect(decrypted).to.have.property('page');
                    	expect(decrypted).to.have.property('pages');
                    	expect(decrypted.items).to.be.a('array');
                    	expect(decrypted.items);
                    	expect(decrypted.items[0]).to.have.property('_id');
                    	expect(decrypted.items[0]).to.have.property('userName','administrator');
                    	expect(decrypted.items[0]).to.have.property('companyID','COMPID');
                    	expect(decrypted.items[0]).to.have.property('status','active');
                    	expect(decrypted.items[0]).to.have.property('nd_trash_deleted');
                    	expect(decrypted.items[0]).to.have.property('salt');
                    	expect(decrypted.items[0]).to.have.property('hash');
                    	expect(decrypted.items[0]).to.have.property('__v');
                    	expect(decrypted.items[0]).to.have.property('last_login_date');
                    	expect(decrypted.items[0]).to.have.property('last_login_ip').to.be.an.ip;
                    	expect(decrypted.items[0]).to.have.property('privateSpace');
                    	expect(decrypted.items[0]).to.have.property('dialogs');
                    	expect(decrypted.items[0]).to.have.property('contextHelp');
                    	expect(decrypted.items[0]).to.have.property('filters');
                    	expect(decrypted.items[0]).to.have.property('roles').to.be.a('array').to.include('WSTADMIN');
                					})

                })
		
	})
})
describe ('get /api/admin/users/find-one',function(){
	it ('should return status 200 1',function(){
		return agent.post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                    expect(res).to.have.status(200);
                    return agent.get('/api/admin/users/find-one')
               			.then(res => {
                    	expect(res).to.have.status(200);
                    	//console.log(decrypt(res.text));
                    	var decrypted = decrypt(res.text);
                        	expect(decrypted).to.have.property('result',0);
                        	expect(decrypted).to.have.property('msg');
                        	

                    	
                    		})
                    	})
                    })
                })

	it ('should return status 200 2',function(){
		return agent.post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                    expect(res).to.have.status(200);
                    return Users.findOne({userName : 'administrator'}).then(function(User){
                    	//console.log(User.id);
 						return agent.get('/api/admin/users/find-one').query({id : User.id})
               				.then(res => {
                    		expect(res).to.have.status(200);
                    		//console.log(decrypt(res.text));
                    		var decrypted = decrypt(res.text);
                        		expect(decrypted).to.have.property('result',1);
                        		expect(decrypted).to.have.property('item');
                        		expect(decrypted.item).to.have.property('_id');
                        		expect(decrypted.item).to.have.property('userName');
                        		expect(decrypted.item).to.have.property('companyID');
                        		expect(decrypted.item).to.have.property('status');
                        		expect(decrypted.item).to.have.property('nd_trash_deleted');
                        		expect(decrypted.item).to.have.property('__v');
                        		expect(decrypted.item).to.have.property('last_login_date');
                        		expect(decrypted.item).to.have.property('last_login_ip').to.be.an.ip;
                        		expect(decrypted.item).to.have.property('privateSpace');
                        		expect(decrypted.item).to.have.property('startDate');
                        		expect(decrypted.item).to.have.property('dialogs');
                        		expect(decrypted.item).to.have.property('contextHelp');
                        		expect(decrypted.item).to.have.property('filters');
                        		expect(decrypted.item).to.have.property('roles').to.be.a('array').to.include('WSTADMIN');




                    })
               	})
            })
        })
describe ('post /api/admin/users/create',function(){
	it ('should return status 200 ',function(){
		return agent.post('/api/login')
                .send({ userName: 'administrator', password: 'widestage' })
                .then(res => {
                	expect(res).to.have.status(200);
               			return agent.post('/api/admin/users/create')
               				.send({ userName : 'test' , pwd1 : 'testPassword'})
               				.then(res => {
                    			expect(res).to.have.status(200);
                    			//console.log(decrypt(res.text));
                    			var decrypted = decrypt(res.text);
                        		expect(decrypted).to.have.property('result',1);
                        		expect(decrypted).to.have.property('msg','User created.');
                        		expect(decrypted).to.have.property('user');
                        		expect(decrypted.user).to.have.property('__v');
                        		expect(decrypted.user).to.have.property('userName');
                        		expect(decrypted.user).to.have.property('companyID');
                        		expect(decrypted.user).to.have.property('status');
                        		expect(decrypted.user).to.have.property('nd_trash_deleted');
                        		expect(decrypted.user).to.have.property('salt');
                        		expect(decrypted.user).to.have.property('hash');
                        		expect(decrypted.user).to.have.property('_id');
                        		expect(decrypted.user).to.have.property('privateSpace');
                        		expect(decrypted.user).to.have.property('startDate');
                        		expect(decrypted.user).to.have.property('dialogs');
                        		expect(decrypted.user).to.have.property('contextHelp');
                        		expect(decrypted.user).to.have.property('filters');
                        		expect(decrypted.user).to.have.property('roles');
                    			return Users.deleteOne({userName: 'test'});
                    		})
                 })
    })
		    		
})
    	
describe ('post /api/admin/users/update/5afec7c6932ee02352204146',function(){
	it ('should return status 200 ',function(){
		return agent.post('/api/login')
                .send({ userName: 'update', password: 'password' })
                .then(res => {
                	expect(res).to.have.status(200);	
                		return agent.post( '/api/admin/users/update/5afec7c6932ee02352204146')
                			.send({})
                			.then(res =>{
                				expect(res).to.have.status(200);
                				console.log(decrypt(res.text));
                			})

                })
    })
		    		
})


                   

function decrypt(data){
	var object = JSON.parse(data.substr(6));
	var decrypted = CryptoJS.AES.decrypt(object.data, "SecretPassphrase");
 return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}