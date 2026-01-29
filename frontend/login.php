<?php 
$page_title = "Student Login";
include 'includes/header.php'; 
?>

<style>
.login-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(rgba(0,35,71,0.9), rgba(0,35,71,0.8)), url('../Home page/photes/collage ground.png');
    background-size: cover;
    background-position: center;
    padding: 120px 20px 60px;
}

.login-card {
    background: var(--white);
    width: 100%;
    max-width: 450px;
    padding: 50px 40px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    text-align: center;
}

.login-logo {
    margin-bottom: 30px;
}

.login-logo img {
    height: 80px;
    margin-bottom: 15px;
}

.login-logo h2 {
    color: var(--primary);
    font-size: 1.8rem;
}

.login-logo p {
    color: var(--text-light);
    font-size: 0.9rem;
}

.form-group {
    text-align: left;
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--primary);
}

.form-group input {
    width: 100%;
    padding: 14px;
    border: 2px solid #eee;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    transition: var(--transition);
}

.form-group input:focus {
    border-color: var(--secondary);
    outline: none;
}

.login-btn {
    width: 100%;
    padding: 14px;
    font-size: 1.1rem;
    margin-top: 10px;
    margin-bottom: 20px;
}

.forgot-password {
    color: var(--primary);
    font-size: 0.9rem;
    text-decoration: none;
    font-weight: 500;
}

.forgot-password:hover {
    color: var(--secondary);
}

.divider {
    margin: 25px 0;
    border-top: 1px solid #eee;
    position: relative;
}

.divider span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--white);
    padding: 0 15px;
    color: #999;
    font-size: 0.8rem;
}

.apply-link {
    font-size: 0.95rem;
    color: var(--text-light);
}

.apply-link a {
    color: var(--secondary);
    font-weight: 700;
}

#login-error {
    display: none;
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    font-size: 0.9rem;
    border-left: 4px solid #dc3545;
}

@media (max-width: 480px) {
    .login-card {
        padding: 40px 25px;
    }
}
</style>

<section class="login-section">
    <div class="login-card" data-aos="zoom-in">
        <div class="login-logo">
            <img src="../Home page/photes/icon.png" alt="SVES Logo">
            <h2>Student Login</h2>
            <p>Access your portal with your credentials</p>
        </div>

        <div id="login-error">Invalid Student ID or Password. Please try again.</div>

        <form id="loginForm">
            <div class="form-group">
                <label for="student_id">Student ID / Email</label>
                <input type="text" id="student_id" placeholder="Enter your ID or Email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="••••••••" required>
            </div>
            
            <div style="text-align: right; margin-bottom: 25px;">
                <a href="#" class="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary login-btn">Login</button>
        </form>

        <div class="apply-link">
            Don't have an account? <a href="admissions.php">Apply Now</a>
        </div>
    </div>
</section>

<script>
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('student_id').value;
    const password = document.getElementById('password').value;
    
    // Dummy authentication logic
    if (studentId === 'student' && password === '1234') {
        window.location.href = 'student-corner.php';
    } else {
        const errorDiv = document.getElementById('login-error');
        errorDiv.style.display = 'block';
        
        // Shake animation
        const card = document.querySelector('.login-card');
        card.style.animation = 'none';
        card.offsetHeight; // trigger reflow
        card.style.animation = 'shake 0.5s';
    }
});
</script>

<style>
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
</style>

<?php include 'includes/footer.php'; ?>
