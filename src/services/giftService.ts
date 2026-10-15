import { GiftItem, GiftRequest, UserProfile } from '../types';

const GIFTS_STORAGE_KEY = 'plc_gifts_catalog_v1';
const REQUESTS_STORAGE_KEY = 'plc_gift_requests_v1';

export const INITIAL_GIFTS: GiftItem[] = [
  {
    id: 'gift_stickers',
    name: "Maxsus stikerlar to'plami",
    description: "Ingliz tilidagi motivatsion va chiroyli stikerlar to'plami",
    icon: '✨',
    diamondPrice: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gift_sweets',
    name: "Shirinlik to'plami",
    description: "Darsdagi a'lo faollik uchun shokolad yoki shirinlik",
    icon: '🍫',
    diamondPrice: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gift_stationery',
    name: "O'quv markazi daftarchasi va ruchkasi",
    description: "Sifatli brendlangan daftarcha va qulay ruchka",
    icon: '📓',
    diamondPrice: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gift_certificate',
    name: "Faxriy sertifikat va diplom",
    description: "Markaz rahbariyati tomonidan tasdiqlangan maxsus sertifikat",
    icon: '📜',
    diamondPrice: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gift_book',
    name: "Ingliz tilidagi badiiy kitob (Reader)",
    description: "O'z darajangizga mos qiziqarli inglizcha hikoyalar kitobi",
    icon: '📚',
    diamondPrice: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export class GiftService {
  public static getGifts(): GiftItem[] {
    if (typeof window === 'undefined') return INITIAL_GIFTS;
    try {
      const stored = localStorage.getItem(GIFTS_STORAGE_KEY);
      if (!stored) {
        this.saveGifts(INITIAL_GIFTS);
        return INITIAL_GIFTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GIFTS;
    } catch {
      return INITIAL_GIFTS;
    }
  }

  public static saveGifts(gifts: GiftItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GIFTS_STORAGE_KEY, JSON.stringify(gifts));
    } catch (err) {
      console.error('Failed to save gifts:', err);
    }
  }

  public static addGift(data: {
    name: string;
    description: string;
    diamondPrice: number;
    icon?: string;
    imageUrl?: string;
    isActive: boolean;
  }): GiftItem {
    const gifts = this.getGifts();
    const newGift: GiftItem = {
      id: 'gift_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: data.name.trim(),
      description: data.description.trim(),
      diamondPrice: Math.max(1, Math.round(data.diamondPrice)),
      icon: data.icon?.trim() || '🎁',
      imageUrl: data.imageUrl?.trim() || undefined,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
    };
    const updated = [newGift, ...gifts];
    this.saveGifts(updated);
    return newGift;
  }

  public static updateGift(id: string, updates: Partial<GiftItem>): GiftItem | undefined {
    const gifts = this.getGifts();
    const idx = gifts.findIndex(g => g.id === id);
    if (idx === -1) return undefined;

    const updatedGift: GiftItem = {
      ...gifts[idx],
      ...updates,
      diamondPrice: updates.diamondPrice !== undefined ? Math.max(1, Math.round(updates.diamondPrice)) : gifts[idx].diamondPrice,
      updatedAt: new Date().toISOString(),
    };
    gifts[idx] = updatedGift;
    this.saveGifts(gifts);
    return updatedGift;
  }

  public static deleteGift(id: string): void {
    const gifts = this.getGifts();
    const filtered = gifts.filter(g => g.id !== id);
    this.saveGifts(filtered);
  }

  public static getGiftRequests(): GiftRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static saveGiftRequests(requests: GiftRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch (err) {
      console.error('Failed to save gift requests:', err);
    }
  }

  public static getRequestsForStudent(studentId: string): GiftRequest[] {
    const all = this.getGiftRequests();
    return all.filter(r => r.studentId === studentId);
  }

  /**
   * Atomically purchase/request a gift with diamonds
   */
  public static requestGift(
    student: UserProfile,
    giftId: string
  ): {
    success: boolean;
    message?: string;
    updatedStudent?: UserProfile;
    request?: GiftRequest;
  } {
    const gifts = this.getGifts();
    const gift = gifts.find(g => g.id === giftId);

    if (!gift) {
      return { success: false, message: "Tanlangan sovg'a topilmadi." };
    }

    if (!gift.isActive) {
      return { success: false, message: "Bu sovg'a ayni paytda faol emas." };
    }

    const currentDiamonds = student.diamonds || 0;
    if (currentDiamonds < gift.diamondPrice) {
      return {
        success: false,
        message: `Olmoslaringiz yetarli emas. Sizda ${currentDiamonds} ta, sovg'a narxi esa ${gift.diamondPrice} ta olmos.`,
      };
    }

    // Atomic deduction
    const newDiamondBalance = currentDiamonds - gift.diamondPrice;

    const newRequest: GiftRequest = {
      id: 'greq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      studentId: student.id,
      studentName: student.name || 'O‘quvchi',
      giftId: gift.id,
      giftName: gift.name,
      giftDescription: gift.description,
      giftIcon: gift.icon,
      giftImageUrl: gift.imageUrl,
      diamondPrice: gift.diamondPrice,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };

    const allRequests = this.getGiftRequests();
    const updatedRequests = [newRequest, ...allRequests];
    this.saveGiftRequests(updatedRequests);

    const updatedStudent: UserProfile = {
      ...student,
      diamonds: newDiamondBalance,
      giftRequests: [newRequest, ...(student.giftRequests || [])],
      lastActiveDate: new Date().toISOString(),
    };

    return {
      success: true,
      message: `Sovg'a so'rovi qabul qilindi! O'qituvchingiz yaqin orada sovg'ani topshiradi.`,
      updatedStudent,
      request: newRequest,
    };
  }

  /**
   * Admin fulfills a requested gift and marks it as DELIVERED
   */
  public static deliverGift(
    requestId: string,
    admin: UserProfile
  ): {
    success: boolean;
    message?: string;
    updatedRequest?: GiftRequest;
  } {
    if (admin.role !== 'admin') {
      return { success: false, message: "Faqat admin sovg'ani topshirildi deb belgilashi mumkin." };
    }

    const allRequests = this.getGiftRequests();
    const idx = allRequests.findIndex(r => r.id === requestId);
    if (idx === -1) {
      return { success: false, message: "So'rov topilmadi." };
    }

    const nowIso = new Date().toISOString();
    const updated: GiftRequest = {
      ...allRequests[idx],
      status: 'DELIVERED',
      deliveredAt: nowIso,
      deliveredByAdminId: admin.id,
      deliveredByAdminName: admin.name || 'Administrator',
    };

    allRequests[idx] = updated;
    this.saveGiftRequests(allRequests);

    return {
      success: true,
      message: "Sovg'a muvaffaqiyatli topshirildi deb belgilandi!",
      updatedRequest: updated,
    };
  }
}
