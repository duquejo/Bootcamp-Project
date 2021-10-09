window.addEventListener('DOMContentLoaded', event => {

  // Toggle the side navigation
  const sidebarToggle = document.querySelector('#sidebarToggle');
  const singleVideoContainer = document.querySelector('#single-video');

  if ( sidebarToggle ) {
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
         * Concat array structures (Unique elements)
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
  
  /**
   * Likes count add
   */
  const $likesCount = document.querySelector('#single-video .likes-content');

  if( $likesCount ) {

    $likesCount.addEventListener('click', (e) => {
      let videoId = e.currentTarget.getAttribute('data-id');
      if( videoId && videoId.length > 0 ){
        console.log( videoId )
        
        fetch( `/api/v1/video/${ videoId }/like`, { method: 'PATCH' }).then( response => response.json() ).then( response => {
          if( response ){
            $likesCount.querySelector('small').innerHTML = response.likes == 1 ? `${ response.likes } like` : `${ response.likes } likes`;
          }
        }).catch( error => {
          console.error(error);
        });
      }
    });
  }

  /**
   * Upper Categories bar (Index)
   */
  const $tagBar = document.querySelector('.main-content .tag-bar');

  if( $tagBar ){
    const $badges = $tagBar.querySelectorAll('.main-content .tag-bar .badge');

    let timeoutId = 0;
    let activeBadges = [];

    $badges.forEach( $badge => {

      $badge.addEventListener('click', (e)=> {

        activeBadges = [];

        const currentBadge = e.currentTarget.classList.toggle( 'active' );
        clearTimeout( timeoutId );
        timeoutId = setTimeout( () => { 
              
          // Remove empty array values.
          $tagBar.querySelectorAll('.active').forEach( badge => {
            const attribute = badge.getAttribute( 'data-category' ).trim();
            if( attribute != '' ) activeBadges.push( attribute );
          } );

          // Check added values
          let url = '';
          if( activeBadges.length > 0 ){
            url = `/api/v1/videos?tags=${ activeBadges.join(',') }`; // Parsed Query
          } else {
            url = `/api/v1/videos`; // Get all results again
          }

          // Manage response
          const response = getApiCall( url )
            .then( videos => fetchVideosList( videos ) )
            .catch( err => console.error( `Something happened ${ err }` ) );
        }, 1000 );
      });
    })
  }
};

/**
 * API /GET Calls handler
 */
const getApiCall = async ( url, params = {} ) => {
    const response = await fetch( url, params );
    if ( !response.ok ) return false;
    const data = await response.json();
    return data;
};

const fetchVideosList = ( videos ) => {

  const $mainContent  = document.querySelector('.main-content' );
  const $videoGrid    = $mainContent.querySelector('.video-grid');
  const $videoCounter = $mainContent.querySelector('h2.video-grid-title small');

  console.log( $mainContent, $videoCounter );

  if( $videoGrid ){

    $videoGrid.innerHTML = '';
    let htmlContent = videos.map( video => {
      let badgeContent = '';
      if( video.tags.length === 0 ) {
        badgeContent = `<span class="badge rounded-pill bg-dark">uncategorized</span>`;
      } else {
        video.tags.map( tag => badgeContent += `<span class="badge rounded-pill bg-dark">${ tag }</span>` );
      }

      return `<div class="card border-0 col-sm-6 col-lg-4 mb-3">
                <a href="/video/${ video._id }">
                  <img src="/images/test.jpg" class="card-img-top rounded-top" alt="...">
                </a>                  
                <div class="card-body">
                  <div class="tags-content mb-3">${ badgeContent }</div>
                  <div class="card-title mb-0"><a href="/video/${ video._id }">${ video.name }</a></div>
                  <p class="card-text mb-0 small"><a href="/user/${ video.owner.username }">${ video.owner.name }</a></p>
                  <p class="likes-content small"><i class="bi bi-heart-fill"></i><span class="ms-2">${ video.likes } likes</span></p>
                </div>
              </div>`;
    });
    // Append HTML
    $videoGrid.innerHTML = htmlContent.join(''); // Remove ','
    $videoCounter.innerHTML = `(${videos.length})`;
  }
};