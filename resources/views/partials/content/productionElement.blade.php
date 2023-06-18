@extends('home.layouts.app')

@section('content')
<link rel="stylesheet" href="{{ asset('css/app.css') }}">

<div class="max-w-screen-2xl mx-auto flex py-20">

    <section class="w-3/5">
        <div class="pb-8 flex justify-center">
            <div class="flex" id="main-image-container">
                <img id="main-image" src="{{ asset('images/suveniri.jpg') }}" alt="" class=" max-h-80  rounded-lg">
            </div>
        </div>

        <div class="px-4 image-grid">
            <div class="flex-1 image-container" data-image="{{ asset('images/main-logo.jpg') }}" onclick="swapImage(this)">
                    <img src="{{ asset('images/main-logo.jpg') }}" alt="" class="image-container">
                    <div class="overlay"></div>
            </div>
            <div class="flex-1 image-container" data-image="{{ asset('images/uzlimes.jpg') }}">
                    <img src="{{ asset('images/uzlimes.jpg') }}" alt="" class="image-container">
                    <div class="overlay"></div>
            </div>
            <div class="flex-1 image-container" data-image="{{ asset('images/test3.jpg') }}">
                    <img src="{{ asset('images/test3.jpg') }}" alt="" class="image-container">
                    <div class="overlay"></div>
            </div>
            <div class="flex-1 image-container" data-image="{{ asset('images/test1.jpg') }}">
                    <img src="{{ asset('images/test1.jpg') }}" alt="" class="image-container">
                    <div class="overlay"></div>
            </div>
        </div>
    </section>

{{-- alpinejs
x-data="{ isHovered: false }"
@mouseenter="isHovered = true"
@mouseleave="isHovered = false"
:class="{ 'border-2 border-yellow-400 brightness-125': isHovered }" --}}

    {{-- <section class="w-3/5 border-r border-gray-300">
      <div class=" flex flex-col">
        <div class=" flex items-center justify-center overflow-hidden">
            
            <div class="w-96 rounded-lg flex items-center justify-center">
                <img src="{{ asset('images/suveniri.jpg') }}" 
                alt="Image" class="">
              </div>
        </div>
        <div class="h-1/5 flex justify-between">

        </div>
      </div>
    </section> --}}
    <section class="w-4/5 pl-16">
      <!-- Right Section - Content -->
      <h2 class="text-2xl font-semibold mb-4">Subcategory</h2>
      <h1 class="text-4xl font-bold mb-6">Category</h1>
      <p class="mb-4">Text</p>
      <p class="mb-4">Specs</p>
      <p class="mb-4">Izmers</p>
      <p class="mb-6">Cenas</p>
      <p class="mb-6">Addit info</p>
      <div class="flex justify-between">
        <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Email Contact</button>
        <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Call Contact</button>
      </div>
      
      
      

    </section>
  </div>
  
<script src="{{ asset('js/app.js') }}"></script>
@endsection