let mongoose = require("mongoose");
let PermissionModule = require('./../server/Models/PermissionModule');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);

describe('Permission Modules', () => {
  describe('/GET PermissionModules', () => {
	  it('it should GET all the permissionmodules', (done) => {
			chai.request(server)
		    .get('/API/PermissionModuleGetAll')
            .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });
 });
