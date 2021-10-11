/**
 * General App Routes
 * 
 * @requires express
 * @requires router Express Route
 */
const express            = require('express');
const router             = express.Router();
const VideoController    = require('../controllers/videoController');
const UserController     = require('../controllers/userController');
const CategoryController = require('../controllers/categoryController');
const userMiddleware     = require('../middleware/user');

/**
 * Home
 */
router.get( '/', async ( req, res ) => {
  const videos = await VideoController.fetchVideos();
  const tags = await CategoryController.fetchCategories();
  const open = true;
  res.render( 'index', { videos, tags, open });
});

/**
 * Single Video
 */
router.get('/video/:id', async ( req, res ) => {
  const video = await VideoController.singleVideo( req.params.id );
  const suggestedVideos = await VideoController.fetchVideos();
  const open = false;
  res.render( 'single-video', { video, suggestedVideos, open } );
});

/**
 * User profile
 */
router.get('/user/:username', async (req, res) => {
  const user = await UserController.singleProfile( req.params.username );
  const videos = await UserController.userVideos( user._id );
  res.render( 'single-user', { user, videos } );
});


/**
 * My profile
 */
 router.get('/profile', userMiddleware, async (req, res) => {
  const user = await UserController.singleProfile( req.user.username );
  const videos = await UserController.userVideos( req.user._id );
  console.log( videos );
  res.render( 'single-user', { user, videos, own: true } );
});

/**
 * Upload video
 */
router.get('/upload', async (req, res) => {
  const tags = await CategoryController.fetchCategories();
  res.render( 'upload-video', { tags } );
});

/**
 * 404
 */
router.get( '*', (req, res) => res.status(404).send( '[404] Route not found' ) );

module.exports = router;