<?php 
$page_title = "Notes & Resources";
include 'includes/header.php'; 
include '../backend/db.php';

// Fetch filters from URL
$course = isset($_GET['course']) ? clean_input($_GET['course']) : '';
$semester = isset($_GET['semester']) ? clean_input($_GET['semester']) : '';
$subject = isset($_GET['subject']) ? clean_input($_GET['subject']) : '';

// Build Query
$query = "SELECT * FROM notes WHERE 1=1";
if ($course) $query .= " AND course_id = '$course'";
if ($semester) $query .= " AND semester = '$semester'";
if ($subject) $query .= " AND subject LIKE '%$subject%'";
$query .= " ORDER BY upload_date DESC";

$result = $conn->query($query);
?>

<style>
.notes-header {
    background: linear-gradient(rgba(0, 35, 71, 0.9), rgba(0, 35, 71, 0.9)), url('assets/images/notes-bg.jpg');
    background-size: cover;
    padding: 150px 0 80px;
    color: var(--white);
    text-align: center;
}

.filter-section {
    background: var(--white);
    padding: 30px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    margin-top: -50px;
    position: relative;
    z-index: 10;
}

.filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.filter-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--primary);
}

.filter-item select, .filter-item input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    font-family: inherit;
}

.notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.note-card {
    background: var(--white);
    padding: 30px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid #eee;
    transition: var(--transition);
}

.note-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--secondary);
}

.note-type {
    background: var(--secondary-light);
    color: var(--primary);
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
}

.note-card h4 {
    margin: 15px 0 10px;
    color: var(--primary);
}

.note-meta {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 20px;
}

.note-meta span {
    display: block;
    margin-bottom: 5px;
}
</style>

<section class="notes-header">
    <div class="container">
        <h1>Digital Notes Library</h1>
        <p>Access high-quality study materials and resources curated by our expert faculty.</p>
    </div>
</section>

<div class="container">
    <div class="filter-section">
        <form action="" method="GET" class="filter-grid">
            <div class="filter-item">
                <label>Course</label>
                <select name="course">
                    <option value="">All Courses</option>
                    <option value="1" <?php if($course == '1') echo 'selected'; ?>>BCA</option>
                    <option value="2" <?php if($course == '2') echo 'selected'; ?>>BA</option>
                    <option value="3" <?php if($course == '3') echo 'selected'; ?>>B.Com</option>
                    <option value="4" <?php if($course == '4') echo 'selected'; ?>>B.Sc</option>
                </select>
            </div>
            <div class="filter-item">
                <label>Semester</label>
                <select name="semester">
                    <option value="">All Semesters</option>
                    <option value="1" <?php if($semester == '1') echo 'selected'; ?>>Semester 1</option>
                    <option value="2" <?php if($semester == '2') echo 'selected'; ?>>Semester 2</option>
                    <option value="3" <?php if($semester == '3') echo 'selected'; ?>>Semester 3</option>
                    <option value="4" <?php if($semester == '4') echo 'selected'; ?>>Semester 4</option>
                    <option value="5" <?php if($semester == '5') echo 'selected'; ?>>Semester 5</option>
                    <option value="6" <?php if($semester == '6') echo 'selected'; ?>>Semester 6</option>
                </select>
            </div>
            <div class="filter-item">
                <label>Search Subject</label>
                <input type="text" name="subject" value="<?php echo $subject; ?>" placeholder="e.g. Data Structures">
            </div>
            <div class="filter-item" style="display: flex; align-items: flex-end;">
                <button type="submit" class="btn btn-primary" style="width: 100%;">Apply Filters</button>
            </div>
        </form>
    </div>

    <div class="section-padding">
        <div class="notes-grid">
            <?php if ($result && $result->num_rows > 0): ?>
                <?php while($row = $result->fetch_assoc()): ?>
                    <div class="note-card" data-aos="fade-up">
                        <span class="note-type">PDF</span>
                        <h4><?php echo $row['title']; ?></h4>
                        <div class="note-meta">
                            <span><i class="fas fa-book-open"></i> Subject: <?php echo $row['subject']; ?></span>
                            <span><i class="fas fa-layer-group"></i> Unit: <?php echo $row['unit']; ?></span>
                            <span><i class="fas fa-clock"></i> Uploaded: <?php echo date('d M, Y', strtotime($row['upload_date'])); ?></span>
                        </div>
                        <div class="flex">
                            <a href="../<?php echo $row['file_path']; ?>" class="btn btn-outline" style="padding: 8px 15px; font-size: 0.9rem; flex: 1; margin-right: 10px;" target="_blank">View</a>
                            <a href="<?php echo $row['file_path']; ?>" class="btn btn-primary" style="padding: 8px 15px; font-size: 0.9rem; flex: 1;" download>Download</a>
                        </div>
                    </div>
                <?php endwhile; ?>
            <?php else: ?>
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <i class="fas fa-folder-open" style="font-size: 4rem; color: #ddd; margin-bottom: 20px;"></i>
                    <h3>No notes found</h3>
                    <p>Try adjusting your filters or search keywords.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
