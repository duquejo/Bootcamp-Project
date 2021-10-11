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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference between User and Video
  },
  tags: {
    type: [ mongoose.Schema.Types.ObjectId ], // Awway ObjectIds
    ref: 'Category'
  }
},{ timestamps: true });

const Video = mongoose.model( 'Video', videoSchema );

module.exports = Video;