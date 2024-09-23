<!DOCTYPE html>
<html>
<head>
    
    <title>Lead Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Lead Report for {{ $lead->title }}</h1>
    <table>
        <tbody>
            <tr>
                <th>Title</th>
                <td>{{ $lead->title }}</td>
            </tr>
            <tr>
                <th>First Name</th>
                <td>{{ $lead->first_name }}</td>
            </tr>
            <tr>
                <th>Surname</th>
                <td>{{ $lead->surname }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $lead->email }}</td>
            </tr>
            <tr>
                <th>Phone Number</th>
                <td>{{ $lead->phone_number }}</td>
            </tr>
            <tr>
                <th>House Number</th>
                <td>{{ $lead->house_number }}</td>
            </tr>
            <tr>
                <th>Street Name</th>
                <td>{{ $lead->street_name }}</td>
            </tr>
            <tr>
                <th>Town/City</th>
                <td>{{ $lead->town_city }}</td>
            </tr>
            <tr>
                <th>Postal Code</th>
                <td>{{ $lead->postal_code }}</td>
            </tr>
            <tr>
                <th>Homeownership Status</th>
                <td>{{ $lead->homeownership_status }}</td>
            </tr>
            <tr>
                <th>Quoted Price</th>
                <td>{{ $lead->quoted_price }}</td>
            </tr>
            <tr>
                <th>Meeting Time</th>
                <td>{{ $lead->meeting_time }}</td>
            </tr>
            <tr>
                <th>Best Time to Call</th>
                <td>{{ $lead->best_time_to_call }}</td>
            </tr>
            <tr>
                <th>Total Payment</th>
                <td>{{ $lead->total_payment }}</td>
            </tr>
            <tr>
                <th>System Quoted</th>
                <td>{{ $lead->system_quoted }}</td>
            </tr>
            <tr>
                <th>Sales Consultant</th>
                <td>{{ $lead->user->name ?? 'N/A' }}</td>
            </tr>

            <tr>
                <th>Status</th>
                <td>{{ $lead->status->title ?? 'N/A' }}</td>
            </tr>
            <tr>
                <th>Created At</th>
                <td>{{ $lead->created_at->format('Y-m-d H:i:s') }}</td>
            </tr>
            <tr>
                <th>Updated At</th>
                <td>{{ $lead->updated_at->format('Y-m-d H:i:s') }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
