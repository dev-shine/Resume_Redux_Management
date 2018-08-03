var mongoose = require('mongoose');
var schema = mongoose.Schema;

var technologySchema = new schema({
    TechnologyName: { type:String, required:true },
    IsActive: { type:Boolean, default:true },
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Technology', technologySchema);