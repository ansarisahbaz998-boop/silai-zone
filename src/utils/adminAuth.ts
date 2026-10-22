export const DEFAULT_ADMIN_USERNAME = 'MD Irfan Ansari';
export const DEFAULT_ADMIN_PASSWORD = 'Sahbaz@sah6666';

export const SECURITY_QUESTION_1 = 'Who are you?';
export const SECURITY_ANSWER_1 = 'robot';

export const SECURITY_QUESTION_2 = 'What is your name?';
export const SECURITY_ANSWER_2 = 'robot';

const STORAGE_KEY_USERNAME = 'silai_zone_admin_username';
const STORAGE_KEY_PASSWORD = 'silai_zone_admin_password';
const SESSION_KEY_ACTIVE = 'silai_zone_admin_session';
const SESSION_KEY_TIMESTAMP = 'silai_zone_admin_session_ts';
const STORAGE_KEY_FAILED_ATTEMPTS = 'silai_zone_auth_failed_attempts';
const STORAGE_KEY_LOCKOUT_UNTIL = 'silai_zone_auth_lockout_until';

// Session duration: 45 minutes of inactivity
const SESSION_MAX_AGE_MS = 45 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

export function getAdminUsername(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_USERNAME;
  const saved = localStorage.getItem(STORAGE_KEY_USERNAME);
  return saved || DEFAULT_ADMIN_USERNAME;
}

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  const saved = localStorage.getItem(STORAGE_KEY_PASSWORD);
  return saved || DEFAULT_ADMIN_PASSWORD;
}

export function setAdminUsername(newUsername: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_USERNAME, newUsername);
}

export function setAdminPassword(newPassword: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword);
}

export function getLockoutRemainingSeconds(): number {
  if (typeof window === 'undefined') return 0;
  const lockoutUntil = parseInt(sessionStorage.getItem(STORAGE_KEY_LOCKOUT_UNTIL) || '0', 10);
  const now = Date.now();
  if (lockoutUntil > now) {
    return Math.ceil((lockoutUntil - now) / 1000);
  }
  return 0;
}

export function recordFailedAttempt(): { remainingAttempts: number; isLocked: boolean; lockoutSeconds: number } {
  if (typeof window === 'undefined') return { remainingAttempts: MAX_FAILED_ATTEMPTS, isLocked: false, lockoutSeconds: 0 };
  
  const currentAttempts = parseInt(sessionStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS) || '0', 10) + 1;
  sessionStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, currentAttempts.toString());

  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY_LOCKOUT_UNTIL, lockoutUntil.toString());
    sessionStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, '0');
    return {
      remainingAttempts: 0,
      isLocked: true,
      lockoutSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  return {
    remainingAttempts: MAX_FAILED_ATTEMPTS - currentAttempts,
    isLocked: false,
    lockoutSeconds: 0,
  };
}

export function resetFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_FAILED_ATTEMPTS);
  sessionStorage.removeItem(STORAGE_KEY_LOCKOUT_UNTIL);
}

export function verifyAdminCredentials(username: string, password: string): { 
  success: boolean; 
  error?: string; 
  lockoutSeconds?: number 
} {
  const trimmedPassword = (password || '').trim();
  const trimmedUsername = (username || '').trim();
  const currentPassword = getAdminPassword();
  const currentUsername = getAdminUsername();

  // Allow default master password 'Sahbaz@sah6666' (case-insensitive) or any newly saved password
  const passwordMatch = 
    trimmedPassword === DEFAULT_ADMIN_PASSWORD ||
    trimmedPassword.toLowerCase() === DEFAULT_ADMIN_PASSWORD.toLowerCase() ||
    trimmedPassword === currentPassword ||
    trimmedPassword.toLowerCase() === currentPassword.toLowerCase();

  // If password is correct, immediately authenticate, reset any failed attempts/lockouts, and unlock!
  if (passwordMatch) {
    resetFailedAttempts();
    return { success: true };
  }

  // Check lockout only when password was incorrect
  const lockoutSeconds = getLockoutRemainingSeconds();
  if (lockoutSeconds > 0) {
    return {
      success: false,
      error: `Security Lockout! Kripya ${lockoutSeconds} seconds intezar karein.`,
      lockoutSeconds,
    };
  }

  const failedInfo = recordFailedAttempt();
  if (failedInfo.isLocked) {
    return {
      success: false,
      error: `Galat Password! Account temporarily locked for ${failedInfo.lockoutSeconds} seconds.`,
      lockoutSeconds: failedInfo.lockoutSeconds,
    };
  }

  return {
    success: false,
    error: `Galat Password! Kripya sahi Admin Password darj karein. (${failedInfo.remainingAttempts} attempts remaining)`,
  };
}

