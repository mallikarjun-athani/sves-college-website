<?php 
$page_title = "Academic Departments";
include 'includes/header.php'; 
include '../backend/db.php';
?>

<!-- Inner Hero Section -->
<section class="hero" style="background-image: url('../Home page/photes/collage ground.png'); height: 60vh; min-height: 400px;">
    <div class="container" data-aos="fade-up">
        <div class="hero-content">
            <h1>Our Departments</h1>
            <p>Specialized centers of learning dedicated to academic excellence.</p>
        </div>
    </div>
</section>

<!-- Departments Section -->
<section class="section-padding">
    <div class="container">
        <div class="card-grid">
            <!-- BCA Department -->
            <div class="card" data-aos="fade-up">
                <i class="fas fa-laptop-code card-icon"></i>
                <h3>Department of Computer Applications</h3>
                <p>Equipping students with technical prowess in software development, web technologies, and data science.</p>
                <a href="courses.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Explore BCA <i class="fas fa-arrow-right"></i></a>
            </div>

            <!-- Commerce Department -->
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <i class="fas fa-chart-line card-icon"></i>
                <h3>Department of Commerce</h3>
                <p>Fostering expertise in accounting, finance, taxation, and business management.</p>
                <a href="courses.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Explore B.Com <i class="fas fa-arrow-right"></i></a>
            </div>

            <!-- Arts Department -->
            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <i class="fas fa-university card-icon"></i>
                <h3>Department of Arts</h3>
                <p>Nurturing critical thinking and cultural awareness through humanities and social sciences.</p>
                <a href="courses.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Explore B.A <i class="fas fa-arrow-right"></i></a>
            </div>

            <!-- Science Department -->
            <div class="card" data-aos="fade-up" data-aos-delay="300">
                <i class="fas fa-microscope card-icon"></i>
                <h3>Department of Science</h3>
                <p>Promoting scientific inquiry and innovation through rigorous theoretical and practical learning.</p>
                <a href="courses.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Explore B.Sc <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
