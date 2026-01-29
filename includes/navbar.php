<header id="main-header">
    <div class="container">
        <div class="header-inner flex align-center justify-between">
            <a href="index.php" class="logo flex align-center">
                <img src="Home page/photes/icon.png" alt="SVES Logo">
                <div class="logo-text" style="margin-left: 15px;">
                    <h2 style="color: var(--white); font-size: 1.5rem; line-height: 1;">SVES College</h2>
                    <span style="color: var(--secondary); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px;">Harugeri</span>
                </div>
            </a>

            <nav class="nav-links">
                <a href="index.php">Home</a>
                <a href="about.php">About Us</a>
                <div class="dropdown" style="display: inline-block; position: relative;">
                    <a href="javascript:void(0)">Academics <i class="fas fa-chevron-down" style="font-size: 0.7rem;"></i></a>
                    <div class="dropdown-content">
                        <a href="departments.php">Departments</a>
                        <a href="courses.php">Courses</a>
                        <a href="faculty.php">Faculty</a>
                    </div>
                </div>
                <a href="student-corner.php">Student Corner</a>
                <a href="notes.php">Notes & Resources</a>
                <a href="gallery.php">Gallery</a>
                <a href="placements.php">Placements</a>
                <a href="contact.php" class="btn btn-secondary" style="padding: 8px 20px; color: var(--primary) !important;">Apply Now</a>
            </nav>

            <div class="mobile-menu-toggle" style="display: none; color: var(--white); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </div>
</header>

<style>
/* Header Dropdown Styling */
.dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--white);
    min-width: 200px;
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-sm);
    padding: 10px 0;
    z-index: 100;
}

.dropdown-content a {
    color: var(--primary) !important;
    padding: 10px 20px;
    display: block;
    font-size: 0.9rem;
}

.dropdown-content a:hover {
    background: var(--bg-light);
    color: var(--secondary) !important;
}

.dropdown:hover .dropdown-content {
    display: block;
}

header.scrolled .logo-text h2 { color: var(--primary); }
header.scrolled .mobile-menu-toggle { color: var(--primary); }

@media (max-width: 1024px) {
    .nav-links { display: none; }
    .mobile-menu-toggle { display: block !important; }
}
</style>
