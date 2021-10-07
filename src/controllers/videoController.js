/**
 * 
 * Video Controller
 */
const axios = require('axios').default;

class VideoController {
  constructor(){
  }

  static async singleVideo( videoId ){
    try {
      const response = await axios.get( `http://localhost:3000/api/v1/video/${ videoId }` );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async fetchVideos(){
    try {
      const response = await axios.get( 'http://localhost:3000/api/v1/videos' );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = VideoController;