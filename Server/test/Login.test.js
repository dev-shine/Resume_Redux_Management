let mongoose = require("mongoose");
let User = require('./../server/Models/User');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
describe('Login', () => {

  describe('Check Login', () => {
    //Check Whether the user is valid or not.
	  it('it should GET an application by the given id', (done) => {
	  	let user = new User({
  				FirstName: 'Login User',
  				LastName: 'Check',
  				ContactNumber: '7845125623',
  				Email: 'login@check.com',
  				Password: '12345678',
  				IsActive: true,
  				IsDelete: false
        });
	  	user.save((err, activeUser) => {
	  		chai.request(server)
        .post('/LoginDetails')
		    .send({
                Email: activeUser.Email,
                Password : activeUser.Password
            })
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
          res.body.should.have.property('id_token');
		      done();
		    });
	  	});
	  });


    //If the invalid user credentials passed
    it('it should GET an application by the given id', (done) => {
        chai.request(server)
        .post('/LoginDetails')
        .send({
                Email: "dummy@user.com",
                Password : "dummyuser"
            })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('result').eql([]);
          res.body.should.have.property('message').eql("Conflict");
          res.body.should.have.property('id_token');
          done();
        });
    });

});
});
