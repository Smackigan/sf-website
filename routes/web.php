<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FormController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductionController;


Route::get('/', [HomeController::class, 'home'])->name('home');
Route::get('/production/{slug}', [ProductionController::class, 'show'])->name('production.show');
Route::get('/production/{slug}/{slug2}', [ProductionController::class, 'showNested'])->name('production.showNested');

Route::post('/sendform', [FormController::class, 'sendEmail'])->name('sendform');
