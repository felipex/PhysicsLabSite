// Theme switching functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Loading spinner functionality
const loadingOverlay = document.querySelector('.loading-overlay');

function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
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
    }

    // Navigation active state
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Hide loading spinner after initial page load
    hideLoading();
});

// Expose loading functions globally
window.showLoading = showLoading;
window.hideLoading = hideLoading;