/**
 * 
 * User Controller
 */
 const axios = require('axios').default;

 class UserController {

  constructor(){}

  static async singleProfile( username ){
    try {
      const response = await axios.get( `http://localhost:3000/api/v1/user/${ username }` );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = UserController;