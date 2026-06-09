// API client for the NearTap Go backend
// Base URL defaults to Go server on :8080 during development

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data;
}

// ── Tap endpoints ─────────────────────────────────────────────────────────────

/**
 * Fetch all taps, optionally filtered by proximity.
 * @param {{ lat?: number, lng?: number, radius?: number }} opts
 */
export async function fetchTaps({ lat, lng, radius = 10 } = {}) {
  const params = new URLSearchParams();
  if (lat != null) params.set('lat', lat);
  if (lng != null) params.set('lng', lng);
  if (radius != null) params.set('radius', radius);
  const qs = params.toString();
  return request(`/api/taps${qs ? `?${qs}` : ''}`);
}

/**
 * Fetch taps within a radius of the given coordinates.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius km, default 10
 */
export async function fetchNearby(lat, lng, radius = 10) {
  return request(`/api/taps/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
}

/**
 * Fetch a single tap by ID.
 * @param {string} id
 */
export async function fetchTap(id) {
  return request(`/api/taps/${id}`);
}

/**
 * Create a new tap (requires idToken from Firebase Auth).
 * @param {object} tapData CreateTapRequest fields
 * @param {string} idToken Firebase ID token
 */
export async function createTap(tapData, idToken) {
  return request('/api/taps', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(tapData),
  });
}

/**
 * Confirm a tap works (requires auth).
 * @param {string} id
 * @param {string} idToken
 */
export async function confirmTap(id, idToken) {
  return request(`/api/taps/${id}/confirm`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

/**
 * Report an issue with a tap (requires auth).
 * @param {string} id
 * @param {string} issue
 * @param {string} idToken
 */
export async function reportIssue(id, issue, idToken) {
  return request(`/api/taps/${id}/report`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ issue }),
  });
}

/**
 * Health check — pings the Go server
 */
export async function healthCheck() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}

/**
 * Update a tap (requires auth).
 * @param {string} id
 * @param {object} tapData
 * @param {string} idToken
 */
export async function updateTap(id, tapData, idToken) {
  return request(`/api/taps/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(tapData),
  });
}

/**
 * Delete a tap (requires auth).
 * @param {string} id
 * @param {string} idToken
 */
export async function deleteTap(id, idToken) {
  return request(`/api/taps/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

/**
 * Resolve all reported issues on a tap (requires auth).
 * @param {string} id
 * @param {string} idToken
 */
export async function resolveIssues(id, idToken) {
  return request(`/api/taps/${id}/resolve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
}
