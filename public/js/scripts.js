window.addEventListener('DOMContentLoaded', event => {

  // Toggle the side navigation
  const sidebarToggle = document.querySelector('#sidebarToggle');
  const singleVideoContainer = document.querySelector('#single-video');

  if (sidebarToggle) {
      sidebarToggle.addEventListener('click', event => {
          event.preventDefault();
          document.querySelector('.sidebar').classList.toggle('sb-sidenav-toggled');
          if( singleVideoContainer ) document.querySelector('.suggested-video').classList.toggle('d-none');
      });
  }
});


window.onload = function () {
  
  /**
   * Form Upload conditions
   */
  const $formUpload = document.querySelector('#form-upload');

  if( $formUpload ){

    hyperform($formUpload);
    // let pristine = new Pristine( $formUpload );

    $formUpload.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // const valid = pristine.validate(); // returns true or false
      // if ( valid ) {
        
        const $formName = $formUpload.querySelector('input[name="form-name"]');
        const $formUrl  = $formUpload.querySelector('input[name="form-url"]');
        const $formCategory  = $formUpload.querySelectorAll('input[name="form-category"]:checked');
        const $formNewCategories = $formUpload.querySelector('input[name="form-new-category"]');
    
        /**
         * Build Initial Category Array from created cats
         */
        let catArr1 = [];
        $formCategory.forEach( cat => catArr1.push( cat.value ) );
    
        /**
         * Build new Categories Structure
         */
        const catArr2 = $formNewCategories.value.split(',').map( cat => cat.trim() );
    
        /**
         * Concat array structures
         */
        const categoriesArray = [ ...new Set( [...catArr1, ...catArr2 ] ) ];
    
        var formData = new FormData();
        formData.append( 'name', $formName.value.trim() );
        formData.append( 'url', $formUrl.files[0] );
        formData.append( 'tags', categoriesArray.join(',') );
    
        fetch( '/api/v1/video', {
          method: 'POST',
          body: formData
        }).then( response => {
          if( response.ok == true && response.status == '201' ) {
            $formUpload.reset();
            showMessage( 'The video has been uploaded successfully!', 'alert-success', 'bi-check-circle-fill' );
          } else {
            showMessage( 'Something happened, check it and retry again.', 'alert-danger', 'bi-x-circle-fill' );
          }
        });
      // } else {
      //   console.error('Form with errors');
      // }
  
    });
  
    const showMessage = ( message, alertClass, iconClass ) => {
      const $formMessage = document.querySelector('.form-upload-messages');
  
      $formMessage.classList.add('animate__animated', 'animate__fadeIn', 'd-flex');
      $formMessage.querySelector('span').textContent = message;
      $formMessage.classList.add( alertClass );
      $formMessage.querySelector('i').classList.add( iconClass );
  
      // Animate message
      setTimeout( () => {
        $formMessage.classList.remove('animate__fadeIn');
        $formMessage.classList.add('animate__fadeOut');
        $formMessage.addEventListener('animationend', () => {
          $formMessage.classList.remove('d-flex');
        });
      }, 5000 );
  
      return false;
    };
  }


  /**
   * Search bar conditions
   */
  const $searchBar = document.querySelector('#search-bar');

  if( $searchBar ){

    /**
     * Delay keypress action
     */
    let timeoutId = 0;
    $searchBar.addEventListener('keypress', (e) => {
      clearTimeout( timeoutId ); 
      timeoutId = setTimeout( () => {

        let searchText = $searchBar.querySelector('input').value.trim();
        const $searchResults = $searchBar.querySelector('.dropdown-content');

        $searchResults.innerHTML = ''; // Clean container first
        if( searchText.length > 2 ) {

          getApiCall( `/api/v1/videos?search=${ searchText }` ).then( res => {
            if( ! res ) {
              $searchResults.innerHTML = '<span class="list-group-item small">No results</span>';
            } else {
              res.map( video => {
                console.log( video );
                $searchResults.innerHTML += `<a href="video/${ video._id }" class="list-group-item list-group-item-action small">${ video.name }</a>`;
              });
            }
          }).catch( err => {
            console.log( err.message );
          });
        } else {
          $searchResults.innerHTML = '<span class="list-group-item small">Please search more than 3 characters</span>';
        }
      }, 1000 );
    });
  };
  
};

/**
 * API /GET Calls handler
 */
const getApiCall = async ( url ) => {
    const response = await fetch( url );
    if ( !response.ok ) return false;
    const data = await response.json();
    return data;
};