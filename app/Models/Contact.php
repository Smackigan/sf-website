<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Contact extends Model
{
    use HasFactory;

    public $fillable = [
        'name', 'email', 'phone', 'subject', 'message'
    ];
}
