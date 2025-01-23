<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdateLeadsStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $affectedRows = DB::table('leads')
            ->whereIn('status', [1, 2])
            ->update([
                'status' => null,
                'quote_status' => 0
            ]);

        if ($affectedRows === 0) {
            info('No records found with status 1 or 2 in the leads table.');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Optionally, you can revert the changes in the `down` method if needed.
        // However, without knowing the original values for 'status' and 'quote_status',
        // a proper rollback might not be possible.
    }
}
