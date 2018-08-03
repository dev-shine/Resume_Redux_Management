let mongoose = require("mongoose");
let Domain = require('./../server/Models/Domain');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

chai.use(chaiHttp);

describe('Domains', () => {

  describe('/GET Domain', () => {
	  it('it should GET all the domains', (done) => {
			chai.request(server)
		    .get('/API/DomainGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Domain', () => {

    // Required Field DomainName missing
	  it('it should not POST an Domain without DomainName field', (done) => {
	  	let domain = {
          DomainName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/DomainInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(domain)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DomainName');
			  	res.body.errors.DomainName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Domain ', (done) => {
	  	let domain = {
           DomainName: 'Test44 Domain',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/DomainInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(domain)
		    .end((err, res) => {
					localStorage.setItem('DomainId', res.body.data[0]._id);
					// console.log(localStorage.getItem('DomainId'));
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('DomainName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Domain without field values ', (done) => {
      let domain = {
           DomainName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/DomainInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(domain)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('DomainName');
			  	res.body.errors.DomainName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

 /*
  * Test the /GET/:id route
  */
  describe('/GET/:id domain', () => {
    ///Get an Domain by the valid given DomainId.
	  it('it should GET an domain by the given id', (done) => {
	  	let domain = new Domain({
          DomainName: "GetById Domain",
          IsActive: true,
          IsDelete: false
      });
	  	domain.save((err, domain) => {
	  		chai.request(server)
        .get('/API/DomainGetById/' + domain._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(domain)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(domain._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Domain with the invalid DomainId / A random string
    it('it should give an error as the DomainId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/DomainGetById/' + 'abc')
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

  describe('/PUT/:id Domain', () => {

    // update an Domain with a valid DomainId
	  it('it should UPDATE an Domain by the given id', (done) => {
	  	let domain = new Domain({
          DomainName: "Existing Domain",
          IsActive: true,
          IsDelete: false
      })
	  	 domain.save((err, domain) => {
				chai.request(server)
			    .put('/API/DomainUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : domain._id,
              DomainName: "Update Test Domain",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == domain._id)[0].should.have.property('DomainName').eql('Update Test Domain');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Domain without DomainName field', (done) => {
      let domain = new Domain({
          DomainName: "Existing Domain",
          IsActive: true,
          IsDelete: false
      })
      domain.save((err, domain) => {
        chai.request(server)
          .put('/API/DomainUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : domain._id,
              DomainName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('DomainName');
  			  	res.body.errors.DomainName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Domain with an invalid DomainId
    it('it should not UPDATE an Domain as given id is not a valid DomainId', (done) => {
        chai.request(server)
          .put('/API/DomainUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              DomainName: "Updated_InvalidId Domain",
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

		// Update an Domain with an invalid DomainId
		it('it should not UPDATE an Domain as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/DomainUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              DomainName: "Updated_InvalidId Domain",
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

  describe('/DELETE/:id domain', () => {

    //Delete an Domain with valid DomainId
	  it('it should DELETE an Domain by the given id', (done) => {
	  	let domain = new Domain({
          DomainName: "Delete Domain",
          IsActive: true,
          IsDelete: false
      })
	  	domain.save((err, domain) => {
				chai.request(server)
			    .delete('/API/DomainDelete/' + domain._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Domain with invalid DomainId
    it('it should not DELETE an Domain by the given id', (done) => {
        chai.request(server)
          .delete('/API/DomainDelete/' + mongoose.Types.ObjectId())
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
