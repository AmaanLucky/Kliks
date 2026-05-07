const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImages = (page = 1) =>
  fetch(`${BASE}/api/images?page=${page}`).then(r => r.json());

export const login = (username, password) =>
  fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

export const uploadImage = (formData, token) =>
  fetch(`${BASE}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(r => r.json());

export const deleteImage = (id, token) =>
  fetch(`${BASE}/api/images/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json());

export const forgotPassword = () =>
  fetch(`${BASE}/api/auth/forgot-password`, { method: 'POST' }).then(r => r.json());

export const verifyOtp = (otp) =>
  fetch(`${BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp }),
  }).then(r => r.json());

export const resetPassword = (resetToken, newPassword) =>
  fetch(`${BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword }),
  }).then(r => r.json());
