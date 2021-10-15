/**
 * 
 * Tests related to User routes
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
 const Video       = require('../src/models/Video');
 const WordFilter  = require('bad-words');
 const badWords    = require('../src/utils/badWords');
 const bcrypt      = require('bcryptjs');
 const { userDemo1, userDemo2, setupDatabase, video1 } = require('./fixtures/db');

/**
* Clean DB before tests
*/
beforeEach( setupDatabase );

/**
 * User tests
 */

/**
 * Create tests
 */
test( 'Should create a new user', async () => {

  const userToTest = {
    name: 'User demo test',
    username: 'demodemo',
    password: 'Test123+',
    email: 'demo1@gmail.com',
  };

  const badUserforTest = { 
    ...userToTest, 
    username: 'fag'
  };

  const badUserforTest2 = {
    ...userToTest,
    username: 'long long story'
  };

  // Asset to create an user
  const response = await request(app).post('/api/v1/user').send(userToTest).expect(201);  
 
  // Assert to fail a wrong username (profanity check)
  await request(app).post('/api/v1/user').send(badUserforTest).expect(400);
 
  // Assert to fail a wrong username (regex)
  await request(app).post('/api/v1/user').send(badUserforTest2).expect(400);

  // Check if user object exists
  const user = await User.findById( response.body.user._id );
  expect(user).not.toBeNull();

  // Check if username has not a single badword
  const filter = new WordFilter();
  filter.addWords( ...badWords );
  expect(filter.isProfane(user.name)).toBeFalsy();   

  // Check if user email is valid
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  expect(user.email).toMatch(re);
  
  // Assert the password is not plaintext
  expect(user.password).not.toBe('Test123+');

  // Check user password is well decrypted
  expect( await bcrypt.compare( userToTest.password, user.password ) ).toBeTruthy();

  // Check Object
  expect( user ).toMatchObject({
    name: 'User demo test',
    username: 'demodemo',
    password: user.password,
    email: 'demo1@gmail.com',
    token: user.token
  });
});


/**
 * Login Tests
 */
test( 'Should login a provided user', async () => {

  // Assert to login with username
  const response = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo1.username,
      password: userDemo1.password
    }).expect(200);
  
  // Assert to login with email
  const response2 = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo2.email,
      password: userDemo2.password
    }).expect(200);

  // Assert to have cookie session present active (User1)
  expect( response.header ).toHaveProperty('set-cookie');

  // Assert to have cookie session present active (User2)
  expect( response2.header ).toHaveProperty('set-cookie');
  
  // Assert to have different cookies for both cases
  const cookieValue1 = response.get('Set-Cookie')[0];
  const cookieValue2 = response2.get('Set-Cookie')[0];
  const user1token = cookieValue1.match('(^|;)\\s*' + 'access_token' + '\\s*=\\s*([^;]+)')?.pop() || '';
  const user2token = cookieValue2.match('(^|;)\\s*' + 'access_token' + '\\s*=\\s*([^;]+)')?.pop() || '';
  expect( user1token ).not.toBe( user2token );

  // Assert to enable an user to navigate on profile area after a successfull login
  await request(app)
    .get('/profile')
    .set('Cookie', response.get('Set-Cookie')[0] )
    .send().expect(200);

  // Assert to enable an user to navigate on video upload area after a successfull login
  await request(app)
    .get('/upload')
    .set('Cookie', response.get('Set-Cookie')[0] )
    .send().expect(200);
});

/**
 * Session tests (Not logged/unregistered)
 */
test( 'Should fail with a unregistered user', async () => {

  // Assert to fail
  await request(app).post('/api/v1/login').set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: 'joseduque',
      password: 'Test123+'
    }).expect(400);

  // Assert to restrict access an unregistered user to a privated areas.
  const response = await request(app).get('/profile').send().expect(302); // Redirection
  const response2 = await request(app).get('/upload').send().expect(302); // Redirection
  
  // Assert to redirect a unregistered user to the login view
  expect( response.get('location') ).toBe('/login');
  expect( response2.get('location') ).toBe('/login');

  // Assert to block an unregistered user to upload a video
  await request(app).post('/api/v1/video').send({
    name: 'Video test 3',
    url: 'education.mp4',
    tags: [ 'funny', 'cats', 'liberty', 'nodejs', 'programming' ]
  }).expect(401);

  // Assert to block an unregistered user to create a category
  await request(app).post('/api/v1/tag').send({
    name: 'Mountain'
  }).expect(401);

  // Assert to block an unregistered user to add a category to a existing video
  await request(app).patch(`/api/v1/video/${ video1._id }/tags`).send([
    'lifestyle', 'food', 'cars', 'planes', 'weedings'
  ]).expect(401);

  // Assert to block an unregistered user to add likes
  await request(app).patch(`/api/v1/video/${ video1._id }/like`).send().expect(401);

  const videoAlt = await Video.findById( video1._id ).select('likes');

  // Assert to check if a unregistered blocked like request haven't altered the original value
  expect( videoAlt.likes ).toBe( video1.likes );

  // Assert to fail to logout a unregistered user
  const response3 = await request(app).get('/logout').send().expect(302); // Redirection

  // Assert to redirect to the login view after trying to logout a unregistered user.
  expect( response3.get('location') ).toBe('/login');
});

test( 'Should retrieve a public user profile', async () => {
  await request(app).get(`/api/v1/user/${ userDemo1.username }`).expect(200);
});

test( 'Should retrieve 404 if the user profile doesn\'t exists', async () => {
  await request(app).get('/api/v1/user/mariah').expect(404);
});

test( 'Should retrieve an user videos object list', async () => {
  // Video content exists
  const response = await request(app).get( `/api/v1/user/${ userDemo1._id }/videos` ).expect(200);

  // Check array of objects structure
  expect( Array.isArray( response.body ) ).toBe(true);
});

test( 'Should retrieve 404 if an inexistent user is requesting videos', async () => {
  // Video content exists
  const response = await request(app).get( `/api/v1/user/${ video1._id }/videos` ).expect(404);
});