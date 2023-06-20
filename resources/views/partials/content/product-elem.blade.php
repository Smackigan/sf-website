@extends('home.layouts.app')

@section('content')
<link rel="stylesheet" href="{{ asset('css/app.css') }}">

<div class="max-w-screen-2xl mx-auto flex py-20">

{{-- Left section with images --}}
@include('partials.content.product-elem-img')


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