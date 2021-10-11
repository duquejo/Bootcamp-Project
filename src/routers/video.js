/**
 * Video Routes
 * 
 * @requires express
 * @requires Video Mongoose Model
 * @requires router Express Route
 * @requires multer Media Handling
 */
const path                = require('path');
const express             = require('express');
const mongoose            = require('mongoose');
const router              = express.Router();

const Video               = require('../models/Video');
const Category            = require('../models/Category');

const uploadMiddleware    = require('../middleware/upload');
const userMiddleware      = require('../middleware/user');

const VideoController     = require('../controllers/videoController');
const { send } = require('process');

/**
 * Get all videos (with filters)
 */
router.get('/videos', async (req, res) => {

  let search = {};
  let tags = req.query.tags;
  parsedTags = tags ? tags.split(',').map( tag => tag.toLowerCase().trim() ).filter( el => el != '' ) : undefined;

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
  if( parsedTags ){

    console.log( parsedTags );

    /**
     * Get Tags ID's
     */
    const tagsIds = await Category.find({ 
      name : { $in: parsedTags }
    }).select('_id');

    console.log( tagsIds );

    search.tags = {
      $elementMatch: tagsIds[0]
    }
    /**
     * Reparar esto
     * @todo
     * 
     */
  }
  
  try {

    const videos = await Video.find( search )
      .populate( [ { path: 'owner', select: 'name username' } ])
      .populate( [ { path: 'tags', select: '-__v' } ]);  
      
      // console.log( videos );

    if( videos.length == 0 ) return res.status(404).send();

    res.send( videos );    

  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * Upload video
 */
router.post('/video', uploadMiddleware, userMiddleware, async (req, res) => {

  let tags = req.body.tags;

  tags = tags ? tags.split(',').map( tag => tag.toLowerCase().trim() ).filter( el => el != '' ) : undefined;

  /**
   * Create new tags
   */
  if( tags ) {

    /**
     * Discard old categories
     */
    const availableTags = await Category.find({}).select('name');
    const availableTagsNames = Object.keys(availableTags).map(k => availableTags[k].name );
    const tagsArray = tags.filter( tag => ! availableTagsNames.includes( tag ) );

    if( tagsArray.length > 0 ) {

      const tagsObject = tagsArray.map( tag => {
        return { name: tag }
      });

      try {
        /**
         * Add new tags into schema
         */        
        await Category.insertMany( tagsObject, ( error, docs ) => {
          if( error ) throw new Error( { message: error } );
        });        
      } catch (e) {
        return res.status(500).send( error );
      }
    }
  }

  /**
   * Get Tags ID's
   */
  const tagsIds = await Category.find({ 
    name : { $in: tags }
  }).select('_id');
  
  try {

    /**
     * Thumbnail
     */
    const thumbSrc = await VideoController.generateThumbnails( req.file.filename );

    /**
     * Save video
     */
    const video = new Video({
      name: req.body.name,
      url: req.file.filename,
      thumbnail: thumbSrc[0],
      owner: req.user._id,
      tags: tagsIds
    });

    console.log( video );

    await video.save();

    res.status(201).send();
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * Get video by ID
 */
router.get('/video/:id', async (req, res) => {
  try {
    const video = await Video.findById( req.params.id )
      .populate( [ { path: 'owner', select: 'name username' } ])
      .populate( [ { path: 'tags', select: '-_id -__v' } ]);

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
    const video = await Video.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } }, { new: true } ).select('likes');
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

module.exports = router;