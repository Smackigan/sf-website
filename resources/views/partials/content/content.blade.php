@extends('home.layouts.app')

@section('content')
{{-- Subcategories --}}

    <div class="max-w-screen-2xl mx-auto bg-gradient-to-b from-neutral-50 to-neutral-200 blur-sm">
        <div class=" py-5">
            <div class="grid grid-cols-3 gap-4">

                @if ($subcategory->isNotEmpty())
                @foreach ($subcategory as $contentItem)

                @php
                $subcategorySlug = $contentItem->slug;
                $categorySlug = $contentItem->category;
                $url = route('production.showNested', ['slug' => strtolower($categorySlug), 'slug2' => $subcategorySlug]);
                // $slug = $contentItem->slug;
                // $url = route('production.showNested', ['slug' => $contentItem->slug, 'slug2' => $slug]);
                 @endphp

                <a href=" {{ $url }}">
                    <div class="bg-gray-200 p-4">
                        <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                            <img src="{{ $contentItem->getImage() }}" class="h-24 w-auto mx-auto">
                            <p class="text-center mt-2">{{ $contentItem->title }}</p>
                        </div>
                    </div>
                </a>
                 @endforeach

                @else
                <p>No subcategories found.</p>
                @endif



                <div class="bg-gray-200 p-4">
                    <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                        <img src="/storage/c8yoXxA1Zh7zueD5xUf2aUMVBrOoaR-metaU2NyZWVuc2hvdF8xLmpwZw==-.jpg" alt="Service 1" class="h-24 mx-auto">
                        <p class="text-center mt-2">Service 4</p>
                    </div>
                </div>
                <div class="bg-gray-200 p-4">
                    <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                        <img src="/storage/c8yoXxA1Zh7zueD5xUf2aUMVBrOoaR-metaU2NyZWVuc2hvdF8xLmpwZw==-.jpg" alt="Service 1" class="h-24 mx-auto">
                        <p class="text-center mt-2">Service 5</p>
                    </div>
                </div>
                <div class="bg-gray-200 p-4">
                    <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                        <img src="/storage/c8yoXxA1Zh7zueD5xUf2aUMVBrOoaR-metaU2NyZWVuc2hvdF8xLmpwZw==-.jpg" alt="Service 1" class="h-24 mx-auto">
                        <p class="text-center mt-2">Service 6</p>
                    </div>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service7.jpg" alt="Service 7" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 7</p>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service7.jpg" alt="Service 7" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 7</p>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service7.jpg" alt="Service 7" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 7</p>
                </div>
            </div>
        </div>
    </div>

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.12.1/dist/cdn.min.js"></script>
@endsection


    {{-- <script>
        const cell = document.getElementById('cell');

        cell.addEventListener('mouseenter', () => {
            cell.style.transition = 'transform 0.3s ease-in-out';
            cell.style.transform = 'scale(1.1)';
        });

        cell.addEventListener('mouseleave', () => {
            cell.style.transition = 'transform 0.3s ease-in-out';
            cell.style.transform = 'scale(1)';
        });
    </script> --}}



{{-- AlpineJS
<div 
x-data="{ isHovered: false }"
:class="{ 'transition ease-in-out delay-100 scale-110': isHovered }"
@mouseenter="isHovered = true"
@mouseleave="isHovered = false"
class="cell bg-gray-300 border-solid border-2 border-blue-500" id="cell">
    <img src="service1.jpg" alt="Service 1" class="w-24 h-24 mx-auto">
    <p class="text-center mt-2">Service 1</p>
</div> --}}
