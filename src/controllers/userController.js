/**
 * 
 * User Controller
 */
 const axios = require('axios').default;

 axios.defaults.baseURL = 'http://localhost:3000';

 class UserController {

  constructor(){}

  static async singleProfile( username ){
    try {
      const response = await axios.get( `/api/v1/user/${ username }` );
      return response.data;
    } catch (e) {
      // console.error(e.message);
    }
  }

  static async userVideos( userId ){
    try {
      const response = await axios.get( `/api/v1/user/${ userId }/videos` );
      return response.data;
    } catch (e) {
      // console.error( e.message );
    }
  }
}

module.exports = UserController;