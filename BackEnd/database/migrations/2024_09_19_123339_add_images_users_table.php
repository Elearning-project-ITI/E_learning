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
        Schema::table('users', function (Blueprint $table) {
            // Remove the nullable constraint from the image field
            $table->string('image')->nullable();
    
            // Add a unique constraint to the name field
<<<<<<< HEAD
            // $table->string('name')->unique()->change();
=======
            //$table->string('name')->unique()->change();
>>>>>>> main
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // $table->string('image')->nullable();
        // $table->dropUnique(['name']);
    }
};
