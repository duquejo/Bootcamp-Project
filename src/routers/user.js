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
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * User profile
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