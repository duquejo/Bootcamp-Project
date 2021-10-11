/**
 * 
 * Some Handlers utils functions
 */
const moment = require('moment');

/**
 * Convert Unix Mongodb Time to X from Now
 */
const fromNow = arg => moment( arg ).fromNow();

/**
 * Convert Unix Mongodb Time To Human Readable String
 */
const humanDate = arg => moment( arg ).format('dddd, MMMM Mo of YYYY');

module.exports = {
  fromNow, humanDate
};