// Check if user is on mobile and show notification
function checkMobile() {
    console.log("Checking mobile...");
    
    // Force show notification for testing
    const notification = document.getElementById('mobileNotification');
    if (!notification) {
        console.error("Notification element not found!");
        return;
    }
    
    console.log("Showing notification...");
    notification.style.display = 'block';
    
    // Original mobile check (commented out for testing)
    /*
    const isMobile = (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (window.innerWidth <= 768)
    );
    
    console.log("Is mobile:", isMobile);
    
    if (isMobile) {
        console.log("Is mobile device!");
        if (!localStorage.getItem('notificationDismissed')) {
            console.log("Showing notification...");
            const notification = document.getElementById('mobileNotification');
            notification.style.display = 'block';
        } else {
            console.log("Notification was previously dismissed");
        }
    } else {
        console.log("Not a mobile device");
    }
    */
}

// Function to dismiss notification
function dismissNotification() {
    console.log("Dismissing notification...");
    const notification = document.getElementById('mobileNotification');
    if (notification) {
        notification.style.display = 'none';
        localStorage.setItem('notificationDismissed', 'true');
    }
}

// Clear localStorage for testing
localStorage.removeItem('notificationDismissed');

// Make sure the DOM is loaded before running
document.addEventListener('DOMContentLoaded', checkMobile);
// Also keep the window.onload as a fallback
window.onload = checkMobile;