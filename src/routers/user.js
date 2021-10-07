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
 * Get user videos
 */
 router.get('/user/:id/videos', async (req, res) => {
  try {

    const videos = await Video.find({
      owner: req.params.id
    });

    if( ! videos ) return res.status(404).send();
    res.send(videos);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Get my videos
 */
 router.get('/profile/videos', userMiddleware, async (req, res) => {
  await req.user.populate('videos');
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