<?php
// Database Configuration
if ($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == '127.0.0.1') {
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
    // If database doesn't exist, we might want to handle it or just error out
    // For now, let's just die.
    die("Connection failed: " . $conn->connect_error);
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
