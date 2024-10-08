<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->decimal('total_payment', 10, 2)->nullable()->after('status');
        });
    }
    
    public function down()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn('total_payment');
        });
    }
    
};
