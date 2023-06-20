require('./bootstrap');
require('flowbite');
const Alpine = require('alpinejs');

window.Alpine = Alpine;

// Initialization for ES Users
import { Collapse, Ripple, initTE } from 'tw-elements';

initTE({ Collapse, Ripple });

// Hover effect of images for product
document.addEventListener('DOMContentLoaded', () => {
    const gridImageContainer = document.querySelector('.grid-image-container');

    gridImageContainer.addEventListener('mouseover', () => {
        gridImageContainer.classList.add('hovered');
    });

    gridImageContainer.addEventListener('mouseout', () => {
        gridImageContainer.classList.remove('hovered');
    });
});


// Image swap for product on main page
const mainImage = document.getElementById('main-image');
const gridImageContainers = document.querySelectorAll('.grid-image-container');

const mainImageContainer = document.getElementById('main-image-container');
const overlay = document.querySelector('.overlay-container');
const closeBtn = document.querySelector('.item-overlay__close-btn');
const overlayImage = document.getElementById('item-overlay__main-img');
const mainOverlayImage = document.getElementById('item-overlay__main-imgimg');

let initialMainImageSrc = mainImage.getAttribute('src');

gridImageContainers.forEach((container) => {
    container.addEventListener('click', () => {
        // with click retrieve src of mainimage and clicked
      const currentMainImageSrc = mainImage.getAttribute('src');
      const clickedImageSrc = container.querySelector('img').getAttribute('src');
  
      // swapping main img and clicked img
      mainImage.setAttribute('src', clickedImageSrc);
      container.querySelector('img').setAttribute('src', currentMainImageSrc);
      container.dataset.image = currentMainImageSrc;
  
      overlayImage.setAttribute('src', clickedImageSrc);
      mainImageContainer.dataset.image = clickedImageSrc; // Update overlay main image
    });
  });
  
     // main image to overlay
  mainImageContainer.addEventListener('click', () => {
    const currentMainImageSrc = mainImage.getAttribute('src');
    mainOverlayImage.setAttribute('src', currentMainImageSrc);
    overlay.classList.add('show');
  });

  
//  Handle image swapping in the overlay
const overlayImageContainers = document.querySelectorAll('.item-overlay__img-container');
// const mainOverlayImage = document.getElementById('item-overlay__main-imgimg');


overlayImageContainers.forEach((container) => {
  container.addEventListener('click', () => {
    const currentOverlayImageSrc = mainOverlayImage.getAttribute('src');
    const clickedImageSrc = container.querySelector('img').getAttribute('src');
    console.log(clickedImageSrc);
    
    mainOverlayImage.setAttribute('src', clickedImageSrc);
    container.querySelector('img').setAttribute('src', currentOverlayImageSrc);
    container.dataset.image = currentOverlayImageSrc;

  });
});


/////////////////////////////////////////////////
  // Hover effect of overlay images
document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.item-overlay__img-container');

    imageContainer.addEventListener('mouseover', () => {
        imageContainer.classList.add('hovered');
    });

    imageContainer.addEventListener('mouseout', () => {
        imageContainer.classList.remove('hovered');
    });
});

  // Overlay class removal 
document.addEventListener('click', (event) => {
    if (event.target.matches('.overlay-container') || event.target.matches('.item-overlay__close-btn')) {
        overlay.classList.remove('show');
        overlayImage.setAttribute('src', initialMainImageSrc);
        mainOverlayImage.setAttribute('src', initialMainImageSrc);
        console.log('overlay closed');
    }
});
  
  // Close button
  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    overlay.classList.remove('show');
    console.log('btn pushed');
  });