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
 const WordFilter  = require('bad-words');
 const badWords    = require('../src/utils/badWords');
 const bcrypt      = require('bcryptjs');
 const { userDemo1, userDemo2, setupDatabase, video1 } = require('./fixtures/db');

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

  // Assert to navigate to a private area after login successfully
  const response3 = await request(app)
    .get('/profile')
    .set('Cookie', response.get('Set-Cookie')[0] )
    .send().expect(200);
});

test( 'Should fail with a unregistered user', async () => {

  // Assert to login with username
  const response = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: 'joseduque',
      password: 'Test123+'
    }).expect(400);
});

test( 'Should retrieve the user profile', async () => {
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