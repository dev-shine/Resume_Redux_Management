var mongoose = require('mongoose');
var schema = mongoose.Schema;

var designationSchema = new schema({
    DesignationName: { type:String, required: true },
    IsActive: { type:Boolean, default: true },
    IsDelete: { type:Boolean, default: false }
});

module.exports = mongoose.model('Designation', designationSchema);
