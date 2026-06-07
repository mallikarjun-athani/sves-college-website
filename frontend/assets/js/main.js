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
    const sidebarPath = 'components/sidebar.html'; // Admin sidebar is already in admin/

    const headerContainer = document.getElementById('main-header');
    const footerContainer = document.getElementById('main-site-footer');
    const sidebarContainer = document.getElementById('admin-sidebar');

    // Add immediate feedback if containers exist
    if (headerContainer) headerContainer.innerHTML = '<div style="height: 80px; background: rgba(0,35,71,0.5);"></div>';
    if (footerContainer) footerContainer.innerHTML = '<div style="height: 200px; background: #eee;"></div>';

    // Load Header and Footer
    const headerLoaded = await loadComponent('main-header', headerPath);
    const footerLoaded = await loadComponent('main-site-footer', footerPath);

    // Load Admin Sidebar if container exists
    if (sidebarContainer) {
        const sidebarLoaded = await loadComponent('admin-sidebar', sidebarPath);
        if (sidebarLoaded) {
            setupAdminLogout();
            highlightActiveLink('.sidebar-menu a');
            setupAdminMobileSidebar();
        }
    }

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
        highlightActiveLink('.nav-links a');
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

function highlightActiveLink(selector = '.nav-links a') {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    const links = document.querySelectorAll(selector);
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupAdminLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof logout === 'function') {
                logout();
            } else {
                localStorage.clear();
                window.location.href = '../index.html';
            }
        });
    }
}

function setupAdminMobileSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;

    // Only activate on mobile
    if (window.innerWidth > 768) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'admin-sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(toggleBtn);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';
    document.body.appendChild(overlay);

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Close sidebar when a link is clicked
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
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

// Lightbox feature for images
document.addEventListener('click', function(e) {
    const img = e.target.closest('.lightbox-img');
    if (img) {
        e.preventDefault();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'custom-lightbox-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: '99999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Create full size image
        const fullImg = document.createElement('img');
        
        let src = img.src;
        if (!src && img.tagName !== 'IMG') {
            const innerImg = img.querySelector('img');
            if (innerImg) {
                src = innerImg.src;
            } else {
                const bgImage = window.getComputedStyle(img).backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    src = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                }
            }
        }
        
        fullImg.src = src;
        
        // If wrapped in an anchor, try to use the anchor's href which might be a higher res version
        const anchor = img.closest('a');
        if (anchor && anchor.href) {
            fullImg.src = anchor.href;
        }
        
        Object.assign(fullImg.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
            transform: 'scale(0.95)',
            transition: 'transform 0.3s ease'
        });
        
        // Close button
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'white',
            fontSize: '30px',
            cursor: 'pointer',
            padding: '10px'
        });
        
        overlay.appendChild(fullImg);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        
        // Trigger animations
        setTimeout(() => {
            overlay.style.opacity = '1';
            fullImg.style.transform = 'scale(1)';
        }, 10);
        
        // Close on click anywhere
        overlay.addEventListener('click', function() {
            overlay.style.opacity = '0';
            fullImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 300);
        });
    }
});
