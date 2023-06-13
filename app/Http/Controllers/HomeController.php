<?php

namespace App\Http\Controllers;
use App\Models\Content;
use Illuminate\View\View;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function home(): View
    {
        $content = Content::all();
        
        return view('partials.content.show', compact('content'));
    }

}
