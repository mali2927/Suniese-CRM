<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddContractLengthPaymentMethodPaymentFrequencyToLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->integer('contract_length')->nullable()->after('status'); // Assuming 'status' is the last column, adjust if necessary
            $table->string('payment_method')->nullable()->after('contract_length');
            $table->string('payment_frequency')->nullable()->after('payment_method');
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
            $table->dropColumn(['contract_length', 'payment_method', 'payment_frequency']);
        });
    }
}
