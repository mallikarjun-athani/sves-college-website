<?php 
$page_title = "Home";
include 'includes/header.php'; 
?>

<!-- Hero Section -->
<section class="hero">
    <div class="container" data-aos="fade-up">
        <div class="hero-content">
            <h1>Excellence in Education</h1>
            <p>Empowering Minds, Shaping Futures at SVES College Harugeri. A legacy of academic excellence since 1983.</p>
            <div class="hero-btns">
                <a href="admissions.php" class="btn btn-secondary">Apply Now</a>
                <a href="student-corner.php" class="btn btn-outline" style="color: white; border-color: white; margin-left: 20px;">Student Login</a>
            </div>
        </div>
    </div>
</section>

<!-- Announcements Ticker -->
<div class="ticker-wrap">
    <div class="container">
        <div class="flex align-center">
            <span style="background: var(--secondary); color: var(--primary); padding: 5px 15px; font-weight: 700; margin-right: 20px; border-radius: 4px;">LATEST</span>
            <div class="ticker-content">
                <span>🔔 Admissions Open for Academic Year 2024-25 | </span>
                <span>📅 Semester Exams start from 15th June 2024 | </span>
                <span>🏆 SVES College wins Zonal Sports Championship | </span>
                <span>📢 Guest Lecture on AI scheduled for next Friday | </span>
            </div>
        </div>
    </div>
</div>

<!-- Quick Info Cards -->
<section class="section-padding bg-light">
    <div class="container">
        <div class="card-grid">
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <i class="fas fa-university card-icon"></i>
                <h3>Our Institution</h3>
                <p>Learn about our rich history, mission, and the visionary leadership behind SVES.</p>
                <a href="about.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <i class="fas fa-graduation-cap card-icon"></i>
                <h3>Academics</h3>
                <p>Explore our diverse range of undergraduate programs in Arts, Commerce, Science, and BCA.</p>
                <a href="courses.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">View Courses <i class="fas fa-arrow-right"></i></a>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="300">
                <i class="fas fa-users card-icon"></i>
                <h3>Placement Cell</h3>
                <p>Our dedicated placement cell ensures that our students are well-prepared for their professional careers.</p>
                <a href="placements.php" class="btn-link" style="color: var(--primary); font-weight: 600; margin-top: 15px; display: inline-block;">Career Support <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose Us -->
<section class="section-padding">
    <div class="container">
        <div class="flex align-center justify-between" style="flex-wrap: wrap;">
            <div class="why-content" style="flex: 1; min-width: 300px;" data-aos="fade-right">
                <div class="section-title" style="text-align: left;">
                    <h2 style="left: 0; transform: none;">Why Choose SVES?</h2>
                </div>
                <p style="margin-bottom: 30px; font-size: 1.1rem; color: var(--text-light);">We provide a holistic environment that foster physical, intellectual, and spiritual growth.</p>
                
                <ul class="why-list">
                    <li style="margin-bottom: 20px; display: flex; align-items: flex-start;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.5rem;"></i>
                        <div>
                            <h4 style="color: var(--primary);">NAAC 'A' Accredited</h4>
                            <p>Proven excellence in quality of education and infrastructure.</p>
                        </div>
                    </li>
                    <li style="margin-bottom: 20px; display: flex; align-items: flex-start;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.5rem;"></i>
                        <div>
                            <h4 style="color: var(--primary);">Experienced Faculty</h4>
                            <p>Dedicated staff with M.Phil and Ph.D degrees for expert guidance.</p>
                        </div>
                    </li>
                    <li style="margin-bottom: 20px; display: flex; align-items: flex-start;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.5rem;"></i>
                        <div>
                            <h4 style="color: var(--primary);">Modern Facilities</h4>
                            <p>Well-equipped labs, digital library, and sports complex.</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="why-image" style="flex: 1; min-width: 300px; margin-left: 50px;" data-aos="fade-left">
                <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg);">
                    <img src="Home page/photes/collage ground.png" alt="College Campus" style="width: 100%; display: block;">
                    <div style="position: absolute; bottom: 30px; left: 30px; background: var(--secondary); padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
                        <h2 style="color: var(--primary); font-size: 2.5rem; line-height: 1;">40+</h2>
                        <p style="color: var(--primary); font-weight: 600;">Years of Excellence</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Call to Action -->
<section class="section-padding" style="background: var(--primary); color: var(--white); text-align: center;">
    <div class="container" data-aos="zoom-in">
        <h2 style="font-size: 3rem; margin-bottom: 20px;">Ready to Start Your Journey?</h2>
        <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.8;">Join SVES College and be part of a vibrant academic community.</p>
        <a href="contact.php" class="btn btn-secondary">Get in Touch</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
