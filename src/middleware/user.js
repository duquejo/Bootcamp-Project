/**
 * 
 * User Middleware
 * @requires User model
 * 
 */
const mongoose = require('mongoose');
const User     = require('../models/User');


const userMiddleware = async ( req, res, next ) => {
  try {
    
    /**
     * Last created user
     */
    const user = await User.findOne().sort({'createdAt': -1});
    
    /**
     * Adding user field as request param
     */
     req.user = user;
     next();
  } catch (e) {
    req.status(404).send('Please login');
  }
};

module.exports = userMiddleware;