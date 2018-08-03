let mongoose = require("mongoose");
let Project = require('./../server/Models/Project');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
chai.use(chaiHttp);

describe('Projects', () => {
  describe('/GET Project', () => {
	  it('it should GET all the projects', (done) => {
			chai.request(server)
		    .get('/API/ProjectGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
		    });
	  });
  });

  describe('/POST Project', () => {
  //   // Required Field ProjectName missing
	  it('it should not POST an Project without ProjectName field', (done) => {

	  	let project = {
				ProjectName: '',
				TeamSize: 5,
				Description: 'Project Description',
				OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
				IsActive: true,
				IsDelete: false
      }
			chai.request(server)
		    .post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(project)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ProjectName');
			  	res.body.errors.ProjectName.should.have.property('kind').eql('required');
		      done();
		    });
	  });
  //
  //   // Required Field TeamSize missing
    it('it should not POST an Project without TeamSize field [With value null]', (done) => {
      let project = {
        ProjectName: '',
        TeamSize: null,
        Description: 'Project Description',
        OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        IsActive: true,
        IsDelete: false
      }
      chai.request(server)
        .post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(project)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('TeamSize');
          res.body.errors.TeamSize.should.have.property('kind').eql('required');
          done();
        });
    });

	// // 	  // Required Field TeamSize missing
		it('it should not POST a Project without TeamSize field [With value undefined]', (done) => {
			let project = {
				ProjectName: 'TeamSize Project',
				TeamSize: undefined,
				Description: 'Project Description',
				OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(project)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Ok');
					done();
				});
		});

	// // 	// Required Field Description missing
		it('it should not POST an Project without Description field', (done) => {
			let project = {
				ProjectName: 'Description Project',
				TeamSize: 5,
				Description: '',
				OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
				IsActive: true,
				IsDelete: false
			}
			chai.request(server)
				.post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(project)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('Description');
					res.body.errors.Description.should.have.property('kind').eql('required');
					done();
				});
		});

  // //   //All valid fields are available
	  it('it should POST a Project ', (done) => {
	  	let project = new Project({
			  ProjectName : "Project123",
		    TeamSize : 5,
		    Description : "test",
		    OtherTools : "test",
		    IsActive : true,
		    IsDelete : false,
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
      });

			chai.request(server)
		    .post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(project)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Ok');
			  	res.body.data[0].should.have.property('ProjectName');
			  	res.body.data[0].should.have.property('IsDelete');
			  	res.body.data[0].should.have.property('IsActive');
				  res.body.data[0].IsDelete.should.be.eql(false);
		      done();
		    });
	  });

  // //   //All fields are not available
    it('it should not POST an Project without field values ', (done) => {
      let project = {
				ProjectName: '',
					TeamSize: '',
					Description: '',
					OtherTools: '',
					DomainId: [],
					OperatingSystemId: [],
					Technology: [],
					DatabaseId: [],
					IsActive: '',
					IsDelete: ''
      }
      chai.request(server)
        .post('/API/ProjectInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(project)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
			  	res.body.errors.should.have.property('ProjectName');
			  	res.body.errors.ProjectName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:id project', () => {
  // //   //Get an Project by the valid given ProjectId.
	  it('it should GET a project by the given id', (done) => {
			let project = new Project({
				  ProjectName : "Project13",
			    TeamSize : 5,
			    Description : "test",
			    OtherTools : "test",
			    IsActive : true,
			    IsDelete : false,
          DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
		    });
	  	project.save((err, project) => {
				chai.request(server)
        .get('/API/ProjectGetById/' + project._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(project)
		    .end((err, res) => {
			  		res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body[0].should.have.property('_id').eql(project._id.toString());
		      done();
		    });
	  	});
	  });
  //
  // // //   //Get an Project with the invalid ProjectId / A random string
    it('it should give an error as the ProjectId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/ProjectGetById/' + 'abc')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .end((err, res) => {
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql('500');
					res.body.should.have.property('message').eql('Internal Server Error');
          done();
        });
    });
  });

  describe('/PUT/:id Project', () => {
  //   // update an Project with a valid ProjectId
	  it('it should UPDATE a Project by the given id', (done) => {
	  	let project = new Project({
				ProjectName: 'Existing Project',
				TeamSize: 5,
				Description: 'Project Description',
				OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
				IsActive: true,
				IsDelete: false
      })
	  	 project.save((err, project) => {
				chai.request(server)
			    .put('/API/ProjectUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
              _id : project._id,
							ProjectName: 'Updated Project',
							TeamSize: 6,
							Description: 'Project Description',
							OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
							IsActive: true,
							IsDelete: false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == project._id)[0].should.have.property('ProjectName').eql('Updated Project');
			      done();
			    });
		   });
	  });
  //
    it('it should not UPDATE  an Project without ProjectName field', (done) => {
      let project = new Project({
          ProjectName: 'Project without Name',
      		TeamSize: 5,
      		Description: 'Project Description',
      		OtherTools: 'OtherTools Project',
          DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
      		IsActive: true,
      		IsDelete: false
      })
      project.save((err, project) => {
        chai.request(server)
          .put('/API/ProjectUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : project._id,
              ProjectName: '',
          		TeamSize: 5,
          		Description: 'Project Description',
          		OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
          		IsActive: true,
          		IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('ProjectName');
  			  	res.body.errors.ProjectName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

 //  //   //TeamSize has value null or empty string to the post object
    it('it should not UPDATE  an Project without TeamSize field (with null value)', (done) => {
      let project = new Project({
          ProjectName: 'Project without Name',
          TeamSize: 5,
          Description: 'Project Description',
          OtherTools: 'OtherTools Project',
          DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
          IsActive: true,
          IsDelete: false
      })
      project.save((err, project) => {
        chai.request(server)
          .put('/API/ProjectUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : project._id,
              ProjectName: 'Updated Project Without Name',
              TeamSize: null,
              Description: 'Project Description',
              OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
   			  	res.body.errors.should.have.property('TeamSize');
   			  	res.body.errors.TeamSize.should.have.property('kind').eql('required');
            done();
          });
      });
    });

 //  //   //Description has value null or empty string to the post object
    it('it should not UPDATE  an Project without Description field (with null value)', (done) => {
      let project = new Project({
          ProjectName: 'Update Project Without Description',
          TeamSize: 5,
          Description: 'Project Description',
          OtherTools: 'OtherTools Project',
          DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
          IsActive: true,
          IsDelete: false
      })
      project.save((err, project) => {
        chai.request(server)
          .put('/API/ProjectUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : project._id,
              ProjectName: 'Updated Project Without Name',
              TeamSize: 6,
              Description: null,
              OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
              TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
              OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
              DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
    		  	res.body.errors.should.have.property('Description');
    		  	res.body.errors.Description.should.have.property('kind').eql('required');
            done();
          });
      });
    });
  //
  // //   //TeamSize has value undefined or when TeamSize field is not passed to the post object
    it('it should not UPDATE  an Project without TeamSize field (with undefined value)', (done) => {
      let project = new Project({
          ProjectName: 'Project without Name',
          TeamSize: 5,
          Description: 'Project Description',
          OtherTools: 'OtherTools Project',
          DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
          IsActive: true,
          IsDelete: false
      })
      project.save((err, project) => {
        chai.request(server)
          .put('/API/ProjectUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id : project._id,
              ProjectName: 'Updated Project Without Name',
              TeamSize: undefined,
              Description: 'Project Description',
              OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
              IsActive: true,
              IsDelete: false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('CastError');
            res.body.should.have.property('kind').eql('number');
            done();
          });
      });
    });
  //
  // //   // Update an Project with an invalid ProjectId
    it('it should not UPDATE an Project as given id is not a valid ProjectId', (done) => {
        chai.request(server)
          .put('/API/ProjectUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							_id: mongoose.Types.ObjectId(),
              ProjectName: 'Update Project with Invalid ProjectId',
              TeamSize: 6,
              Description: 'Project Description',
              OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
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
  //
	// // // 	// Update an Project with an invalid ProjectId
		it('it should not UPDATE an Project as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/ProjectUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
              _id:'abc',
              ProjectName: 'Update Project with Invalid ProjectId',
              TeamSize: 6,
              Description: 'Project Description',
              OtherTools: 'OtherTools Project',
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
       			  TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
       			  OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
       			  DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
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

  describe('/DELETE/:id project', () => {
// // //     //Delete an Project with valid ProjectId
	  it('it should DELETE an Project by the given id', (done) => {
	  	let project = new Project({
        ProjectName: 'Delete Project',
        TeamSize: 6,
        Description: 'Project Description',
        OtherTools: 'OtherTools Project',
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        OperatingSystemId : localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        IsActive: true,
        IsDelete: false
      })
	  	project.save((err, project) => {
				chai.request(server)
			    .delete('/API/ProjectDelete/' + project._id)
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
			      done();
			    });
		  });
	  });

// //     //Delete an Project with invalid ProjectId
    it('it should not DELETE an Project by the given id', (done) => {
        chai.request(server)
          .delete('/API/ProjectDelete/' + mongoose.Types.ObjectId())
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
