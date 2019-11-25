const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  accepted: {
      type: Boolean,
      default: false
  },
  acceptedUserId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User',
  },
  delivered: {
      type: Boolean,
      default: false
  }
},{timestamps: true});



const Order = mongoose.model('Order', OrderSchema);


function validateOrder(Order) {
  const schema = {
    name: Joi.string().min(1).max(255).required(),
    quantity: Joi.number().min(0),
  };

  return Joi.validate(Order, schema);
}

exports.Order = Order; 
exports.validate = validateOrder;