<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->string('client_name')->nullable();
            $table->string('end_user')->nullable();
            $table->text('service_description')->nullable();
            $table->decimal('commission', 8, 2)->nullable();
            $table->string('commission_status')->nullable();
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
            $table->dropColumn([
                'client_name',
                'end_user',
                'service_description',
                'commission',
                'commission_status',
            ]);
        });
    }
};
