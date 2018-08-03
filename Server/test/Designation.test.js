let mongoose = require("mongoose");
let Designation = require('./../server/Models/Designation');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);

describe('Designations', () => {

  describe('/GET Designation', () => {
	  it('it should GET all the designations', (done) => {
			chai.request(server)
		    .get('/API/DesignationGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Designation', () => {

    // Required Field DesignationName missing
	  it('it should not POST an Designation without DesignationName field', (done) => {
	  	let designation = {
          DesignationName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/DesignationInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(designation)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DesignationName');
			  	res.body.errors.DesignationName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Designation ', (done) => {
	  	let designation = {
           DesignationName: 'Test4 Designation',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/DesignationInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(designation)
		    .end((err, res) => {
          localStorage.setItem('DesignationId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('DesignationName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Designation without field values ', (done) => {
      let designation = {
           DesignationName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/DesignationInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(designation)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DesignationName');
			  	res.body.errors.DesignationName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id designation', () => {
    ///Get an Designation by the valid given DesignationId.
	  it('it should GET an designation by the given id', (done) => {
	  	let designation = new Designation({
          DesignationName: "GetById Designation",
          IsActive: true,
          IsDelete: false
      });
	  	designation.save((err, designation) => {
	  		chai.request(server)
        .get('/API/DesignationGetById/' + designation._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(designation)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(designation._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Designation with the invalid DesignationId / A random string
    it('it should give an error as the DesignationId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/DesignationGetById/' + 'abc')
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

  describe('/PUT/:id Designation', () => {

    // update an Designation with a valid DesignationId
	  it('it should UPDATE an Designation by the given id', (done) => {
	  	let designation = new Designation({
          DesignationName: "Existing Designation",
          IsActive: true,
          IsDelete: false
      })
	  	 designation.save((err, designation) => {
				chai.request(server)
			    .put('/API/DesignationUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : designation._id,
              DesignationName: "Update Test Designation",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == designation._id)[0].should.have.property('DesignationName').eql('Update Test Designation');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Designation without DesignationName field', (done) => {
      let designation = new Designation({
          DesignationName: "Existing Designation",
          IsActive: true,
          IsDelete: false
      })
      designation.save((err, designation) => {
        chai.request(server)
          .put('/API/DesignationUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : designation._id,
              DesignationName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('DesignationName');
  			  	res.body.errors.DesignationName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Designation with an invalid DesignationId
    it('it should not UPDATE an Designation as given id is not a valid DesignationId', (done) => {
        chai.request(server)
          .put('/API/DesignationUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id: mongoose.Types.ObjectId(),
              DesignationName: "Updated_InvalidId Designation",
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

		// Update an Designation with an invalid DesignationId
		it('it should not UPDATE an Designation as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/DesignationUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              DesignationName: "Updated_InvalidId Designation",
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

  describe('/DELETE/:id designation', () => {

    //Delete an Designation with valid DesignationId
	  it('it should DELETE an Designation by the given id', (done) => {
	  	let designation = new Designation({
          DesignationName: "Delete Designation",
          IsActive: true,
          IsDelete: false
      })
	  	designation.save((err, designation) => {
				chai.request(server)
			    .delete('/API/DesignationDelete/' + designation._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Designation with invalid DesignationId
    it('it should not DELETE an Designation by the given id', (done) => {
        chai.request(server)
          .delete('/API/DesignationDelete/' + mongoose.Types.ObjectId())
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
