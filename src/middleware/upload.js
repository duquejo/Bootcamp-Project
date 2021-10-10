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

const upload = multer({ storage }).single('url');

module.exports = upload;