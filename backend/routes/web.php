<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\PublisherController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn() => auth()->user());

    Route::prefix('api')->group(function () {

        // Authors
        Route::apiResource('authors', AuthorController::class);

        // Books
        Route::apiResource('books', BookController::class);

        // Publishers
        Route::apiResource('publishers', PublisherController::class);
    });
});