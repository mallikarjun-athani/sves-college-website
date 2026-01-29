<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: login.php");
    exit();
}
include '../backend/db.php';

$message = "";

// Handle Delete
if (isset($_GET['delete'])) {
    $id = clean_input($_GET['delete']);
    $sel = "SELECT image_path FROM gallery WHERE id = '$id'";
    $res = $conn->query($sel);
    if($res->num_rows > 0) {
        $row = $res->fetch_assoc();
        if(file_exists("../".$row['image_path'])) unlink("../".$row['image_path']);
    }
    
    $conn->query("DELETE FROM gallery WHERE id = '$id'");
    $message = "Image deleted successfully.";
}

// Handle Upload
if (isset($_POST['upload_image'])) {
    $caption = clean_input($_POST['caption']);
    $category = clean_input($_POST['category']);
    
    // Create uploads directory if it doesn't exist
    if (!file_exists('../uploads')) {
        mkdir('../uploads', 0777, true);
    }

    // File Upload
    $file_name = time() . "_" . basename($_FILES["image_file"]["name"]);
    $target_file = "../uploads/" . $file_name;
    $db_path = "uploads/" . $file_name;

    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["image_file"]["tmp_name"]);
    if($check !== false) {
        if (move_uploaded_file($_FILES["image_file"]["tmp_name"], $target_file)) {
            $sql = "INSERT INTO gallery (image_path, category, caption) VALUES ('$db_path', '$category', '$caption')";
            if ($conn->query($sql)) {
                $message = "Image uploaded and saved to uploads folder!";
            } else {
                $message = "Database error: " . $conn->error;
            }
        } else {
            $message = "Sorry, there was an error uploading your file.";
        }
    } else {
        $message = "File is not an image.";
    }
}

$images = $conn->query("SELECT * FROM gallery ORDER BY id DESC");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Gallery | Admin Panel</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../frontend/assets/css/style.css">
    <style>
        :root { --sidebar-width: 260px; }
        body { background: #f4f7f6; display: flex; }
        .sidebar { width: var(--sidebar-width); background: var(--primary); color: white; height: 100vh; position: fixed; padding-top: 30px; }
        .main-content { margin-left: var(--sidebar-width); flex: 1; padding: 40px; }
        .sidebar-menu a { display: flex; align-items: center; padding: 15px 30px; color: rgba(255,255,255,0.7); transition: var(--transition); text-decoration: none; }
        .sidebar-menu a:hover, .sidebar-menu a.active { background: rgba(255,255,255,0.05); color: var(--secondary); border-left: 4px solid var(--secondary); }
        
        .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-sm); margin-top: 20px; }
        .admin-table th, .admin-table td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
        .admin-table th { background: #fafafa; font-weight: 600; color: var(--primary); }
        
        .upload-form { background: white; padding: 30px; border-radius: 8px; margin-bottom: 40px; box-shadow: var(--shadow-sm); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 15px; }
        .alert { padding: 15px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 20px; }
        
        .img-preview { width: 100px; height: 60px; object-fit: cover; border-radius: 4px; }
        
        /* Matching buttons from style.css if needed */
        .btn { padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-weight: 600; text-decoration: none; display: inline-block; }
        .btn-primary { background: var(--primary); color: white; }
        .btn-secondary { background: var(--secondary); color: white; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-brand" style="padding: 0 30px 40px;"><h2 style="color:white">SVES Admin</h2></div>
        <div class="sidebar-menu">
            <a href="dashboard.php"><i class="fas fa-home"></i> Dashboard</a>
            <a href="manage-notes.php"><i class="fas fa-file-alt"></i> Manage Notes</a>
            <a href="manage-gallery.php" class="active"><i class="fas fa-images"></i> Manage Gallery</a>
            <a href="manage-announcements.php"><i class="fas fa-bullhorn"></i> Announcements</a>
            <a href="logout.php" style="margin-top: 50px; color: #ff6b6b;"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>

    <div class="main-content">
        <h1>Manage Gallery & Images</h1>
        <p>Upload banners, campus photos, and event images easily.</p>
        
        <?php if($message): ?>
            <div class="alert"><?php echo $message; ?></div>
        <?php endif; ?>

        <div class="upload-form">
            <h3>Upload New Image</h3>
            <form action="" method="POST" enctype="multipart/form-data">
                <div class="form-grid" style="margin-top: 20px;">
                    <div class="form-group">
                        <label>Image Caption</label>
                        <input type="text" name="caption" placeholder="e.g. Annual Day 2024" style="width:100%; padding:10px; border: 1px solid #ddd; border-radius: 4px;" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category" style="width:100%; padding:10px; border: 1px solid #ddd; border-radius: 4px;" required>
                            <option value="Campus">Campus</option>
                            <option value="Events">Events</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Banner">Banner (Home Page)</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Select Image File</label>
                    <input type="file" name="image_file" accept="image/*" style="width:100%; padding:10px; border: 1px solid #ddd; border-radius: 4px;" required>
                </div>
                <button type="submit" name="upload_image" class="btn btn-primary">Upload & Save</button>
            </form>
        </div>

        <h3>Uploaded Media</h3>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Preview</th>
                    <th>Caption</th>
                    <th>Category</th>
                    <th>Path</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php if($images->num_rows > 0): ?>
                    <?php while($row = $images->fetch_assoc()): ?>
                        <tr>
                            <td><img src="../<?php echo $row['image_path']; ?>" class="img-preview" alt=""></td>
                            <td><?php echo $row['caption']; ?></td>
                            <td><span class="badge"><?php echo $row['category']; ?></span></td>
                            <td><small><?php echo $row['image_path']; ?></small></td>
                            <td>
                                <a href="?delete=<?php echo $row['id']; ?>" style="color: #d9534f;" onclick="return confirm('Are you sure?')"><i class="fas fa-trash"></i> Delete</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">No images uploaded yet.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