export function verifySecurityQuestions(answer1: string, answer2: string): boolean {
  const a1 = answer1.trim().toLowerCase();
  const a2 = answer2.trim().toLowerCase();
  return a1 === SECURITY_ANSWER_1.toLowerCase() && a2 === SECURITY_ANSWER_2.toLowerCase();
}

export function resetPasswordWithSecurityQuestions(
  answer1: string,
  answer2: string,
  newPassword: string
): { success: boolean; message: string } {
  if (!verifySecurityQuestions(answer1, answer2)) {
    return {
      success: false,
      message: 'Galat uttar! Security questions ke uttar galat hain. Sahi answers enter karein.',
    };
  }

  if (!newPassword || newPassword.trim().length < 6) {
    return {
      success: false,
      message: 'High Security Requirement: Password must be at least 6 characters long.',
    };
  }

  setAdminPassword(newPassword.trim());
  resetFailedAttempts();
  return {
    success: true,
    message: 'Password successfully changed! Now login with your new password.',
  };
}

export function recoverUsernameWithSecurityQuestions(
  answer1: string,
  answer2: string
): { success: boolean; username?: string; message: string } {
  if (!verifySecurityQuestions(answer1, answer2)) {
    return {
      success: false,
      message: 'Galat uttar! Security questions ke uttar galat hain. Sahi answers enter karein.',
    };
  }

  const currentUsername = getAdminUsername();
  return {
    success: true,
    username: currentUsername,
    message: `Verification Successful! Aapka Admin Username hai: "${currentUsername}"`,
  };
}

export function resetUsernameWithSecurityQuestions(
  answer1: string,
  answer2: string,
  newUsername: string
): { success: boolean; message: string } {
  if (!verifySecurityQuestions(answer1, answer2)) {
    return {
      success: false,
      message: 'Galat uttar! Security questions ke uttar galat hain. Sahi answers enter karein.',
    };
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return {
      success: false,
      message: 'Admin Username must be at least 3 characters long.',
    };
  }

  setAdminUsername(newUsername.trim());
  return {
    success: true,
    message: `Admin Username successfully badal kar "${newUsername.trim()}" kar diya gaya hai!`,
  };
}

export function isAdminSessionActive(): boolean {
  if (typeof window === 'undefined') return false;
  const isActive = sessionStorage.getItem(SESSION_KEY_ACTIVE) === 'true';
  if (!isActive) return false;

  const timestampStr = sessionStorage.getItem(SESSION_KEY_TIMESTAMP);
  if (!timestampStr) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (Date.now() - timestamp > SESSION_MAX_AGE_MS) {
    // Session expired
    setAdminSessionActive(false);
    return false;
  }

  // Refresh timestamp on active check
  sessionStorage.setItem(SESSION_KEY_TIMESTAMP, Date.now().toString());
  return true;
}

export function setAdminSessionActive(active: boolean): void {
  if (typeof window === 'undefined') return;
  if (active) {
    sessionStorage.setItem(SESSION_KEY_ACTIVE, 'true');
    sessionStorage.setItem(SESSION_KEY_TIMESTAMP, Date.now().toString());
    resetFailedAttempts();
  } else {
    sessionStorage.removeItem(SESSION_KEY_ACTIVE);
    sessionStorage.removeItem(SESSION_KEY_TIMESTAMP);
  }
}
