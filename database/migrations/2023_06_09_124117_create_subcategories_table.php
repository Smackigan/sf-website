<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subcategories', function (Blueprint $table) {
            $table->id();
            $table->string('title', 2048);
            $table->string('slug', 2048);
            $table->text('description');
            $table->text('category')->nullable();
            $table->foreignId('content_id')->nullable()->default(null)->constrained('content');
            // $table->foreignIdFor(\App\Models\User::class, 'content_id');
            $table->string('main_image')->nullable();
            $table->string('image2')->nullable();
            $table->string('image3')->nullable();
            $table->string('image4')->nullable();
            $table->boolean('active')->default(false);
            $table->decimal('price', 8, 2)->nullable();
            $table->string('measurement')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcategories');
    }
};
