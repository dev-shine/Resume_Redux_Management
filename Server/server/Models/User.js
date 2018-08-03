var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    // _id: { type: schema.ObjectId },
    FirstName: { type:String, required:true },
    LastName: { type:String, required:true },
    ContactNumber: { type:Number, required:true },
    Email: { type:String, required:true },
    Password: { type:String, required:true },
    IsActive: { type:Boolean, default: true },
    IsDelete: { type:Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
