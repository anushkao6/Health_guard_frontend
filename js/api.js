async function hgFetch(path, options = {}) {
  const url = `${window.HG_API_BASE}${path}`;
  const headers = { ...(options.headers || {}) };
  const token = localStorage.getItem('hg_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}
