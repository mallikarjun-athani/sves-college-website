<?php
// Database Configuration
if (
    $_SERVER['HTTP_HOST'] == 'localhost' || 
    $_SERVER['HTTP_HOST'] == '127.0.0.1' || 
    strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0 || 
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1:') === 0 ||
    $_SERVER['SERVER_ADDR'] == '127.0.0.1' || 
    $_SERVER['SERVER_ADDR'] == '::1'
) {
    // Local XAMPP Settings
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $dbname = 'sves_website';
} else {
    // Online Hosting Settings (Injected via GitHub Actions during deployment)
    $host = '__DB_HOST__'; 
    $user = '__DB_USER__';
    $pass = '__DB_PASS__';
    $dbname = '__DB_NAME__';
}

// Suppress warnings for a cleaner error message if connection fails
mysqli_report(MYSQLI_REPORT_OFF);
$conn = @new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    // Safety fallback: If it failed because of placeholders, try localhost (for local development edge cases)
    if ($host === '__DB_HOST__' || strpos($conn->connect_error, '__DB_HOST__') !== false) {
        $host = 'localhost';
        $user = 'root';
        $pass = '';
        $dbname = 'sves_website';
        $conn = @new mysqli($host, $user, $pass, $dbname);
    }
}

if ($conn->connect_error) {
    die("<b>Database Connection Error:</b> " . $conn->connect_error . "<br>Check if your database server is running and the credentials are correct.");
}

// Function to clean input
function clean_input($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $conn->real_escape_string($data);
}
?>
