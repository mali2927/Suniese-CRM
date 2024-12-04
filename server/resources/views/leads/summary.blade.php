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
    </style>
</head>
<body>
    <h2>Leads Summary</h2>
    <p><strong>User ID:</strong> {{ $userId }}</p>
    
    <p><strong>Date Range:</strong> {{ \Carbon\Carbon::parse($startDate)->format('F j, Y') }} to {{ \Carbon\Carbon::parse($endDate)->format('F j, Y') }}</p>
    <p><strong>Total Leads:</strong> {{ $totalLeads }}</p>

    <table>
        <thead>
            <tr>
                <th>Status</th>
                <th>Number of Leads</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Hot</td>
                <td>{{ $leads['hot']->count() }}</td>
            </tr>
            <tr>
                <td>Cold</td>
                <td>{{ $leads['cold']->count() }}</td>
            </tr>
            <tr>
                <td>Lost</td>
                <td>{{ $leads['lost']->count() }}</td>
            </tr>
            <tr>
                <td>Won</td>
                <td>{{ $leads['won']->count() }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
