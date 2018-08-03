let mongoose = require("mongoose");
let Application = require('./../server/Models/Application');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);
describe('Applications', () => {
  describe('/GET Application', () => {
	  it('it should GET all the applications', (done) => {
			chai.request(server)
		    .get('/API/ApplicationGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Application', () => {

    // Required Field ApplicationName missing
	  it('it should not POST an Application without ApplicationName field', (done) => {
	  	let application = {
          ApplicationName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/ApplicationInsert')
		    .send(application)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ApplicationName');
			  	res.body.errors.ApplicationName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

  //   //All valid fields are available
	  it('it should POST an Application ', (done) => {
	  	let application = {
           ApplicationName: 'Test4 Application',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/ApplicationInsert')
		    .send(application)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
          localStorage.setItem('ApplicationId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('ApplicationName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });
  //
  // //   // All fields are not available
    it('it should not POST an Application without field values ', (done) => {
      let application = {
           ApplicationName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/ApplicationInsert')
        .send(application)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ApplicationName');
			  	res.body.errors.ApplicationName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id application', () => {
    ///Get an Application by the valid given ApplicationId.
	  it('it should GET an application by the given id', (done) => {
	  	let application = new Application({
          ApplicationName: "GetById Application",
          IsActive: true,
          IsDelete: false
      });
	  	application.save((err, application) => {
	  		chai.request(server)
        .get('/API/ApplicationGetById/' + application._id)
		    .send(application)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(application._id.toString());
		      done();
		    });
	  	});
	  });

  //   //Get an Application with the invalid ApplicationId / A random string
    it('it should give an error as the ApplicationId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/ApplicationGetById/' + 'abc')
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

  describe('/PUT/:id Application', () => {

    // update an Application with a valid ApplicationId
	  it('it should UPDATE an Application by the given id', (done) => {
	  	let application = new Application({
          ApplicationName: "Existing Application",
          IsActive: true,
          IsDelete: false
      })
	  	 application.save((err, application) => {
				chai.request(server)
			    .put('/API/ApplicationUpdate')
			    .send({
              _id : application._id,
              ApplicationName: "Update Test Application",
              IsActive: true,
              IsDelete: false
          })
         .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == application._id)[0].should.have.property('ApplicationName').eql('Update Test Application');
			      done();
			    });
		   });
	  });
  
	 	// update an Application with a valid ApplicationId but without ApplicationName
    it('it should not UPDATE  an Application without ApplicationName field', (done) => {
      let application = new Application({
          ApplicationName: "Existing Application",
          IsActive: true,
          IsDelete: false
      })
      application.save((err, application) => {
        chai.request(server)
          .put('/API/ApplicationUpdate')
          .send({
              _id : application._id,
              ApplicationName: '',
              IsActive: true,
              IsDelete: false
          })
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('ApplicationName');
  			  	res.body.errors.ApplicationName.should.have.property('kind').eql('required');
            done();
          });
      });
    });
 
    // Update an Application with an invalid ApplicationId
    it('it should not UPDATE an Application as given id is not a valid ApplicationId', (done) => {
        chai.request(server)
          .put('/API/ApplicationUpdate/')
          .send({
							_id: mongoose.Types.ObjectId(),
              ApplicationName: "Updated_InvalidId Application",
              IsActive: true,
              IsDelete: false
          })
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('RecordNotFound');
                res.body.should.have.property('status').eql(404);
            done();
          });
    });
 
 	// Update an Application with an invalid ApplicationId
		it('it should not UPDATE an Application as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/ApplicationUpdate/')
          .send({
              _id:'abc',
              ApplicationName: "Updated_InvalidId Application",
              IsActive: true,
              IsDelete: false
          })
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
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

  describe('/DELETE/:id application', () => {
  //   //Delete an Application with valid ApplicationId
	  it('it should DELETE an Application by the given id', (done) => {
	  	let application = new Application({
          ApplicationName: "Delete Application",
          IsActive: true,
          IsDelete: false
      })
	  	application.save((err, application) => {
				chai.request(server)
			    .delete('/API/ApplicationDelete/' + application._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

  //   //Delete an Application with invalid ApplicationId
    it('it should not DELETE an Application by the given id', (done) => {
        chai.request(server)
          .delete('/API/ApplicationDelete/' + mongoose.Types.ObjectId())
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
