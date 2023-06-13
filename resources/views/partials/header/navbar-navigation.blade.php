<nav class="bg-gray-100">
    <div class="max-w-screen-2xl mx-auto">
    <div class="flex justify-between">

        <div>
            <a href="{{ route('home') }}" class="flex items-center py-2 px-5 text-blue-400">
                <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                <span class="ml-3 text-xl font-medium ">Suveniru Fabrika</span>     
            </a>
        </div>
        <div class="flex justify-center space-x-5 items-center mr-3 font-semibold text-gray-700">
            <a href="#" class="hover:text-blue-500">About</a>
            <button class="nav-item" x-data="{ isOpen: false }" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
                <a href="#" class="hover:text-blue-500 font-semibold nav-link" @click="isOpen = !isOpen ">Production</a>
                <div x-show="isOpen" class="absolute bg-white p-4 shadow-md">
                    @include('partials.header._production')
                </div>
            </button>            
            <a href="#">Delivery</a>
            <a href="#">Contacts</a>
            <a href="#">Sadarbiba</a>
            <a href="#" class="py-2 px-3 bg-yellow-400 text-yellow-900 rounded">E-Shop</a>
            <button class="nav-item" x-data="{ isOpen: false }" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
                <a href="#" class="hover:text-blue-500 font-semibold nav-link" @click="isOpen = !isOpen">Language</a>
                <div x-show="isOpen" class="absolute bg-white p-4 shadow-md" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
                    <ul>
                        <li><a href="#">Latvian</a></li>
                        <li><a href="#">Russian</a></li>
                    </ul>
                </div>
            </button>
        </div>

    </div>
    </div>
</nav>

{{-- Logo --}}

<div class="flex justify-center max-w-screen-2xl mx-auto">
    <img src="{{ asset('images/bannerimg.png') }}" alt="Banner Image" class="">
</div>


