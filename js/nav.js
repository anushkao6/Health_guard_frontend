function hgRenderNav(active) {
  const el = document.getElementById('site-header');
  if (!el) return;
  const name = localStorage.getItem('hg_name') || '';
  const logged = hgIsLoggedIn();
  const admin = hgIsAdmin();
  const isRegularUser = logged && !admin;

  // Render top-bar (landing page version or compact version)
  const isAltLayout = ['dashboard', 'admin', 'chat', 'symptom', 'profile', 'mh-checkup'].includes(active);

  if (!isAltLayout) {
    el.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="/index.html">HealthBot <span>AI</span></a>
        <nav class="nav-links">
          <a href="/index.html" class="${active === 'home' ? 'active' : ''}">Home</a>
          <a href="/health-awareness.html" class="${active === 'awareness' ? 'active' : ''}">Awareness</a>
          ${logged ? `<a href="${admin ? '/admin.html' : '/profile.html'}" class="btn btn-sm btn-primary">${admin ? 'Admin Panel' : 'My Profile'}</a>` : ''}
          ${!logged ? `<a href="/login.html" class="btn btn-sm btn-outline">Login</a><a href="/register.html" class="btn btn-sm btn-primary">Register</a>` : ''}
          <button type="button" id="theme-toggle-nav" class="btn btn-sm theme-toggle-btn" style="border:1px solid var(--border-color); background:transparent; padding:0.4rem 0.6rem;">Dark</button>
        </nav>
      </div>`;
  } else {
    // If it's a dashboard/app page, we might want a simple top-bar with a menu toggle for mobile
    el.innerHTML = `
      <div class="nav-inner" style="max-width:100%;">
        <div style="display:flex; align-items:center; gap:1rem;">
          <button id="sidebar-toggle" class="btn btn-sm btn-secondary" style="display:none; padding:0.4rem 0.6rem;">&#9776;</button>
          <a class="brand" href="/index.html" style="font-size:1.25rem;">HealthBot <span>AI</span></a>
        </div>
        <div style="display:flex; align-items:center; gap:1rem;">
          <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">${name ? name.split(' ')[0] : 'User'}</span>
          <a href="/profile.html" class="btn btn-sm btn-secondary" title="My Profile" style="padding:0.4rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </a>
          <a href="#" id="nav-logout" class="btn btn-sm btn-outline" style="font-size:0.75rem; padding:0.3rem 0.75rem;">Logout</a>
        </div>
      </div>`;
  }

  // Handle logout
  const lo = document.getElementById('nav-logout');
  if (lo) lo.addEventListener('click', (e) => { e.preventDefault(); hgLogout(); });

  // Handle theme
  const themeBtn = document.getElementById('theme-toggle-nav');
  if (themeBtn && typeof hgToggleTheme === 'function') {
    themeBtn.addEventListener('click', () => hgToggleTheme());
    if (typeof hgLoadSavedTheme === 'function') hgLoadSavedTheme();
  }

  // Handle sidebar for dashboard pages
  if (isAltLayout) {
    hgRenderSidebar(active, admin);
  }
}

function hgRenderSidebar(active, isAdmin) {
  const body = document.body;
  if (!document.getElementById('sidebar-container')) {
    const mainWrap = document.createElement('div');
    mainWrap.className = 'app-layout';
    mainWrap.id = 'app-layout-wrap';
    
    // Create sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'sidebar-container';

    // Move current body children (except for header/footer) into a main container
    const children = Array.from(body.children).filter(c => c.tagName !== 'HEADER' && c.tagName !== 'FOOTER' && c.tagName !== 'SCRIPT' && !c.classList.contains('emergency-banner'));
    const main = document.createElement('main');
    main.className = 'main-content';
    children.forEach(c => main.appendChild(c));

    body.appendChild(mainWrap);
    mainWrap.appendChild(sidebar);
    mainWrap.appendChild(main);
  }

  const sidebar = document.getElementById('sidebar-container');
  sidebar.innerHTML = `
    <div class="sidebar-logo">HealthBot <span>AI</span></div>
    <nav class="sidebar-nav">
      ${!isAdmin ? `
        <a href="/dashboard.html" class="sidebar-link ${active === 'dashboard' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </a>
        <a href="/profile.html" class="sidebar-link ${active === 'profile' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          My Profile
        </a>
        <a href="/chatbot.html" class="sidebar-link ${active === 'chat' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          AI Chatbot
        </a>
        <a href="/symptom-checker.html" class="sidebar-link ${active === 'symptom' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M12 9l-3 3 3 3 3-3-3-3z"></path></svg>
          Symptom Assessment
        </a>
        <a href="/mental-health-checkup.html" class="sidebar-link ${active === 'mh-checkup' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          Mental Health Checkup
        </a>
      ` : `
        <a href="/admin.html#overview" class="sidebar-link ${active === 'admin' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Dashboard
        </a>
        <a href="/admin.html#users" class="sidebar-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Manage Users
        </a>
        <a href="/admin.html#diseases" class="sidebar-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M12 9l-3 3 3 3 3-3-3-3z"></path></svg>
          Manage Diseases
        </a>
        <a href="/admin.html#alerts" class="sidebar-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Manage Health Alerts
        </a>
      `}
      <a href="/health-awareness.html" class="sidebar-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        Disease Library
      </a>
    </nav>
    <div style="padding-top:2rem; border-top:1px solid var(--border-color);">
       <button id="theme-toggle-side" class="sidebar-link theme-toggle-btn" style="width:100%; background:none; border:none; cursor:pointer;">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
         Switch Theme
       </button>
       <a href="#" id="nav-logout-side" class="sidebar-link" style="color:var(--color-danger)">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
         Logout
       </a>
    </div>`;

  const lo = document.getElementById('nav-logout-side');
  if (lo) lo.addEventListener('click', (e) => { e.preventDefault(); hgLogout(); });
  
  const th = document.getElementById('theme-toggle-side');
  if (th && typeof hgToggleTheme === 'function') {
    th.addEventListener('click', () => hgToggleTheme());
    if (typeof hgLoadSavedTheme === 'function') hgLoadSavedTheme();
  }
}
