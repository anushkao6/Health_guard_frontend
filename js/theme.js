/**
 * HealthGuard AI — Theme System
 * Two themes: light (default) | dark
 * Persists via localStorage key "hg_theme"
 */
(function () {
  const THEME_KEY = 'hg_theme';
  const THEMES = ['light', 'dark'];
  const LABELS = { light: 'Dark', dark: 'Light' };

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem(THEME_KEY, theme);
    _updateButtons(theme);
  }

  function loadSavedTheme() {
    let saved = localStorage.getItem(THEME_KEY) || 'light';
    // Migrate old night theme to dark
    if (saved === 'night') saved = 'dark';
    applyTheme(saved);
  }

  function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  function _updateButtons(theme) {
    const label = LABELS[theme] || 'Dark';
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = label;
      btn.title = 'Switch to ' + label + ' mode';
      btn.setAttribute('aria-label', 'Switch to ' + label + ' mode');
    });
  }

  window.hgLoadSavedTheme = loadSavedTheme;
  window.hgToggleTheme = toggleTheme;
  window.hgApplyTheme = applyTheme;

  loadSavedTheme();
})();
