<?php 
$page_title = "About Us";
include 'includes/header.php'; 
include '../backend/db.php';
?>

<!-- Inner Hero Section -->
<section class="hero" style="background-image: url('../Home page/photes/collage ground.png'); height: 60vh; min-height: 400px;">
    <div class="container" data-aos="fade-up">
        <div class="hero-content">
            <h1>About Our Institution</h1>
            <p>A legacy of academic excellence and holistic development since 1983.</p>
        </div>
    </div>
</section>

<!-- About Detail Section -->
<section class="section-padding bg-light">
    <div class="container">
        <div class="flex align-center justify-between" style="flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; padding-right: 50px;" data-aos="fade-right">
                <div class="section-title" style="text-align: left;">
                    <h2 style="left: 0; transform: none;">Our Rich Legacy</h2>
                </div>
                <p style="margin-bottom: 20px; font-size: 1.1rem; color: var(--text-light);">
                    Shree Vrushibendra Education Society's (SVES) B.R.Darur First Grade College, Harugeri, was established in 1983 with a vision to provide quality education to the rural youth of this region. Over the past four decades, we have grown into a premier educational institution known for academic rigor and character building.
                </p>
                <p style="margin-bottom: 30px; font-size: 1.1rem; color: var(--text-light);">
                    Affiliated with Rani Channamma University, Belagavi, our college offers a wide spectrum of undergraduate programs in Arts, Commerce, Science, and Computer Applications (BCA). We are proud to be NAAC 'A' accredited, a testament to our commitment to excellence.
                </p>
                <div class="flex" style="gap: 30px;">
                    <div>
                        <h2 style="color: var(--secondary); font-size: 2.5rem;">40+</h2>
                        <p style="font-weight: 600; color: var(--primary);">Years of Experience</p>
                    </div>
                    <div>
                        <h2 style="color: var(--secondary); font-size: 2.5rem;">5000+</h2>
                        <p style="font-weight: 600; color: var(--primary);">Successful Graduates</p>
                    </div>
                </div>
            </div>
            <div style="flex: 1; min-width: 300px;" data-aos="fade-left">
              <video src="../Home page/photes/sves harugeri video.mp4" autoplay loop muted controls style="width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);"></video>
            </div>
        </div>
    </div>
</section>


<!-- Mission & Vision -->
<section class="section-padding">
    <div class="container">
        <div class="card-grid">
            <div class="card" data-aos="fade-up" data-aos-delay="100" style="text-align: center;">
                <i class="fas fa-eye card-icon"></i>
                <h3>Our Vision</h3>
                <p>To be a center of excellence in education, empowering students with knowledge, skills, and values to meet the challenges of a dynamic world and contribute to national development.</p>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="200" style="text-align: center;">
                <i class="fas fa-bullseye card-icon"></i>
                <h3>Our Mission</h3>
                <p>To provide accessible, affordable, and quality higher education to the rural community, fostering an environment of intellectual curiosity, ethical conduct, and social responsibility.</p>
            </div>
            <div class="card" data-aos="fade-up" data-aos-delay="300" style="text-align: center;">
                <i class="fas fa-heart card-icon"></i>
                <h3>Core Values</h3>
                <p>Integrity, Excellence, Inclusion, and Sustainability are at the heart of everything we do, guiding our students to become compassionate leaders of tomorrow.</p>
            </div>
        </div>
    </div>
</section>

<!-- Director/Principal Message -->
<section class="section-padding bg-dark" style="color: var(--white);">
    <div class="container">
        <div class="flex align-center" style="flex-wrap: wrap-reverse;">
            <div style="flex: 1; min-width: 300px; padding: 40px;" data-aos="fade-up">
                <h2 style="color: var(--secondary); margin-bottom: 25px;">Message from the Principal</h2>
                <p style="font-style: italic; font-size: 1.2rem; margin-bottom: 25px; line-height: 1.8; opacity: 0.9;">
                    "At SVES, we don't just teach subjects; we nurture dreams. Our focus is on the holistic development of every student, ensuring they are not just degree holders but responsible citizens equipped with the skills needed for the 21st century. We welcome you to join our family and embark on a transformative journey."
                </p>
                <h4 style="color: var(--white); font-size: 1.5rem; margin-bottom: 5px;">Dr. Mallikarjun Athani</h4>
                <p style="color: var(--secondary); font-weight: 500;">Principal, SVES College Harugeri</p>
            </div>
            <div style="flex: 0.8; min-width: 250px; text-align: center;" data-aos="fade-up">
                <div style="position: relative; display: inline-block;">
                    <img src="../Home page/photes/icon.png" alt="Principal" style="width: 250px; height: 250px; object-fit: contain; border-radius: 50%; border: 5px solid var(--secondary); background: white; padding: 20px;">
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Facilities -->
<section class="section-padding">
    <div class="container">
        <div class="section-title text-center">
            <h2>Our Facilities</h2>
            <p style="max-width: 700px; margin: 20px auto; color: var(--text-light);">We provide state-of-the-art infrastructure to support academic and extracurricular excellence.</p>
        </div>
        
        <div class="card-grid">
            <div class="facility-item" data-aos="zoom-in" data-aos-delay="100">
                <div style="overflow: hidden; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <img src="../Home page/photes/collage ground.png" alt="Library" style="width: 100%; height: 200px; object-fit: cover; transition: var(--transition);">
                </div>
                <h4>Digital Library</h4>
                <p>Thousands of books, journals, and e-resources at your fingertips.</p>
            </div>
            <div class="facility-item" data-aos="zoom-in" data-aos-delay="200">
                <div style="overflow: hidden; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <img src="../Home page/photes/collage ground.png" alt="Labs" style="width: 100%; height: 200px; object-fit: cover; transition: var(--transition);">
                </div>
                <h4>Modern Labs</h4>
                <p>Advanced computer and science labs for practical learning.</p>
            </div>
            <div class="facility-item" data-aos="zoom-in" data-aos-delay="300">
                <div style="overflow: hidden; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <img src="../Home page/photes/collage ground.png" alt="Sports" style="width: 100%; height: 200px; object-fit: cover; transition: var(--transition);">
                </div>
                <h4>Sports Complex</h4>
                <p>Large playground and facilities for various indoor and outdoor sports.</p>
            </div>
        </div>
    </div>
</section>

<style>
.facility-item h4 {
    color: var(--primary);
    margin-bottom: 10px;
    font-size: 1.3rem;
}
.facility-item p {
    color: var(--text-light);
    font-size: 0.95rem;
}
.facility-item img:hover {
    transform: scale(1.1);
}
</style>

<?php include 'includes/footer.php'; ?>
