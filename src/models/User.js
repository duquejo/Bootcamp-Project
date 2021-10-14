/**
 * 
 * User model
 * 
 * @requires mongoose
 * @requires validator
 * @requires bcryptjs
 * @requires bad-words
 */
const mongoose      = require('mongoose');
const validator     = require('validator');
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const WordsFilter   = require('bad-words');
const badwordsArray = require('../utils/badWords');

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
    unique: true,
    maxlength: 15,
    trim: true,
    validate( username ){

      if ( ! validator.isAlphanumeric(username) ) throw new Error('Your username has a wrong format, check it and try again.');

      const filter = new WordsFilter(); // Default words list
      filter.addWords( ...badwordsArray );
      if( filter.isProfane( username ) ) throw new Error('Your username is invalid, try another one, please.'); 
      /**
       * @todo check!
       */
    }
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
  token:{
    type: String,
    required: true
  }
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
 * Generate User Auth Token
 */
userSchema.methods.generateAuthToken = async function (){
  
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' } ); // 1 Minute

  user.token = token;
  await user.save();
  return token;
};

/**
 * Search User Object by credentials
 */
userSchema.statics.findByCredentials = async ( login, password ) => {

  /**
   * Search by Username / Password
   */
  const user = await User.findOne({
    $or: [
      { email: login },
      { username: login }
  ]});

  if( ! user ) throw new Error('Unable to login');

  /**
   * Password correlation
   */
  const isMatch = await bcrypt.compare( password, user.password );

  if( ! isMatch ) throw new Error('Unable to login');

  return user;
};

/**
 * Secure sensible user data thought API requests.
 * @returns Object
 */
userSchema.methods.toJSON = function() {
  const user       = this;
  const userObject = user.toObject(); // Mongoose method.

  /**
   * Deleting private info
   */
  delete userObject.password;
  delete userObject.token;
  return userObject;
};

/**
 * Pre Save Mongoose Hook alteration
 * @see Before a user saving task, if the password has been modified, it will be encrypted.
 */
userSchema.pre('save', async function ( next ) {
  const user =  this; // User context
  if( user.isModified('password') ) user.password = await bcrypt.hash( user.password, 8 ); // Using async hashing strategy for resources optimization
  next();
});

const User = mongoose.model( 'User', userSchema );

module.exports = User;