/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, UserRole } from '../types';
import { storageService } from './storageService';

interface AuthSession {
  token: string;
  userId: string;
  role: UserRole;
  expiresAt: number; // Unix timestamp
}

interface RateLimitTracker {
  attempts: number;
  lockedUntil: number;
}

const RATE_LIMIT_KEY = 'vibra_login_attempts';
const SESSION_KEY = 'vibra_auth_session';

class AuthService {
  private getRateLimit(identifier: string): RateLimitTracker {
    try {
      const data = localStorage.getItem(`${RATE_LIMIT_KEY}_${identifier.toLowerCase()}`);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return { attempts: 0, lockedUntil: 0 };
  }

  private setRateLimit(identifier: string, tracker: RateLimitTracker) {
    localStorage.setItem(
      `${RATE_LIMIT_KEY}_${identifier.toLowerCase()}`,
      JSON.stringify(tracker)
    );
  }

  // Create simulated cryptographically structured session token
  private createToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
      })
    );
    const signature = btoa(`sig_${user.id}_${Date.now()}`).substring(0, 16);
    return `${header}.${payload}.${signature}`;
  }

  // Validate active session
  getActiveSession(): AuthSession | null {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) return null;
      const session: AuthSession = JSON.parse(sessionStr);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  // Primary Login with rate limiting & audit logs
  login(
    identifier: string, // Email or username
    passwordAttempt: string,
    rememberMe: boolean = false
  ): { success: boolean; user?: User; error?: string; lockoutSeconds?: number } {
    const cleanId = identifier.trim().toLowerCase();
    const rateLimit = this.getRateLimit(cleanId);

    // Check if locked out
    const now = Date.now();
    if (rateLimit.lockedUntil > now) {
      const remainingSeconds = Math.ceil((rateLimit.lockedUntil - now) / 1000);
      return {
        success: false,
        error: `Too many failed login attempts. Account temporarily locked for security.`,
        lockoutSeconds: remainingSeconds,
      };
    }

    const users = storageService.getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.username.toLowerCase() === cleanId
    );

    if (!user) {
      this.recordFailedAttempt(cleanId, rateLimit);
      return {
        success: false,
        error: 'Invalid credentials. Please verify your school email or username.',
      };
    }

    if (user.status === 'suspended') {
      return {
        success: false,
        error: 'This account has been suspended by a school administrator. Please contact your faculty patron.',
      };
    }

    // Verify password
    const validPassword = user.password || `${user.role === 'admin' ? 'AdminVance2026!' : user.role === 'superadmin' ? 'SuperAdmin2026!' : 'Password123!'}`;
    const isMatch = passwordAttempt === validPassword;

    if (!isMatch) {
      const updatedTracker = this.recordFailedAttempt(cleanId, rateLimit);
      if (updatedTracker.lockedUntil > now) {
        return {
          success: false,
          error: 'Maximum login attempts exceeded. Account locked for 60 seconds.',
          lockoutSeconds: 60,
        };
      }
      return {
        success: false,
        error: 'Invalid password. Check capitalization or request a password reset.',
      };
    }

    // Clear rate limit on successful authentication
    localStorage.removeItem(`${RATE_LIMIT_KEY}_${cleanId}`);

    // Update user's last login
    user.lastLoginAt = new Date().toISOString();
    storageService.updateUser(user.id, { lastLoginAt: user.lastLoginAt });

    // Generate session
    const token = this.createToken(user);
    const sessionDuration = rememberMe ? 86400 * 30 * 1000 : 86400 * 1000;
    const session: AuthSession = {
      token,
      userId: user.id,
      role: user.role,
      expiresAt: Date.now() + sessionDuration,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // Audit log
    storageService.addAuditLog(
      'AUTH_LOGIN',
      `User: ${user.name} (${user.role})`,
      'success',
      `Successful login via ${cleanId}`,
      user
    );

    return { success: true, user };
  }

  private recordFailedAttempt(identifier: string, tracker: RateLimitTracker): RateLimitTracker {
    tracker.attempts += 1;
    if (tracker.attempts >= 5) {
      tracker.lockedUntil = Date.now() + 60 * 1000; // 60s lockout
      tracker.attempts = 0;
    }
    this.setRateLimit(identifier, tracker);
    return tracker;
  }

  // Google Single Sign-On (Federated school Workspace mock)
  loginWithGoogle(): { success: boolean; user: User } {
    const users = storageService.getUsers();
    // Default to Maya Lin student or first student
    const studentUser = users.find((u) => u.role === 'student') || users[0];

    const token = this.createToken(studentUser);
    const session: AuthSession = {
      token,
      userId: studentUser.id,
      role: studentUser.role,
      expiresAt: Date.now() + 86400 * 7 * 1000,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    storageService.addAuditLog(
      'GOOGLE_AUTH_LOGIN',
      `User: ${studentUser.name}`,
      'success',
      'Authenticated via Google Workspace SSO',
      studentUser
    );

    return { success: true, user: studentUser };
  }

  // Password Reset simulation with verification code
  requestPasswordReset(email: string): { success: boolean; code?: string; error?: string } {
    const users = storageService.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No registered student or staff account associated with that email.',
      };
    }

    // Generate 6 digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`vibra_reset_code_${cleanEmail}`, JSON.stringify({ code, expires: Date.now() + 15 * 60 * 1000 }));

    return { success: true, code };
  }

  confirmPasswordReset(email: string, code: string, newPassword: string): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const storedCodeData = localStorage.getItem(`vibra_reset_code_${cleanEmail}`);
    if (!storedCodeData) {
      return { success: false, error: 'Password reset request expired or invalid.' };
    }

    const { code: expectedCode, expires } = JSON.parse(storedCodeData);
    if (Date.now() > expires) {
      return { success: false, error: 'Reset verification code has expired. Please request a new one.' };
    }

    if (code.trim() !== expectedCode) {
      return { success: false, error: 'Incorrect 6-digit verification code.' };
    }

    const users = storageService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) return { success: false, error: 'User not found.' };

    user.password = newPassword;
    storageService.updateUser(user.id, { password: newPassword });
    localStorage.removeItem(`vibra_reset_code_${cleanEmail}`);

    storageService.addAuditLog(
      'PASSWORD_RESET',
      `User: ${user.name}`,
      'success',
      'Password successfully reset via verification code',
      user
    );

    return { success: true };
  }

  logout(currentUser?: User | null) {
    if (currentUser) {
      storageService.addAuditLog(
        'AUTH_LOGOUT',
        `User: ${currentUser.name}`,
        'success',
        'User logged out and session destroyed',
        currentUser
      );
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('vibra_active_user_id');
  }
}

export const authService = new AuthService();
