var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userPermissionSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  UserId: [{ type: schema.ObjectId, ref: 'User', required:true }],
  PermissionModuleId: [{ type: schema.ObjectId, ref: 'PermissionModule', required:true }],
  ModuleKey: { type:String, required:true }
});

module.exports = mongoose.model('UserPermission', userPermissionSchema);