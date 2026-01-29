<?php
session_start();
include '../backend/db.php';

$error = "";

if (isset($_POST['login'])) {
    $username = clean_input($_POST['username']);
    $password = $_POST['password'];

    $query = "SELECT * FROM admin WHERE username = '$username'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // For development, we'll allow plaintext 'admin123' check if hash fails, 
        // but let's try to be professional.
        if (password_verify($password, $row['password']) || $password == 'admin123') {
            $_SESSION['admin_id'] = $row['id'];
            $_SESSION['admin_username'] = $row['username'];
            header("Location: dashboard.php");
            exit();
        } else {
            $error = "Invalid password.";
        }
    } else {
        $error = "Admin user not found.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | SVES College</title>
    <link rel="stylesheet" href="../frontend/assets/css/style.css">
    <style>
        body {
            background: var(--bg-dark);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-card {
            background: var(--white);
            padding: 50px;
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 450px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .login-card h2 {
            color: var(--primary);
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: var(--radius-sm);
        }
        .error-msg {
            color: #d9534f;
            background: #f2dede;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <h2>Admin Portal</h2>
        
        <?php if($error): ?>
            <div class="error-msg"><?php echo $error; ?></div>
        <?php endif; ?>

        <form action="" method="POST">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" name="login" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Login</button>
            <p style="text-align: center; margin-top: 20px;">
                <a href="../index.php" style="color: var(--text-muted); font-size: 0.9rem;"><i class="fas fa-arrow-left"></i> Back to Website</a>
            </p>
        </form>
    </div>
</body>
</html>
