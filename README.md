# Welcome to my Node JS Final Project!
## It's chilltime 
*Version:* v1.1.0

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![made-with-nodejs](https://img.shields.io/badge/Made_with-Node_JS-green.svg)](https://nodejs.org/es/)
[![Project Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)](https://github.com/duquejo01/Bootcamp-Project)

[![JWT Compatible](http://jwt.io/img/badge-compatible.svg)](https://jwt.io/)


## Project dependencies and development dependencies

- *Dependencies*
  - *[axios](https://www.npmjs.com/package/axios)* (0.22.0): HTTP REST Client for the frontend requests.
  - *[bootstrap](https://www.npmjs.com/package/bootstrap)* (5.1.2): Frontend framework for quickly sites building (Mobile-first, responsive).
  - *[bad-words](https://www.npmjs.com/package/bad-words)* (3.0.4): Analize strings and check their profanity
  - *[bcryptjs](https://www.npmjs.com/package/bcryptjs)* (2.4.3): Encrypt and validates password strings.
  - *[express](https://www.npmjs.com/package/express)* (4.17.1): Server management module.
  - *[cookie-parser](https://www.npmjs.com/package/cookie-parser)* (1.4.5): Handles User sessions in the app using server cookies.
  - *[ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static)* (4.4.0): Static _ffmpeg_ dependencies based in the host OS.
  - *[ffprobe-static](https://www.npmjs.com/package/ffprobe-static)* (3.0.0): Static _ffprobe_ dependencies based in the host OS.
  - *[fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)* (2.1.2): A fluent ffmpeg API for video manipulation and processing.
  - *[hbs](https://www.npmjs.com/package/hbs)* (4.1.2): Handlebars mustache template frontend system.
  - *[moment](https://www.npmjs.com/package/moment)* (2.29.1): Time manipulation and datatime management library.
  - *[mongodb](https://www.npmjs.com/package/mongodb)* (4.1.2): Documental JSON Database (NoSQL)
  - *[mongoose](https://www.npmjs.com/package/mongoose)* (6.0.8): MongoDB speciallized ODM library.
  - *[multer](https://www.npmjs.com/package/multer)* (1.4.3): File handling/Uploading module. 
  - *[node-sass-middleware](https://www.npmjs.com/package/node-sass-middleware)* (0.11.0): Node JS middleware for compiling and building CSS through SASS/SCSS files.
  - *[validator](https://www.npmjs.com/package/validator)* (13.6.0): Allows backend to manage complex validations.

- *Development dependencies*
  - *[env-cmd](https://www.npmjs.com/package/env-cmd)*: (10.1.0): Enviroment variables module.
  - *[jest](https://www.npmjs.com/package/jest)*: (27.2.5): Node JS Testing suite with mocking support.
  - *[nodemon](https://www.npmjs.com/package/nodemon)* (2.0.13): Server demon for file changes listening and live server updating.
  - *[supertest](https://www.npmjs.com/package/supertest)*: (6.1.6): Boosts Jest with asyncronous tasks and more HTTP Request testing support.

### Quick links for the Node JS Bootcamp memories & public projects.
- [Bootcamp memories Hub](https://github.com/duquejo01/BootCamp-Node-JS)
- [Weather App Git](https://github.com/duquejo01/Weather-App-Node): GIT Source.
- [Weather App Demo (Frontend+Backend)](https://duque-weather-application.herokuapp.com/): Live Weather App Public Demo.
- [Task Manager App Git](https://github.com/duquejo01/Task-Manager): GIT Source.
- [Task Manager App Demo (Backend)](https://duque-task-manager.herokuapp.com/): Live Task Manager App Public Demo.
- [Chat App Git](https://github.com/duquejo01/Chat-App): GIT Source.
- [Chat App Demo (Frontend+Backend)](https://duque-chat-app.herokuapp.com/): Live Chat App Public Demo.

## Node JS _package.json_ config

```sh
  ...
  "scripts": {
    "start": "node src/app.js",
    "dev": "env-cmd -f ./src/config/.env nodemon ./app.js -e js,hbs",
    "test": "env-cmd -f ./src/config/test.env jest --watch --runInBand"
  },
  ...
```
## It's Chilltime setup
As I said in the first section, the app has a .env config support... So, if you want to run locally/our server this project, you need to follow this steps first.

1. Install NPM dependencies & development dependencies. `npm i` (You need to have installed Node in the host server).
2. Copy the .env.example file located in `src/config/` directory.
3. Complete the following fields:

```.env

# Server variables

APP_PORT= Express Listening Port

MONGODB_URL= "MongoDB URL, with leading mongodb:// config string."
MONGODB_USER= "MongoDB User"
MONGODB_PASSWORD= "MongoDB Password"

UPLOADS_DIR= "It's recommended to use the default public/uploads value."

```
4. If you want to run tests, create a new .env file with the name `test.env` name.
5. If you want to run tests without removing the uploaded uploads, please configure `UPLOADS_DIR` in the `test.env` file. 
6. Take care if you want to run the automated tests in the main dev/prod uploads directory, that's because the test tasks cleans the database and remove all files in the specified directories for each every executed test suite.
7. Execute `npm run dev` or `npm run test` for quick development/testing deployment.

## Notes about *ffmpeg* and *ffprobe*

FFmpeg is the leading multimedia framework, able to decode, encode, transcode, mux, demux, stream, filter and play pretty much anything that humans and machines have created.

This video codecs are supported in my app, I'm using this for the auto video thumbnail generation. But.. It can open up the possibilities to make a *LOT* of things with the uploaded videos:

- Video standarization: Convert all sources to a general one... (Web friendly standard - Like webm).
- Video compressing & optimization.
- Video quick view (Like a gif or short video) support.

The 'fmpeg-static' and 'ffprobe-static' dependencies enable the native support for quickly implementation. It will analize the current OS and will install the best option.

## Future updates/improvements

- Users management.
- User register
- User avatar uploading support.
- Video Standarization.
- Video Optimization.
- Quick Peek Video support (Like youtube).
- Refactor Categories & Videos model relationship.
- Tests coverage over 100% (Including cookie unit tests).
- Commenting system support.
- Use React/Angular/Vue to serve the frontend.