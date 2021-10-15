/**
 * Uploads middleware
 * @requires multer
 * @requires path
 */
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: ( req, file, cb ) => {
    cb( null, path.join( process.env.UPLOADS_DIR, '/videos' ));
  },
  filename: ( req, file, cb ) => {
    cb( null, `${ Date.now() }${ path.extname( file.originalname )}` );
  }
});

const upload = multer({ 
  storage,
  fileFilter( req, file, cb ) {
    if( !file.originalname.match( /\.(mp4|mov|avi|wmv|mkv|oog|wma|webm)$/ ) ) {
      return cb( new Error('Please upload a valid video file.') );
    }
    cb( undefined, true );
  } 
}).single('url');

module.exports = upload;