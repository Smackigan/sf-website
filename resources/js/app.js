require('./bootstrap');
require('flowbite');
const Alpine = require('alpinejs');

window.Alpine = Alpine;

// Initialization for ES Users
import { Collapse, Ripple, initTE } from 'tw-elements';

initTE({ Collapse, Ripple });


document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');

    imageContainer.addEventListener('mouseover', () => {
        imageContainer.classList.add('hovered');
    });

    imageContainer.addEventListener('mouseout', () => {
        imageContainer.classList.remove('hovered');
    });
});

// const mainImageContainer = document.getElementById('main-image-container');
const mainImage = document.getElementById('main-image');
const imageContainers = document.querySelectorAll('.image-container');

imageContainers.forEach((container) => {
    container.addEventListener('click', () => {
        const currentMainImage = mainImage.getAttribute('src');
        const clickedImage = container.querySelector('img');
        const clickedImageSrc = clickedImage.getAttribute('src');
    
        mainImage.setAttribute('src', clickedImageSrc);
        clickedImage.setAttribute('src', currentMainImage);
        container.dataset.image = currentMainImage;
    });
});

// function changeImage(img) {
//     document.getElementById('main-image').src=img.src;
// }
