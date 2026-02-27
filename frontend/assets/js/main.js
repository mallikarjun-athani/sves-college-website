/**
 * SVES College Website - Main JavaScript
 * Handles shared UI interactions and component loading
 */

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            return true;
        }
    } catch (error) {
        console.error(`Failed to load component: ${componentPath}`, error);
    }
    return false;
}

async function initCommonUI() {
    // Detect if we are in admin folder
    const isAdmin = window.location.pathname.includes('/admin/');
    const prefix = isAdmin ? '../' : '';

    const headerPath = prefix + 'components/header.html';
    const footerPath = prefix + 'components/footer.html';

    const headerContainer = document.getElementById('main-header');
    const footerContainer = document.getElementById('main-site-footer');

    // Add immediate feedback if containers exist
    if (headerContainer) headerContainer.innerHTML = '<div style="height: 80px; background: rgba(0,35,71,0.5);"></div>';
    if (footerContainer) footerContainer.innerHTML = '<div style="height: 200px; background: #eee;"></div>';

    // Load Header and Footer
    const headerLoaded = await loadComponent('main-header', headerPath);
    const footerLoaded = await loadComponent('main-site-footer', footerPath);

    if (headerLoaded) {
        // If we are in admin, we need to fix relative links in the header
        if (isAdmin) {
            const links = headerContainer.querySelectorAll('a, img');
            links.forEach(el => {
                const attr = el.tagName === 'IMG' ? 'src' : 'href';
                const val = el.getAttribute(attr);
                // Only patch if it's a relative local link (not absolute, not hash, not js)
                if (val && !val.startsWith('/') && !val.startsWith('http') && !val.startsWith('javascript:') && !val.startsWith('#')) {
                    el.setAttribute(attr, '../' + val);
                }
            });
        }
        setupMobileMenu();
        setupNavbarScroll();
        highlightActiveLink();
    }

    // Initialize AOS if available
    if (window.AOS) {
        window.AOS.init({
            duration: 800,
            once: true
        });
    }
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileClose = document.getElementById('mobile-close');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function () {
            mobileNav.classList.add('active');
        });
    }

    if (mobileClose && mobileNav) {
        mobileClose.addEventListener('click', function () {
            mobileNav.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!mobileNav.contains(e.target) && (mobileToggle && !mobileToggle.contains(e.target))) {
                mobileNav.classList.remove('active');
            }
        }
    });
}

function setupNavbarScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function highlightActiveLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initCommonUI);

// Global Admission Handler
function handleApplyNow(event) {
    const isAdmissionsPage = window.location.pathname.includes('admissions.html');

    if (isAdmissionsPage) {
        // Only prevent default and open modal if we are on the admissions page
        if (typeof openAdmissionModal === 'function') {
            if (event) event.preventDefault();
            openAdmissionModal();

            // Close mobile nav if open
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) mobileNav.classList.remove('active');
        }
    }
}

// CSP-compliant event delegation for "Apply Now" buttons
document.addEventListener('click', function (e) {
    const target = e.target.closest('.apply-now-trigger');
    if (target) {
        handleApplyNow(e);
    }
});
