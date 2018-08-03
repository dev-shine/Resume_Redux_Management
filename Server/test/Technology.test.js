let mongoose = require("mongoose");
let Technology = require('./../server/Models/Technology');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

describe('Technologys', () => {

  describe('/GET Technology', () => {
	  it('it should GET all the technologys', (done) => {
			chai.request(server)
		    .get('/API/TechnologyGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Technology', () => {

    // Required Field TechnologyName missing
	  it('it should not POST an Technology without TechnologyName field', (done) => {
	  	let technology = {
          TechnologyName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/TechnologyInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(technology)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('TechnologyName');
			  	res.body.errors.TechnologyName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Technology ', (done) => {
	  	let technology = {
           TechnologyName: 'Test4 Technology',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/TechnologyInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(technology)
		    .end((err, res) => {
          localStorage.setItem('TechnologyId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('TechnologyName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Technology without field values ', (done) => {
      let technology = {
           TechnologyName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/TechnologyInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(technology)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('TechnologyName');
			  	res.body.errors.TechnologyName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id technology', () => {
    ///Get an Technology by the valid given TechnologyId.
	  it('it should GET an technology by the given id', (done) => {
	  	let technology = new Technology({
          TechnologyName: "GetById Technology",
          IsActive: true,
          IsDelete: false
      });
	  	technology.save((err, technology) => {
	  		chai.request(server)
        .get('/API/TechnologyGetById/' + technology._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(technology)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(technology._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Technology with the invalid TechnologyId / A random string
    it('it should give an error as the TechnologyId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/TechnologyGetById/' + 'abc')
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

  describe('/PUT/:id Technology', () => {

    // update an Technology with a valid TechnologyId
	  it('it should UPDATE an Technology by the given id', (done) => {
	  	let technology = new Technology({
          TechnologyName: "Existing Technology",
          IsActive: true,
          IsDelete: false
      })
	  	 technology.save((err, technology) => {
				chai.request(server)
			    .put('/API/TechnologyUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : technology._id,
              TechnologyName: "Update Test Technology",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == technology._id)[0].should.have.property('TechnologyName').eql('Update Test Technology');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Technology without TechnologyName field', (done) => {
      let technology = new Technology({
          TechnologyName: "Existing Technology",
          IsActive: true,
          IsDelete: false
      })
      technology.save((err, technology) => {
        chai.request(server)
          .put('/API/TechnologyUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : technology._id,
              TechnologyName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('TechnologyName');
  			  	res.body.errors.TechnologyName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Technology with an invalid TechnologyId
    it('it should not UPDATE an Technology as given id is not a valid TechnologyId', (done) => {
        chai.request(server)
          .put('/API/TechnologyUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              TechnologyName: "Updated_InvalidId Technology",
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

		// Update an Technology with an invalid TechnologyId
		it('it should not UPDATE an Technology as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/TechnologyUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              TechnologyName: "Updated_InvalidId Technology",
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

  describe('/DELETE/:id technology', () => {

    //Delete an Technology with valid TechnologyId
	  it('it should DELETE an Technology by the given id', (done) => {
	  	let technology = new Technology({
          TechnologyName: "Delete Technology",
          IsActive: true,
          IsDelete: false
      })
	  	technology.save((err, technology) => {
				chai.request(server)
			    .delete('/API/TechnologyDelete/' + technology._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Technology with invalid TechnologyId
    it('it should not DELETE an Technology by the given id', (done) => {
        chai.request(server)
          .delete('/API/TechnologyDelete/' + mongoose.Types.ObjectId())
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
