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
  
  const tagName = req.body.name.toLowerCase().trim();
  const tag = await Category.find({ name: tagName });
  
  if( tag.length > 0 ) {
    return res.status(400).send( `The category name: \'${ tagName }\' already exists`);
  } else {
    
    const newTag = new Category({ name: tagName });
    try {
      await newTag.save();
      res.status(201).send();
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
});

/**
 * - Get tags ()
 * - Create tag (done)
 * - Delete tag (maybe)
 */

module.exports = router;