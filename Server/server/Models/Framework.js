var mongoose = require('mongoose');
var schema = mongoose.Schema;

var frameworkSchema = new schema({
    FrameworkName: { type:String, required:true },
    IsActive: { type:Boolean, default:true },
    IsDelete: { type:Boolean, default:false }
});

module.exports = mongoose.model('Framework', frameworkSchema);
