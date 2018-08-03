let mongoose = require("mongoose");
let OperatingSystem = require('./../server/Models/OperatingSystem');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);

describe('OperatingSystems', () => {
  describe('/GET OperatingSystem', () => {
	  it('it should GET all the operatingsystems', (done) => {
			chai.request(server)
		    .get('/API/OperatingSystemGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST OperatingSystem', () => {

    // Required Field OperatingSystemName missing
	  it('it should not POST an OperatingSystem without OperatingSystemName field', (done) => {
	  	let operatingsystem = {
          OperatingSystemName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/OperatingSystemInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(operatingsystem)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('OperatingSystemName');
			  	res.body.errors.OperatingSystemName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an OperatingSystem ', (done) => {
	  	let operatingsystem = {
           OperatingSystemName: 'Test4 OperatingSystem',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/OperatingSystemInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(operatingsystem)
		    .end((err, res) => {
					localStorage.setItem('OperatingSystemId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('OperatingSystemName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an OperatingSystem without field values ', (done) => {
      let operatingsystem = {
           OperatingSystemName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/OperatingSystemInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(operatingsystem)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('OperatingSystemName');
			  	res.body.errors.OperatingSystemName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id operatingsystem', () => {
    ///Get an OperatingSystem by the valid given OperatingSystemId.
	  it('it should GET an operatingsystem by the given id', (done) => {
	  	let operatingsystem = new OperatingSystem({
          OperatingSystemName: "GetById OperatingSystem",
          IsActive: true,
          IsDelete: false
      });
	  	operatingsystem.save((err, operatingsystem) => {
	  		chai.request(server)
        .get('/API/OperatingSystemGetById/' + operatingsystem._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(operatingsystem)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(operatingsystem._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an OperatingSystem with the invalid OperatingSystemId / A random string
    it('it should give an error as the OperatingSystemId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/OperatingSystemGetById/' + 'abc')
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

  describe('/PUT/:id OperatingSystem', () => {

    // update an OperatingSystem with a valid OperatingSystemId
	  it('it should UPDATE an OperatingSystem by the given id', (done) => {
	  	let operatingsystem = new OperatingSystem({
          OperatingSystemName: "Existing OperatingSystem",
          IsActive: true,
          IsDelete: false
      })
	  	 operatingsystem.save((err, operatingsystem) => {
				chai.request(server)
			    .put('/API/OperatingSystemUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : operatingsystem._id,
              OperatingSystemName: "Update Test OperatingSystem",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == operatingsystem._id)[0].should.have.property('OperatingSystemName').eql('Update Test OperatingSystem');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an OperatingSystem without OperatingSystemName field', (done) => {
      let operatingsystem = new OperatingSystem({
          OperatingSystemName: "Existing OperatingSystem",
          IsActive: true,
          IsDelete: false
      })
      operatingsystem.save((err, operatingsystem) => {
        chai.request(server)
          .put('/API/OperatingSystemUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : operatingsystem._id,
              OperatingSystemName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('OperatingSystemName');
  			  	res.body.errors.OperatingSystemName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an OperatingSystem with an invalid OperatingSystemId
    it('it should not UPDATE an OperatingSystem as given id is not a valid OperatingSystemId', (done) => {
        chai.request(server)
          .put('/API/OperatingSystemUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              OperatingSystemName: "Updated_InvalidId OperatingSystem",
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

		// Update an OperatingSystem with an invalid OperatingSystemId
		it('it should not UPDATE an OperatingSystem as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/OperatingSystemUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              OperatingSystemName: "Updated_InvalidId OperatingSystem",
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

  describe('/DELETE/:id operatingsystem', () => {

    //Delete an OperatingSystem with valid OperatingSystemId
	  it('it should DELETE an OperatingSystem by the given id', (done) => {
	  	let operatingsystem = new OperatingSystem({
          OperatingSystemName: "Delete OperatingSystem",
          IsActive: true,
          IsDelete: false
      })
	  	operatingsystem.save((err, operatingsystem) => {
				chai.request(server)
			    .delete('/API/OperatingSystemDelete/' + operatingsystem._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an OperatingSystem with invalid OperatingSystemId
    it('it should not DELETE an OperatingSystem by the given id', (done) => {
        chai.request(server)
          .delete('/API/OperatingSystemDelete/' + mongoose.Types.ObjectId())
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
