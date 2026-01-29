<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(["status" => "error", "message" => "Please fill in all fields."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format."]);
        exit;
    }

    // In a real application, you would send an email here using mail() 
    // or a library like PHPMailer, or save to a database.
    
    // Simulate successful processing
    echo json_encode([
        "status" => "success", 
        "message" => "Hello $name, your message has been received! We'll get back to you at $email soon."
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
