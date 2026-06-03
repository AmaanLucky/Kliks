const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseJsonWithAuthCheck = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && data && data.error && data.error.toLowerCase().includes('password changed')) {
    try { window.dispatchEvent(new CustomEvent('auth:password-changed', { detail: data.error })); } catch (e) {}
  }
  return data;
};

export const getImages = (page = 1) =>
  fetch(`${BASE}/api/images?page=${page}`).then(parseJsonWithAuthCheck);

export const login = (username, password) =>
  fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(parseJsonWithAuthCheck);

export const uploadImage = (formData, token) =>
  fetch(`${BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(parseJsonWithAuthCheck);

export const deleteImage = (id, token) =>
  fetch(`${BASE}/api/images/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(parseJsonWithAuthCheck);

export const forgotPassword = () =>
  fetch(`${BASE}/api/auth/forgot-password`, { method: 'POST' }).then(parseJsonWithAuthCheck);

export const verifyOtp = (otp) =>
  fetch(`${BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp }),
  }).then(parseJsonWithAuthCheck);

export const resetPassword = (resetToken, newPassword) =>
  fetch(`${BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword }),
  }).then(parseJsonWithAuthCheck);

export const logout = (token) =>
  fetch(`${BASE}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({}),
    keepalive: true,
  }).then(parseJsonWithAuthCheck).catch(() => ({ error: 'logout-failed' }));
