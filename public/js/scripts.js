window.addEventListener('DOMContentLoaded', event => {

  // Toggle the side navigation
  const sidebarToggle = document.querySelector('#sidebarToggle');
  const singleVideoContainer = document.querySelector('#single-video');

  console.log( singleVideoContainer );

  if (sidebarToggle) {
      sidebarToggle.addEventListener('click', event => {
          event.preventDefault();
          document.querySelector('.sidebar').classList.toggle('sb-sidenav-toggled');
          if( singleVideoContainer ) document.querySelector('.suggested-video').classList.toggle('d-none');
      });
  }
});