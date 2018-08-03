let mongoose = require("mongoose");
let ProjectRole = require('./../server/Models/ProjectRole');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

describe('ProjectRoles', () => {

  describe('/GET ProjectRole', () => {
	  it('it should GET all the projectroles', (done) => {
			chai.request(server)
		    .get('/API/ProjectRoleGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST ProjectRole', () => {

    // Required Field ProjectRoleName missing
	  it('it should not POST an ProjectRole without ProjectRoleName field', (done) => {
	  	let projectrole = {
          ProjectRoleName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/ProjectRoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(projectrole)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ProjectRoleName');
			  	res.body.errors.ProjectRoleName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an ProjectRole ', (done) => {
	  	let projectrole = {
           ProjectRoleName: 'Test4 ProjectRole',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/ProjectRoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(projectrole)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('ProjectRoleName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an ProjectRole without field values ', (done) => {
      let projectrole = {
           ProjectRoleName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/ProjectRoleInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(projectrole)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ProjectRoleName');
			  	res.body.errors.ProjectRoleName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id projectrole', () => {
    ///Get an ProjectRole by the valid given ProjectRoleId.
	  it('it should GET an projectrole by the given id', (done) => {
	  	let projectrole = new ProjectRole({
          ProjectRoleName: "GetById ProjectRole",
          IsActive: true,
          IsDelete: false
      });
	  	projectrole.save((err, projectrole) => {
	  		chai.request(server)
        .get('/API/ProjectRoleGetById/' + projectrole._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(projectrole)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(projectrole._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an ProjectRole with the invalid ProjectRoleId / A random string
    it('it should give an error as the ProjectRoleId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/ProjectRoleGetById/' + 'abc')
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

  describe('/PUT/:id ProjectRole', () => {

    // update an ProjectRole with a valid ProjectRoleId
	  it('it should UPDATE an ProjectRole by the given id', (done) => {
	  	let projectrole = new ProjectRole({
          ProjectRoleName: "Existing ProjectRole",
          IsActive: true,
          IsDelete: false
      })
	  	 projectrole.save((err, projectrole) => {
				chai.request(server)
			    .put('/API/ProjectRoleUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : projectrole._id,
              ProjectRoleName: "Update Test ProjectRole",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == projectrole._id)[0].should.have.property('ProjectRoleName').eql('Update Test ProjectRole');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an ProjectRole without ProjectRoleName field', (done) => {
      let projectrole = new ProjectRole({
          ProjectRoleName: "Existing ProjectRole",
          IsActive: true,
          IsDelete: false
      })
      projectrole.save((err, projectrole) => {
        chai.request(server)
          .put('/API/ProjectRoleUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : projectrole._id,
              ProjectRoleName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('ProjectRoleName');
  			  	res.body.errors.ProjectRoleName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an ProjectRole with an invalid ProjectRoleId
    it('it should not UPDATE an ProjectRole as given id is not a valid ProjectRoleId', (done) => {
        chai.request(server)
          .put('/API/ProjectRoleUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              ProjectRoleName: "Updated_InvalidId ProjectRole",
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

		// Update an ProjectRole with an invalid ProjectRoleId
		it('it should not UPDATE an ProjectRole as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/ProjectRoleUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              ProjectRoleName: "Updated_InvalidId ProjectRole",
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

  describe('/DELETE/:id projectrole', () => {

    //Delete an ProjectRole with valid ProjectRoleId
	  it('it should DELETE an ProjectRole by the given id', (done) => {
	  	let projectrole = new ProjectRole({
          ProjectRoleName: "Delete ProjectRole",
          IsActive: true,
          IsDelete: false
      })
	  	projectrole.save((err, projectrole) => {
				chai.request(server)
			    .delete('/API/ProjectRoleDelete/' + projectrole._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an ProjectRole with invalid ProjectRoleId
    it('it should not DELETE an ProjectRole by the given id', (done) => {
        chai.request(server)
          .delete('/API/ProjectRoleDelete/' + mongoose.Types.ObjectId())
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
