<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Content extends Model
{
    use HasFactory;

    protected $table = 'content';

    protected $fillable = ['title', 'slug', 'category', 'description', 'main_image', 'image2', 'image3', 'image4', 'price'];

    public function getImage()
    {
        return asset('storage/' . $this->main_image);
    }

    // public function subcategory(): BelongsToMany
    // {
    //     return $this->belongsToMany(Subcategory::class, 'content_subcategory');
    // }

    public function subcategory(): HasMany
    {
        return $this->hasMany(Subcategory::class);
    }

}
