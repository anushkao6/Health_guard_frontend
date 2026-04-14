/**
 * HealthBot AI — AQI & Location-Based Health Alerts
 * Mock AQI data by city. In production, connect to a real-time environmental API.
 */
const _aqiDB = {
  panvel: { aqi: 102, city: 'Panvel, Maharashtra' },
  delhi: { aqi: 185, city: 'Delhi NCR' },
  mumbai: { aqi: 72, city: 'Mumbai' },
  bangalore: { aqi: 55, city: 'Bengaluru' },
  chennai: { aqi: 68, city: 'Chennai' },
  pune: { aqi: 95, city: 'Pune' },
  kolkata: { aqi: 142, city: 'Kolkata' },
  hyderabad: { aqi: 88, city: 'Hyderabad' },
};

function getAQIForLocation(city) {
  if (!city) return { aqi: 85, city: 'Your Area' };
  const lower = city.toLowerCase();
  for (const [key, data] of Object.entries(_aqiDB)) {
    if (lower.includes(key)) return { ...data };
  }
  // Deterministic mock AQI based on city name hash
  const hash = [...city].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return { aqi: 40 + (hash % 160), city };
}

function getAQICategory(value) {
  if (value <= 50)  return { label: 'Good', color: '#10B981', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (value <= 100) return { label: 'Moderate', color: '#F59E0B', advice: 'Air quality is acceptable. However, there may be a risk for some people.' };
  if (value <= 150) return { label: 'Poor', color: '#EA580C', advice: 'People with respiratory issues should limit outdoor activity. Use a mask.' };
  if (value <= 200) return { label: 'Unhealthy', color: '#EF4444', advice: 'Everyone may begin to experience health effects. Avoid prolonged outdoor exertion.' };
  if (value <= 300) return { label: 'Very Unhealthy', color: '#7C3AED', advice: 'Health warnings of emergency conditions. The entire population is likely to be affected.' };
  return { label: 'Hazardous', color: '#7F1D1D', advice: 'Health alert: everyone may experience more serious health effects.' };
}

function getSeasonalAlerts(city, month) {
  const alerts = [];
  const isSummer = month >= 3 && month <= 6;
  const isMonsoon = month >= 7 && month <= 9;
  const isWinter = month >= 10 || month <= 2;

  if (isSummer) {
    alerts.push({ title: 'Heat Stroke Risk', desc: 'Stay hydrated. Avoid direct sun between 11am and 4pm. Watch for heat exhaustion signs.', type: 'heat' });
    alerts.push({ title: 'Waterborne Disease Season', desc: 'Typhoid and gastroenteritis risk is high in summer. Drink safe, treated water only.', type: 'waterborne' });
  } else if (isMonsoon) {
    alerts.push({ title: 'Dengue & Malaria', desc: 'Prevent mosquito breeding in stagnant water. Use nets and repellents.', type: 'mosquito' });
  } else if (isWinter) {
    alerts.push({ title: 'Respiratory Infections', desc: 'Cold weather increases flu risk. Maintain hygiene and stay warm.', type: 'winter' });
  }
  return alerts;
}

function renderLocationHealthAlert(containerId, city, aqiData, seasonalAlerts) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cat = getAQICategory(aqiData.aqi);
  const percentage = Math.min((aqiData.aqi / 300) * 100, 100);
  const date = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="aqi-container">
      <div class="aqi-header">
        <div class="aqi-location">
          <h2>${aqiData.city || city}</h2>
          <p>Air Quality Index &middot; ${date}</p>
        </div>
        <div class="aqi-score-card">
          <div class="aqi-value" style="color: ${cat.color}">${aqiData.aqi}</div>
          <div class="aqi-label" style="color: ${cat.color}">${cat.label}</div>
          <div class="aqi-small" style="color: ${cat.color}">AQI</div>
        </div>
      </div>

      <div class="aqi-bar-container">
        <div class="aqi-progress-bar">
          <div class="aqi-indicator" style="left: ${percentage}%; border-color: ${cat.color}"></div>
        </div>
        <div class="aqi-segments">
          <span>Good</span>
          <span>Moderate</span>
          <span>Poor</span>
          <span>Severe</span>
          <span>Hazardous</span>
        </div>
      </div>

      <div class="aqi-advice-box" style="border-left-color: ${cat.color}">
        <strong>Air Quality Advice:</strong>
        <p>${cat.advice}</p>
      </div>

      <div class="seasonal-alerts-heading mb-1">
        <span style="font-weight: 700; color: var(--text-secondary); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em;">Seasonal Health Alerts</span>
      </div>

      <div class="seasonal-alerts-grid">
        ${seasonalAlerts.map(a => `
          <div class="seasonal-card ${a.type === 'waterborne' ? 'waterborne' : ''}">
            <h4>${a.title}</h4>
            <p>${a.desc}</p>
          </div>
        `).join('')}
      </div>

      <p style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">
        AQI data is indicative. Refer to local health authority advisories for official guidance.
      </p>
    </div>
  `;
}

window.getAQIForLocation = getAQIForLocation;
window.getAQICategory = getAQICategory;
window.getSeasonalAlerts = getSeasonalAlerts;
window.renderLocationHealthAlert = renderLocationHealthAlert;
