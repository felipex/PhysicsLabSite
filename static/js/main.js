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
    // Create and update a live region to announce theme changes
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
const loadingOverlay = document.querySelector('.loading-overlay');

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
        loadingOverlay.setAttribute('aria-busy', 'true');
        loadingOverlay.setAttribute('aria-label', 'Carregando página');
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
        loadingOverlay.setAttribute('aria-busy', 'false');
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

// For testing purposes, show loading on navigation
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && !link.target && link.href && !link.href.startsWith('#')) {
        showLoading();
    }
});

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

    // Navigation active state
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboardNav);
    document.addEventListener('mousedown', handleMouseNav);

    // Hide loading spinner after initial page load
    hideLoading();
});

// Expose loading functions globally
window.showLoading = showLoading;
window.hideLoading = hideLoading;