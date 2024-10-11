<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTakDetailToChaseNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('chase_notes', function (Blueprint $table) {
            $table->string('talk_detail')->nullable(); // Adjust the data type as needed
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
            $table->dropColumn('talk_detail');
        });
    }
}
