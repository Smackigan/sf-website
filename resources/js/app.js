import './bootstrap';
import 'flowbite';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// Initialization for ES Users
import {
    Collapse,
    Ripple,
    initTE,
  } from "tw-elements";
  
  initTE({ Collapse, Ripple });
