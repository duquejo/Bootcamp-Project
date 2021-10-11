/**
 * Category Routes
 * 
 * @requires express
 * @requires Category Mongoose Model
 * @requires router Express Route
 * @requires multer Media Handling
 */
const { response } = require('express');
const express    = require('express');
const Category   = require('../models/Category');
const router     = express.Router();

/**
 * Get all tags
 */
router.get('/tags', async (req, res) => {
  const tags = await Category.find({});

  if( ! tags ) return res.status(404).send();
  
  return res.send(tags);
});

/**
 * Create new tags
 */
router.post('/tag', async (req, res) => {

  let rawTags = req.body;

  if( ! Array.isArray( rawTags ) ) return res.status(403); // Invalid format

  /**
   * Sanitization
   */
  rawTags = rawTags.filter( tag => {
    if( tag.trim() && tag.trim() != '' ) return tag.trim();
  }).map( tag => tag.toLowerCase().trim() );

  if( rawTags.length == 0 ) return res.status(400).send(); // No data

  /**
   * Search ocurrencies
   */
  const tags = await Category.find({ 
    name : { $in: rawTags }
  });

  /**
   * Check tags number
   */
  if( tags.length > 0 )  return res.status(400).send( `The category name(s): \'${ tags.map( tag => tag.name ).join(', ') }\' already exists`);

  /**
   * Create tags
   */
  const structuredTags = rawTags.map( tag => {
    return { name: tag };
  });

  try {

    /**
     * Add new tags into schema
     */        
    await Category.insertMany( structuredTags, ( error, tags ) => {
      if( error ) throw new Error( { message: error } );
      res.status(201).send(tags);
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;