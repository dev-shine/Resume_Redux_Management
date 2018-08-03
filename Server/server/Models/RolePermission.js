var mongoose = require('mongoose');
var schema = mongoose.Schema;

var rolePermissionSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  RoleId: [{ type: schema.ObjectId, ref: 'Role', required:true }],
  PermissionModuleId: [{ type: schema.ObjectId, ref: 'PermissionModule', required:true }],
  ModuleKey: { type: String, required:true }
});

module.exports = mongoose.model('RolePermission', rolePermissionSchema);