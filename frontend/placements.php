<?php 
$page_title = "Placement Cell";
include 'includes/header.php'; 
include '../backend/db.php';
?>

<!-- Inner Hero Section -->
<section class="hero" style="background-image: url('../Home page/photes/collage ground.png'); height: 60vh; min-height: 400px;">
    <div class="container" data-aos="fade-up">
        <div class="hero-content">
            <h1>Career & Placements</h1>
            <p>Bridging the gap between academic brilliance and professional success.</p>
        </div>
    </div>
</section>

<!-- Placement Overview -->
<section class="section-padding">
    <div class="container">
        <div class="flex align-center justify-between" style="flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; padding-right: 50px;" data-aos="fade-right">
                <div class="section-title" style="text-align: left;">
                    <h2 style="left: 0; transform: none;">Placement Cell</h2>
                </div>
                <p style="margin-bottom: 20px; font-size: 1.1rem; color: var(--text-light);">
                    Our dedicated Placement Cell works tirelessly to ensure that every student is well-prepared for their professional journey. We provide a platform where students can interact with industry leaders, gain practical experience, and secure their dream jobs.
                </p>
                <div class="why-list" style="margin-top: 30px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.2rem;"></i>
                        <span style="font-weight: 500; color: var(--primary);">Skills Training & Workshops</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.2rem;"></i>
                        <span style="font-weight: 500; color: var(--primary);">Mock Interviews & Resume Building</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <i class="fas fa-check-circle" style="color: var(--secondary); margin-right: 15px; font-size: 1.2rem;"></i>
                        <span style="font-weight: 500; color: var(--primary);">Campus Recruitment Drives</span>
                    </div>
                </div>
            </div>
            <div style="flex: 1; min-width: 300px;" data-aos="fade-left">
                <div class="card" style="background: var(--bg-light); border-left: 5px solid var(--secondary);">
                    <h3 style="margin-bottom: 20px; color: var(--primary);">Recent Statistics</h3>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div class="flex justify-between align-center">
                            <span style="color: var(--text-light);">Placement Rate</span>
                            <span style="font-weight: 800; color: var(--secondary); font-size: 1.5rem;">85%</span>
                        </div>
                        <div class="flex justify-between align-center">
                            <span style="color: var(--text-light);">Higher Studies</span>
                            <span style="font-weight: 800; color: var(--secondary); font-size: 1.5rem;">60%</span>
                        </div>
                        <div class="flex justify-between align-center">
                            <span style="color: var(--text-light);">Avg. Package</span>
                            <span style="font-weight: 800; color: var(--secondary); font-size: 1.5rem;">3.5 LPA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Training Programs -->
<section class="section-padding bg-light">
    <div class="container">
        <div class="section-title text-center">
            <h2>Our Training Programs</h2>
            <p style="max-width: 700px; margin: 20px auto; color: var(--text-light);">Holistic training modules designed to make students industry-ready.</p>
        </div>
        
        <div class="card-grid">
            <div class="card" data-aos="fade-up">
                <h4>Soft Skills</h4>
                <p>Communication, teamwork, leadership, and emotional intelligence training.</p>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="100">
                <h4>Technical Skills</h4>
                <p>Hands-on training in the latest technologies and programming languages.</p>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="200">
                <h4>Aptitude</h4>
                <p>Quantitative, logical, and verbal reasoning skills for competitive exams.</p>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
