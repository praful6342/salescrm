// Custom JavaScript for Sales CRM

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // Add confirmation dialog to all delete buttons (if not already using inline confirm)
    const deleteForms = document.querySelectorAll('form[action*="_method=DELETE"]');
    deleteForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });
    
    // Format mobile number input as user types (optional)
    const mobileInputs = document.querySelectorAll('input[type="tel"]');
    mobileInputs.forEach(function(input) {
        input.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            // Limit to 10 digits
            if (value.length > 10) value = value.slice(0, 10);
            this.value = value;
        });
    });
    
    // Add active class to current nav link based on URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.startsWith('/clients') && href === '/clients')) {
            link.classList.add('active');
        } else if (currentPath === '/dashboard' && href === '/dashboard') {
            link.classList.add('active');
        } else if (currentPath === '/clients/new' && href === '/clients/new') {
            link.classList.add('active');
        }
    });
    
    // Tooltip initialization (if any elements have data-bs-toggle="tooltip")
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Optional: Show a "loading" spinner on form submit
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            }
        });
    });
});