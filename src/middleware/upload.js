/**
 * Uploads middleware
 * @requires multer
 */
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: ( req, file, cb ) => {
    cb( null, process.env.UPLOADS_DIR );
  },
  filename: ( req, file, cb ) => {
    cb( null, `${ Date.now() }${ path.extname( file.originalname ) }` );
  }
});

const upload = multer({ storage }).single('url');

module.exports = upload;