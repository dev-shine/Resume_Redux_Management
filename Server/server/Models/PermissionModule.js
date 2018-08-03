var mongoose = require('mongoose');
var schema = mongoose.Schema;

var permissionModuleSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  ParentPermissionModuleId: { type:schema.ObjectId, required: true },
  PermissionModuleName: { type:String, required: true },
  DisplayName: { type:String, default:null },
  IsActive : { type:Boolean, default:true }
});

module.exports = mongoose.model('PermissionModule', permissionModuleSchema);