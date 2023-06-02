@include('partials.header.navbar-contact')

@include('partials.header.navbar-navigation')

{{-- <nav class="navbar">
    <div class="container">
        <a href="{{ route('home') }}" class="navbar-brand">Suveniru</a>

        <button class="navbar-toggler">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <div class="navbar-menu p-3 bg-white shadow rounded-lg">
            <div></div>
            <ul class="navbar-nav">
                <li class="nav-item "><a href="#" class="nav-link">Item 1</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Item 2</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Item 3</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Item 4</a></li>
                <li class="nav-item">
                    <button type="button" class="nav-link" x-data="{ isOpen: false }" @click="isOpen = !isOpen">
                        Item 5
                        <div x-show="isOpen" @click.away="isOpen = false" class="absolute bg-white p-4 shadow-md">
                            <!-- Pop-up content for Item 5 -->
                            <h2>Pop-up Content</h2>
                            <p>This is the content for Item 5's pop-up.</p>
                            <li class="nav-item"><a href="#" class="nav-link">Item 2</a></li>
                            <li class="nav-item"><a href="#" class="nav-link">Item 3</a></li>
                            <li class="nav-item"><a href="#" class="nav-link">Item 4</a></li>
                        </div>
                    </button>
                </li>
                
                <li class="nav-item"><a href="#" class="nav-link">Item 6</a></li>
            </ul>
        </div>
    </div>
</nav> --}}
