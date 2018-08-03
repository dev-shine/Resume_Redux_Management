let mongoose = require("mongoose");
let Role = require('./../server/Models/Role');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

describe('Roles', () => {

  describe('/GET Role', () => {
	  it('it should GET all the roles', (done) => {
			chai.request(server)
		    .get('/API/RoleGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Role', () => {

    // Required Field RoleName missing
	  it('it should not POST an Role without RoleName field', (done) => {
	  	let role = {
          RoleName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/RoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(role)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('RoleName');
			  	res.body.errors.RoleName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Role ', (done) => {
	  	let role = {
           RoleName: 'Test4 Role',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/RoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(role)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('RoleName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Role without field values ', (done) => {
      let role = {
           RoleName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/RoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(role)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('RoleName');
			  	res.body.errors.RoleName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id role', () => {
    ///Get an Role by the valid given RoleId.
	  it('it should GET an role by the given id', (done) => {
	  	let role = new Role({
          RoleName: "GetById Role",
          IsActive: true,
          IsDelete: false
      });
	  	role.save((err, role) => {
	  		chai.request(server)
        .get('/API/RoleGetById/' + role._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(role)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(role._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Role with the invalid RoleId / A random string
    it('it should give an error as the RoleId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/RoleGetById/' + 'abc')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('status');
          res.body.errors.should.have.property('status').eql(500);
			  	 res.body.errors.should.have.property('kind').eql('ObjectId');
          done();
        });
    });
  });

  describe('/PUT/:id Role', () => {

    // update an Role with a valid RoleId
	  it('it should UPDATE an Role by the given id', (done) => {
	  	let role = new Role({
          RoleName: "Existing Role",
          IsActive: true,
          IsDelete: false
      })
	  	 role.save((err, role) => {
				chai.request(server)
			    .put('/API/RoleUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : role._id,
              RoleName: "Update Test Role",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == role._id)[0].should.have.property('RoleName').eql('Update Test Role');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Role without RoleName field', (done) => {
      let role = new Role({
          RoleName: "Existing Role",
          IsActive: true,
          IsDelete: false
      })
      role.save((err, role) => {
        chai.request(server)
          .put('/API/RoleUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : role._id,
              RoleName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('RoleName');
  			  	res.body.errors.RoleName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Role with an invalid RoleId
    it('it should not UPDATE an Role as given id is not a valid RoleId', (done) => {
        chai.request(server)
          .put('/API/RoleUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id: mongoose.Types.ObjectId(),
              RoleName: "Updated_InvalidId Role",
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('RecordNotFound');
                res.body.should.have.property('status').eql(404);
            done();
          });
    });

		// Update an Role with an invalid RoleId
		it('it should not UPDATE an Role as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/RoleUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              RoleName: "Updated_InvalidId Role",
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('RecordNotFound');
                res.body.should.have.property('status').eql(404);
				        res.body.should.have.property('errors');
						  	res.body.errors.should.have.property('kind').eql('ObjectId');
            done();
          });
    });
  });

  describe('/DELETE/:id role', () => {

    //Delete an Role with valid RoleId
	  it('it should DELETE an Role by the given id', (done) => {
	  	let role = new Role({
          RoleName: "Delete Role",
          IsActive: true,
          IsDelete: false
      })
	  	role.save((err, role) => {
				chai.request(server)
			    .delete('/API/RoleDelete/' + role._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Role with invalid RoleId
    it('it should not DELETE an Role by the given id', (done) => {
        chai.request(server)
          .delete('/API/RoleDelete/' + mongoose.Types.ObjectId())
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
						res.body.should.have.property('message');
						res.body.should.have.property('status');
            res.body.should.have.property('message').eql('RecordNotFound');
            res.body.should.have.property('status').eql(404);
            done();
          });
    });
  });
});
