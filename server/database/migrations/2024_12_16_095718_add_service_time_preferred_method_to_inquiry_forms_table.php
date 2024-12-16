<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('inquiry_forms', function (Blueprint $table) {
            $table->string('service')->nullable()->after('user_id'); // Replace 'last_column' with the column after which you want to add this.
            $table->time('time')->nullable()->after('service');
            $table->string('preferred_method')->nullable()->after('time');
        });
    }

    public function down()
    {
        Schema::table('inquiry_forms', function (Blueprint $table) {
            $table->dropColumn(['service', 'time', 'preferred_method']);
        });
    }
};
