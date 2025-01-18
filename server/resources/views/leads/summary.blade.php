<!DOCTYPE html>
<html>
<head>
    <title>Leads Summary</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        .chart-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .chart-container img {
            max-width: 600px; /* Set the desired width */
            height: auto; /* Maintain aspect ratio */
        }
    </style>
</head>
<body>
    <h1>Leads Summary for {{ $userName }}</h1>
    <p><strong>User ID:</strong> {{ $userId }}</p>
    <p><strong>Sales Consultant Name:</strong> {{ $userName }}</p>
    <p><strong>Date Range:</strong> {{ \Carbon\Carbon::parse($startDate)->format('F j, Y') }} to {{ \Carbon\Carbon::parse($endDate)->format('F j, Y') }}</p>
    <p><strong>Total Leads:</strong> {{ $totalLeads }}</p>

    <table>
        <thead>
            <tr>
                <th>Status</th>
                <th>Number of Leads</th>
                <th>Quoted Price Sum</th>
                <th>Quoted Price Average</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($statusStats as $status => $stats)
                <tr>
                    <td>{{ ucfirst($status) }}</td>
                    <td>{{ $stats['total'] }}</td>
                    <td>{{ number_format($stats['quotedPriceSum'], 2) }}</td>
                    <td>{{ number_format($stats['quotedPriceAvg'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <h3>Pie Chart</h3>
    <div class="chart-container">
        <img src="data:image/png;base64,{{ $chartBase64 }}" alt="Leads Pie Chart">
    </div>
</body>
</html>
