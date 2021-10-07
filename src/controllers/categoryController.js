/**
 * 
 * Category Controller
 */
const axios = require('axios').default;

class CategoryController {
  constructor(){
  }

  static async fetchCategories(){
    try {
      const response = await axios.get( 'http://localhost:3000/api/v1/tags' );
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = CategoryController;