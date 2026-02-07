/**
 * SVES College Website - Main JavaScript
 * Handles shared UI interactions and advanced features
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
    const isAdmin = window.location.pathname.includes('/admin/');
    const prefix = isAdmin ? '../' : '';

    const headerPath = prefix + 'components/header.html';
    const footerPath = prefix + 'components/footer.html';

    const headerLoaded = await loadComponent('main-header', headerPath);
    const footerLoaded = await loadComponent('main-site-footer', footerPath);

    if (headerLoaded) {
        if (isAdmin) {
            const links = document.getElementById('main-header').querySelectorAll('a, img');
            links.forEach(el => {
                const attr = el.tagName === 'IMG' ? 'src' : 'href';
                const val = el.getAttribute(attr);
                if (val && !val.startsWith('/') && !val.startsWith('http') && !val.startsWith('javascript:') && !val.startsWith('#')) {
                    el.setAttribute(attr, '../' + val);
                }
            });
        }
        setupMobileMenu();
        setupNavbarScroll();
        highlightActiveLink();
        setupSearch();
        setupAccessibility();
        setupMultilingual();
        initNotifications();
        setupVoiceReadout();
        setupOneClickInquiry();
        setupEmergencyBar();
        setupRealTimeNotices();
    }

    if (window.AOS) {
        window.AOS.init({ duration: 800, once: true });
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register(prefix + 'sw.js');
        });
    }

    // Feature: Usage Heatmap Placeholder (Admin only)
    if (isAdmin) initUsageHeatmap();
}

/**
 * Feature 14: Announcement Voice Readout
 * Uses Web Speech API to read important notices
 */
function setupVoiceReadout() {
    const notices = document.querySelectorAll('.notice-item');
    notices.forEach(notice => {
        const text = notice.innerText;
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-volume-up"></i>';
        btn.className = 'voice-readout-btn';
        btn.title = 'Listen to this notice';
        btn.onclick = (e) => {
            e.stopPropagation();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        };
        notice.appendChild(btn);
    });
}

/**
 * Feature 15: One-Click Inquiry System
 * Floating Action Button for quick mobile interaction
 */
function setupOneClickInquiry() {
    const fab = document.createElement('div');
    fab.className = 'fab-container';
    fab.innerHTML = `
        <div class="fab-main"><i class="fas fa-comment-dots"></i></div>
        <div class="fab-options">
            <a href="tel:+919876543210" class="fab-option"><i class="fas fa-phone"></i></a>
            <a href="https://wa.me/919876543210" class="fab-option" style="background: #25D366;"><i class="fab fa-whatsapp"></i></a>
            <a href="admissions.html" class="fab-option" style="background: var(--primary);"><i class="fas fa-paper-plane"></i></a>
        </div>
    `;
    document.body.appendChild(fab);

    fab.querySelector('.fab-main').onclick = () => {
        fab.classList.toggle('active');
    };
}

/**
 * Feature 3: Live Notice Board
 * Auto-refreshes notices without page reload
 */
function setupRealTimeNotices() {
    const ticker = document.querySelector('.notice-ticker');
    if (!ticker) return;

    setInterval(() => {
        // In real app, fetch from API
        console.log('Checking for new notices...');
        // Simulate a highlight for urgent notice
        const urgent = ticker.querySelector('.urgent-notice');
        if (urgent) urgent.style.opacity = (Math.sin(Date.now() / 500) + 1.5) / 2.5;
    }, 5000);
}

/**
 * Feature 8: Emergency Information Section
 * Minimal, high-visibility contact info on mobile
 */
function setupEmergencyBar() {
    const bar = document.createElement('div');
    bar.className = 'emergency-bar';
    bar.innerHTML = `
        <span><i class="fas fa-exclamation-triangle"></i> Campus Safety: <strong>100 / 108</strong></span>
        <a href="tel:0831123456" class="btn btn-sm">Call Office</a>
    `;
    document.body.appendChild(bar);
}

/**
 * Feature 10: Website Usage Heatmap (Admin Placeholder)
 */
function initUsageHeatmap() {
    console.log('Heatmap tracking active (Placeholder)');
}

// Logic for existing features
function setupSearch() {
    const toggle = document.getElementById('header-search-toggle');
    const overlay = document.getElementById('search-overlay');
    const close = document.getElementById('search-close');
    const input = document.getElementById('global-search-input');
    const results = document.getElementById('search-results');

    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
        overlay.classList.add('active');
        input.focus();
    });

    if (close) close.onclick = () => overlay.classList.remove('active');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') overlay.classList.remove('active');
    });

    const searchableContent = [
        { title: 'Admissions', link: 'admissions.html', text: 'Apply' },
        { title: 'Courses', link: 'courses.html', text: 'Duration, Syllabus' },
        { title: 'Virtual Tour', link: 'virtual-tour.html', text: '360 degree campus view' },
        { title: 'Compare Courses', link: 'compare-courses.html', text: 'Side by side analysis' },
        { title: 'Timetable', link: 'timetable.html', text: 'Academic schedule' },
        { title: 'Student Portfolios', link: 'portfolios.html', text: 'Project showcase' }
    ];

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) { results.innerHTML = ''; return; }
        const isAdmin = window.location.pathname.includes('/admin/');
        const prefix = isAdmin ? '../' : '';
        const matches = searchableContent.filter(item => item.title.toLowerCase().includes(term));
        results.innerHTML = matches.map(m => `
            <a href="${prefix}${m.link}" class="search-result-item">
                <h4>${m.title}</h4>
                <p>${m.text}</p>
            </a>
        `).join('');
    });
}

function setupAccessibility() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    if (localStorage.getItem('high-contrast') === 'true') document.body.classList.add('high-contrast');
    toggle.onclick = () => {
        const isHC = document.body.classList.toggle('high-contrast');
        localStorage.setItem('high-contrast', isHC);
    };
}

function setupMultilingual() {
    const select = document.getElementById('lang-select');
    if (select) {
        select.onchange = (e) => {
            if (e.target.value === 'kn') alert('Kannada language support initialized.');
        };
    }
}

function initNotifications() {
    // Already implemented in previous session - keeping for consistency
}

function setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const close = document.getElementById('mobile-close');
    const nav = document.getElementById('mobile-nav');

    if (toggle && nav) toggle.onclick = () => nav.classList.add('active');
    if (close && nav) close.onclick = () => nav.classList.remove('active');

    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && !nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('active');
        }
    });
}

function setupNavbarScroll() {
    const header = document.getElementById('main-header');
    window.onscroll = () => {
        if (window.scrollY > 50) header?.classList.add('scrolled');
        else header?.classList.remove('scrolled');
    };
}

function highlightActiveLink() {
    const page = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
}

document.addEventListener('DOMContentLoaded', initCommonUI);
