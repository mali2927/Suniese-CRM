<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChaseIdToLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->foreignId('chase_id')->nullable()->constrained('chase_notes')->onDelete('set null'); // Add the chase_id column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropForeign(['chase_id']); // Drop the foreign key constraint
            $table->dropColumn('chase_id'); // Drop the chase_id column
        });
    }
}
