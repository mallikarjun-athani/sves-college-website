<?php
// Database Configuration
$host_name = $_SERVER['HTTP_HOST'] ?? '';
$is_local = (
    strpos($host_name, 'localhost') !== false || 
    strpos($host_name, '127.0.0.1') !== false || 
    empty($host_name)
);

if ($is_local) {
    // Local XAMPP Settings
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $dbname = 'sves_website';
} else {
    // Online Hosting Settings (InfinityFree)
    // Replace these with details from your InfinityFree Control Panel
    $host = 'sql202.infinityfree.com'; 
    $user = 'if0_41019619';
    $pass = '2W8w4UE95Je';
    $dbname = 'if0_41019619_if0_41019619_sves_db';
}

$conn = new mysqli($host, $user, $pass, $dbname);

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
