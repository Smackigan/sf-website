@section('contactform')
    <div class="bg-gradient-to-b from-yellow-200 to-yellow-400 py-5">
    <h2 class="text-3xl font-bold text-center mb-4"> Jums ir idejas?</h2>
    <div class="sm:px-6">
        <p class="text-gray-700 text-center mb-2">Suveniru Fabrika SIA ir prezentreklamas uzņēmums, kurš nodarbojas ar
            dažādu suvenīru ražošanu un personalizētu suvenīru apdruku.</p>
        <p class="text-gray-700 text-center mb-8">If you have an idea about presents or souvenirs tell us and we will see
            what we can come up with</p>

    </div>
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md px-6 py-8">
        <form id="form" action="{{ route('sendform') }}" method="POST">
            @csrf

        @if(session('success'))
        <div class="" role="alert">
            <p class="text-black mb-2 text-center font-bold">{{ session('success') }}</p>
        </div>
         @endif 

            <div class="mb-4 flex">

                <div class="w-1/2 mr-2">
                    <input id="namefield" name="name" type="text" placeholder="Vards" value="{{ old('name') }}"
                        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">
                    @error('name')
                        <li class="text-red-600 list-none">{{ $message }}</li>
                    @enderror
                </div>
                <div class="w-1/2 ml-2">
                    <input id="company" name="company" type="text" placeholder="Kompanija"
                        value="{{ old('company') }}"
                        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">
                </div>
            </div>

            <div class="mb-4 flex">
                <div class="w-1/2 mr-2">
                    <input id="email" name="email" type="email" placeholder="email address"
                        value="{{ old('email') }}"
                        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">
                    @error('email')
                        <li class="text-red-600 list-none">{{ $message }}</li>
                    @enderror
                </div>
                <div class="w-1/2 ml-2">
                    <input id="phone" name="phone" type="text" placeholder="Telefonnumurs"
                        value="{{ old('phone') }}"
                        class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">
                    @error('phone')
                        <li class="text-red-600 list-none">{{ $message }}</li>
                    @enderror
                </div>
            </div>

            <div class="mb-4">
                <textarea id="message" name="message" placeholder="Aprakstijas jusu ideju"
                    class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500">{{ old('message') }}</textarea>
                @error('message')
                    <li class="text-red-600 list-none">{{ $message }}</li>
                @enderror
            </div>

            <div class="flex items-center mb-2">
                <div class="w-2/3">
                    <input type="checkbox" name="checkbox" id="data-sharing"
                        class="form-checkbox border border-gray-300 focus:outline-none focus:border-blue-500">
                    <label for="data-sharing" class="ml-2 text-gray-700">My information will not be shared with outside
                        parts</label>
                    @error('checkbox')
                        <li class="text-red-600 list-none">{{ $message }}</li>
                    @enderror
                </div>
                <div class="w-1/3">
                    <button type="submit"
                        class="w-full bg-yellow-600 text-white py-2 px-4 rounded-md font-bold hover:bg-yellow-400 transition duration-400">Send</button>
                </div>

            </div>

        </form>
    </div>
</div>
@endsection

{{-- <script>
        onsubmit="return validateForm()"

        function validateForm() {
          // Get the form fields
          var name = document.getElementById('name').value;
          var email = document.getElementById('email').value;
          var phone = document.getElementById('phone').value;
          var message = document.getElementById('message').value;
          var checkbox = document.getElementById('data-sharing').checked;
        
          // Perform validation
          if (name === '' || email === '' || phone === '' || message === '' || !checkbox) {
            // Display error messages or highlight empty fields
            alert('Please fill in all required fields');
            return false; // Prevent the form from submitting
          }
        
          // Form is valid, allow submission
          return true;
        }
        </script> --}}
{{-- 
        Allert
        @if(session('success'))
        <script>
            alert("{{ session('success') }}");
        </script>
    @endif --}}
