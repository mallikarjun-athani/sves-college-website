<?php 
$page_title = "Our Faculty";
include 'includes/header.php'; 
?>

<style>
.faculty-header {
    background: linear-gradient(rgba(0,35,71,0.8), rgba(0,35,71,0.8)), url('../Home page/photes/collage ground.png');
    background-size: cover;
    padding: 120px 0 60px;
    color: var(--white);
    text-align: center;
}

.faculty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 40px;
    margin-top: 50px;
}

.faculty-card {
    background: var(--white);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    text-align: center;
    transition: var(--transition);
}

.faculty-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
}

.faculty-img {
    height: 300px;
    width: 100%;
    overflow: hidden;
}

.faculty-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.faculty-card:hover .faculty-img img {
    transform: scale(1.05);
}

.faculty-info {
    padding: 25px;
}

.faculty-info h3 {
    color: var(--primary);
    margin-bottom: 5px;
    font-size: 1.2rem;
}

.faculty-info p {
    color: var(--secondary);
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.dept-tag {
    display: inline-block;
    background: var(--bg-light);
    color: var(--text-muted);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-top: 15px;
}
</style>

<section class="faculty-header">
    <div class="container">
        <h1>Our Distinguished Faculty</h1>
        <p>Guided by experts, motivated by passion, dedicated to student excellence.</p>
    </div>
</section>

<div class="container section-padding">
    <div class="section-title">
        <h2>Administrative Leadership</h2>
    </div>
    <div class="faculty-grid">
        <div class="faculty-card" data-aos="fade-up">
            <div class="faculty-img">
                <img src="../Home page/photes/br darur.png" alt="Shri. B R Darur">
            </div>
            <div class="faculty-info">
                <h3>Shri. B. R. Darur</h3>
                <p>Founder</p>
                <span class="dept-tag">Administration</span>
            </div>
        </div>
        
        <div class="faculty-card" data-aos="fade-up" data-aos-delay="100">
            <div class="faculty-img">
                <img src="../Home page/photes/chairman_pre.jpg" alt="Shri. Girish Darur">
            </div>
            <div class="faculty-info">
                <h3>Shri. Girish Darur</h3>
                <p>Chairman</p>
                <span class="dept-tag">Board of Directors</span>
            </div>
        </div>
        
        <div class="faculty-card" data-aos="fade-up" data-aos-delay="200">
            <div class="faculty-img">
                <img src="../Home page/photes/mali sir.png" alt="Dr. V S Mali">
            </div>
            <div class="faculty-info">
                <h3>Dr. V. S. Mali</h3>
                <p>Secretary</p>
                <span class="dept-tag">Administration</span>
            </div>
        </div>
        
        <div class="faculty-card" data-aos="fade-up" data-aos-delay="300">
            <div class="faculty-img">
                <img src="../Home page/photes/VINOD.jpg" alt="Dr. Vinod Kambale">
            </div>
            <div class="faculty-info">
                <h3>Dr. Vinod Kambale</h3>
                <p>Principal</p>
                <span class="dept-tag">Higher Education</span>
            </div>
        </div>
    </div>

    <div class="section-title" style="margin-top: 80px;">
        <h2>Academic Faculty</h2>
    </div>
    <div class="faculty-grid">
        <div class="faculty-card" data-aos="fade-up">
            <div class="faculty-img">
                <img src="../Home page/photes/RAMESH.jpg" alt="Dr. Ramesh Kamathigi">
            </div>
            <div class="faculty-info">
                <h3>Dr. Ramesh Kamathigi</h3>
                <p>Assistant Professor</p>
                <span class="dept-tag">Arts Department</span>
            </div>
        </div>
        
        <div class="faculty-card" data-aos="fade-up" data-aos-delay="100">
            <div class="faculty-img">
                <img src="../Home page/photes/HONAKAMBLE.jpg" alt="Prof. A D Honakamble">
            </div>
            <div class="faculty-info">
                <h3>Prof. A. D. Honakamble</h3>
                <p>IQAC Coordinator</p>
                <span class="dept-tag">Quality Assurance</span>
            </div>
        </div>
        
        <!-- More faculty members can be added here or fetched from DB -->
    </div>
</div>

<?php include 'includes/footer.php'; ?>
