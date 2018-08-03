let mongoose = require("mongoose");
let User = require('./../server/Models/User');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

chai.use(chaiHttp);
describe('Users', () => {
  describe('/GET User', () => {
	  it('it should GET all the users', (done) => {
			chai.request(server)
		    .get('/API/UserGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

   describe('/POST User', () => {
  // //   // Required Field FirstName missing
	  it('it should not POST an User without FirstName field', (done) => {
	  	let user = {
				FirstName: '',
				LastName: 'Patel',
				ContactNumber: '7845125623',
				Email: 'ukti@gmail.com',
				Password: '12345678',
				IsActive: true,
				IsDelete: false
      }
			chai.request(server)
		    .post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('FirstName');
			  	res.body.errors.FirstName.should.have.property('kind').eql('required');
		      done();
		    });
	  });

	// // 	// Required Field LastName missing
		it('it should not POST an User without LastName field', (done) => {
			let user = {
				FirstName: 'Ukti',
				LastName: '',
				ContactNumber: '7845125623',
				Email: 'ukti@gmail.com',
				Password: '12345678',
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('LastName');
					res.body.errors.LastName.should.have.property('kind').eql('required');
					done();
				});
		});

	// // 	// Required Field ContactNumber missing
		it('it should not POST an User without ContactNumber field', (done) => {
			let user = {
				FirstName: 'Ukti',
				LastName: 'Patel',
				ContactNumber: '',
				Email: 'ukti@gmail.com',
				Password: '12345678',
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('ContactNumber');
					res.body.errors.ContactNumber.should.have.property('kind').eql('required');
					done();
				});
		});

	// // 	// Required Field Email missing
		it('it should not POST an User without Email field', (done) => {
			let user = {
				FirstName: 'Ukti',
				LastName: 'Patel',
				ContactNumber: '7845128956',
				Email: '',
				Password: '12345678',
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('Email');
					res.body.errors.Email.should.have.property('kind').eql('required');
					done();
				});
		});

	// // 	// Required Field Password missing
		it('it should not POST an User without Password field', (done) => {
			let user = {
				FirstName: 'Ukti',
				LastName: 'Patel',
				ContactNumber: '7845128956',
				Email: 'ukti@gmail.com',
				Password: '',
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('Password');
					res.body.errors.Password.should.have.property('kind').eql('required');
					done();
				});
		});

  // //   //All valid fields are available
	  it('it should POST an User ', (done) => {
	  	let user = {
				FirstName: 'Ukti',
				LastName: 'Patel',
				ContactNumber: '7845128956',
				Email: 'ukti@gmail.com',
				Password: '12345678',
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
		    .post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('FirstName');
					res.body.data[0].should.have.property('LastName');
					res.body.data[0].should.have.property('ContactNumber');
					res.body.data[0].should.have.property('Email');
					res.body.data[0].should.have.property('Password');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });
  // //
  // //   // All fields are not available
    it('it should not POST an User without field values ', (done) => {
      let user = {
				FirstName: '',
				LastName: '',
				ContactNumber: '',
				Email: '',
				Password: '',
				IsActive: '',
				IsDelete: ''
      }
      chai.request(server)
        .post('/API/UserInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('FirstName');
			  	res.body.errors.FirstName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

   describe('/GET/:id user', () => {
    ///Get an User by the valid given UserId.
	  it('it should GET an user by the given id', (done) => {
	  	let user = new User({
						FirstName: 'Niyati',
						LastName: 'Parekh',
						ContactNumber: '7845128957',
						Email: 'niyati@gmail.com',
						Password: '123456789',
						IsActive: true,
						IsDelete: false
					});
	  	user.save((err, user) => {
	  		chai.request(server)
        .get('/API/UserGetById/' + user._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(user)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(user._id.toString());
		      done();
		    });
	  	});
	  });

    //Get an User with the invalid UserId / A random string
    it('it should give an error as the UserId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/UserGetById/' + 'abc')
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


   describe('/PUT/:id User', () => {

    // update an User with a valid UserId
	  it('it should UPDATE an User by the given id', (done) => {
	  	let user = new User({
							FirstName: 'Existing User',
							LastName: 'Surname',
							ContactNumber: '7845127854',
							Email: 'existinguser@gmail.com',
							Password: '123456789',
							IsActive: true,
							IsDelete: false
						})
	  	 user.save((err, user) => {
				chai.request(server)
			    .put('/API/UserUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : user._id,
							FirstName: 'Updated User',
							LastName: 'Surname',
							ContactNumber: '7845127854',
							Email: 'existinguser@gmail.com',
							Password: '123456789',
							IsActive: true,
							IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == user._id)[0].should.have.property('FirstName').eql('Updated User');
			      done();
			    });
		   });
	  });

		// 	// Required Field FirstName missing
    it('it should not UPDATE  an User without FirstName field', (done) => {
      let user = new User({
					FirstName: 'BAC User',
					LastName: 'Surname',
					ContactNumber: '7845127854',
					Email: 'firstnameuser@gmail.com',
					Password: '123456789',
					IsActive: true,
					IsDelete: false
				})
      user.save((err, user) => {
        chai.request(server)
          .put('/API/UserUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : user._id,
							FirstName: '',
							LastName: 'Surname',
							ContactNumber: '7845127854',
							Email: 'firstnameuser@gmail.com',
							Password: '123456789',
							IsActive: true,
							IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('FirstName');
  			  	res.body.errors.FirstName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

		// 	// Required Field LastName missing
		it('it should not UPDATE  an User without LastName field', (done) => {
			let user = new User({
					FirstName: 'Existing User',
					LastName: 'Surname',
					ContactNumber: '7845127854',
					Email: 'lastnameuser@gmail.com',
					Password: '123456789',
					IsActive: true,
					IsDelete: false
							})
			user.save((err, user) => {
				chai.request(server)
					.put('/API/UserUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
							_id : user._id,
							FirstName: 'Updated User',
							LastName: '',
							ContactNumber: '7845127854',
							Email: 'lastnameuser@gmail.com',
							Password: '123456789',
							IsActive: true,
							IsDelete: false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('LastName');
						res.body.errors.LastName.should.have.property('kind').eql('required');
						done();
					});
			});
		});

		// // 	// Required Field ContactNumber missing
		it('it should not UPDATE  an User without ContactNumber field', (done) => {
			let user = new User({
					FirstName: 'ContactNumber User',
					LastName: 'Surname',
					ContactNumber: '7845127854',
					Email: 'contactnumberuser@gmail.com',
					Password: '123456789',
					IsActive: true,
					IsDelete: false
							})
			user.save((err, user) => {
				chai.request(server)
					.put('/API/UserUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
							_id : user._id,
							FirstName: 'Updated User',
							LastName: 'New Surname',
							ContactNumber: '',
							Email: 'contactnumberuser@gmail.com',
							Password: '123456789',
							IsActive: true,
							IsDelete: false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('ContactNumber');
						res.body.errors.ContactNumber.should.have.property('kind').eql('required');
						done();
					});
			});
		});

    // Update an User with an invalid UserId
    it('it should not UPDATE an User as given id is not a valid UserId', (done) => {
        chai.request(server)
          .put('/API/UserUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id : mongoose.Types.ObjectId(),
							FirstName: 'Invalid UserId User',
							LastName: 'New Surname',
							ContactNumber: '4512784512',
							Email: 'InvalidIdUser@gmail.com',
							Password: '123456789',
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

		// Update an User with an invalid UserId
		it('it should not UPDATE an User as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/UserUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
							FirstName: 'Invalid String UserId User',
							LastName: 'New Surname',
							ContactNumber: '4512784512',
							Email: 'InvalidObjectIdUser@gmail.com',
							Password: '123456789',
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

  describe('/DELETE/:id user', () => {
    //Delete an User with valid UserId
	  it('it should DELETE an User by the given id', (done) => {
	  	let user = new User({
				FirstName: 'Deleted User',
				LastName: 'New Surname',
				ContactNumber: '4512784512',
				Email: 'existinguser@gmail.com',
				Password: '123456789',
				IsActive: true,
				IsDelete: false
      })
	  	user.save((err, user) => {
				chai.request(server)
			    .delete('/API/UserDelete/' + user._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

    //Delete an User with invalid UserId
    it('it should not DELETE an User by the given id', (done) => {
        chai.request(server)
          .delete('/API/UserDelete/' + mongoose.Types.ObjectId())
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
