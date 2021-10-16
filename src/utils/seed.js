/**
 * 
 * Development seeders config
 */
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

const User     = require('../models/User');
const Video    = require('../models/Video');
const Category = require('../models/Category');

/**
 * DATABASE METHODS
 */
require('../database/mongoose');

const seedDB = async () => {
  try {
    
    /**
     * 
     * DB Cleaning
     */
    await User.deleteMany({});
    await Video.deleteMany({});
    await Category.deleteMany({});

    /**
     * 
     * @model Users
     */
    const userID = new mongoose.Types.ObjectId();
    const seedUser = {
        _id: userID,
        name: 'José Duque',
        username: 'demo',
        email: 'jose@demo.com',
        password: 'demo123*',
        token: jwt.sign({ _id: userID }, process.env.JWT_SECRET )
    };    
    const userID2 = new mongoose.Types.ObjectId();
    const seedUser2 = {
        _id: userID2,
        name: 'Andrea Johnson',
        username: 'demo2',
        email: 'andrea@demo.com',
        password: 'demo123*',
        token: jwt.sign({ _id: userID2 }, process.env.JWT_SECRET )
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

    await new User( seedUser ).save();
    await new User( seedUser2 ).save();
    await new Category( cat1 ).save();
    await new Category( cat2 ).save();
    await new Category( cat3 ).save();
    await new Category( cat4 ).save();

    console.log('Seeding process completed!');
  } catch (e) {
    console.error('Something happened', e );
  }
  // Close process
  process.exit();
}

seedDB();