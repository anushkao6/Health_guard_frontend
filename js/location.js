/**
 * Browser geolocation + server reverse geocode (Nominatim via /api/geocode/reverse).
 */
function hgGetCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err || new Error("Location denied")),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 120000 }
    );
  });
}

async function hgReverseGeocode(lat, lon) {
  const q = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  return hgFetch("/geocode/reverse?" + q.toString(), { method: "GET" });
}

/** Returns { label, displayName } from backend. */
async function hgDetectLocationLabel() {
  const c = await hgGetCoords();
  return hgReverseGeocode(c.lat, c.lon);
}
