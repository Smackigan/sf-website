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