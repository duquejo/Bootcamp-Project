/**
 * User Routes
 * 
 * @requires express
 * @requires User Mongoose Model
 * @requires Video Mongoose Model
 * @requires router
 * @requires jsonwebtoken
 */
const express          = require('express');
const validator        = require('validator');
const cookie           = require('cookie-parser');
const User             = require('../models/User');
const Video            = require('../models/Video');
const userMiddleware   = require('../middleware/user');
const router           = express.Router();

/**
 * Create user
 */
router.post('/user', async ( req, res ) => {

  const user = new User({
    ...req.body
  });

  try {

    /**
     * Generating JWT session tokens
     */
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({user, token}); // Return user & token
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Login Route
 */
router.post( '/login', async ( req, res, next ) => {

  const { login, password } = req.body;
  
  try {

    /**
     * Data validation & sanitization
     */
    if( ! login ) throw new Error('The login field is mandatory');
    if( ! password ) throw new Error('The password field is mandatory');
    if( ! validator.isEmail(login) && ! validator.isAlphanumeric(login) ) throw new Error('Please provide a valid username or email.');

    // Define custom User Model function to login
    const user  = await User.findByCredentials( login, password ); // Static Model Method
    const token = await user.generateAuthToken(); // Revoke actual user session and set a new one.
    
    res.cookie( 'access_token', token ).send({ user });

  } catch (e) {
    res.statusMessage = e.message;
    return res.status(400).send();
  }
});

/**
 * Retrieve user profile by username
 */
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne( {
      username: req.params.username
    } );    
    if( ! user ) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * Get user videos
 */
 router.get('/user/:id/videos', async (req, res) => {
  try {

    const videos = await Video.find({
      owner: req.params.id
    });

    if( ! videos || videos.length === 0 ) return res.status(404).send();
    
    res.send(videos);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;