var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectDetailsSchema = new schema({
    _id: { type: schema.ObjectId, default: null },
    CandidateId: { type:schema.ObjectId, required:true },
    ProjectId: { type:schema.ObjectId, required:true },
    RoleId: { type: schema.ObjectId, required:true },
    Responsibilities: { type:String, required:true }
});

module.exports = mongoose.model('ProjectDetails', projectDetailsSchema);