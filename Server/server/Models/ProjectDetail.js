var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectDetailSchema = new schema({
    CandidateId: { type:schema.ObjectId, required:true },
    ProjectId: { type:schema.ObjectId, required:true },
    RoleId:{ type:schema.ObjectId, required:true },
    Responsibilities: { type:String, required:true }
});

module.exports = mongoose.model('ProjectDetail', projectDetailSchema);
