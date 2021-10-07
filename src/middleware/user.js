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
     * @todo Make it dynamic
     */
    const ownerId = mongoose.Types.ObjectId('615b99f22657154fd2f92d1f');
    const user = await User.findById( ownerId );

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