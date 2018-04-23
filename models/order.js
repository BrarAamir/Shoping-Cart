var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  paymentId: {type: String, required: true},
});
var Order = mongoose.model('Order', OrderSchema);
module.exports = {Order};
