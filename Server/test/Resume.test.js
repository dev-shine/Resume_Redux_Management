let mongoose = require("mongoose");
let Candidate = require('./../server/Models/Candidate');
let ProjectDetail = require('./../server/Models/ProjectDetail');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localstorage');

chai.use(chaiHttp);

describe('Resumes', () => {

   describe('/GET Resumes', () => {
	  it('it should GET all the resumes', (done) => {
			chai.request(server)
		    .get('/API/ResumeGetAll')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
		      done();
	  });
  });

  describe('/GET/:id resume', () => {
  // //   ///Get an Resume by the valid given ResumeId.
	  it('it should GET an resume by the given id', (done) => {
	  	let candidate = new Candidate({
        CandidateName: "Karisma1 M Patel",
        EducationDescription: "EducationDescription",
        CurrentCompanyName : "CurrentCompanyName",
        Experience : 5,
        TeamSize : 6,
        ProjectCount : 2,
        KnowledgeDescription : "KnowledgeDescription",
        WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
        IsActive : true,
        IsDelete : false
      });

	  	candidate.save((err, resume) => {
	  		chai.request(server)
        .get('/API/ResumeGetById/' + resume._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
		    .send(resume)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('_id').eql(resume._id.toString());
		      done();
		    });
	  	});
	  });

  // //   //Get an Resume with the invalid ResumeId / A random string
    it('it should give an error as the ResumeId is not a valid id', (done) => {
        chai.request(server)
        .get('/API/ResumeGetById/' + 'abc')
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

	describe('/GET/:id All Resume Details', () => {
	// //   ///Get an Resume by the valid given ResumeId.
		it('it should GET all resume details by the given id', (done) => {
			let candidate = new Candidate({
				CandidateName: "Krina M Patel",
				EducationDescription: "EducationDescription",
				CurrentCompanyName : "CurrentCompanyName",
				Experience : 5,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			});
			candidate.save((err, resume) => {
				chai.request(server)
				.get('/API/ResumeGetAllDetailsById/' + resume._id)
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(resume)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body[0].should.have.property('_id').eql(resume._id.toString());
					done();
				});
			});
		});

	// // //   //Get an Resume with the invalid ResumeId / A random string
		it('it should give an error as the ResumeId is not a valid id for fetching all resume details', (done) => {
				chai.request(server)
				.get('/API/ResumeGetAllDetailsById/' + mongoose.Types.ObjectId())
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.should.have.property('status');
					res.body.should.have.property('status').eql(404);
					done();
				});
		});
	});

  describe('/POST Resume', () => {
  //   // Required Field ResumeName missing
    it('it should not POST an Resume without CandidateName field', (done) => {
      let candidate = {
        CandidateName: "",
        EducationDescription: "EducationDescription",
        CurrentCompanyName : "CurrentCompanyName",
        Experience : 5,
        TeamSize : 6,
        ProjectCount : 2,
        KnowledgeDescription : "KnowledgeDescription",
        WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
        IsActive : true,
        IsDelete : false
      };
      chai.request(server)
        .post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(candidate)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('CandidateName');
          res.body.errors.CandidateName.should.have.property('kind').eql('required');
          done();
        });
    });

		it('it should not POST an Resume without EducationDescription field', (done) => {
			let candidate = {
				CandidateName: "",
				EducationDescription: undefined,
				CurrentCompanyName : "CurrentCompanyName",
				Experience : 5,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('EducationDescription');
					res.body.errors.EducationDescription.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without CurrentCompanyName field', (done) => {
			let candidate = {
				CandidateName: "",
				EducationDescription: "B.Com",
				CurrentCompanyName : undefined,
				Experience : 5,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('CurrentCompanyName');
					res.body.errors.CurrentCompanyName.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without Experience field', (done) => {
			let candidate = {
				CandidateName: "",
				EducationDescription: "B.Com",
				CurrentCompanyName : "ABC",
				Experience : undefined,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('Experience');
					res.body.errors.Experience.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without TeamSize field', (done) => {
			let candidate = {
				CandidateName: "Riya Somani",
				EducationDescription: "B.Com",
				CurrentCompanyName : "ABC",
				Experience : 5,
				TeamSize : undefined,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('TeamSize');
					res.body.errors.TeamSize.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without ProjectCount field', (done) => {
			let candidate = {
				CandidateName: "",
				EducationDescription: "B.Com",
				CurrentCompanyName : "ABC",
				Experience : 5,
				TeamSize : 6,
				ProjectCount : undefined,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('ProjectCount');
					res.body.errors.ProjectCount.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without KnowledgeDescription field', (done) => {
			let candidate = {
				CandidateName: "",
				EducationDescription: "B.Com",
				CurrentCompanyName : "ABC",
				Experience : 5,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : undefined,
				WorkDescription: "WorkDescription",
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('KnowledgeDescription');
					res.body.errors.KnowledgeDescription.should.have.property('kind').eql('required');
					done();
				});
		});
		it('it should not POST an Resume without WorkDescription field', (done) => {
			let candidate = {
				CandidateName: "Chanda Kocher",
				EducationDescription: "B.Com",
				CurrentCompanyName : "ABC",
				Experience : 5,
				TeamSize : 6,
				ProjectCount : 2,
				KnowledgeDescription : "KnowledgeDescription",
				WorkDescription: undefined,
        DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
        ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
        OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
        TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
        FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
        LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
        DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
        DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
				IsActive : true,
				IsDelete : false
			};
			chai.request(server)
				.post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				.send(candidate)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('WorkDescription');
					res.body.errors.WorkDescription.should.have.property('kind').eql('required');
					done();
				});
		});
  // //   //All valid fields are available
    it('it should POST a Resume ', (done) => {
      // let candidate = new Candidate({
			let candidate = {
          CandidateName: "Monica M Patel",
          EducationDescription: "EducationDescription",
          CurrentCompanyName : "CurrentCompanyName",
          Experience : 5,
          TeamSize : 6,
          ProjectCount : 2,
          KnowledgeDescription : "KnowledgeDescription",
          WorkDescription: "WorkDescription",
          Domain : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
          Application :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
          OperatingSystem :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
          Technology : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
          Framework : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
          Language : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
          Database : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
          DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
          IsActive : true,
          IsDelete : false,
					Projects : []
        };
      chai.request(server)
        .post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(candidate)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Ok');
          res.body.data[0].should.have.property('CandidateName');
          res.body.data[0].should.have.property('IsDelete');
          res.body.data[0].should.have.property('IsActive');
          res.body.data[0].IsDelete.should.be.eql(false);
          done();
        });
    });
  // // //   // All fields are not available
    it('it should not POST an Resume without field values ', (done) => {
      let candidate = {
          CandidateName: undefined,
          EducationDescription: undefined,
          CurrentCompanyName : undefined,
          Experience : undefined,
          TeamSize : undefined,
          ProjectCount : undefined,
          KnowledgeDescription : undefined,
          WorkDescription: undefined,
          Domain : undefined,
          Application : undefined,
          OperatingSystem : undefined,
          Technology : undefined,
          Framework : undefined,
          Language : undefined,
          Database : undefined,
          DesignationId : undefined,
          IsActive : undefined,
          IsDelete : undefined,
					Projects : undefined
      }
      chai.request(server)
        .post('/API/ResumeInsert')
        .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
        .send(candidate)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('CandidateName');
          res.body.errors.CandidateName.should.have.property('kind').eql('required');
          done();
        });
    });
  });

	  describe('/PUT/:id Resume', () => {
  //   // update a Resume with a valid ResumeId
	  it('it should UPDATE a Resume by the given id', (done) => {
	  	let candidate = new Candidate({
						CandidateName: "Monica Bedi",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
      })

	  	 candidate.save((err, resume) => {
				chai.request(server)
			    .put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
			    .send({
             CandidateId : resume._id,
							CandidateName: "Jayshree Pathak",
							EducationDescription: "EducationDescription",
							CurrentCompanyName : "CurrentCompanyName",
							Experience : 5,
							TeamSize : 6,
							ProjectCount : 5,
							KnowledgeDescription : "KnowledgeDescription",
							WorkDescription: "WorkDescription",
              DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
              ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
              OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
              TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
              FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
              LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
              DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
							IsActive : true,
							IsDelete : false
          })
			    .end((err, res) => {
				  	res.should.have.status(200);
				  	res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('Ok');
				  	res.body.data.filter(x=>x._id == resume._id)[0].should.have.property('CandidateName').eql('Jayshree Pathak');
			      done();
			    });
		   });
	  });
	// // 	// update a Resume with a valid CandidateId but without CandidateName
    it('it should not UPDATE  a Resume without CandidateName field', (done) => {
      let candidate = new Candidate({
						CandidateName: "Kiran Bedi",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
      })
      candidate.save((err, resume) => {
        chai.request(server)
          .put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
						CandidateId : resume._id,
						CandidateName: undefined,
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
  			  	res.body.errors.should.have.property('CandidateName');
  			  	res.body.errors.CandidateName.should.have.property('kind').eql('required');
            done();
          });
      });
    });

		it('it should not UPDATE  a Resume without EducationDescription field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Jugal Hansraj",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Aditya Pancholi",
						EducationDescription: undefined,
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('EducationDescription');
						res.body.errors.EducationDescription.should.have.property('kind').eql('required');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without CurrentCompanyName field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hanshika Panchal",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Arena Panchal",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : undefined,
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('CurrentCompanyName');
						res.body.errors.CurrentCompanyName.should.have.property('kind').eql('required');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without Experience field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : undefined,
						TeamSize : 6,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('Experience');
						res.body.errors.Experience.should.have.property('kind').eql('required');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without TeamSize field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 7,
						TeamSize : null,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
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
		it('it should not UPDATE  a Resume when TeamSize field is undefined', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 7,
						TeamSize : undefined,
						ProjectCount : 5,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql("CastError");
						res.body.should.have.property('path').eql("TeamSize");
						res.body.should.have.property('kind').eql('number');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without ProjectCount field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 7,
						TeamSize : 7,
						ProjectCount : null,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('ProjectCount');
						res.body.errors.ProjectCount.should.have.property('kind').eql('required');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without KnowledgeDescription field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 7,
						TeamSize : 7,
						ProjectCount : 2,
						KnowledgeDescription : undefined,
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('KnowledgeDescription');
						res.body.errors.KnowledgeDescription.should.have.property('kind').eql('required');
						done();
					});
			});
		});
		it('it should not UPDATE  a Resume without WorkDescription field', (done) => {
			let candidate = new Candidate({
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
			})
			candidate.save((err, resume) => {
				chai.request(server)
					.put('/API/ResumeUpdate')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
					.send({
						CandidateId : resume._id,
						CandidateName: "Jay Gohil",
						EducationDescription: "EducationDescription",
						CurrentCompanyName : "CurrentCompanyName",
						Experience : 7,
						TeamSize : 7,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: undefined,
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('errors');
						res.body.errors.should.have.property('WorkDescription');
						res.body.errors.WorkDescription.should.have.property('kind').eql('required');
						done();
					});
			});
		 });
  //   // Update a Resume with an invalid CandidateId
    it('it should not UPDATE Resume Details as given id is not a valid CandidateId', (done) => {
        chai.request(server)
          .put('/API/ResumeUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
							CandidateId : mongoose.Types.ObjectId(),
							CandidateName: "Hinal Gohil",
							EducationDescription: "B.Com",
							CurrentCompanyName : "ABC",
							Experience : 5,
							TeamSize : 6,
							ProjectCount : 2,
							KnowledgeDescription : "KnowledgeDescription",
							WorkDescription: "WorkDescription",
              DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
              ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
              OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
              TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
              FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
              LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
              DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
              DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
							IsActive : true,
							IsDelete : false
          })
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('RecordNotFound');
                res.body.should.have.property('status').eql(404);
            done();
          });
    });
	// 	// Update a Resume with an invalid CandidateId
		it('it should not UPDATE an Resume as given id is not a valid objectId', (done) => {
        chai.request(server)
          .put('/API/ResumeUpdate/')
          .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
          .send({
						CandidateId : 'abc',
						CandidateName: "Hinal Gohil",
						EducationDescription: "B.Com",
						CurrentCompanyName : "ABC",
						Experience : 5,
						TeamSize : 6,
						ProjectCount : 2,
						KnowledgeDescription : "KnowledgeDescription",
						WorkDescription: "WorkDescription",
            DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
            ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
            OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
            TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
            FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
            LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
            DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
            DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
						IsActive : true,
						IsDelete : false
          })
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name').eql('CastError');
                res.body.should.have.property('path').eql("_id");
						  	res.body.should.have.property('kind').eql('ObjectId');
            done();
          });
    });
  });
});



	describe('/DELETE/:id Resume', () => {
 // //   //Delete an Resume with valid CandidateId
	 it('it should DELETE an Resume by the given id', (done) => {
		 let candidate = new Candidate({
			CandidateName: "Suchita Chopra",
			EducationDescription: "B.Com",
			CurrentCompanyName : "ABC",
			Experience : 5,
			TeamSize : 6,
			ProjectCount : 2,
			KnowledgeDescription : "KnowledgeDescription",
			WorkDescription: "WorkDescription",
      DomainId : localStorage.getItem('DomainId') != null ? localStorage.getItem('DomainId').toString(): [],
      ApplicationId :localStorage.getItem('ApplicationId') != null ? localStorage.getItem('ApplicationId').toString(): [],
      OperatingSystemId :localStorage.getItem('OperatingSystemId') != null ? localStorage.getItem('OperatingSystemId').toString(): [],
      TechnologyId : localStorage.getItem('TechnologyId') != null ? localStorage.getItem('TechnologyId').toString(): [],
      FrameworkId : localStorage.getItem('FrameworkId') != null ? localStorage.getItem('FrameworkId').toString(): [],
      LanguageId : localStorage.getItem('LanguageId') != null ? localStorage.getItem('LanguageId').toString(): [],
      DatabaseId : localStorage.getItem('DatabaseId') != null ? localStorage.getItem('DatabaseId').toString(): [],
      DesignationId : localStorage.getItem('DesignationId') != null ? localStorage.getItem('DesignationId').toString(): [],
			IsActive : true,
			IsDelete : false
		 })
		 candidate.save((err, resume) => {
			 chai.request(server)
				 .delete('/API/ResumeDelete/' + resume._id)
         .set('Authorization', 'Bearer ' + localStorage.getItem('JWT_Token').toString())
				 .end((err, res) => {
					 res.should.have.status(200);
					 res.body.should.be.a('object');
					 res.body.should.have.property('message').eql('Ok');
					 done();
				 });
		 });
	 });

 // //   //Delete an Resume with invalid CandidateId
	 it('it should not DELETE an Resume by the given id', (done) => {
			 chai.request(server)
				 .delete('/API/ResumeDelete/' + mongoose.Types.ObjectId())
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
