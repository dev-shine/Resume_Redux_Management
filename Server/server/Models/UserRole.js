var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userRoleSchema = new schema({
  _id: { type: schema.ObjectId, default: null },
  UserId: [{ type: schema.ObjectId, ref: 'User', required:true }],
  RoleId: [{ type: schema.ObjectId, ref: 'Role', required:true }]
});

module.exports = mongoose.model('UserRole', userRoleSchema);