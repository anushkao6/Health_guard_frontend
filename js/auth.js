const HG_TOKEN = 'hg_token';
const HG_ROLE = 'hg_role';
const HG_NAME = 'hg_name';
const HG_EMAIL = 'hg_email';

function hgGetToken() {
  return localStorage.getItem(HG_TOKEN);
}

function hgSetSession(data) {
  if (!data || !data.token) return;
  localStorage.setItem(HG_TOKEN, data.token);
  localStorage.setItem(HG_ROLE, data.role || 'USER');
  localStorage.setItem(HG_NAME, data.fullName || '');
  localStorage.setItem(HG_EMAIL, data.email || '');
}

function hgLogin(token, fullName, role) {
  if (!token) return;
  localStorage.setItem(HG_TOKEN, token);
  localStorage.setItem(HG_ROLE, role || 'USER');
  localStorage.setItem(HG_NAME, fullName || '');
}

function hgClearSession() {
  localStorage.removeItem(HG_TOKEN);
  localStorage.removeItem(HG_ROLE);
  localStorage.removeItem(HG_NAME);
  localStorage.removeItem(HG_EMAIL);
}

function hgIsLoggedIn() {
  return !!hgGetToken();
}

function hgIsAdmin() {
  return localStorage.getItem(HG_ROLE) === 'ADMIN';
}

function hgRequireAuth(redirectUrl) {
  if (!hgIsLoggedIn()) {
    const next = redirectUrl || window.location.pathname + window.location.search;
    window.location.href = `/login.html?next=${encodeURIComponent(next)}`;
    return false;
  }
  return true;
}

function hgLogout() {
  hgClearSession();
  window.location.href = '/index.html';
}
