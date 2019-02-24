var mongoose = require('mongoose');
// Setup schema
var bitcoinSchema = mongoose.Schema({
    timestamp:Date,
    marketname: String,
    //open: String,
    //close:String,
    high:Number,
    low:Number,
    volume:Number
});
/* Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}
*/
module.exports = mongoose.model('bitcoin', bitcoinSchema);