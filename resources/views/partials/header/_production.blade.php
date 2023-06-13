<ul>
    @foreach (\DB::table('content')->distinct('slug')->pluck('slug') as $slug)
    @php
        $content = \DB::table('content')->where('slug', $slug)->first();
        $title = $content->title;
    @endphp
    <li><a href="{{ route('production.show', ['slug' => $slug]) }}">{{ $title }}</a></li>
    @endforeach

</ul>
