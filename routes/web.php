<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\HomeController;


Route::get('/', [HomeController::class, 'home'])->name('home');

Route::post('/sendform', [FormController::class, 'sendEmail'])->name('sendform');
