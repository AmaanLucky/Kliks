import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, LogOut, LogIn, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { login, uploadImage, deleteImage, getImages, forgotPassword, verifyOtp, resetPassword } from '../api/images';

const TOKEN_KEY = 'kliks_admin_token';

const AdminPage = ({ darkMode }) => {
  const [token, setToken]                 = useState(() => localStorage.getItem(TOKEN_KEY));
  const [password, setPassword]           = useState('');
  const [loginError, setLoginError]       = useState('');
  const [loginLoading, setLoginLoading]   = useState(false);
  const [loginToast, setLoginToast]       = useState('');

  const [forgotMsg, setForgotMsg]         = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpSent, setOtpSent]             = useState(false);
  const [otp, setOtp]                     = useState('');
  const [otpLoading, setOtpLoading]       = useState(false);

  const [resetToken, setResetToken]       = useState('');
  const [resetStep, setResetStep]         = useState('otp'); // 'otp' | 'reset'
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading]   = useState(false);

  const [title, setTitle]         = useState('');
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  const [images, setImages]             = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deletingId, setDeletingId]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, title, src }

  const bg    = darkMode ? 'bg-yellow-900' : 'bg-white';
  const text  = darkMode ? 'text-black' : 'text-gray-900';
  const sub   = darkMode ? 'text-gray-300' : 'text-gray-600';
  const card  = darkMode ? 'bg-yellow-900 border-black border-[0.2vw]' : 'bg-white border-black border-[0.2vw]';
  const input = darkMode
    ? 'bg-yellow-900 border-black border-[0.2vw] text-black placeholder-black font-semibold placeholder:font-semibold focus:border-black focus:border-[0.3vw]'
    : 'bg-white border-black text-gray-900 placeholder-black focus:border-black focus:border-[0.2vw]';

  useEffect(() => {
    if (token) fetchImages();
  }, [token]);

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const data = await getImages(1);
      setImages(data.images || []);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const data = await login('admin', password);
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Server error. Is the backend running?');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotMsg(null);
    setForgotLoading(true);
    try {
      const data = await forgotPassword();
      if (data.error) {
        setForgotMsg({ type: 'error', text: data.error });
      } else {
        setOtpSent(true);
        setForgotMsg({ type: 'success', text: 'OTP sent to your registered email.' });
      }
    } catch {
      setForgotMsg({ type: 'error', text: 'Failed to send OTP. Is the server running?' });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setForgotMsg(null);
    setOtpLoading(true);
    try {
      const data = await verifyOtp(otp);
      if (data.error) {
        setForgotMsg({ type: 'error', text: data.error });
      } else {
        setResetToken(data.resetToken);
        setResetStep('reset');
        setForgotMsg(null);
      }
    } catch {
      setForgotMsg({ type: 'error', text: 'Verification failed. Try again.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword)
      return setForgotMsg({ type: 'error', text: 'Passwords do not match.' });
    if (newPassword.length < 6)
      return setForgotMsg({ type: 'error', text: 'Password must be at least 6 characters.' });

    setResetLoading(true);
    setForgotMsg(null);
    try {
      const data = await resetPassword(resetToken, newPassword);
      if (data.error) {
        setForgotMsg({ type: 'error', text: data.error });
      } else {
        setOtpSent(false);
        setOtp('');
        setResetToken('');
        setResetStep('otp');
        setNewPassword('');
        setConfirmPassword('');
        setForgotMsg(null);
        setLoginToast('Password updated successfully. Please login with your new password.');
      }
    } catch {
      setForgotMsg({ type: 'error', text: 'Reset failed. Try again.' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setImages([]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setUploadMsg({ type: 'error', text: 'Please select an image file.' });
    if (!title.trim()) return setUploadMsg({ type: 'error', text: 'Title is required.' });

    setUploading(true);
    setUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title.trim());

      const data = await uploadImage(formData, token);
      if (data.error) {
        if (data.error.includes('token')) { handleLogout(); return; }
        setUploadMsg({ type: 'error', text: data.error });
      } else {
        setUploadMsg({ type: 'success', text: `"${data.title}" uploaded successfully!` });
        setTitle('');
        setFile(null);
        e.target.reset();
        setImages(prev => [data, ...prev]);
      }
    } catch {
      setUploadMsg({ type: 'error', text: 'Upload failed. Check your connection.' });
    } finally {
      setUploading(false);
    }
  };

  // Opens the confirm modal instead of window.confirm
  const handleDelete = (id, title, src) => {
    setConfirmDelete({ id, title, src });
  };

  // Called when user clicks "Delete" inside the modal
  const confirmDeleteAction = async () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    setDeletingId(id);
    try {
      const data = await deleteImage(id, token);
      if (!data.error) {
        setImages(prev => prev.filter(img => img.id !== id));
      }
    } catch {
      // silent — image stays in list if request fails
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Login screen ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg} transition-colors duration-500`}>
        <div className={`w-full max-w-sm mx-4 border rounded-2xl p-8 shadow-2xl ${card}`}>
          <div className="flex flex-col items-center gap-2 mb-8">
            <Camera className={`h-10 w-10 ${text}`} />
            <h1 className={`text-2xl font-bold ${text}`}>Welcome Boss</h1>
            <p className={`text-sm ${sub}`}>Enter your password to continue</p>
          </div>

          {loginToast && (
            <p className="text-green-600 text-xs text-center flex items-center justify-center gap-1 mb-4 px-2">
              <CheckCircle className="h-3 w-3 flex-shrink-0" /> {loginToast}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${input}`}
            />
            {loginError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {loginLoading
                ? <><Loader className="h-4 w-4 animate-spin" /> Logging in…</>
                : <><LogIn className="h-4 w-4" /> Login</>
              }
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className={`text-sm underline underline-offset-2 transition-opacity disabled:opacity-50 ${sub}`}
              >
                {forgotLoading ? 'Sending OTP…' : 'Forgot Password?'}
              </button>
              {forgotMsg && !otpSent && (
                <p className={`text-xs mt-2 flex items-center justify-center gap-1 ${
                  forgotMsg.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {forgotMsg.type === 'success'
                    ? <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    : <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  }
                  {forgotMsg.text}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* ─── OTP / Reset Password Modal ──────────────────────────────────── */}
        {otpSent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <div className={`w-full max-w-xs rounded-2xl border shadow-2xl p-8 ${card}`}>

              {resetStep === 'otp' ? (
                <>
                  <div className="flex flex-col items-center gap-1 mb-6">
                    <Camera className={`h-8 w-8 ${text}`} />
                    <h2 className={`text-lg font-bold ${text}`}>Enter OTP</h2>
                    <p className={`text-xs text-center ${sub}`}>A 6-digit code was sent to your email. Expires in 10 minutes.</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="— — — — — —"
                      maxLength={6}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                      className={`w-full px-4 py-3 rounded-lg border text-lg outline-none transition-colors text-center tracking-[0.5em] font-bold ${input}`}
                    />
                    {forgotMsg && (
                      <p className={`text-xs flex items-center justify-center gap-1 ${forgotMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {forgotMsg.type === 'success' ? <CheckCircle className="h-3 w-3 flex-shrink-0" /> : <AlertCircle className="h-3 w-3 flex-shrink-0" />}
                        {forgotMsg.text}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otp.length !== 6}
                      className="w-full py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                      {otpLoading ? <><Loader className="h-4 w-4 animate-spin inline mr-1" />Verifying…</> : 'Verify OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(''); setForgotMsg(null); setResetStep('otp'); }}
                      className={`w-full text-xs py-1 underline underline-offset-2 ${sub}`}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-1 mb-6">
                    <Camera className={`h-8 w-8 ${text}`} />
                    <h2 className={`text-lg font-bold ${text}`}>Reset Password</h2>
                    <p className={`text-xs text-center ${sub}`}>OTP verified. Set your new password.</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      autoFocus
                      className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${input}`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${input}`}
                    />
                    {forgotMsg && (
                      <p className={`text-xs flex items-center justify-center gap-1 ${forgotMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {forgotMsg.type === 'success' ? <CheckCircle className="h-3 w-3 flex-shrink-0" /> : <AlertCircle className="h-3 w-3 flex-shrink-0" />}
                        {forgotMsg.text}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={resetLoading || !newPassword || !confirmPassword}
                      className="w-full py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
                    >
                      {resetLoading ? <><Loader className="h-4 w-4 animate-spin inline mr-1" />Saving…</> : 'Save New Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setResetStep('otp'); setOtp(''); setNewPassword(''); setConfirmPassword(''); setForgotMsg(null); }}
                      className={`w-full text-xs py-1 underline underline-offset-2 ${sub}`}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Admin dashboard ─────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-500 pt-24 pb-20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Camera className={`h-7 w-7 ${text}`} />
            <h1 className={`text-2xl font-bold ${text}`}>Kliks Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg border transition-colors ${
              darkMode
                ? 'border-black border-[0.2vw] font-black hover:bg-yellow-800'
                : 'border-black border-[0.2vw] text-black hover:bg-black hover:text-white'
            }`}
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Upload form */}
        <div className={`border rounded-2xl p-6 mb-10 ${card}`}>
          <h2 className={`text-lg font-semibold mb-4 ${text}`}>Upload New Photo</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              placeholder="Photo title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${input}`}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              required
              className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer ${sub}`}
            />
            <div className="flex items-center justify-between gap-4">
              {uploadMsg ? (
                <p className={`text-sm flex items-center gap-1 ${
                  uploadMsg.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {uploadMsg.type === 'success'
                    ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    : <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  }
                  {uploadMsg.text}
                </p>
              ) : <span />}
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 whitespace-nowrap"
              >
                {uploading
                  ? <><Loader className="h-4 w-4 animate-spin" /> Uploading…</>
                  : <><Upload className="h-4 w-4" /> Upload</>
                }
              </button>
            </div>
          </form>
        </div>

        {/* Image list */}
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${text}`}>
            All Photos {images.length > 0 && <span className={`text-sm font-normal ${sub}`}>({images.length})</span>}
          </h2>

          {loadingImages ? (
            <div className={`text-center py-12 ${sub}`}>
              <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading images…
            </div>
          ) : images.length === 0 ? (
            <p className={`text-center py-12 ${sub}`}>No photos yet. Upload one above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className={`group relative rounded-xl overflow-hidden border ${card}`}>
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-white text-xs font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                      {img.title}
                    </p>
                    <button
                      onClick={() => handleDelete(img.id, img.title, img.src)}
                      disabled={deletingId === img.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 disabled:opacity-60"
                    >
                      {deletingId === img.id
                        ? <Loader className="h-3 w-3 animate-spin" />
                        : <Trash2 className="h-3 w-3" />
                      }
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ─── Delete confirm modal ─────────────────────────────────────────────── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className={`relative w-full max-w-sm rounded-2xl border-[0.2vw] border-black shadow-2xl overflow-hidden ${
              darkMode ? 'bg-yellow-900' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            {/* <button
              onClick={() => setConfirmDelete(null)}
              className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
                darkMode ? 'hover:bg-yellow-800 text-black' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="h-4 w-4" />
            </button> */}

            {/* Image preview */}
            {/* <div className="w-full h-44 overflow-hidden">
              <img
                src={confirmDelete.src}
                alt={confirmDelete.title}
                className="w-full h-full object-cover"
              />
            </div> */}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-2">
                <div className="mt-0.5 p-2 rounded-full bg-red-100 flex-shrink-0">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${text}`}>Delete Photo?</h3>
                  <p className={`text-sm mt-1 ${sub}`}>
                    This will permanently remove
                  </p>
                  <p className={`text-sm font-semibold mt-0.5 ${text}`}>
                    "{confirmDelete.title}"
                  </p>
                  <p className={`text-xs mt-1 ${sub}`}>This action cannot be undone.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className={`flex-1 py-2.5 rounded-xl border-[0.2vw] border-black font-semibold text-sm transition-colors ${
                    darkMode
                      ? 'text-black hover:bg-yellow-800'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAction}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
