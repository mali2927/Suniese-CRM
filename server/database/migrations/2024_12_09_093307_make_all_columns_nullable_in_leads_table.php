<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeAllColumnsNullableInLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('leads', function (Blueprint $table) {
            // Ensure the foreign key is dropped if it exists to prevent errors on re-creation
            $table->dropForeign(['status']);
            
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->string('title')->nullable()->change();
            $table->string('first_name')->nullable()->change();
            $table->string('surname')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('phone_number')->nullable()->change();
            $table->string('house_number')->nullable()->change();
            $table->string('street_name')->nullable()->change();
            $table->string('town_city')->nullable()->change();
            $table->string('postal_code')->nullable()->change();
            $table->string('homeownership_status')->nullable()->change();
            $table->string('system_quoted')->nullable()->change();
            $table->decimal('quoted_price', 10, 2)->nullable()->change();
            $table->timestamp('meeting_time')->nullable()->change();
            $table->string('best_time_to_call')->nullable()->change();
            $table->unsignedBigInteger('status')->nullable()->change();
            $table->boolean('archive_status')->nullable()->change();
            $table->string('quote_status')->nullable()->change();
            $table->boolean('maintenance_check')->nullable()->change();
            $table->integer('contract_length')->nullable()->change();
            $table->string('payment_method')->nullable()->change();
            $table->string('payment_frequency')->nullable()->change();
            $table->string('customer_type')->nullable()->change();
            $table->decimal('total_payment', 10, 2)->nullable()->change();
            $table->decimal('total_contract_value_net', 10, 2)->nullable()->change();
            $table->decimal('total_contract_value_gross', 10, 2)->nullable()->change();
            $table->unsignedBigInteger('chase_id')->nullable()->change();
            $table->string('client_name')->nullable()->change();
            $table->string('end_user')->nullable()->change();
            $table->text('service_description')->nullable()->change();
            $table->decimal('commission', 10, 2)->nullable()->change();
            $table->string('commission_status')->nullable()->change();
            $table->boolean('monitoring_check')->nullable()->change();
            $table->boolean('installation_check')->nullable()->change();
            
            // Re-add the foreign key
            $table->foreign('status', 'leads_status_foreign')->references('id')->on('lead_statuses')->onDelete('cascade');
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
            $table->dropForeign(['status']);
            // Reverse modifications to the default non-nullable state and reapply the foreign key
            $table->unsignedBigInteger('status')->nullable(false)->change();
            $table->foreign('status', 'leads_status_foreign')->references('id')->on('lead_statuses')->onDelete('cascade');
        });
    }
}
