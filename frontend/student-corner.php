<?php 
$page_title = "Student Corner";
include 'includes/header.php'; 
?>

<style>
.student-header {
    background: linear-gradient(rgba(0,35,71,0.9), rgba(0,35,71,0.9)), url('Home page/photes/collage ground.png');
    background-size: cover;
    padding: 120px 0 60px;
    color: var(--white);
    text-align: center;
}

.student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 50px;
}

.student-feature-card {
    background: var(--white);
    padding: 40px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    text-align: center;
    border-top: 5px solid var(--primary);
    transition: var(--transition);
}

.student-feature-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
    border-top-color: var(--secondary);
}

.feature-icon {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 20px;
}

.student-feature-card h3 {
    margin-bottom: 15px;
    color: var(--primary);
}

.student-feature-card p {
    color: var(--text-light);
    margin-bottom: 25px;
}
</style>

<section class="student-header">
    <div class="container">
        <h1>Student Resource Center</h1>
        <p>Your one-stop destination for academic materials, results, and administrative updates.</p>
    </div>
</section>

<div class="container section-padding">
    <div class="student-grid">
        <div class="student-feature-card" data-aos="fade-up">
            <i class="fas fa-poll feature-icon"></i>
            <h3>Exam Results</h3>
            <p>Check your semester results and internal assessment marks online.</p>
            <a href="results.php" class="btn btn-outline">Check Results</a>
        </div>
        
        <div class="student-feature-card" data-aos="fade-up" data-aos-delay="100">
            <i class="fas fa-calendar-alt feature-icon"></i>
            <h3>Time Table</h3>
            <p>Access the latest class schedules and examination time tables.</p>
            <a href="timetable.php" class="btn btn-outline">View Schedules</a>
        </div>
        
        <div class="student-feature-card" data-aos="fade-up" data-aos-delay="200">
            <i class="fas fa-book feature-icon"></i>
            <h3>Academic Syllabus</h3>
            <p>Download the detailed syllabus for your course and semester.</p>
            <a href="syllabus.php" class="btn btn-outline">Download PDF</a>
        </div>
        
        <div class="student-feature-card" data-aos="fade-up">
            <i class="fas fa-bullhorn feature-icon"></i>
            <h3>Circulars & Notices</h3>
            <p>Stay updated with the latest administrative and academic circulars.</p>
            <a href="circulars.php" class="btn btn-outline">View Notices</a>
        </div>
        
        <div class="student-feature-card" data-aos="fade-up" data-aos-delay="100">
            <i class="fas fa-calendar-check feature-icon"></i>
            <h3>Academic Calendar</h3>
            <p>Plan your semester with the official university academic calendar.</p>
            <a href="calendar.php" class="btn btn-outline">View Calendar</a>
        </div>
        
        <div class="student-feature-card" data-aos="fade-up" data-aos-delay="200">
            <i class="fas fa-file-invoice feature-icon"></i>
            <h3>Internal Marks</h3>
            <p>Verify your internal assessment and attendance percentage.</p>
            <a href="internal-marks.php" class="btn btn-outline">Check Marks</a>
        </div>
    </div>
</div>

<section class="section-padding bg-light">
    <div class="container text-center">
        <div class="section-title">
            <h2>Need More Help?</h2>
        </div>
        <p style="max-width: 600px; margin: 0 auto 40px; color: var(--text-light);">If you're looking for specific notes or resources, visit our digital library or contact the department office.</p>
        <div class="flex justify-center" style="gap: 20px;">
            <a href="notes.php" class="btn btn-primary">Digital Notes Library</a>
            <a href="contact.php" class="btn btn-outline">Contact Office</a>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
