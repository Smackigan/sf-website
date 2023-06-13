@extends('home.layouts.app')

@section('content')
{{-- Content of categories on mainpage --}}

<div class="max-w-screen-2xl mx-auto bg-gradient-to-b from-neutral-50 to-neutral-200 blur-sm">
    <div class="py-5">
        <div class="grid grid-cols-3 gap-4">
            @foreach ($content as $contentItem)
            @php
            $slug = $contentItem->slug;
            $url = route('production.show', ['slug' => $slug]);
             @endphp

                <a href="{{ $url }}">
                    <div class="bg-gray-200 p-4">
                        <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                            <img src="{{ $contentItem->getImage() }}" class="h-24 w-auto mx-auto">
                            <p class="text-center mt-2">{{ $contentItem->title }}</p>
    
                        </div>
                    </div>
                </a>

            @endforeach
        </div>
    </div>
</div>

@endsection

{{-- </@php
dd($content)
@endphp --}}