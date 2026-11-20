import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { firebaseProjectId } from '../firebaseConfig';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    switchDemoProfile,
    authBusy,
    verifyStudentDomain
  } = useAuth();
  const { hubs, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [hostelHub, setHostelHub] = useState(hubs[0]?.name || 'Main Campus Gate Dock');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isLoginModalOpen) return null;

  const isInstitutionalEmail = verifyStudentDomain(email);
  const currentHost =
    typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : '';

  const clearAlerts = () => {
    setErrorMsg(null);
    setErrorCode(null);
    setInfoMsg(null);
  };

  const handleCopyHostname = () => {
    if (!currentHost || typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(currentHost).then(() => {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (mode === 'signin') {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        showToast(
          res.needsEmailVerification
            ? `Signed in as ${email.trim()}. Please check your inbox to verify your email.`
            : `Welcome back, ${email.trim()}!`
        );
      } else {
        setErrorMsg(res.error || 'Could not sign in.');
        setErrorCode(res.code || null);
      }
    } else {
      const res = await registerWithEmail(email, password, displayName, hostelHub);
      if (res.success) {
        showToast(
          `Account created for ${email.trim()}! Verification link sent to your email ID.`
        );
      } else {
        setErrorMsg(res.error || 'Could not create account.');
        setErrorCode(res.code || null);
      }
    }
  };

  const handleGoogleLogin = async () => {
    clearAlerts();
    const res = await loginWithGoogle();
    if (res.success) {
      showToast('Signed in successfully with Google!');
    } else {
      setErrorMsg(res.error || 'Google Sign-In failed.');
      setErrorCode(res.code || null);
    }
  };

  const handleForgotPassword = async () => {
    clearAlerts();
    const res = await sendPasswordReset(email);
    if (res.success) {
      setInfoMsg(`Password reset link sent to ${email.trim()}. Check your inbox.`);
    } else {
      setErrorMsg(res.error || 'Could not send reset email.');
      setErrorCode(res.code || null);
    }
  };

  const handleDemoPreview = () => {
    switchDemoProfile('verified-dgu');
    closeLoginModal();
    showToast('Exploring in Demo Preview mode. Sign in anytime to sync with cloud.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {mode === 'signin' ? 'Sign In to GearLoop' : 'Create GearLoop Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Use Google or your personal / @dgu.ac.in email ID
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLoginModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Google Sign-In Button (Primary) */}
          <button
            type="button"
            disabled={authBusy}
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-bold text-sm rounded-xl transition flex items-center justify-center gap-3 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Continue with Google (Any Email ID)</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Or with email &amp; password
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                clearAlerts();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearAlerts();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error / Info Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>

              {errorCode === 'auth/unauthorized-domain' && firebaseProjectId && (
                <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center gap-2">
                  {currentHost && (
                    <button
                      type="button"
                      onClick={handleCopyHostname}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-[11px] font-mono text-rose-100 flex items-center gap-1.5"
                    >
                      {copiedDomain ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedDomain ? 'Copied' : currentHost}</span>
                    </button>
                  )}
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 font-semibold text-[11px] inline-flex items-center gap-1"
                  >
                    <span>Add Domain in Firebase Auth</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {errorCode === 'auth/operation-not-allowed' && firebaseProjectId && (
                <div className="pt-2 border-t border-rose-500/20">
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 font-semibold text-[11px] inline-flex items-center gap-1"
                  >
                    <span>Enable Email/Password in Firebase</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {infoMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{infoMsg}</span>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Saurabh Patel"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 font-semibold">Email ID *</label>
                {email.includes('@') && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isInstitutionalEmail
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {isInstitutionalEmail ? '✓ DGU Institutional Email' : 'Personal Email ID'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com or name@dgu.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 font-semibold">Password *</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-emerald-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Primary Campus / PG Hub</span>
                </label>
                <select
                  value={hostelHub}
                  onChange={(e) => setHostelHub(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {hubs.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={authBusy}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {authBusy ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Login with Email ID' : 'Register & Verify Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Supports both personal Gmail IDs and <strong className="text-slate-200">@dgu.ac.in</strong> institutional student emails for instant verification badges.
            </span>
          </div>

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleDemoPreview}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-4 transition"
            >
              Or preview with a demo campus account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
