/**
 * 
 * Category Controller
 */
const axios          = require('axios').default;

axios.defaults.baseURL = 'http://localhost:3000';

class CategoryController {
  constructor(){
  }

  static async fetchCategories(){
    try {
      const response = await axios.get( `/api/v1/tags` );
      return response.data;
    } catch (e) {
      // console.error(e.message);
    }
  }
}

module.exports = CategoryController;