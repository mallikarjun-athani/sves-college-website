<?php 
$page_title = "Contact Us";
include 'includes/header.php'; 
?>

<style>
.contact-header {
    background: linear-gradient(rgba(0,35,71,0.8), rgba(0,35,71,0.8)), url('../Home page/photes/collage ground.png');
    background-size: cover;
    padding: 150px 0 80px;
    color: var(--white);
    text-align: center;
}

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 50px;
    margin-top: -80px;
}

.contact-info-panel {
    background: var(--primary);
    color: var(--white);
    padding: 50px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
}

.contact-item {
    margin-bottom: 30px;
    display: flex;
    align-items: flex-start;
}

.contact-icon {
    background: var(--secondary);
    color: var(--primary);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    flex-shrink: 0;
    font-size: 1.2rem;
}

.contact-form-panel {
    background: var(--white);
    padding: 50px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--primary);
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    font-family: inherit;
}

@media (max-width: 992px) {
    .contact-wrapper { grid-template-columns: 1fr; margin-top: 30px; }
}
</style>

<section class="contact-header">
    <div class="container">
        <h1>Connect With Us</h1>
        <p>Have questions? We're here to help you on your educational journey.</p>
    </div>
</section>

<div class="container section-padding">
    <div class="contact-wrapper">
        <div class="contact-info-panel" data-aos="fade-right">
            <h2>Contact Information</h2>
            <p style="margin: 20px 0 40px; opacity: 0.8;">Our office is always open for visitors and inquiries about admissions and courses.</p>
            
            <div class="contact-item">
                <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div>
                    <h4>Our Location</h4>
                    <p>B.R. Darur First Grade College,<br>Harugeri, Karnataka - 591 220</p>
                </div>
            </div>
            
            <div class="contact-item">
                <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
                <div>
                    <h4>Call Us</h4>
                    <p>BCA Dept: +91 80507 86198</p>
                    <p>Office: 08331 - XXXXXX</p>
                </div>
            </div>
            
            <div class="contact-item">
                <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                <div>
                    <h4>Email Us</h4>
                    <p>info@svescollege.edu.in</p>
                    <p>admissions@svescollege.edu.in</p>
                </div>
            </div>

            <div class="social-links" style="margin-top: 40px;">
                <h4 style="margin-bottom: 15px;">Follow Us</h4>
                <div class="flex" style="gap: 15px;">
                    <a href="#" class="contact-icon" style="width:40px; height:40px; font-size: 1rem;"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="contact-icon" style="width:40px; height:40px; font-size: 1rem;"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="contact-icon" style="width:40px; height:40px; font-size: 1rem;"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>

        <div class="contact-form-panel" data-aos="fade-left">
            <h2>Send a Message</h2>
            <p style="margin: 15px 0 30px; color: var(--text-light);">Interested in our programs? Fill out the form below and we will get back to you shortly.</p>
            
            <form action="contact_handler.php" method="POST">
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" name="fname" placeholder="John" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lname" placeholder="Doe" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="john@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX">
                    </div>
                </div>
                <div class="form-group">
                    <label>Inquiry Type</label>
                    <select name="subject" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: var(--radius-sm);">
                        <option>Admissions</option>
                        <option>General Inquiry</option>
                        <option>Placements</option>
                        <option>Alumni</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Your Message</label>
                    <textarea name="message" rows="5" placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Send Message</button>
            </form>
        </div>
    </div>
</div>

<!-- Map Section -->
<section class="section-padding">
    <div class="container text-center">
        <div class="section-title">
            <h2>Find Us on Campus</h2>
        </div>
        <div style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); height: 450px;">
            <!-- Placeholder for Google Maps -->
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1162.744474324276!2d74.8465!3d16.4568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI3JzI0LjUiTiA3NMKwNTAnNDcuNCJF!5e0!3m2!1sen!2sin!4v1622111111111!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
