<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $statuses = ['Hot', 'Cold', 'Warm', 'Lost', 'Won'];

        foreach ($statuses as $status) {
            DB::table('lead_statuses')->insert([
                'title' => ucfirst($status),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
