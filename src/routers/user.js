/**
 * User Routes
 * 
 * @requires express
 * @requires User Mongoose Model
 * @requires router Express Route
 */
 const express          = require('express');
 const User             = require('../models/User');
 const Video             = require('../models/Video');
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
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * My profile
 */
router.get('/profile/me', userMiddleware, async ( req, res ) => {
  res.send( req.user );
});

/**
 * User profile
 */
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne( {
      username: req.params.username
    });
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
    }).populate('tags', '-_id -__v');

    if( ! videos ) return res.status(404).send();
    res.send(videos);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Get my videos
 * "Populate a populated field."
 */
 router.get('/profile/videos', userMiddleware, async (req, res) => {
  await req.user.populate({
    path: 'videos',
    model: 'Video',
    populate: { path: 'tags', model: 'Category', select: '-_id -__v' }
  });
  res.send( req.user.videos );
});


/**
 * Create user (done)
 * Get my profile (done)
 * Delete user (maybe)
 * List users (maybe)
 * Auth users (X)
 */

module.exports = router;