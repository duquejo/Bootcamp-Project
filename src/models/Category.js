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

const Category = mongoose.model( 'Category', categorySchema );

module.exports = Category;