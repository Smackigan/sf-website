<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subcategory extends Model
{
    use HasFactory;

    protected $table = 'subcategories';

    protected $fillable = [
    'title', 
    'slug', 
    'category', 
    'description', 
    'content_id', 
    'main_image', 
    'image2', 
    'image3', 
    'image4', 
    'price'];

    public function getImage()
    {
        return asset('storage/' . $this->main_image);
    }

    // public function contents(): BelongsToMany
    // {
    //     return $this->belongsToMany(Content::class, 'content_subcategory');
    // }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Content::class, 'category');
    }
}
