/**
 * 
 * Tests related to User methods
 * 
 * @requires jest
 * @requires supertest
 * @requires app
 * @requires User
 * @requires fixtures/db package
 * 
 */
 const request     = require('supertest');
 const app         = require('../app');
 const User        = require('../src/models/User');
 const { userDemo1, userDemo2, setupDatabase } = require('./fixtures/db');

/**
* Clean DB before tests
*/
beforeEach( setupDatabase );

/**
 * User Tests list
 * 1- Assert to create a new user
 * 2- Assert to find the newest user
 * 3- Assert to check a valid email
 * 4- Assert to find a user profile route
 * 5- 
 */

/**
 * User tests
 */
test( 'Should create a new user', async () => {

  // Asset to create an user
  const response = await request(app).post('/api/v1/user').send({
    name: 'User demo test',
    username: 'demodemo',
    password: 'Test123+',
    email: 'demo1@gmail.com',
  }).expect(201);

  // Check if user object exists
  const user = await User.findById( response.body.user._id );
  expect(user).not.toBeNull();

  // Check if user email is valid
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  expect(user.email).toMatch(re);
});

test( 'Should retrieve the user profile', async () => {
  await request(app).get(`/api/v1/user/${ userDemo1.username }`).expect(200);
});

test( 'Should retrieve 404 if the user profile doesn\'t exists', async () => {
  await request(app).get('/api/v1/user/mariah').expect(404);
});

test( 'Should retrieve the user videos', async () => {
  // Video content exists
  const response = await request(app).get( `/api/v1/user/${ userDemo1._id }/videos` ).expect(200);

  // Check array of objects structure
  expect( Array.isArray( response.body) ).toBe(true);
});

test( 'Should retrieve 404 if an inexistent user is requesting videos', async () => {
  // Video content exists
  const response = await request(app).get( `/api/v1/user/61650fd532ca60d515705c30/videos` ).expect(404);
});