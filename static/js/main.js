// Theme switching functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    announceThemeChange(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    announceThemeChange(newTheme);
}

function announceThemeChange(theme) {
    let announcer = document.getElementById('theme-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'theme-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('class', 'sr-only');
        document.body.appendChild(announcer);
    }
    announcer.textContent = `Tema alterado para ${theme === 'dark' ? 'escuro' : 'claro'}`;
}

// Loading spinner functionality
let loadingTimeout;

function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        clearTimeout(loadingTimeout);
        loadingOverlay.style.display = 'flex';
        loadingOverlay.classList.add('show');
        loadingOverlay.setAttribute('aria-hidden', 'false');
    }
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingTimeout = setTimeout(() => {
            loadingOverlay.classList.remove('show');
            loadingOverlay.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }, 500);
    }
}

// Keyboard navigation enhancement
function handleKeyboardNav(event) {
    if (event.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
}

function handleMouseNav() {
    document.body.classList.remove('keyboard-nav');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();

    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Show loading animation on navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && !link.target && link.href && !link.href.startsWith('#') && !link.href.includes('javascript:')) {
            showLoading();
        }
    });

    // Navigation active state
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus',  // Show on hover and focus
            animation: true,         // Enable animation
            html: true,             // Allow HTML in tooltips
            delay: {                // Add slight delays for better UX
                show: 100,
                hide: 100
            }
        });
    });

    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboardNav);
    document.addEventListener('mousedown', handleMouseNav);

    // Hide loading spinner after initial page load
    window.addEventListener('load', hideLoading);
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    showLoading();
});

// Expose loading functions globally
window.showLoading = showLoading;
window.hideLoading = hideLoading;