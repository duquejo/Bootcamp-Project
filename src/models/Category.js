/**
 * 
 * Category model
 * @requires mongoose
 */
 const mongoose  = require('mongoose');

 /**
  * 
 * Video Model Schema Definition
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
});

categorySchema.virtual( 'videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'tags'
});

const Category = mongoose.model( 'Category', categorySchema );

module.exports = Category;