var mongoose = require('mongoose');
var schema = mongoose.Schema;

var applicationSchema = new schema({
    ApplicationName:{ type: String, required: true }, 
    IsActive: { type: Boolean, default: true },
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Application', applicationSchema);