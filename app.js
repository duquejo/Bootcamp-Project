/**
 * ********
 * Main App
 * ********
 * 
 * SERVER SETTINGS
 */
const express        = require('express');
const http           = require('http');
const path           = require('path');
const sassMiddleware = require('node-sass-middleware');
const hbs            = require('hbs');

hbs.registerHelper('ifTrue', ( arg1 ) => arg1 == false ? 'sb-sidenav-toggled' : '' );

/**
 * DATABASE METHODS
 */
require('./src/database/mongoose');

/**
 * ROUTERS HANDLERS
 */
const videoRouter    = require('./src/routers/video');
const categoryRouter = require('./src/routers/category');
const userRouter     = require('./src/routers/user');
const appRouter      = require('./src/routers/app');

/**
 * EXPRESS APP DEFINITION
 */
const app = express();

/**
 * PORT
 */
const port = process.env.APP_PORT || 3000;

/**
 * SITE PATHS
 */
const publicDirectoryPath = path.join( __dirname, './public' );
const destDirectoryPath   = path.join( __dirname, './public/css' );
const srcDirectoryPath    = path.join( __dirname, './public/scss' );
const viewsPath           = path.join( __dirname, './templates/views' );
const partialsPath        = path.join( __dirname, './templates/partials' );

/**
 * VIEW ENGINE SETTINGS
 */
app.set( 'view engine', 'hbs' );
app.set( 'views', viewsPath );

hbs.registerPartials( partialsPath );

/**
 * Live SCSS Compressing middleware
 * 
 * node_modules\materialize.scss
 */
app.use( sassMiddleware({
  src: srcDirectoryPath,
  dest: destDirectoryPath,
  outputStyle: 'expanded',
  includePaths: [ 
    path.join( __dirname ), 'node_modules/bootstrap\/sass',
  ],
  prefix: '/css',
  // debug: true
}));
app.use( express.static( publicDirectoryPath ) );

/**
 * Configure Express to automatically parse JSON as objects
 */
app.use( express.json() );

 /**
  * Using custom route handlers
  */
// Custom API Backend Wrapper /api/v1/
app.use( '/api/v1', videoRouter, userRouter, categoryRouter );

// Public Wrapper /
app.use( appRouter );
// app.use( videoRouter, userRouter, categoryRouter, appRouter );

/**
 * Server listening
 */
http.createServer(app).listen( port, () => {
  console.log(`Server started on port ${ port }`);
});