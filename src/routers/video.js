/**
 * Video Routes
 * 
 * @requires express
 * @requires Video Mongoose Model
 * @requires router Express Route
 * @requires multer Media Handling
 */
const express          = require('express');
const path             = require('path');
const Video            = require('../models/Video');
const Category         = require('../models/Category');
const uploadMiddleware = require('../middleware/upload');
const userMiddleware   = require('../middleware/user');
const router           = express.Router();

/**
 * Get all videos (with filters)
 */
router.get('/videos', async (req, res) => {

  let search = {};

  /**
   * Search params
   */
  if( req.query.search ) {
    search.name = {
      $regex: req.query.search, // String search
      $options: "i" // Case Insensitive search
    };
  }

  /**
   * Tag search
   */
  if( req.query.tags ){
    search.tags = req.query.tags.trim().toLowerCase();
  }

  try {

    const videos = await Video.find( search );
    if( videos.length == 0 ) return res.status(404).send();
    res.send( videos );    

  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Upload video
 */
router.post('/video', uploadMiddleware, userMiddleware, async (req, res) => {

  let tags = req.body.tags;
  tags = tags ? tags.split(',').map( tag => tag.trim() ) : undefined;
  

  console.log( req.file );

  try {

    const video = new Video({
      name: req.body.name,
      url: req.file.filename,
      owner: req.user._id,
      tags
    });

    await video.save();

    // Create new tags
    if( tags ) {

      const availableTags = await Category.find({}).select('name');
      const availableTagsNames = Object.keys(availableTags).map(k => availableTags[k].name );
      const tagsArray = tags.filter( tag => ! availableTagsNames.includes( tag ) );

      if( tagsArray.length > 0 ) {

        let tagsObject = [];
        tagsArray.map( tag => tagsObject.push( { name: tag } ) );

        /**
         * Add new tags into schema
         */        
        await Category.insertMany( tagsObject, ( error, docs ) => {
          if( error ) res.status(500).send( error );
        });
      }
    }

    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get video info
 */
router.get('/video/:id', async (req, res) => {
  try {
    const video = await Video.findById( req.params.id );

    if( ! video ) return res.status(404).send();  

    res.send( video );

  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * Delete video by Id
 */
router.delete('/video/:id', async (req, res) => {

  try {
    const video = await Video.findOneAndDelete({
      _id: req.params.id
    });

    if( ! video ) return res.status(404).send();

    res.send( video );

  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * Add User likes
 */
router.patch('/video/:id/like', async (req, res) => {

  try {

    const video = await Video.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } }, { new: true } );

    if( ! video ) return res.status(404).send();

    res.send( video );

  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * Add Categories to video
 */
router.patch('/video/:id/tags', async (req, res) => {

  const tags = req.body;
  try {

    const video = await Video.findByIdAndUpdate( req.params.id, {
      $addToSet: {
        tags
      }
    }, { new: true });

    if( ! video ) return res.status(404).send();

    res.send(video);

  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Create video by user (done)
 * Get all videos (done)
 * Get user videos (done)
 * delete video (done)
 * add likes to video (done)
 * filter video by category (done)
 * Search video (done)
 * assign tag to video (done)
 * remove video tag (maybe)
 */

module.exports = router;