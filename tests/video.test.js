/**
 * 
 * Tests related to Video routes
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
const Video       = require('../src/models/Video');
const { userDemo3, setupDatabase2, video1 } = require('./fixtures/db');

/**
* Clean DB before tests
*/
beforeEach( setupDatabase2 );

/**
 * User tests
 */

/**
 * Create tests
 */
test( 'Should create a new video', async () => {

  const newVideo = {
    url: 'tests/fixtures/education.mp4',
    name: 'Video test 4',
    tags: 'funny  ,cats,Liberty,nodejs,programming   '
  };

  // Assert to login with username
  const userResponse = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo3.username,
      password: userDemo3.password
    }).expect(200);
  
  // Assert to create a video
  const videoResponse = await request(app)
  .post('/api/v1/video')
  .set('Cookie', userResponse.get('Set-Cookie')[0] )
  .attach( 'url', newVideo.url )
  .field( 'name', newVideo.name )
  .field( 'tags', newVideo.tags ).expect(201);

  const video = await Video.findById( videoResponse.body._id );

  // Assert to validate if the new video exists
  expect( video ).not.toBeNull();

  // Assert to tags string to array conversion
  expect( Array.isArray(video.tags) ).toBeTruthy();
  
  // Assert if array was parsed
  expect( video.tags.sort() ).not.toEqual( newVideo.tags.split(',').sort() );
  
  // Assert if the parsed process was the same 
  expect( video.tags.sort() ).toEqual( newVideo.tags.split(',').map( el => el.trim().toLowerCase() ).sort() ); 
});

test( 'Should evaluate video files content', async () => {

  const newVideo2 = {
    url: 'tests/fixtures/education.mp4',
    name: 'Video test 6'
  }

  // Assert to login with username
  const userResponse = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo3.username,
      password: userDemo3.password
    }).expect(200);
  
  // Assert to enable video saving without categories
  const videoResponse2 = await request(app)
  .post('/api/v1/video')
  .set('Cookie', userResponse.get('Set-Cookie')[0] )
  .attach( 'url', newVideo2.url )
  .field( 'name', newVideo2.name ).expect(201);

  // Assert to preserve the creator Object ID in the Ref owner
  expect( videoResponse2.body.owner ).toBe( userDemo3._id.toString() );
});

test( 'Should add a video like', async () => {

  // Assert to login with username
  const userResponse = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo3.username,
      password: userDemo3.password
    }).expect(200);

  const videoResponse = await request(app)
    .patch( `/api/v1/video/${ video1._id }/like` )
    .set( 'Cookie', userResponse.get('Set-Cookie')[0] ).send().expect(200);

  // Assert to add a like and be greater than the last value.
  expect( videoResponse.body.likes ).toBeGreaterThan( video1.likes );
});

test( 'Should add an array of video tags', async () => {

  const newCats = [ 'world', 'traveling', 'adventure', 'happiness'];

  // Assert to login with username
  const userResponse = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      login: userDemo3.username,
      password: userDemo3.password
    }).expect(200);
  
  // Assert to block add tags if isn't the original propietary
  await request(app)
    .patch( `/api/v1/video/${ video1._id }/tags` )
    .set( 'Cookie', userResponse.get('Set-Cookie')[0] )
    .send( newCats ).send().expect(404);

  const newVideo = {
    url: 'tests/fixtures/education.mp4',
    name: 'Video test 5',
    tags: 'programming'
  };

  // Assert to create a video and append the new cats
  const videoResponse = await request(app)
    .post('/api/v1/video')
    .set('Cookie', userResponse.get('Set-Cookie')[0] )
    .attach( 'url', newVideo.url )
    .field( 'name', newVideo.name )
    .field( 'tags', newVideo.tags ).expect(201); 

  const appendedCatsVideo = await request(app)
    .patch( `/api/v1/video/${ videoResponse.body._id }/tags` )
    .set( 'Cookie', userResponse.get('Set-Cookie')[0] )
    .send( newCats ).expect(200);

  // Assert to append without duplicates.
  expect( appendedCatsVideo.body.tags.sort() ).toEqual( newCats.concat( newVideo.tags ).sort() );
});