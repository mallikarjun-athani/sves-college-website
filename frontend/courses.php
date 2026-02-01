<?php 
$page_title = "Academic Courses";
include 'includes/header.php'; 
include '../backend/db.php';
?>

<!-- Inner Hero Section -->
<section class="hero" style="background-image: url('../Home page/photes/collage ground.png'); height: 60vh; min-height: 400px;">
    <div class="container" data-aos="fade-up">
        <div class="hero-content">
            <h1>Academic Programs</h1>
            <p>Empowering students with industry-relevant skills and knowledge since 1983.</p>
        </div>
    </div>
</section>

<!-- Courses Section -->
<section class="section-padding">
    <div class="container">
        <div class="section-title text-center">
            <h2>Our Undergraduate Programs</h2>
            <p style="max-width: 700px; margin: 20px auto; color: var(--text-light);">We offer a range of programs affiliated with Rani Channamma University, Belagavi, designed to provide a strong foundation for your future career.</p>
        </div>

        <div class="card-grid">
            <!-- BCA -->
            <div class="card" data-aos="fade-up">
                <i class="fas fa-laptop-code card-icon"></i>
                <h3>B.C.A.</h3>
                <p>Bachelor of Computer Applications</p>
                <div style="margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;">
                    <ul style="color: var(--text-light); font-size: 0.9rem; text-align: left;">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Duration: 3 Years</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Focus: Software Development</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Modern Computer Labs</li>
                    </ul>
                </div>
            </div>

            <!-- B.Com -->
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <i class="fas fa-chart-line card-icon"></i>
                <h3>B.Com.</h3>
                <p>Bachelor of Commerce</p>
                <div style="margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;">
                    <ul style="color: var(--text-light); font-size: 0.9rem; text-align: left;">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Duration: 3 Years</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Focus: Finance & Accounting</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Industrial Visits</li>
                    </ul>
                </div>
            </div>

            <!-- B.A -->
            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <i class="fas fa-university card-icon"></i>
                <h3>B.A.</h3>
                <p>Bachelor of Arts</p>
                <div style="margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;">
                    <ul style="color: var(--text-light); font-size: 0.9rem; text-align: left;">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Duration: 3 Years</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Focus: Humanities & Social Sciences</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Competitive Exam Coaching</li>
                    </ul>
                </div>
            </div>

            <!-- B.Sc -->
            <div class="card" data-aos="fade-up" data-aos-delay="300">
                <i class="fas fa-microscope card-icon"></i>
                <h3>B.Sc.</h3>
                <p>Bachelor of Science</p>
                <div style="margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px;">
                    <ul style="color: var(--text-light); font-size: 0.9rem; text-align: left;">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Duration: 3 Years</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Focus: Applied Sciences</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--secondary); margin-right: 8px;"></i> Well-equipped Science Labs</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
