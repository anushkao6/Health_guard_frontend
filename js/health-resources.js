/**
 * HealthBot AI — Nearby Health Resources
 * Static category-based resource discovery with dynamic location-based mapping.
 */

const _resourcesDB = {
  panvel: [
    { type: 'hospital', name: 'District Government Hospital', address: 'Nearest district hospital', distance: '~2–5 km', q: 'District+Government+Hospital+Panvel' },
    { type: 'pharmacy', name: 'Pharmacy', address: 'Generic medicines at low cost', distance: 'Varies', q: 'Pharmacy+Panvel' },
    { type: 'vaccination', name: 'Govt. Vaccination Drive', address: 'Local dispensary / civic centre', distance: 'Varies', q: 'Vaccination+Centre+Panvel' },
    { type: 'bloodbank', name: 'Nearest Blood Bank', address: 'Govt. hospital blood bank', distance: '~5 km', q: 'Blood+Bank+Panvel' },
  ],
  default: [
    { type: 'hospital', name: 'District Government Hospital', address: 'Nearest local hospital', distance: '~2–5 km', q: 'Government+Hospital+near+me' },
    { type: 'pharmacy', name: 'Pharmacy', address: 'Generic medicines at low cost', distance: 'Varies', q: 'Pharmacy+near+me' },
    { type: 'vaccination', name: 'Govt. Vaccination Drive', address: 'Local dispensary / civic centre', distance: 'Varies', q: 'Vaccination+centre+near+me' },
    { type: 'bloodbank', name: 'Nearest Blood Bank', address: 'Govt. hospital blood bank', distance: '~5 km', q: 'Blood+Bank+near+me' },
  ]
};

const _icons = {
  hospital: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  pharmacy: '<path d="M3 3h18v18H3z"/><path d="M12 8v8M8 12h8"/>',
  vaccination: '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
  bloodbank: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
};

const _colors = {
  hospital: '#0D9488',
  pharmacy: '#16A34A',
  vaccination: '#2563EB',
  bloodbank: '#DC2626'
};

function fetchNearbyHealthResources(city) {
  if (!city) return _resourcesDB.default;
  const lower = city.toLowerCase();
  for (const [key, resources] of Object.entries(_resourcesDB)) {
    if (lower.includes(key)) return resources;
  }
  return _resourcesDB.default;
}

function renderNearbyHealthResources(city, containerId, coords = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const resources = fetchNearbyHealthResources(city);

  // Build maps query suffix
  let mapsSuffix = '';
  if (coords && coords.lat && coords.lon) {
    mapsSuffix = `/@${coords.lat},${coords.lon},14z`;
  }

  container.innerHTML = `
    <div class="nearby-grid">
      ${resources.map(r => {
    // Dynamic search query based on coords if available
    const query = coords ? `${r.type}+near+me` : r.q;
    const mapsUrl = `https://www.google.com/maps/search/${query}${mapsSuffix}`;

    return `
          <div class="support-card">
            <div class="support-icon-wrap" style="background: ${_colors[r.type]}15; color: ${_colors[r.type]}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${_icons[r.type] || ''}
              </svg>
            </div>
            <div class="support-content">
              <span class="support-type">${r.type.toUpperCase()}</span>
              <h4 class="support-title">${r.name}</h4>
              <p class="support-desc">${r.address}</p>
              <p class="support-distance">Approx. ${r.distance}</p>
            </div>
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm mt-1" style="width: 100%;">
              View on Maps <span style="font-size: 1.1rem; line-height: 1;">&#8599;</span>
            </a>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

window.fetchNearbyHealthResources = fetchNearbyHealthResources;
window.renderNearbyHealthResources = renderNearbyHealthResources;


