(function () {
  // If the page is opened as a local file, default to the standard Spring Boot backend URL.
  // Otherwise, use the same origin as the frontend.
  const origin = window.location.origin;
  const isLocalFile = origin.startsWith('file://');
  
  window.HG_API_BASE = window.HG_API_BASE || (isLocalFile ? 'http://localhost:8081/api' : `${origin}/api`);
  
  console.log('HealthBot API Base:', window.HG_API_BASE);
})();
