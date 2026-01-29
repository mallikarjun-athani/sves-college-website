<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include '../includes/db.php';

$message = "";

// Handle Delete
if (isset($_GET['delete'])) {
    $id = clean_input($_GET['delete']);
    // Optional: Delete physical file first
    $sel = "SELECT file_path FROM notes WHERE id = '$id'";
    $res = $conn->query($sel);
    if($res->num_rows > 0) {
        $row = $res->fetch_assoc();
        if(file_exists("../".$row['file_path'])) unlink("../".$row['file_path']);
    }
    
    $conn->query("DELETE FROM notes WHERE id = '$id'");
    $message = "Note deleted successfully.";
}

// Handle Upload
if (isset($_POST['upload_note'])) {
    $title = clean_input($_POST['title']);
    $course = clean_input($_POST['course']);
    $semester = clean_input($_POST['semester']);
    $subject = clean_input($_POST['subject']);
    $unit = clean_input($_POST['unit']);
    
    // File Upload
    $target_dir = "../uploads/notes/";
    $file_name = time() . "_" . basename($_FILES["pdf_file"]["name"]);
    $target_file = $target_dir . $file_name;
    $db_path = "uploads/notes/" . $file_name;

    if (move_uploaded_file($_FILES["pdf_file"]["tmp_name"], $target_file)) {
        $sql = "INSERT INTO notes (title, course_id, semester, subject, unit, file_path) 
                VALUES ('$title', '$course', '$semester', '$subject', '$unit', '$db_path')";
        if ($conn->query($sql)) {
            $message = "Note uploaded successfully!";
        } else {
            $message = "Database error: " . $conn->error;
        }
    } else {
        $message = "Sorry, there was an error uploading your file.";
    }
}

$notes = $conn->query("SELECT * FROM notes ORDER BY upload_date DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Notes | Admin Panel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        :root { --sidebar-width: 260px; }
        body { background: #f4f7f6; display: flex; }
        .sidebar { width: var(--sidebar-width); background: var(--primary); color: white; height: 100vh; position: fixed; padding-top: 30px; }
        .main-content { margin-left: var(--sidebar-width); flex: 1; padding: 40px; }
        .sidebar-menu a { display: flex; align-items: center; padding: 15px 30px; color: rgba(255,255,255,0.7); transition: var(--transition); }
        .sidebar-menu a:hover, .sidebar-menu a.active { background: rgba(255,255,255,0.05); color: var(--secondary); border-left: 4px solid var(--secondary); }
        
        .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); }
        .admin-table th, .admin-table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        .admin-table th { background: #fafafa; font-weight: 600; color: var(--primary); }
        
        .upload-form { background: white; padding: 30px; border-radius: 8px; margin-bottom: 40px; box-shadow: var(--shadow-sm); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 15px; }
        .alert { padding: 15px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-brand" style="padding: 0 30px 40px;"><h2 style="color:white">SVES Admin</h2></div>
        <div class="sidebar-menu">
            <a href="dashboard.php"><i class="fas fa-home"></i> Dashboard</a>
            <a href="manage-notes.php" class="active"><i class="fas fa-file-alt"></i> Manage Notes</a>
            <a href="manage-gallery.php"><i class="fas fa-images"></i> Manage Gallery</a>
            <a href="manage-announcements.php"><i class="fas fa-bullhorn"></i> Announcements</a>
            <a href="logout.php" style="margin-top: 50px; color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>

    <div class="main-content">
        <h1>Manage Study Notes</h1>
        
        <?php if($message): ?>
            <div class="alert"><?php echo $message; ?></div>
        <?php endif; ?>

        <div class="upload-form">
            <h3>Upload New Note</h3>
            <form action="" method="POST" enctype="multipart/form-data">
                <div class="form-grid" style="margin-top: 20px;">
                    <div class="form-group">
                        <label>Note Title</label>
                        <input type="text" name="title" class="btn-outline" style="width:100%; padding:10px" required>
                    </div>
                    <div class="form-group">
                        <label>Course</label>
                        <select name="course" class="btn-outline" style="width:100%; padding:10px" required>
                            <option value="1">BCA</option>
                            <option value="2">BA</option>
                            <option value="3">B.Com</option>
                            <option value="4">B.Sc</option>
                        </select>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Semester</label>
                        <input type="number" name="semester" min="1" max="6" class="btn-outline" style="width:100%; padding:10px" required>
                    </div>
                    <div class="form-group">
                        <label>Subject Name</label>
                        <input type="text" name="subject" class="btn-outline" style="width:100%; padding:10px" required>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Unit Name/Number</label>
                        <input type="text" name="unit" class="btn-outline" style="width:100%; padding:10px" required>
                    </div>
                    <div class="form-group">
                        <label>Select PDF File</label>
                        <input type="file" name="pdf_file" accept=".pdf" class="btn-outline" style="width:100%; padding:10px" required>
                    </div>
                </div>
                <button type="submit" name="upload_note" class="btn btn-primary">Upload Note</button>
            </form>
        </div>

        <h3>Existing Notes</h3>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Course</th>
                    <th>Sem</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = $notes->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo $row['title']; ?></td>
                        <td><?php echo $row['course_id']; ?></td>
                        <td><?php echo $row['semester']; ?></td>
                        <td><?php echo $row['subject']; ?></td>
                        <td><?php echo date('d-M-y', strtotime($row['upload_date'])); ?></td>
                        <td>
                            <a href="../<?php echo $row['file_path']; ?>" style="color: var(--primary);" target="_blank"><i class="fas fa-eye"></i></a>
                            <a href="?delete=<?php echo $row['id']; ?>" style="color: #d9534f; margin-left: 15px;" onclick="return confirm('Are you sure?')"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
