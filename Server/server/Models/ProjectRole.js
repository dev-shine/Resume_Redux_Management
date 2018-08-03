var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectRoleSchema = new schema({
  ProjectRoleName: { type:String, required:true },
  IsActive: { type:Boolean, default: true },
  IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('ProjectRole', projectRoleSchema);