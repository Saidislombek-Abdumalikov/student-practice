import { UserProfile, UserRole } from '../types';

/**
 * Format an ISO date-time string into a clear, exact human-readable date & time.
 * e.g., "Sep 4, 2026, 09:15 AM". If empty or invalid, returns "Not entered yet".
 */
export function formatExactDateTime(isoString?: string): string {
  if (!isoString) return 'Not entered yet';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Not entered yet';

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

/**
 * Format a user's presence into a clean, human-friendly label with exact timestamps.
 * If user has never logged in/entered, returns "Not entered yet".
 */
export function formatPresence(lastSeenAt?: string, isOnline?: boolean): {
  isOnline: boolean;
  label: string;
  shortLabel: string;
  exact: string;
} {
  if (!lastSeenAt) {
    return {
      isOnline: false,
      label: 'Not entered yet',
      shortLabel: 'Not entered',
      exact: 'Not entered yet',
    };
  }

  const date = new Date(lastSeenAt);
  if (isNaN(date.getTime())) {
    return {
      isOnline: false,
      label: 'Not entered yet',
      shortLabel: 'Not entered',
      exact: 'Not entered yet',
    };
  }

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // If marked online or heartbeat within last 3 minutes
  if (isOnline || diffMinutes < 3) {
    return {
      isOnline: true,
      label: '🟢 Online',
      shortLabel: 'Online',
      exact: 'Online now',
    };
  }

  const exactStr = formatExactDateTime(lastSeenAt);
  return {
    isOnline: false,
    label: `Last online: ${exactStr}`,
    shortLabel: exactStr,
    exact: exactStr,
  };
}

/**
 * Format active minutes into clean human-friendly time string.
 * e.g. 15 -> "15m", 85 -> "1h 25m", 150 -> "2h 30m"
 */
export function formatTimeSpent(totalMinutes: number = 0): string {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Field-level backend / state sanitization based on viewer role.
 * 
 * Rules:
 * - Admin can see everything (passwords, last login, login history, time spent).
 * - Support (Roziya) can see student learning progress, last seen, online status,
 *   and TIME SPENT, but CANNOT see last_login_at, login_history, or passwords.
 * - Students can see their OWN stats (time spent), other users' online/offline
 *   and basic last seen, but CANNOT see other users' time spent, last_login_at,
 *   or login_history.
 */
export function sanitizeProfileForViewer(
  target: UserProfile,
  viewerRole: UserRole = 'student',
  isSelf: boolean = false
): UserProfile {
  const sanitized: UserProfile = { ...target };

  // Strip password if viewer is not admin and not viewing self
  if (viewerRole !== 'admin' && !isSelf) {
    delete (sanitized as any).password;
  }

  // Admin-ONLY fields: lastLoginAt, loginHistory
  if (viewerRole !== 'admin') {
    delete sanitized.lastLoginAt;
    delete sanitized.loginHistory;
  }

  // Support + Admin ONLY fields: time spent of other users
  // Students can ONLY see their own time spent
  if (viewerRole === 'student' && !isSelf) {
    delete sanitized.totalTimeSpentMinutes;
    delete sanitized.todayTimeSpentMinutes;
    delete sanitized.dailyTimeSpent;
  }

  // Presence is preserved for EVERYONE
  return sanitized;
}

/**
 * Sanitize an array of profiles for a specific viewer
 */
export function sanitizeAccountListForViewer(
  accounts: UserProfile[],
  viewerRole: UserRole = 'student',
  currentUserId?: string
): UserProfile[] {
  return accounts.map(acc => 
    sanitizeProfileForViewer(acc, viewerRole, currentUserId === acc.id)
  );
}
