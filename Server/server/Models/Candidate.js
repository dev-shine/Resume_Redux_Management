var mongoose = require('mongoose');
var schema = mongoose.Schema;

var candidateSchema = new schema({
    CandidateName: {type:String, required: true},
    EducationDescription: {type:String, required: true},
    CurrentCompanyName: {type:String, required: true},
    Experience: {type:String, required: true},
    TeamSize: {type:Number, required: true},
    ProjectCount: {type:Number, required: true},
    KnowledgeDescription: {type:String, required: true},
    WorkDescription: {type:String, required: true},
    DomainId: [{type:schema.ObjectId,ref : 'Domain', required: true}],
    ApplicationId: [{type:schema.ObjectId,ref : 'Application', required: true}],
    OperatingSystemId: [{type:schema.ObjectId,ref : 'OperatingSystem', required: true}],
    TechnologyId: [{type:schema.ObjectId,ref : 'Technology', required: true}],
    FrameworkId: [{type:schema.ObjectId, required: true}],
    LanguageId: [{ type: schema.ObjectId, ref: 'Language',required: true }],
    DatabaseId: [{ type: schema.ObjectId, ref: 'Database',required: true  }],
    DesignationId: [{ type: schema.ObjectId, ref: 'Designation', required: true }],
    IsActive: { type: Boolean, default: true },
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Candidate', candidateSchema);
