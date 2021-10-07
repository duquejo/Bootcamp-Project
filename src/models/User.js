/**
 * 
 * User model
 * @requires mongoose
 * @requires validator
 */
const mongoose  = require('mongoose');
const validator = require('validator');

 /**
  * 
 * User Model Schema Definition
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove initial and final spaces
    validate( value ) {
      if( value.length === 0 ) throw new Error('The \'name\' field is mandatory');
    }
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password:{
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate( value ) {
      if( value.includes('password') ) throw new Error('Your password cannot contain "password" word.');
    }
  },
  email:{
    type: String,
    required: true,
    unique: true, // Mongoose will handle email as a unique index
    trim: true, // Remove initial and final spaces
    lowercase: true, // Convert any source to lowercase
    validate( value ) {
      if( ! validator.isEmail( value ) ) throw new Error('Your email is has a wrong format.');
    }
  },
},{ timestamps: true });

/**
 * Virtual field conn to videos Schema
 */
userSchema.virtual( 'videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'owner'
});

/**
 * Secure sensible user data thought API requests.
 * @returns 
 */
userSchema.methods.toJSON = function() {
  const user       = this;
  const userObject = user.toObject(); // Mongoose method.

  /**
   * Deleting private info
   */
  delete userObject.password;
  return userObject;
};

const User = mongoose.model( 'User', userSchema );

module.exports = User;