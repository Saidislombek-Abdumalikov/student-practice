import { DiamondAwardLog, DiamondAwardCategory, UserProfile } from '../types';

const DIAMOND_LOGS_STORAGE_KEY = 'plc_diamond_award_logs_v1';

// In-memory execution lock to prevent rapid accidental double-clicks / parallel execution
let isProcessingAward = false;

export class DiamondAwardService {
  public static getLogs(): DiamondAwardLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(DIAMOND_LOGS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static saveLogs(logs: DiamondAwardLog[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DIAMOND_LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save diamond award logs:', err);
    }
  }

  public static getLogsForStudent(studentId: string): DiamondAwardLog[] {
    const logs = this.getLogs();
    return logs.filter(l => l.studentId === studentId);
  }

  /**
   * Check if standard reward for a specific assignment or exam was already given
   */
  public static isAlreadyAwarded(
    studentId: string,
    category: DiamondAwardCategory,
    relatedEntityId?: string
  ): boolean {
    if (!relatedEntityId) return false;
    const logs = this.getLogs();
    return logs.some(
      l => l.studentId === studentId && l.category === category && l.relatedEntityId === relatedEntityId
    );
  }

  /**
   * Admin explicitly and manually awards diamonds to a student
   */
  public static awardDiamonds(params: {
    admin: UserProfile;
    targetStudent: UserProfile;
    amount: number;
    category: DiamondAwardCategory;
    reason: string;
    relatedEntityId?: string;
    relatedEntityType?: 'homework' | 'exam' | 'manual';
  }): {
    success: boolean;
    message: string;
    updatedStudent?: UserProfile;
    logEntry?: DiamondAwardLog;
  } {
    // 1. Backend / Role verification
    if (params.admin.role !== 'admin') {
      return {
        success: false,
        message: "Xatolik: Faqat administrator olmos bera oladi!",
      };
    }

    // 2. Debouncing / Double-click lock
    if (isProcessingAward) {
      return {
        success: false,
        message: "Amal bajarilmoqda, iltimos kuting...",
      };
    }

    const validAmount = Math.round(params.amount);
    if (isNaN(validAmount) || validAmount <= 0) {
      return {
        success: false,
        message: "Olmos miqdori 1 yoki undan yuqori bo'lishi kerak.",
      };
    }

    if (!params.reason || params.reason.trim().length === 0) {
      return {
        success: false,
        message: "Mukofot sababini ko'rsatish shart.",
      };
    }

    // 3. Duplicate check for standard homework and exam awards
    if (
      params.relatedEntityId &&
      (params.category === 'HOMEWORK_COMPLETED' || params.category === 'EXAM_HIGH_SCORE')
    ) {
      if (this.isAlreadyAwarded(params.targetStudent.id, params.category, params.relatedEntityId)) {
        return {
          success: false,
          message: "Ushbu vazifa yoki imtihon uchun o'quvchiga allaqachon olmos berilgan!",
        };
      }
    }

    try {
      isProcessingAward = true;

      const logEntry: DiamondAwardLog = {
        id: 'daw_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        studentId: params.targetStudent.id,
        studentName: params.targetStudent.name || 'O‘quvchi',
        amount: validAmount,
        category: params.category,
        reason: params.reason.trim(),
        relatedEntityId: params.relatedEntityId,
        relatedEntityType: params.relatedEntityType || 'manual',
        adminId: params.admin.id,
        adminName: params.admin.name || 'Administrator',
        awardedByName: params.admin.name || 'Administrator',
        awardedAt: new Date().toISOString(),
      };

      const existingLogs = this.getLogs();
      const updatedLogs = [logEntry, ...existingLogs];
      this.saveLogs(updatedLogs);

      const currentDiamonds = params.targetStudent.diamonds || 0;
      const updatedStudent: UserProfile = {
        ...params.targetStudent,
        diamonds: currentDiamonds + validAmount,
        diamondHistory: [logEntry, ...(params.targetStudent.diamondHistory || [])],
        lastActiveDate: new Date().toISOString(),
      };

      return {
        success: true,
        message: `${params.targetStudent.name} o'quvchisiga ${validAmount} ta olmos muvaffaqiyatli berildi!`,
        updatedStudent,
        logEntry,
      };
    } finally {
      setTimeout(() => {
        isProcessingAward = false;
      }, 500);
    }
  }
}
