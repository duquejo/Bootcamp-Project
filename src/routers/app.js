/**
 * General App Routes
 * 
 * @requires express
 * @requires router Express Route
 */
const express            = require('express');
const router             = express.Router();
const VideoController    = require('../controllers/videoController');
const CategoryController = require('../controllers/categoryController');

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
router.get( '/video/:id', async ( req, res ) => {
  
  const video = await VideoController.singleVideo( req.params.id );
  const suggestedVideos = await VideoController.fetchVideos();
  const open = false;
  res.render( 'single-video', { video, suggestedVideos, open } );
});

/**
 * 404
 */
router.get( '*', (req, res) => res.status(404).send( '[404] Route not found' ) );

module.exports = router;