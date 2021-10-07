/**
 * 
 * 
 * MongoDB Database File
 * @requires mongodb
 * @requires mongoose
 */
const mongodb = require('mongodb'); 
const mongoose  = require('mongoose');

/**
 * Mongoose connection
 * @param connectionURL
 * @param optionsObject
 */
const connectionURL = process.env.MONGODB_URL;

mongoose.connect( connectionURL, {
  useNewUrlParser: true
});