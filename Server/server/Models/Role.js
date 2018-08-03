var mongoose = require('mongoose');
var schema = mongoose.Schema;

var roleSchema = new schema({
  RoleName: { type:String, required:true },
  IsActive: { type: Boolean, default : true },
  IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Role', roleSchema);