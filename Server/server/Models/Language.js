var mongoose = require('mongoose');
var schema = mongoose.Schema;

var languageSchema = new schema({
    LanguageName: {type:String, required:true },
    IsActive: { type:Boolean, default:true },
    IsDelete: { type: Boolean, default: false  }
});

module.exports = mongoose.model('Language', languageSchema);