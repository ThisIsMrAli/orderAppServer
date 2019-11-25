const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access
  role: {
      type: String,
      required: true,
  }
});


//custom method to generate authToken 
UserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, role: this.role }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    role: Joi.string().max(1).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;