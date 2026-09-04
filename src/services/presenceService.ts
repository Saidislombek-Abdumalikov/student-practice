import { UserProfile, UserRole } from '../types';

/**
 * Format a user's presence into a clean, human-friendly label.
 * Rules:
 * - Online (if marked online or lastSeenAt within 3 minutes)
 * - "Last seen 5m ago" (if within 60 minutes)
 * - "Last seen today at 14:20" (if earlier today)
 * - "Last seen yesterday"
 * - "Last seen 3 days ago" (if within 7 days)
 * - "Last seen on M/D/YYYY"
 */
export function formatPresence(lastSeenAt?: string, isOnline?: boolean): {
  isOnline: boolean;
  label: string;
  shortLabel: string;
} {
  if (!lastSeenAt) {
    return {
      isOnline: false,
      label: 'Offline',
      shortLabel: 'Offline',
    };
  }

  const date = new Date(lastSeenAt);
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // If marked online or heartbeat within last 3 minutes
  if (isOnline || diffMinutes < 3) {
    return {
      isOnline: true,
      label: '🟢 Online',
      shortLabel: 'Online',
    };
  }

  // Within an hour
  if (diffMinutes < 60) {
    const mins = Math.max(1, diffMinutes);
    return {
      isOnline: false,
      label: `Last seen ${mins}m ago`,
      shortLabel: `${mins}m ago`,
    };
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return {
      isOnline: false,
      label: `Last seen today at ${hours}:${mins}`,
      shortLabel: `Today ${hours}:${mins}`,
    };
  }

  if (isYesterday) {
    return {
      isOnline: false,
      label: 'Last seen yesterday',
      shortLabel: 'Yesterday',
    };
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) {
    return {
      isOnline: false,
      label: `Last seen ${Math.max(1, diffDays)} days ago`,
      shortLabel: `${Math.max(1, diffDays)}d ago`,
    };
  }

  return {
    isOnline: false,
    label: `Last seen on ${date.toLocaleDateString()}`,
    shortLabel: date.toLocaleDateString(),
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
 * - Support (Robiya) can see student learning progress, last seen, online status,
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
