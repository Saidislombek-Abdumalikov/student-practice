import { MysteryBoxPrize, MysteryBoxTier, ClaimedPrizeRecord, UserProfile } from '../types';

export const DEFAULT_BOX_PRICES: Record<MysteryBoxTier, number> = {
  bronze: 20,
  platinum: 50,
  gold: 100,
};

const STORAGE_KEY_BOX_PRICES = 'play_learn_compete_box_prices_v2';
const STORAGE_KEY_PRIZES = 'play_learn_compete_mystery_prizes_v2';

export let MYSTERY_BOX_PRICES: Record<MysteryBoxTier, number> = { ...DEFAULT_BOX_PRICES };

export const DEFAULT_MYSTERY_PRIZES: MysteryBoxPrize[] = [
  // BRONZE BOX
  {
    id: 'pz_b1',
    tier: 'bronze',
    title: '+100 Bonus Coins',
    description: 'Instant deposit of 100 shiny gold coins into your wallet!',
    type: 'coins',
    coinAmount: 100,
    icon: '🪙',
    chancePercent: 30,
  },
  {
    id: 'pz_b_dia',
    tier: 'bronze',
    title: '+5 Bonus Diamonds',
    description: 'Bonus 5 precious diamonds won from the bronze wheel!',
    type: 'diamonds',
    diamondAmount: 5,
    icon: '💎',
    chancePercent: 20,
  },
  {
    id: 'pz_b2',
    tier: 'bronze',
    title: 'Candy Treat from Teacher',
    description: 'Redeem this ticket with your teacher for a sweet candy treat in class!',
    type: 'real_world',
    icon: '🍬',
    chancePercent: 25,
  },
  {
    id: 'pz_b3',
    tier: 'bronze',
    title: '+150 Bonus Coins',
    description: 'Bonus 150 practice coins for your cosmetics stash!',
    type: 'coins',
    coinAmount: 150,
    icon: '🪙',
    chancePercent: 15,
  },
  {
    id: 'pz_b4',
    tier: 'bronze',
    title: 'Bronze Scholar Badge',
    description: 'Special student badge recognized in leaderboard rankings!',
    type: 'badge',
    icon: '🥉',
    chancePercent: 10,
  },

  // PLATINUM BOX
  {
    id: 'pz_p1',
    tier: 'platinum',
    title: '+350 Bonus Coins',
    description: 'Big payout of 350 gold coins!',
    type: 'coins',
    coinAmount: 350,
    icon: '💰',
    chancePercent: 25,
  },
  {
    id: 'pz_p_dia',
    tier: 'platinum',
    title: '+15 Bonus Diamonds',
    description: 'High-tier reward of 15 sparkling diamonds for your vault!',
    type: 'diamonds',
    diamondAmount: 15,
    icon: '💎',
    chancePercent: 20,
  },
  {
    id: 'pz_p2',
    tier: 'platinum',
    title: 'Pick Classroom Seat for 1 Day',
    description: 'Show this pass to your teacher to sit at any desk you like for the day!',
    type: 'real_world',
    icon: '🪑',
    chancePercent: 20,
  },
  {
    id: 'pz_p3',
    tier: 'platinum',
    title: '+500 Bonus Coins',
    description: 'Massive stash of 500 gold coins for any hat or pet in shop!',
    type: 'coins',
    coinAmount: 500,
    icon: '💰',
    chancePercent: 15,
  },
  {
    id: 'pz_p4',
    tier: 'platinum',
    title: 'Stationery Gift from Teacher',
    description: 'Redeem with your teacher for cool stationery gifts!',
    type: 'real_world',
    icon: '✏️',
    chancePercent: 10,
  },
  {
    id: 'pz_p5',
    tier: 'platinum',
    title: 'Platinum Duelist Title',
    description: 'Honored duelist status on the peer arena leaderboard!',
    type: 'badge',
    icon: '🥈',
    chancePercent: 10,
  },

  // GOLD BOX
  {
    id: 'pz_g1',
    tier: 'gold',
    title: 'Free Homework Pass (1 Day)',
    description: 'Ultimate classroom pass! Skip one regular homework assignment with teacher approval.',
    type: 'real_world',
    icon: '🎫',
    chancePercent: 25,
  },
  {
    id: 'pz_g_dia',
    tier: 'gold',
    title: '+30 Bonus Diamonds',
    description: 'Legendary deposit of 30 diamonds straight to your profile!',
    type: 'diamonds',
    diamondAmount: 30,
    icon: '💎',
    chancePercent: 20,
  },
  {
    id: 'pz_g2',
    tier: 'gold',
    title: 'Kinder Joy / Chocolate Treat',
    description: 'Delicious chocolate surprise given directly by your teacher in class!',
    type: 'real_world',
    icon: '🍫',
    chancePercent: 25,
  },
  {
    id: 'pz_g3',
    tier: 'gold',
    title: '+1,500 Mega Gold Coins',
    description: 'Huge jackpot! Instantly buy premium character outfits, pets, and accessories.',
    type: 'coins',
    coinAmount: 1500,
    icon: '👑',
    chancePercent: 15,
  },
  {
    id: 'pz_g4',
    tier: 'gold',
    title: 'Teacher Assistant for a Lesson',
    description: 'Be the co-teacher and assistant leader during tomorrow English lesson!',
    type: 'real_world',
    icon: '⭐',
    chancePercent: 10,
  },
  {
    id: 'pz_g5',
    tier: 'gold',
    title: 'Sovereign Champion Gold Crown',
    description: 'Permanent legendary cosmetic crown only obtainable through the Gold Mystery Box.',
    type: 'badge',
    icon: '👑',
    chancePercent: 5,
  },
];

