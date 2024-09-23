<?php

// app/Http/Controllers/LeadReportController.php

namespace App\Http\Controllers;

use App\Models\Lead; // Ensure you import your Lead model
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class LeadReportController extends Controller
{
    public function generateReport($id)
    {
        // Fetch the lead data by ID
         $lead = Lead::with(['user', 'status'])->findOrFail($id);
        
        // Generate the PDF
        $pdf = Pdf::loadView('reports.lead_report', compact('lead'));
        
        // Download the PDF
        return $pdf->download('lead_report_' . $lead->id . '.pdf');
    }
}
