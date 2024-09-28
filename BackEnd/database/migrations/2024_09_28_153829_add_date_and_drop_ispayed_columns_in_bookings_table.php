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
        Schema::table('bookings', function (Blueprint $table) {
            // Add the 'date' column
            $table->date('date')->nullable();

            // Drop the 'is_payed' column
            $table->dropColumn('is_payed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Reverse the changes by adding back the 'is_payed' column
            $table->boolean('is_payed')->default(false);

            // Drop the 'date' column
            $table->dropColumn('date');
        });
    }
};