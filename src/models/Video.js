/**
 * 
 * Video model
 * @requires mongoose
 */
 const mongoose  = require('mongoose');

 /**
  * 
 * Video Model Schema Definition
 */
const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {  
    // type: Buffer,
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: {
    type: Array,
    ref: 'Category' // Reference between Category and Video
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference between User and Video
  }
},{ timestamps: true });

const Video = mongoose.model( 'Video', videoSchema );

module.exports = Video;