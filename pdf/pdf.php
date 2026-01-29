<?php
$message = "";
$messageType = ""; // 'success' or 'error'
$uploadedFile = "";

if (isset($_POST['uploads'])) {
    if(isset($_FILES["2ndsembca"]) && $_FILES["2ndsembca"]["error"] == 0){
        $file_name = $_FILES["2ndsembca"]["name"];
        $file_size = $_FILES["2ndsembca"]["size"];
        $file_temp = $_FILES["2ndsembca"]["tmp_name"];
        $file_type = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        
        $allowed_types = ["pdf", "doc", "docx", "jpg", "png"];
        $max_size = 5 * 1024 * 1024; // 5MB

        if (!in_array($file_type, $allowed_types)) {
            $message = "Invalid file type. Only PDF, DOC, JPG, and PNG are allowed.";
            $messageType = "error";
        } elseif ($file_size > $max_size) {
            $message = "File is too large. Maximum size is 5MB.";
            $messageType = "error";
        } else {
            $upload_dir = "uploads/";
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

            // Generate unique name to prevent overwriting
            $new_file_name = uniqid('doc_') . '.' . $file_type;
            $target_path = $upload_dir . $new_file_name;

            if (move_uploaded_file($file_temp, $target_path)) {
                $message = "Document uploaded successfully!";
                $messageType = "success";
                $uploadedFile = $new_file_name;
                $originalName = $file_name;
            } else {
                $message = "Internal server error. Please try again.";
                $messageType = "error";
            }
        }
    } else {
        $message = "Error: Please select a valid file.";
        $messageType = "error";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downloads | SVES College</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4338ca;
            --primary-light: #6366f1;
            --secondary: #fbbf24;
            --dark: #0f172a;
            --gray-light: #f8fafc;
            --gray-text: #64748b;
            --white: #ffffff;
            --glass: rgba(255, 255, 255, 0.8);
            --shadow-premium: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --radius-lg: 20px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent),
                        radial-gradient(circle at bottom left, rgba(251, 191, 36, 0.05), transparent),
                        var(--gray-light);
            min-height: 100vh;
            color: var(--dark);
            display: flex;
            flex-direction: column;
        }

        /* Navbar Styling */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 8%;
            background: var(--glass);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            object-fit: cover;
        }

        .navbar-list {
            list-style: none;
            display: flex;
            gap: 2.5rem;
            align-items: center;
        }

        .navbar-list a {
            text-decoration: none;
            color: var(--dark);
            font-weight: 500;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .navbar-list a:hover {
            color: var(--primary);
        }

        .active-link {
            color: var(--primary) !important;
            font-weight: 600 !important;
        }
        
        /* Main Content */
        .main-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 60px 20px;
        }

        .upload-card {
            background: var(--white);
            padding: 3.5rem;
            border-radius: 30px;
            box-shadow: var(--shadow-premium);
            width: 100%;
            max-width: 550px;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.03);
            transition: transform 0.3s ease;
        }

        .upload-card:hover {
            transform: translateY(-8px);
        }

        .upload-card h3 {
            font-family: 'Outfit';
            font-size: 2.2rem;
            margin-bottom: 0.75rem;
            color: var(--dark);
            font-weight: 800;
        }

        .upload-card p {
            color: var(--gray-text);
            margin-bottom: 2.5rem;
            font-size: 1.1rem;
        }

        /* Form Elements */
        .form-group {
            margin-bottom: 2rem;
        }

        .file-upload-wrapper {
            position: relative;
            width: 100%;
            height: 180px;
            border: 2.5px dashed #e2e8f0;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: #fcfdfe;
        }

        .file-upload-wrapper:hover {
            border-color: var(--primary);
            background-color: #f5f7ff;
            transform: scale(1.01);
        }

        .file-upload-wrapper input[type="file"] {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;
        }

        .upload-icon {
            font-size: 3.5rem;
            color: var(--primary);
            margin-bottom: 1.25rem;
            opacity: 0.8;
        }

        .upload-text {
            font-size: 1rem;
            color: var(--gray-text);
            font-weight: 500;
        }

        /* Button Styling */
        .btn-submit {
            background: var(--primary);
            color: white;
            border: none;
            padding: 1.1rem 2rem;
            font-size: 1.1rem;
            font-weight: 700;
            border-radius: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 15px -3px rgba(67, 56, 202, 0.3);
            width: 100%;
            letter-spacing: 0.02em;
        }

        .btn-submit:hover {
            background: var(--primary-light);
            transform: translateY(-2px);
            box-shadow: 0 15px 25px -5px rgba(67, 56, 202, 0.4);
        }

        /* Message Styling */
        .alert {
            padding: 1.25rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            font-weight: 600;
            font-size: 0.95rem;
            animation: slideDown 0.4s ease-out;
        }

        .alert-success {
            background-color: #ecfdf5;
            color: #065f46;
            border: 1px solid #d1fae5;
        }

        .alert-error {
            background-color: #fef2f2;
            color: #991b1b;
            border: 1px solid #fee2e2;
        }

        .download-box {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 16px;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            text-align: left;
            border: 1px solid #e2e8f0;
        }

        .download-link {
            color: var(--primary);
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .download-link:hover {
            color: var(--primary-light);
            text-decoration: underline;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .btn-loading {
            position: relative;
            color: transparent !important;
            pointer-events: none;
        }

        .btn-loading::after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin: -10px 0 0 -10px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .file-info {
            font-size: 0.85rem;
            color: var(--gray-text);
            margin-top: 1rem;
            display: block;
        }

        @media (max-width: 768px) {
            nav { padding: 1rem 5%; }
            .navbar-list { display: none; }
            .upload-card { padding: 2.5rem 1.5rem; }
        }
    </style>
</head>
<body>

    <nav>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="../Home page/photes/icon.png" alt="SVES Logo" class="icon">
            <h1 style="font-family: 'Outfit'; font-size: 1.25rem; font-weight: 700;">SVES College</h1>
        </div>
        <ul class="navbar-list">
            <li><a href="../Home page/index.html">Home</a></li>
            <li><a href="../Home page/index.html#about">About</a></li>
            <li><a href="../Home page/index.html#departments">Departments</a></li>
            <li><a href="pdf.php" class="active-link">Downloads</a></li>
            <li><a href="../Home page/index.html#contact">Contact</a></li>
        </ul>
    </nav>

    <div class="main-container">
        <div class="upload-card">
            <h3>Student Portal</h3>
            <p>Securely upload or access academic documents and question papers.</p>

            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $messageType; ?>">
                    <i class="fas <?php echo $messageType == 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'; ?>"></i>
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($uploadedFile)): ?>
                <div class="download-box" style="animation: slideDown 0.5s ease-out;">
                    <div style="background: #ecfdf5; color: #10b981; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                        <i class="fas fa-check-double"></i>
                    </div>
                    <div>
                        <p style="margin-bottom: 0; font-size: 0.75rem; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">File Uploaded</p>
                        <a href="uploads/<?php echo $uploadedFile; ?>" class="download-link" style="font-size: 0.9rem;" download>Download <?php echo htmlspecialchars($file_name); ?></a>
                    </div>
                </div>
            <?php endif; ?>

            <form action="pdf.php" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <div class="file-upload-wrapper" id="drop-area">
                        <input type="file" name="2ndsembca" id="file-input" required onchange="updateFileName(this)">
                        <div class="file-upload-content">
                            <i class="fas fa-cloud-upload-alt upload-icon" id="icon-state"></i>
                            <span class="upload-text" id="file-name-display">Drag & Drop or Click to Browse</span>
                            <span class="file-info">Maximum file size: 5MB</span>
                        </div>
                    </div>
                </div>
                <button type="submit" name="uploads" value="upload" id="submit-btn" class="btn-submit">
                    <i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Submit Document
                </button>
            </form>
        </div>
    </div>

    <script>
        function updateFileName(input) {
            const fileNameDisplay = document.getElementById('file-name-display');
            const wrapper = document.getElementById('drop-area');
            const icon = document.getElementById('icon-state');
            
            if (input.files && input.files.length > 0) {
                const name = input.files[0].name;
                fileNameDisplay.textContent = name;
                fileNameDisplay.style.color = 'var(--primary)';
                fileNameDisplay.style.fontWeight = '700';
                wrapper.style.borderColor = 'var(--primary)';
                wrapper.style.backgroundColor = '#f5f7ff';
                icon.className = 'fas fa-file-alt upload-icon';
                icon.style.color = 'var(--primary)';
            } else {
                fileNameDisplay.textContent = 'Drag & Drop or Click to Browse';
                fileNameDisplay.style.color = 'var(--gray-text)';
                fileNameDisplay.style.fontWeight = '500';
                wrapper.style.borderColor = '#e2e8f0';
                wrapper.style.backgroundColor = '#fcfdfe';
                icon.className = 'fas fa-cloud-upload-alt upload-icon';
                icon.style.color = 'var(--primary)';
            }
        }

        // Add loading state to button on submit
        document.querySelector('form').addEventListener('submit', function() {
            document.getElementById('submit-btn').classList.add('btn-loading');
        });
    </script>
</body>
</html>