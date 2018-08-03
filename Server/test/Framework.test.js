let mongoose = require("mongoose");
let Framework = require('./../server/Models/Framework');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);

describe('Frameworks', () => {

  describe('/GET Framework', () => {
	  it('it should GET all the frameworks', (done) => {
			chai.request(server)
		    .get('/API/FrameworkGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Framework', () => {

    // Required Field FrameworkName missing
	  it('it should not POST an Framework without FrameworkName field', (done) => {
	  	let framework = {
          FrameworkName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/FrameworkInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(framework)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('FrameworkName');
			  	res.body.errors.FrameworkName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Framework ', (done) => {
	  	let framework = {
           FrameworkName: 'Test4 Framework',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/FrameworkInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(framework)
		    .end((err, res) => {
				  localStorage.setItem('FrameworkId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('FrameworkName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Framework without field values ', (done) => {
      let framework = {
           FrameworkName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/FrameworkInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(framework)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('FrameworkName');
			  	res.body.errors.FrameworkName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id framework', () => {
    ///Get an Framework by the valid given FrameworkId.
	  it('it should GET an framework by the given id', (done) => {
	  	let framework = new Framework({
          FrameworkName: "GetById Framework",
          IsActive: true,
          IsDelete: false
      });
	  	framework.save((err, framework) => {
	  		chai.request(server)
        .get('/API/FrameworkGetById/' + framework._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(framework)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(framework._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Framework with the invalid FrameworkId / A random string
    it('it should give an error as the FrameworkId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/FrameworkGetById/' + 'abc')
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

  describe('/PUT/:id Framework', () => {

    // update an Framework with a valid FrameworkId
	  it('it should UPDATE an Framework by the given id', (done) => {
	  	let framework = new Framework({
          FrameworkName: "Existing Framework",
          IsActive: true,
          IsDelete: false
      })
	  	 framework.save((err, framework) => {
				chai.request(server)
			    .put('/API/FrameworkUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : framework._id,
              FrameworkName: "Update Test Framework",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == framework._id)[0].should.have.property('FrameworkName').eql('Update Test Framework');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Framework without FrameworkName field', (done) => {
      let framework = new Framework({
          FrameworkName: "Existing Framework",
          IsActive: true,
          IsDelete: false
      })
      framework.save((err, framework) => {
        chai.request(server)
          .put('/API/FrameworkUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : framework._id,
              FrameworkName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('FrameworkName');
  			  	res.body.errors.FrameworkName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Framework with an invalid FrameworkId
    it('it should not UPDATE an Framework as given id is not a valid FrameworkId', (done) => {
        chai.request(server)
          .put('/API/FrameworkUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id: mongoose.Types.ObjectId(),
              FrameworkName: "Updated_InvalidId Framework",
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

		// Update an Framework with an invalid FrameworkId
		it('it should not UPDATE an Framework as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/FrameworkUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              FrameworkName: "Updated_InvalidId Framework",
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

  describe('/DELETE/:id framework', () => {

    //Delete an Framework with valid FrameworkId
	  it('it should DELETE an Framework by the given id', (done) => {
	  	let framework = new Framework({
          FrameworkName: "Delete Framework",
          IsActive: true,
          IsDelete: false
      })
	  	framework.save((err, framework) => {
				chai.request(server)
			    .delete('/API/FrameworkDelete/' + framework._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Framework with invalid FrameworkId
    it('it should not DELETE an Framework by the given id', (done) => {
        chai.request(server)
          .delete('/API/FrameworkDelete/' + mongoose.Types.ObjectId())
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
