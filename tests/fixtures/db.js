/**
 * 
 * JEST Setup
 * 
 * @requires mongoose
 * @requires User model
 * @requires Video model
 * @requires Category model
 * @requires jwt
 * 
 */
const mongoose = require('mongoose');
const User     = require('../../src/models/User');
const Video    = require('../../src/models/Video');
const Category = require('../../src/models/Category');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');

/**
 * 
 * Model Mockup & Factory
 * 
 */

const userDemo1Id = new mongoose.Types.ObjectId();
const userDemo2Id = new mongoose.Types.ObjectId();
const userDemo3Id = new mongoose.Types.ObjectId();

/**
 * 
 * @model Users
 */
const userDemo1 = {
    _id: userDemo1Id,
    name: 'Juan Pérez',
    username: 'juanpe',
    email: 'juan@demo.com',
    password: 'juanDemo123*',
    token: jwt.sign({ _id: userDemo1Id }, process.env.JWT_SECRET )
};

const userDemo2 = {
    _id: userDemo2Id,
    name: 'Martina Domínguez',
    username: 'mar321',
    email: 'martina@demo.com',
    password: 'mar123¿?',
    token: jwt.sign({ _id: userDemo2Id }, process.env.JWT_SECRET )
};

const userDemo3 = {
    _id: userDemo3Id,
    name: 'Leandro Muñoz',
    username: 'leamu',
    email: 'leamu@demo.com',
    password: 'leo123*',
    token: jwt.sign({ _id: userDemo3Id }, process.env.JWT_SECRET )
};

/**
 * 
 * 
 * @model Categories
 */
const cat1 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'corporate'
}
const cat2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'business'
}
const cat3 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'driving'
}
const cat4 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'passion'
}

/**
 * 
 * @model Videos
 */
const video1 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Video test 1',
    url: 'education.mp4',
    thumbnail: 'education_thumb.png',
    likes: 0,
    tags: [ 'corporate', 'business', 'driving', 'passion' ],
    owner: userDemo1._id
};

const video2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Video test 2',
    url: 'education.mp4',
    thumbnail: 'car_thumb.png',
    likes: 0,
    tags: [ 'corporate', 'driving' ],
    owner: userDemo1._id
};

const deleteUploads = directory => {
    fs.readdir( directory, (err, files) => {
        if (err) console.log(err);
        files.forEach(file => {
            const fileDir = path.join( directory, file);
            if (file !== '.gitkeep') {
                fs.unlinkSync(fileDir);
            }
        });
    });
};

const setupDatabase = async () => {

    deleteUploads('./public/uploads/thumbnails');
    deleteUploads('./public/uploads/videos');

    /**
     * 
     * DB Cleaning
     */
    await User.deleteMany({});
    await Video.deleteMany({});
    await Category.deleteMany({});

    /**
     * 
     * Tests models instantiation & save
     */
    await new User( userDemo1 ).save();
    await new User( userDemo2 ).save();

    await new Category( cat1 ).save();
    await new Category( cat2 ).save();
    await new Category( cat3 ).save();
    await new Category( cat4 ).save();

    await new Video( video1 ).save();
    await new Video( video2 ).save();

};

const setupDatabase2 = async () => {

    deleteUploads('./public/uploads/thumbnails');
    deleteUploads('./public/uploads/videos');

    await User.deleteMany({});
    await Video.deleteMany({});
    await Category.deleteMany({});

    await new User( userDemo3 ).save();
    
    await new Video( video1 ).save();
}

module.exports = { userDemo1, userDemo2, userDemo3, cat1, cat2, cat3, cat4, video1, video2, setupDatabase, setupDatabase2 };