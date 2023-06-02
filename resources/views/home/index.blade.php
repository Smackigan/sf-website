{{-- @extends('home.layouts.app') --}}

@section('content')

<div class="container">
    <!-- Your content section -->
    <section class="content">
        <!-- Content elements here -->
        <h1 class="font-black">Welcome to Your Website!!!!</h1>
        <p>Some introductory text or description</p>
    </section>

    <!-- Include other blade partials as needed -->
    {{-- @include('partials.google_reviews') --}}

    <!-- Your footer section -->
    <footer class="footer">
        <!-- Footer elements here -->
        <p>Contact information, links, etc.</p>
    </footer>
</div>
    
@endsection

@extends('home.layouts.app')