
/**
 * 
 * Sidebar logic
 */
window.addEventListener('DOMContentLoaded', event => {

  // Side navigation Toggle
  const sidebarToggle = document.querySelector('#sidebarToggle');
  const singleVideoContainer = document.querySelector('#single-video');

  if ( sidebarToggle ) {
      sidebarToggle.addEventListener('click', event => {
          event.preventDefault();
          document.querySelector('.sidebar').classList.toggle('sb-sidenav-toggled');
          if( singleVideoContainer ) document.querySelector('.suggested-video').classList.toggle('d-none');
      });
  }

  /**
   * 
   * Menu bar
   */
  const showNavbar = ( toggleId, navId, bodyId, headerId ) =>{

    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if( toggle && nav && bodypd && headerpd ){
      toggle.addEventListener('click', () => {
      // show navbar
      nav.classList.toggle('show-bar')
      // change icon
      toggle.classList.toggle('bi-x')
      // add padding to body
      bodypd.classList.toggle('body-pd')
      // add padding to header
      headerpd.classList.toggle('body-pd')
    })};
  };

  showNavbar( 'header-toggle','nav-bar','body-pd','header');

  /**
   * Active link
   */
  const linkColor = document.querySelectorAll('.nav_link')

  function colorLink(){
    if(linkColor){
      linkColor.forEach(l=> l.classList.remove('active'))
      this.classList.add('active')
    }
  }
  linkColor.forEach(l=> l.addEventListener('click', colorLink))

  // Your code to run since DOM is loaded and ready

});




window.onload = function () {

  /**
   * Form Upload conditions
   */
  const $formUpload = document.querySelector('#form-upload');

  if( $formUpload ){

    hyperform($formUpload); // Form Validation

    $formUpload.addEventListener('submit', e => {

      e.preventDefault();
        
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if( response.ok == true && response.status == '201' ) {
          $formUpload.reset();
          $formUpload.querySelector('#preview').innerHTML = '';
          showMessage( 'The video has been uploaded successfully!', 'alert-success', 'bi-check-circle-fill' );
        } else {
          showMessage( 'Something happened, check it and retry again.', 'alert-danger', 'bi-x-circle-fill' );
        }
      });
    });

    const $inputUrl = $formUpload.querySelector('#form-url');
    $inputUrl.addEventListener('change', e => {

      
      const $video = $formUpload.querySelector('#preview');
      let videoSource = e.target.files;

      if( videoSource.length == 0 ) return;

      const videoSourceBlob = URL.createObjectURL( videoSource[0] );      
      
      if( $video.children.length == 0 ){
        const source = document.createElement('source');
        source.setAttribute('src', videoSourceBlob );
        $video.appendChild(source);
      } else {
        const source = $video.getElementsByTagName('source')[0];
        source.setAttribute('src', videoSourceBlob );
      }

      $video.load();
      $video.play();

    });
  
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
                $searchResults.innerHTML += `<a href="/video/${ video._id }" class="list-group-item list-group-item-action small">${ video.name }</a>`;
              });
            }
          }).catch( err => {
            console.error( err.message );
            $searchResults.innerHTML = '<span class="list-group-item small">No results</span>';
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
        
        /**
         * Fetch Call
         */
        getApiCall( `/api/v1/video/${ videoId }/like`, { method: 'PATCH' }).then( response => {
          console.log( response );
          if( response ) $likesCount.querySelector('small').innerHTML = response.likes == 1 ? `${ response.likes } like` : `${ response.likes } likes`;
        }).catch( error => {
          /**
           * Advice
           */
          modalContent('Please <a href="/login">login first</a> if you want to add a like!' );
          console.error( error );
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
            .then( videos => fetchVideosList( videos ))
            .catch( ( { status, statusText } ) => {
              if( status == 404 ) { 
                document.querySelector('.main-content  .video-grid' ).innerHTML = '<p class="fst-italic">No videos found with this tag.</p>';
              } else {
                console.error( `Something happened ${ statusText }`);
              }
            });
        }, 1000 );
      });
    })
  }


  /**
   * Site login
   */
  const $formLogin = document.querySelector('#form-login');
  if( $formLogin ) {
    
    hyperform( $formLogin);
    
    $formLogin.addEventListener('submit', e => {
      e.preventDefault();

      const $formUser = $formLogin.querySelector('input[name="login"]');
      const $formPass = $formLogin.querySelector('input[name="password"]');
      const $formTerms = $formLogin.querySelector('input[name="terms"]');
      
      let loginFormData = new URLSearchParams();
      loginFormData.append('login', $formUser.value.trim() );
      loginFormData.append('password', $formPass.value );
      loginFormData = loginFormData.toString();

      const response = getApiCall( '/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: loginFormData
      }).then( res => window.location.assign('/'))
      .catch( err => {
        console.error(err);
        showMessage( err.statusText, 'alert-danger', 'bi-x-circle-fill' );
      })
    });
  }

};

/**
 * API /GET Calls handler
 */
const getApiCall = async ( url, params = {} ) => {
    const response = await fetch( url, params );
    if ( !response.ok ) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
    return data;
};

/**
 * Fetch videos lists
 */
const fetchVideosList = ( videos ) => {

  const $mainContent  = document.querySelector('.main-content' );
  const $videoGrid    = $mainContent.querySelector('.video-grid');
  const $videoCounter = $mainContent.querySelector('h2.video-grid-title small');

  if( $videoGrid && videos.length ){

    $videoGrid.innerHTML = '';

    /**
     * Get all cards
     */
    let htmlContent = videos.map( video => {
      let badgeContent = '';
      if( video.tags.length === 0 ) {
        badgeContent = `<span class="badge rounded-pill bg-dark">uncategorized</span>`;
      } else {
        video.tags.map( tag => badgeContent += `<span class="badge rounded-pill bg-dark">${ tag }</span>` );
      }

      return `<div class="card border-0 col-sm-6 col-lg-3 mb-3">
                <a class="image-container" href="/video/${ video._id }">
                  <div class="play position-absolute top-50 start-50 translate-middle"><i class="bi bi-play-circle animate__animated animate__fadeInDown"></i></div>
                  <img src="/uploads/thumbnails/${ video.thumbnail }" class="card-img-top rounded-top"  alt="${ video.name } thumbnail">
                </a>                  
                <div class="card-body">
                  <div class="tags-content mb-3">${ badgeContent }</div>
                  <div class="card-title mb-0"><a href="/video/${ video._id }">${ video.name }</a></div>
                  <p class="card-text mb-0 small"><a href="/user/${ video.owner.username }">${ video.owner.name }</a></p>
                  <div class="row mt-2">
                    <p class="likes-content small col-md-5 col-12 text-center"><i class="bi bi-heart-fill"></i><span class="ms-2">${ video.likes } likes</span></p>
                    <p class="small col-md-7 col-12 text-end fw-light fst-italic">${ moment( video.createdAt ).fromNow() }</p>
                  </div>
                </div>
              </div>`;
    });

    // Append HTML
    $videoGrid.innerHTML = htmlContent.join(''); // Remove ','
    $videoCounter.innerHTML = `(${videos.length})`;
  }
};

/**
 * Messages
 */
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

const modalContent = content => {
  const $modal = document.querySelector('#modal')
  const modal = bootstrap.Modal.getOrCreateInstance( $modal ) // Returns a Bootstrap modal instance
  $modal.querySelector('.modal-body p').innerHTML = content;
  modal.show();
  return;
};