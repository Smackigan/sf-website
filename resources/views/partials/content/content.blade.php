{{-- <div class="grid grid-cols-3 gap-4">
    @foreach ($services as $service)
    <div class="text-center">
        <img src="{{ $service->image }}" alt="{{ $service->name }}" class="w-32 h-32 mx-auto">
        <p>{{ $service->name }}</p>
    </div>
    @endforeach
</div> --}}

<body>

    <div class="max-w-screen-2xl mx-auto bg-gradient-to-b from-neutral-50 to-neutral-200 blur-sm">
        <div class=" py-5">
            <div class="grid grid-cols-3 gap-4">

                <div class="bg-gray-200 p-4">
                    <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                        <img src="service1.jpg" alt="Service 1" class="w-24 h-24 mx-auto">
                        <p class="text-center mt-2">Service 1</p>
                    </div>
                </div>
                <div class="bg-gray-200 p-4">
                    <div class="bg-gray-300 border-solid border-2 border-blue-500 transition-transform transform hover:scale-110">
                        <img src="service1.jpg" alt="Service 2" class="w-24 h-24 mx-auto">
                        <p class="text-center mt-2">Service 2</p>
                    </div>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service3.jpg" alt="Service 3" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 3</p>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service4.jpg" alt="Service 4" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 4</p>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service5.jpg" alt="Service 5" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 5</p>
                </div>
                <div class="bg-gray-200 p-4">
                    <img src="service6.jpg" alt="Service 6" class="w-24 h-24 mx-auto">
                    <p class="text-center mt-2">Service 6</p>
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

</body>

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
