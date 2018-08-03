var mongoose = require('mongoose');
var schema = mongoose.Schema;

var domainSchema = new schema({
    DomainName: {type:String, required: true},
    IsActive: {type:Boolean, default:true },
    IsDelete: {type:Boolean, default:false }
});

module.exports = mongoose.model('Domain', domainSchema);
