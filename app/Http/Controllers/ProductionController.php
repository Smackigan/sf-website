<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function show($category)
    {
        // dd($category);

        $subcategory = Subcategory::where('category', $category)->get();

        // dd($subcategory);
        
        return view('partials.content.content', compact('subcategory'));
    }

    // public function store(Request $request) 
    // {
    //     $subcategory = Subcategory::create([
    //         'content_id' => $request->input('content_id')
    //     ]);
    // }

}
