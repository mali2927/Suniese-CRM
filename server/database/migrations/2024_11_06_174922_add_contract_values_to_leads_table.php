<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddContractValuesToLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->decimal('total_contract_value_net', 15, 2)->nullable()->after('total_payment');
            $table->decimal('total_contract_value_gross', 15, 2)->nullable()->after('total_contract_value_net');
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
            $table->dropColumn('total_contract_value_net');
            $table->dropColumn('total_contract_value_gross');
        });
    }
}
