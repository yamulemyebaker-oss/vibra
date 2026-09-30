/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Moon, 
  Sun,
  X,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateTab }) => {
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useNotification();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Light/Dark Theme toggle state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'done'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCodeHint, setGeneratedCodeHint] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both your email/username and password.');
      return;
    }

    setIsLoading(true);

    // Simulate real auth network latency
    setTimeout(() => {
      const result = login(identifier, password, rememberMe);
      setIsLoading(false);

      if (result.success && result.user) {
        showToast(`Welcome back, ${result.user.name}!`, 'success');
        onSuccess();
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        if (result.lockoutSeconds) {
          setLockoutTimer(result.lockoutSeconds);
          const interval = setInterval(() => {
            setLockoutTimer((prev) => {
              if (!prev || prev <= 1) {
                clearInterval(interval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const ok = loginWithGoogle();
      setIsLoading(false);
      if (ok) {
        showToast('Signed in via Google School SSO!', 'success');
        onSuccess();
      }
    }, 500);
  };

  const handleQuickFill = (emailVal: string, passVal: string) => {
    setIdentifier(emailVal);
    setPassword(passVal);
    setErrorMessage(null);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    const res = authService.requestPasswordReset(resetEmail);
    if (res.success && res.code) {
      setGeneratedCodeHint(res.code);
      setResetStep('verify');
      showToast('Password reset verification code generated.', 'info');
    } else {
      showToast(res.error || 'Unable to find an account with that email.', 'error');
    }
  };

  const handleConfirmResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword) return;

    const res = authService.confirmPasswordReset(resetEmail, resetCode, newPassword);
    if (res.success) {
      setResetStep('done');
      showToast('Password updated! You can now sign in with your new password.', 'success');
    } else {
      showToast(res.error || 'Verification code mismatch.', 'error');
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 transition-colors ${isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* Theme Switcher Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-20 right-6 p-2 rounded-xl bg-neutral-900/60 dark:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all shadow-lg cursor-pointer"
        title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
      </button>

      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className={`rounded-3xl p-8 border shadow-2xl transition-all ${
          isDarkMode 
            ? 'bg-neutral-900/80 border-neutral-800 shadow-black/60 backdrop-blur-xl' 
            : 'bg-white border-neutral-200 shadow-neutral-200/80'
        }`}>
          
          {/* Logo & Brand Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-2 ring-white/20 mb-3 group hover:scale-105 transition-transform">
              <span className="font-black text-white text-2xl tracking-tighter">V</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Sign in to Vibra
            </h1>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              St. Jude Creative Arts Academy · School Talent Hub
            </p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className={`mb-6 p-3.5 rounded-2xl border ${isDarkMode ? 'bg-neutral-950/70 border-neutral-800/80' : 'bg-neutral-100 border-neutral-200'}`}>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2">
              Select Role for Instant Demo Sign-In:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('superadmin@vibra.edu', 'SuperAdmin2026!')}
                className="text-[11px] p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-left font-medium transition-colors"
              >
                ★ Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('principal.vance@stjude.edu', 'AdminVance2026!')}
                className="text-[11px] p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-left font-medium transition-colors"
              >
                ◆ School Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('d.sterling@stjude.edu', 'TeacherSterling!')}
                className="text-[11px] p-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 text-left font-medium transition-colors"
              >
                ● Teacher Patron
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('maya.lin@stjude.edu', 'StudentMaya2026!')}
                className="text-[11px] p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-left font-medium transition-colors"
              >
                ▲ Student (Maya)
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold leading-snug">{errorMessage}</p>
                {lockoutTimer && (
                  <p className="text-[11px] font-mono text-rose-300 mt-1">
                    Cooldown remaining: {lockoutTimer} seconds
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@stjude.edu or username"
                  className={`w-full pl-9.5 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-violet-500 border transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' 
                      : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setResetStep('request');
                  }}
                  className="text-[11px] text-violet-400 hover:text-violet-300 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-9.5 pr-10 py-2.5 rounded-xl text-xs focus:outline-none focus:border-violet-500 border transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' 
                      : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-violet-600 focus:ring-violet-500"
                />
                <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!lockoutTimer}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Vibra</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social / Federated Divider */}
          <div className="relative my-6 text-center">
            <div className={`absolute inset-0 flex items-center ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} border-t`} />
            <span className={`relative px-3 text-[11px] uppercase font-mono ${isDarkMode ? 'bg-neutral-900 text-neutral-500' : 'bg-white text-neutral-400'}`}>
              Or continue with
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-neutral-950 hover:bg-neutral-850 border-neutral-800 text-neutral-200' 
                : 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-700 shadow-sm'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.16C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.6H1.28C.47 8.24 0 10.06 0 12s.47 3.76 1.28 5.4l3.99-3.16z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.28 6.6l3.99 3.16c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Sign in with School Google Account</span>
          </button>

          {/* Footer security note */}
          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS Encrypted · RBAC Enforced · St. Jude Hub</span>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password / Reset Flow Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Account Password</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your verified school email to receive an instant verification reset token.
              </p>
            </div>

            {resetStep === 'request' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    School Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. maya.lin@stjude.edu"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow"
                >
                  Send Verification Code
                </button>
              </form>
            )}

            {resetStep === 'verify' && (
              <form onSubmit={handleConfirmResetSubmit} className="space-y-4 text-xs">
                {generatedCodeHint && (
                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs">
                    Simulated Email Delivery: Your 6-digit code is <strong className="font-mono text-white text-sm">{generatedCodeHint}</strong>
                  </div>
                )}
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow"
                >
                  Save New Password
                </button>
              </form>
            )}

            {resetStep === 'done' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Password Updated!</h4>
                <p className="text-xs text-neutral-400">
                  You can now log in with your updated password.
                </p>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
