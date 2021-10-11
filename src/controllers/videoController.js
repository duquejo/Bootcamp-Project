/**
 * 
 * Video Controller
 * 
 * @requires axios HTTP Async Client
 * 
 * @requires ffmpeg // Video codecs
 * @requires ffmpegPath // Node JS Integrated OS ffmpeg codec
 * @requires ffprobePath // Node JS Integrated OS ffprobe codec
 */
const axios       = require('axios').default;
const path        = require('path');
const ffmpeg      = require('fluent-ffmpeg');
const ffmpegPath  = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static');

class VideoController {

  constructor(){}

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

  static generateThumbnails( videoSrc ){
    /**
     * Ffmpeg & Ffprobe setup
     */
     ffmpeg.setFfmpegPath( ffmpegPath );
     ffmpeg.setFfprobePath( ffprobePath.path );    

    return new Promise( ( resolve, reject ) => {
      try {
        var proc = ffmpeg( path.join( process.env.UPLOADS_DIR, '/videos', videoSrc ))
        .on('filenames', filenames => resolve( filenames ))
        .on('error', err => reject( `An error happened: ${ err.message }` ))
        .takeScreenshots({ 
          count: 1, 
          timestamps: [ '00:00:000' ],
          size: '390x260',
          filename: '%b_thumb.png' 
        }, path.join( process.env.UPLOADS_DIR, '/thumbnails' ));
      } catch (e) {
        reject( e );
      }
    });
  }
}

module.exports = VideoController;