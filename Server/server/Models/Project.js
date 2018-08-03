var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectSchema = new schema({
    ProjectName: { type:String, required:true },
    TeamSize: { type:Number, required:true, default : 0 },
    Description: { type:String, required:true },
    OtherTools: { type:String, default:null },
    DomainId: [{ type: schema.ObjectId, ref: 'Domain', required:true }],
    OperatingSystemId: [{ type: schema.ObjectId, ref: 'OperatingSystem', required:true }],
    TechnologyId: [{ type: schema.ObjectId, ref: 'Technology', required:true }],
    DatabaseId: [{ type: schema.ObjectId, ref: 'Database', required:true }],
    IsActive: { type:Boolean, default: true },
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Project', projectSchema);
