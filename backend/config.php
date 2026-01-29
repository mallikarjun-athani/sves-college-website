<?php
// Define base paths
define('BASE_PATH', dirname(__DIR__) . '/');
define('UPLOAD_PATH', BASE_PATH . 'uploads/');
define('ADMIN_PATH', BASE_PATH . 'admin/');
define('FRONTEND_PATH', BASE_PATH . 'frontend/');
define('BACKEND_PATH', BASE_PATH . 'backend/');

// Site URLs (Adjust as needed)
$base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$project_folder = '/SVES website'; // Change this if project is in root
define('SITE_URL', $base_url . $project_folder . '/');
define('UPLOAD_URL', SITE_URL . 'uploads/');

// Include DB Connection
require_once 'db.php';
?>
