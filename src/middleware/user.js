/**
 * 
 * User Middleware
 * @requires mongoose
 * @requires User model
 * @requires jwt
 * 
 */
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const url      = require('url');

const userMiddleware = async ( req, res, next ) => {

  console.log('Auth middleware');
  
  /**
   * Getting session cookie
   */
  const token = req.cookies.access_token;
  
  try {
        
    if( ! token ) throw new Error('Please login');

    // Verifing JWT from header.
    const payload = jwt.verify( token, process.env.JWT_SECRET );

    // Getting User
    const user = await User.findOne({ _id: payload._id, token: token });

    if( ! user ) throw new Error();
    
    /**
     * Pass user authenticated variables
     */
    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    /**
     * Discrimine Frontend & Backend actions
     * @bugfix Clean cookies it auth fails.
     */
    res.clearCookie('access_token');
    if( req.baseUrl == '/api/v1' ) {
      return res.status(401).send({ error: 'Please login'});
    } else {
      return res.redirect('/login');
    }
  }
};

module.exports = userMiddleware;