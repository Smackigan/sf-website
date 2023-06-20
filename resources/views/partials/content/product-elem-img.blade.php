<section class="w-3/5">
    <div class="pb-8 flex justify-center">
        <div class="main-image-container" id="main-image-container">
            <img id="main-image" src="{{ asset('images/suveniri.jpg') }}" alt="" class="main-image">

                {{-- Overlay elements --}}
                @include('partials.content.product-elem-img-overlay')
        </div>
    </div>

    <div class="px-4 image-grid">
        <div class="grid-image-container" data-image="{{ asset('images/main-logo.jpg') }}">
                <img src="{{ asset('images/main-logo.jpg') }}" alt="" class="grid-image-container">
                <div class="overlay"></div>
        </div>
        <div class="grid-image-container" data-image="{{ asset('images/uzlimes.jpg') }}">
                <img src="{{ asset('images/uzlimes.jpg') }}" alt="" class="grid-image-container">
                <div class="overlay"></div>
        </div>
        <div class="grid-image-container" data-image="{{ asset('images/test3.jpg') }}">
                <img src="{{ asset('images/test3.jpg') }}" alt="" class="grid-image-container">
                <div class="overlay"></div>
        </div>
        <div class="grid-image-container" data-image="{{ asset('images/test1.jpg') }}">
                <img src="{{ asset('images/test1.jpg') }}" alt="" class="grid-image-container">
                <div class="overlay"></div>
        </div>
    </div>
</section>