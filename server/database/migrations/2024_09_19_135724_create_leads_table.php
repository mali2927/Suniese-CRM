<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');  // Foreign key referencing users table
            $table->string('title')->nullable();    // Mr./Ms./Mrs.
            $table->string('first_name');
            $table->string('surname');
            $table->string('email');
            $table->string('phone_number');
            $table->string('house_number');
            $table->string('street_name');
            $table->string('town_city');
            $table->string('postal_code');
            $table->enum('homeownership_status', ['Owner', 'Tenant']); // Radio button
            $table->string('system_quoted');  // Dropdown for system type
            $table->decimal('quoted_price', 10, 2);  // Quoted price (decimal)
            $table->dateTime('meeting_time')->nullable();  // Convenient meeting time
            $table->string('best_time_to_call')->nullable();  // Best time to call
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leads');
    }
}
