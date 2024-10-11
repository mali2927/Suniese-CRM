<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChaseNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chase_notes', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->unsignedBigInteger('lead_id'); // Foreign key for the lead
            $table->string('chased_via')->nullable(); // Column for chase method (email, phone, etc.)
            $table->dateTime('last_contacted')->nullable(); // Last contacted timestamp
            $table->timestamps(); // Created at and updated at timestamps
            
            // Foreign key constraint
            $table->foreign('lead_id')->references('id')->on('leads')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('chase_notes', function (Blueprint $table) {
            $table->dropForeign(['lead_id']); // Drop foreign key constraint
        });
        Schema::dropIfExists('chase_notes'); // Drop the chase_notes table
    }
}
