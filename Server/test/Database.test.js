let mongoose = require("mongoose");
let Database = require('./../server/Models/Database');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

chai.use(chaiHttp);
describe('Databases', () => {

  describe('/GET Database', () => {
	  it('it should GET all the databases', (done) => {
			chai.request(server)
		    .get('/API/DatabaseGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Database', () => {

    // Required Field DatabaseName missing
	  it('it should not POST an Database without DatabaseName field', (done) => {
	  	let database = {
          DatabaseName: undefined,
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/DatabaseInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(database)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DatabaseName');
			  	res.body.errors.DatabaseName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Database ', (done) => {
	  	let database = {
           DatabaseName: 'Test4 Database',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/DatabaseInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(database)
		    .end((err, res) => {
          localStorage.setItem('DatabaseId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('DatabaseName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Database without field values ', (done) => {
      let database = {
           DatabaseName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/DatabaseInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(database)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DatabaseName');
			  	res.body.errors.DatabaseName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id database', () => {
    ///Get an Database by the valid given DatabaseId.
	  it('it should GET an database by the given id', (done) => {
	  	let database = new Database({
          DatabaseName: "GetById Database",
          IsActive: true,
          IsDelete: false
      });
	  	database.save((err, database) => {
	  		chai.request(server)
        .get('/API/DatabaseGetById/' + database._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(database)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(database._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Database with the invalid DatabaseId / A random string
    it('it should give an error as the DatabaseId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/DatabaseGetById/' + 'abc')
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

  describe('/PUT/:id Database', () => {

    // update an Database with a valid DatabaseId
	  it('it should UPDATE an Database by the given id', (done) => {
	  	let database = new Database({
          DatabaseName: "Existing Database",
          IsActive: true,
          IsDelete: false
      })
	  	 database.save((err, database) => {
				chai.request(server)
			    .put('/API/DatabaseUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : database._id,
              DatabaseName: "Update Test Database",
              IsActive: true,
              IsDelete: false
          })
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == database._id)[0].should.have.property('DatabaseName').eql('Update Test Database');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Database without DatabaseName field', (done) => {
      let database = new Database({
          DatabaseName: "Existing Database",
          IsActive: true,
          IsDelete: false
      })
      database.save((err, database) => {
        chai.request(server)
          .put('/API/DatabaseUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : database._id,
              DatabaseName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('DatabaseName');
  			  	res.body.errors.DatabaseName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Database with an invalid DatabaseId
    it('it should not UPDATE an Database as given id is not a valid DatabaseId', (done) => {
        chai.request(server)
          .put('/API/DatabaseUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              DatabaseName: "Updated_InvalidId Database",
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

		// Update an Database with an invalid DatabaseId
		it('it should not UPDATE an Database as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/DatabaseUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              DatabaseName: "Updated_InvalidId Database",
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

  describe('/DELETE/:id database', () => {

    //Delete an Database with valid DatabaseId
	  it('it should DELETE an Database by the given id', (done) => {
	  	let database = new Database({
          DatabaseName: "Delete Database",
          IsActive: true,
          IsDelete: false
      })
	  	database.save((err, database) => {
				chai.request(server)
			    .delete('/API/DatabaseDelete/' + database._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Database with invalid DatabaseId
    it('it should not DELETE an Database by the given id', (done) => {
        chai.request(server)
          .delete('/API/DatabaseDelete/' + mongoose.Types.ObjectId())
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