export class MysteryBoxService {
  /**
   * Load editable diamond prices for each box tier
   */
  public static getBoxPrices(): Record<MysteryBoxTier, number> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOX_PRICES);
      if (stored) {
        const parsed = JSON.parse(stored);
        MYSTERY_BOX_PRICES = {
          bronze: Number(parsed.bronze) || DEFAULT_BOX_PRICES.bronze,
          platinum: Number(parsed.platinum) || DEFAULT_BOX_PRICES.platinum,
          gold: Number(parsed.gold) || DEFAULT_BOX_PRICES.gold,
        };
        return MYSTERY_BOX_PRICES;
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_BOX_PRICES };
  }

  /**
   * Save editable diamond prices
   */
  public static saveBoxPrices(prices: Record<MysteryBoxTier, number>): void {
    try {
      const sanitized = {
        bronze: Math.max(1, Math.round(prices.bronze || DEFAULT_BOX_PRICES.bronze)),
        platinum: Math.max(1, Math.round(prices.platinum || DEFAULT_BOX_PRICES.platinum)),
        gold: Math.max(1, Math.round(prices.gold || DEFAULT_BOX_PRICES.gold)),
      };
      localStorage.setItem(STORAGE_KEY_BOX_PRICES, JSON.stringify(sanitized));
      MYSTERY_BOX_PRICES = sanitized;
    } catch {
      // Storage error
    }
  }

  /**
   * Get price for a tier
   */
  public static getPrice(tier: MysteryBoxTier): number {
    const prices = this.getBoxPrices();
    return prices[tier] || DEFAULT_BOX_PRICES[tier];
  }

  public static getPrizes(): MysteryBoxPrize[] {
    return this.loadPrizes();
  }

  public static getPrizesByTier(tier: MysteryBoxTier): MysteryBoxPrize[] {
    return this.getPrizesForTier(tier);
  }

  /**
   * Load all mystery prizes
   */
  public static loadPrizes(): MysteryBoxPrize[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PRIZES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    this.savePrizes(DEFAULT_MYSTERY_PRIZES);
    return DEFAULT_MYSTERY_PRIZES;
  }

  /**
   * Save mystery prizes
   */
  public static savePrizes(prizes: MysteryBoxPrize[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRIZES, JSON.stringify(prizes));
    } catch {
      // Storage error
    }
  }

  /**
   * Get prizes filtered by tier
   */
  public static getPrizesForTier(tier: MysteryBoxTier): MysteryBoxPrize[] {
    const all = this.loadPrizes();
    const filtered = all.filter(p => p.tier === tier);
    return filtered.length > 0 ? filtered : DEFAULT_MYSTERY_PRIZES.filter(p => p.tier === tier);
  }

  /**
   * Add a new prize
   */
  public static addPrize(prize: Omit<MysteryBoxPrize, 'id'>): MysteryBoxPrize {
    const prizes = this.loadPrizes();
    const newPrize: MysteryBoxPrize = {
      ...prize,
      id: 'pz_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    prizes.push(newPrize);
    this.savePrizes(prizes);
    return newPrize;
  }

  /**
   * Update an existing prize
   */
  public static updatePrize(id: string, updates: Partial<MysteryBoxPrize>): boolean {
    const prizes = this.loadPrizes();
    const idx = prizes.findIndex(p => p.id === id);
    if (idx >= 0) {
      prizes[idx] = { ...prizes[idx], ...updates };
      this.savePrizes(prizes);
      return true;
    }
    return false;
  }

  /**
   * Delete a prize
   */
  public static deletePrize(id: string): boolean {
    const prizes = this.loadPrizes();
    const filtered = prizes.filter(p => p.id !== id);
    if (filtered.length !== prizes.length) {
      this.savePrizes(filtered);
      return true;
    }
    return false;
  }

  /**
   * Reset prizes back to defaults
   */
  public static resetToDefaults(): MysteryBoxPrize[] {
    this.savePrizes(DEFAULT_MYSTERY_PRIZES);
    this.saveBoxPrices(DEFAULT_BOX_PRICES);
    return DEFAULT_MYSTERY_PRIZES;
  }

  /**
   * Roll a prize based on drop weights
   */
  public static rollPrize(tier: MysteryBoxTier): MysteryBoxPrize | null {
    const pool = this.getPrizesForTier(tier);
    if (pool.length === 0) return null;

    const totalWeight = pool.reduce((acc, p) => acc + (p.chancePercent && p.chancePercent > 0 ? p.chancePercent : 20), 0);
    const rand = Math.random() * totalWeight;

    let running = 0;
    for (const prize of pool) {
      const weight = prize.chancePercent && prize.chancePercent > 0 ? prize.chancePercent : 20;
      running += weight;
      if (rand <= running) {
        return prize;
      }
    }
    return pool[0];
  }
}
