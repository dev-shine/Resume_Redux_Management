var mongoose = require('mongoose');
var schema = mongoose.Schema;

var operatingSystemSchema = new schema({
    OperatingSystemName: { type:String, required: true },
    IsActive: { type:Boolean, default: true },
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('OperatingSystem', operatingSystemSchema);