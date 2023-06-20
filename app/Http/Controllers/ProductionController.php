<?php

namespace App\Http\Controllers;

use App\Models\Content;
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

    public function showNested($slug, $slug2) 
    {

        $category = Content::where('slug', $slug)->firstOrFail();

        // Retrieve the subcategory using the second slug
        $subcategory = Subcategory::where('slug', $slug2)->firstOrFail();

        // $nestedSubcategory = NestedSubcategory::where('slug', $slug2)->firstOrFail();

        // $nestedSubcategory = Subcategory::where('slug', $slug2)
        //                                 ->where('category', $subcategory->category)
        //                                 ->firstOrFail();

        return view('partials.content.product-elem', compact('category', 'subcategory'));
    }
    // public function store(Request $request) 
    // {
    //     $subcategory = Subcategory::create([
    //         'content_id' => $request->input('content_id')
    //     ]);
    // }

}
