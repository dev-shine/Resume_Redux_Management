let mongoose = require("mongoose");
let Language = require('./../server/Models/Language');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
chai.use(chaiHttp);

describe('Languages', () => {

  describe('/GET Language', () => {
	  it('it should GET all the languages', (done) => {
			chai.request(server)
		    .get('/API/LanguageGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Language', () => {

    // Required Field LanguageName missing
	  it('it should not POST an Language without LanguageName field', (done) => {
	  	let language = {
          LanguageName: "",
          IsActive: true,
          IsDelete: false
      }
			chai.request(server)
		    .post('/API/LanguageInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(language)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('LanguageName');
			  	res.body.errors.LanguageName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

    //All valid fields are available
	  it('it should POST an Language ', (done) => {
	  	let language = {
           LanguageName: 'Test4 Language',
           IsActive: true,
           IsDelete: false
      }
			chai.request(server)
		    .post('/API/LanguageInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(language)
		    .end((err, res) => {
				  localStorage.setItem('LanguageId', res.body.data[0]._id);
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('LanguageName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

    // All fields are not available
    it('it should not POST an Language without field values ', (done) => {
      let language = {
           LanguageName: '',
           IsActive: '',
           IsDelete: ''
      }
      chai.request(server)
        .post('/API/LanguageInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(language)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('LanguageName');
			  	res.body.errors.LanguageName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id language', () => {
    ///Get an Language by the valid given LanguageId.
	  it('it should GET an language by the given id', (done) => {
	  	let language = new Language({
          LanguageName: "GetById Language",
          IsActive: true,
          IsDelete: false
      });
	  	language.save((err, language) => {
	  		chai.request(server)
        .get('/API/LanguageGetById/' + language._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(language)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(language._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an Language with the invalid LanguageId / A random string
    it('it should give an error as the LanguageId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/LanguageGetById/' + 'abc')
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

  describe('/PUT/:id Language', () => {

    // update an Language with a valid LanguageId
	  it('it should UPDATE an Language by the given id', (done) => {
	  	let language = new Language({
          LanguageName: "Existing Language",
          IsActive: true,
          IsDelete: false
      })
	  	 language.save((err, language) => {
				chai.request(server)
			    .put('/API/LanguageUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : language._id,
              LanguageName: "Update Test Language",
              IsActive: true,
              IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == language._id)[0].should.have.property('LanguageName').eql('Update Test Language');
			      done();
			    });
		   });
	  });

    it('it should not UPDATE  an Language without LanguageName field', (done) => {
      let language = new Language({
          LanguageName: "Existing Language",
          IsActive: true,
          IsDelete: false
      })
      language.save((err, language) => {
        chai.request(server)
          .put('/API/LanguageUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : language._id,
              LanguageName: '',
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('LanguageName');
  			  	res.body.errors.LanguageName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

    // Update an Language with an invalid LanguageId
    it('it should not UPDATE an Language as given id is not a valid LanguageId', (done) => {
        chai.request(server)
          .put('/API/LanguageUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
              LanguageName: "Updated_InvalidId Language",
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

		// Update an Language with an invalid LanguageId
		it('it should not UPDATE an Language as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/LanguageUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              LanguageName: "Updated_InvalidId Language",
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

  describe('/DELETE/:id language', () => {

    //Delete an Language with valid LanguageId
	  it('it should DELETE an Language by the given id', (done) => {
	  	let language = new Language({
          LanguageName: "Delete Language",
          IsActive: true,
          IsDelete: false
      })
	  	language.save((err, language) => {
				chai.request(server)
			    .delete('/API/LanguageDelete/' + language._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an Language with invalid LanguageId
    it('it should not DELETE an Language by the given id', (done) => {
        chai.request(server)
          .delete('/API/LanguageDelete/' + mongoose.Types.ObjectId())
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
