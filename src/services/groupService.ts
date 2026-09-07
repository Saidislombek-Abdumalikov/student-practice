import { StudentGroup, UserProfile, LevelId } from '../types';

const GROUPS_STORAGE_KEY = 'plc_student_groups_v1';

export const INITIAL_STUDENT_GROUPS: StudentGroup[] = [
  {
    id: 'group_alpha',
    name: 'Morning Group Alpha',
    levelId: 'beginner',
    description: 'Beginner morning session students (Grammar & Basic Vocabulary)',
    studentIds: ['usr_dilnura', 'usr_ruxshona', 'usr_gulasal'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'group_beta',
    name: 'Afternoon Group Beta',
    levelId: 'elementary',
    description: 'Elementary afternoon session students (Reading, Listening & Duels)',
    studentIds: ['usr_omina', 'usr_bahodir'],
    createdAt: new Date().toISOString(),
  },
];

export class GroupService {
  /**
   * Load all student groups from persistent storage, or initialize defaults
   */
  public static getGroups(): StudentGroup[] {
    if (typeof localStorage === 'undefined') {
      return [...INITIAL_STUDENT_GROUPS];
    }
    try {
      const raw = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StudentGroup[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load student groups from storage:', err);
    }

    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENT_GROUPS));
    } catch {
      // Storage unavailable
    }
    return [...INITIAL_STUDENT_GROUPS];
  }

  /**
   * Save groups to storage
   */
  public static saveGroups(groups: StudentGroup[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    } catch (err) {
      console.warn('Failed to save student groups:', err);
    }
  }

  /**
   * Find group by ID
   */
  public static getGroupById(id: string): StudentGroup | undefined {
    return this.getGroups().find(g => g.id === id);
  }

  /**
   * Create a new student group
   */
  public static createGroup(data: {
    name: string;
    levelId: LevelId;
    description?: string;
    studentIds?: string[];
  }): StudentGroup {
    const groups = this.getGroups();
    const newGroup: StudentGroup = {
      id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      levelId: data.levelId,
      description: data.description?.trim() || '',
      studentIds: data.studentIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If students are assigned to this new group, remove them from any existing groups to prevent multi-group conflict
    if (newGroup.studentIds.length > 0) {
      for (const g of groups) {
        g.studentIds = g.studentIds.filter(sid => !newGroup.studentIds.includes(sid));
      }
    }

    groups.push(newGroup);
    this.saveGroups(groups);
    return newGroup;
  }

  /**
   * Edit / update an existing group
   */
  public static updateGroup(
    id: string,
    updates: Partial<Omit<StudentGroup, 'id' | 'createdAt'>>
  ): StudentGroup | undefined {
    const groups = this.getGroups();
    const idx = groups.findIndex(g => g.id === id);
    if (idx === -1) return undefined;

    const current = groups[idx];
    const newStudentIds = updates.studentIds !== undefined ? updates.studentIds : current.studentIds;

    // If new studentIds provided, remove them from other groups so students are not mixed across multiple groups
    if (updates.studentIds) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].id !== id) {
          groups[i].studentIds = groups[i].studentIds.filter(sid => !updates.studentIds!.includes(sid));
        }
      }
    }

    const updatedGroup: StudentGroup = {
      ...current,
      ...updates,
      studentIds: newStudentIds,
      updatedAt: new Date().toISOString(),
    };

    groups[idx] = updatedGroup;
    this.saveGroups(groups);
    return updatedGroup;
  }

  /**
   * Delete a student group
   */
  public static deleteGroup(id: string): void {
    const groups = this.getGroups().filter(g => g.id !== id);
    this.saveGroups(groups);
  }

  /**
   * Assign a single student to a group
   */
  public static assignStudentToGroup(studentId: string, groupId: string): void {
    const groups = this.getGroups();
    for (const g of groups) {
      if (g.id === groupId) {
        if (!g.studentIds.includes(studentId)) {
          g.studentIds.push(studentId);
          g.updatedAt = new Date().toISOString();
        }
      } else {
        // Remove from other groups
        g.studentIds = g.studentIds.filter(id => id !== studentId);
      }
    }
    this.saveGroups(groups);
  }

  /**
   * Remove a student from any assigned group
   */
  public static removeStudentFromGroup(studentId: string): void {
    const groups = this.getGroups();
    for (const g of groups) {
      g.studentIds = g.studentIds.filter(id => id !== studentId);
    }
    this.saveGroups(groups);
  }

  /**
   * Get students for a specific group from an account list
   */
  public static getStudentsInGroup(groupId: string, allAccounts: UserProfile[]): UserProfile[] {
    const group = this.getGroupById(groupId);
    if (!group) return [];
    return allAccounts.filter(acc => group.studentIds.includes(acc.id) || acc.groupId === groupId);
  }

  /**
   * Sync accounts' groupId field to match current group registrations
   */
  public static syncAccountsWithGroups(groups: StudentGroup[], accounts: UserProfile[]): UserProfile[] {
    const studentToGroupMap = new Map<string, string>();
    for (const g of groups) {
      for (const sid of g.studentIds) {
        studentToGroupMap.set(sid, g.id);
      }
    }

    return accounts.map(acc => {
      const assignedGroupId = studentToGroupMap.get(acc.id);
      if (assignedGroupId) {
        return { ...acc, groupId: assignedGroupId };
      }
      // If student was in a group that was deleted or removed
      if (acc.groupId && !groups.some(g => g.id === acc.groupId)) {
        const copy = { ...acc };
        delete copy.groupId;
        return copy;
      }
      return acc;
    });
  }
}
