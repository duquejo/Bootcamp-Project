/**
 * 
 * JEST Setup
 * 
 * @requires mongoose
 * @requires User model
 * @requires Video model
 * @requires Category model
 * 
 */
const mongoose = require('mongoose');
const User     = require('../../src/models/User');
const Video    = require('../../src/models/Video');
const Category = require('../../src/models/Category');

/**
 * 
 * Model Mockup & Factory
 * 
 */

/**
 * 
 * @model Users
 */
const userDemo1 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Juan Pérez',
    username: 'juanpe',
    email: 'juan@demo.com',
    password: 'juanDemo123*'
};

const userDemo2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Martina Domínguez',
    username: 'mar321',
    email: 'martina@demo.com',
    password: 'mar123¿?'
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
    tags: [ cat1, cat2, cat3, cat4 ],
    owner: userDemo1._id
};

const video2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Video test 2',
    url: 'education.mp4',
    thumbnail: 'car_thumb.png',
    likes: 0,
    tags: [ cat1, cat3 ],
    owner: userDemo1._id
};

const setupDatabase = async () => {

    /**
     * 
     * DB Cleaning
     */
    await User.deleteMany();
    await Video.deleteMany();
    await Category.deleteMany();

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

module.exports = { userDemo1, userDemo2, cat1, cat2, cat3, cat4, video1, video2, setupDatabase };