import { CharacterConfig } from '../types';

export interface OutfitPreset {
  id: string;
  name: string;
  gender: 'man' | 'woman';
  description: string;
  badge: string;
  discountPercent: number;
  bundlePrice: number;
  originalPrice: number;
  character: Partial<CharacterConfig>;
  includedItemIds: string[];
}

export const OUTFIT_PRESETS: OutfitPreset[] = [
  // =============================================================
  // WOMEN PRE-STYLED READY-TO-WEAR SETS
  // =============================================================
  {
    id: 'preset_sweet_blossom',
    name: 'Sweet Rose Blossom',
    gender: 'woman',
    description: 'Charming sweetheart dress with velvet hair bow and pearl choker.',
    badge: '🌸 Sweet Look',
    discountPercent: 12,
    originalPrice: 1530, // 500 (dress) + 320 (bow) + 710 (pearls)
    bundlePrice: 1350,   // Slight discount (-12%)
    character: {
      gender: 'woman',
      skinTone: '#FFDFC4',
      hairStyle: 'wavy_bob',
      hairColor: '#8B5CF6',
      outfit: 'dress',
      outfitColor: '#F43F5E',
      hat: 'ribbon_bow',
      glasses: 'none',
      accessory: 'pearl_necklace',
      expression: 'victory',
    },
    includedItemIds: ['outfit_dress_floral', 'hat_ribbon_bow', 'acc_pearls'],
  },
  {
    id: 'preset_tokyo_streetwear',
    name: 'Tokyo Neon Streetwear',
    gender: 'woman',
    description: 'Cropped streetwear hoodie, neko anime cat ears, cat-eye shades, and velvet heart choker.',
    badge: '💜 Streetwear',
    discountPercent: 12,
    originalPrice: 1810, // 440 (hoodie) + 570 (cat ears) + 440 (cat eye) + 360 (choker)
    bundlePrice: 1590,   // Slight discount (-12%)
    character: {
      gender: 'woman',
      skinTone: '#F0C08A',
      hairStyle: 'ponytail',
      hairColor: '#1E293B',
      outfit: 'hoodie_cropped',
      outfitColor: '#8B5CF6',
      hat: 'cat_ears',
      glasses: 'cat_eye',
      accessory: 'choker',
      expression: 'happy',
    },
    includedItemIds: ['outfit_hoodie_cropped', 'hat_cat_ears', 'glasses_cat_eye', 'acc_choker'],
  },
  {
    id: 'preset_european_chic',
    name: 'European High Chic',
    gender: 'woman',
    description: 'Elegant ribbed turtleneck with sparkling princess tiara, study specs, and lustrous pearls.',
    badge: '👑 Royal Chic',
    discountPercent: 12,
    originalPrice: 2440, // 520 (turtleneck) + 1010 (tiara) + 200 (specs) + 710 (pearls)
    bundlePrice: 2150,   // Slight discount (-12%)
    character: {
      gender: 'woman',
      skinTone: '#FFDFC4',
      hairStyle: 'wavy_bob',
      hairColor: '#4A2E18',
      outfit: 'turtleneck',
      outfitColor: '#10B981',
      hat: 'tiara',
      glasses: 'specs',
      accessory: 'pearl_necklace',
      expression: 'thinking',
    },
    includedItemIds: ['outfit_turtleneck', 'hat_tiara', 'glasses_specs', 'acc_pearls'],
  },
  {
    id: 'preset_imperial_sakura',
    name: 'Imperial Sakura Kimono',
    gender: 'woman',
    description: 'Traditional Japanese blossom kimono with woven flower crown and crescent star pendant.',
    badge: '⛩️ Traditional',
    discountPercent: 12,
    originalPrice: 1780, // 940 (kimono) + 440 (crown) + 400 (pendant)
    bundlePrice: 1570,   // Slight discount (-12%)
    character: {
      gender: 'woman',
      skinTone: '#FFDFC4',
      hairStyle: 'braids',
      hairColor: '#D97706',
      outfit: 'kimono',
      outfitColor: '#F59E0B',
      hat: 'flower_crown',
      glasses: 'none',
      accessory: 'silver_pendant',
      expression: 'happy',
    },
    includedItemIds: ['outfit_kimono_sakura', 'hat_flower_crown', 'acc_silver_pendant'],
  },
  {
    id: 'preset_summer_breeze',
    name: 'Summer Pastel Breeze',
    gender: 'woman',
    description: 'Scoop summer blouse with playful rose heart shades, braids, and star pendant.',
    badge: '🌊 Casual Vibe',
    discountPercent: 12,
    originalPrice: 1300, // 380 (blouse) + 520 (heart shades) + 400 (pendant)
    bundlePrice: 1140,   // Slight discount (-12%)
    character: {
      gender: 'woman',
      skinTone: '#F0C08A',
      hairStyle: 'braids',
      hairColor: '#D97706',
      outfit: 'summer_top',
      outfitColor: '#06B6D4',
      hat: 'none',
      glasses: 'heart_shades',
      accessory: 'silver_pendant',
      expression: 'victory',
    },
    includedItemIds: ['outfit_summer_top', 'glasses_heart', 'acc_silver_pendant'],
  },

  // =============================================================
  // MEN PRE-STYLED READY-TO-WEAR SETS
  // =============================================================
  {
    id: 'preset_rebel_rider',
    name: 'Rebel Biker Leader',
    gender: 'man',
    description: 'Heavy asymmetrical biker leather jacket with gold Cuban chain, pro snapback, and dark shades.',
    badge: '⚡ Rebel Look',
    discountPercent: 12,
    originalPrice: 2470, // 760 (leather) + 200 (snapback) + 460 (shades) + 1050 (gold chain)
    bundlePrice: 2170,   // Slight discount (-12%)
    character: {
      gender: 'man',
      skinTone: '#F0C08A',
      hairStyle: 'fade',
      hairColor: '#1E293B',
      outfit: 'leather_biker',
      outfitColor: '#3B82F6',
      hat: 'snapback',
      glasses: 'sunglasses',
      accessory: 'gold_chain',
      expression: 'victory',
    },
    includedItemIds: ['outfit_leather_biker', 'hat_snapback', 'glasses_sunglasses', 'acc_gold_chain'],
  },
  {
    id: 'preset_oxford_scholar',
    name: 'Oxford Scholar',
    gender: 'man',
    description: 'Tailored academic blazer with silk crimson bowtie, French wool beret, and study specs.',
    badge: '🎓 Academic',
    discountPercent: 12,
    originalPrice: 1520, // 670 (blazer) + 360 (beret) + 200 (specs) + 290 (bowtie)
    bundlePrice: 1340,   // Slight discount (-12%)
    character: {
      gender: 'man',
      skinTone: '#FFDFC4',
      hairStyle: 'side_sweep',
      hairColor: '#4A2E18',
      outfit: 'blazer',
      outfitColor: '#F43F5E',
      hat: 'beret',
      glasses: 'specs',
      accessory: 'bowtie',
      expression: 'thinking',
    },
    includedItemIds: ['outfit_blazer_gold', 'hat_beret', 'glasses_specs', 'acc_bowtie'],
  },
  {
    id: 'preset_varsity_champion',
    name: 'Varsity Campus Legend',
    gender: 'man',
    description: 'Classic college letterman jacket with warm beanie, aviators, and grand champion gold medal.',
    badge: '🏆 Champion',
    discountPercent: 12,
    originalPrice: 2820, // 340 (varsity) + 250 (beanie) + 800 (aviator) + 1430 (medal)
    bundlePrice: 2480,   // Slight discount (-12%)
    character: {
      gender: 'man',
      skinTone: '#F0C08A',
      hairStyle: 'fade',
      hairColor: '#1E293B',
      outfit: 'varsity',
      outfitColor: '#10B981',
      hat: 'beanie',
      glasses: 'aviator',
      accessory: 'medal',
      expression: 'victory',
    },
    includedItemIds: ['outfit_varsity_emerald', 'hat_beanie', 'glasses_aviator', 'acc_medal'],
  },
  {
    id: 'preset_cyber_runner',
    name: 'Cyberpunk Runner',
    gender: 'man',
    description: 'High-tech neon strip jacket with steampunk brass goggles and RGB studio headphones.',
    badge: '🚀 Cyberpunk',
    discountPercent: 12,
    originalPrice: 2420, // 1160 (cyber jacket) + 740 (goggles) + 520 (headphones)
    bundlePrice: 2130,   // Slight discount (-12%)
    character: {
      gender: 'man',
      skinTone: '#F0C08A',
      hairStyle: 'curly_top',
      hairColor: '#8B5CF6',
      outfit: 'cyber_jacket',
      outfitColor: '#06B6D4',
      hat: 'none',
      glasses: 'retro_round',
      accessory: 'headphones',
      expression: 'victory',
    },
    includedItemIds: ['outfit_cyber_jacket', 'glasses_retro_round', 'acc_headphones'],
  },
  {
    id: 'preset_athletic_sprint',
    name: 'Athletic Speed Drills',
    gender: 'man',
    description: 'Dual-stripe athletic tracksuit with crimson sprint headband and RGB studio headphones.',
    badge: '🏃 Sport Vibe',
    discountPercent: 12,
    originalPrice: 1380, // 630 (tracksuit) + 230 (headband) + 520 (headphones)
    bundlePrice: 1210,   // Slight discount (-12%)
    character: {
      gender: 'man',
      skinTone: '#F0C08A',
      hairStyle: 'fade',
      hairColor: '#1E293B',
      outfit: 'tracksuit',
      outfitColor: '#1E293B',
      hat: 'headband',
      glasses: 'none',
      accessory: 'headphones',
      expression: 'happy',
    },
    includedItemIds: ['outfit_tracksuit', 'hat_headband', 'acc_headphones'],
  },
];
