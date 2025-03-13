async function logout() {
  // Clear all authentication tokens/cookies
  localStorage.removeItem('authToken');
  sessionStorage.clear();
  
  // If using cookies, also clear them
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Additional cleanup if needed
  await auth.signOut(); // If using a third-party auth service
  
  // Redirect to login page
  window.location.href = '/login';
} 