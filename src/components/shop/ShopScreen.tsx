import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ShopCategory, ShopItem } from '../../types';
import { SHOP_ITEMS, STICKERS } from '../../data/shopData';
import { ModularCharacter } from '../character/ModularCharacter';
import { QuickMoodBar } from '../character/QuickMoodBar';
import { soundService } from '../../services/soundService';
import { 
  ShoppingBag,
  Gift, 
  Coins, 
  Check, 
  Sparkles, 
  HardHat, 
  Glasses, 
  Crown, 
  Smile, 
  Image as ImageIcon,
  Shirt,
  Tag
} from 'lucide-react';
import { OUTFIT_PRESETS, OutfitPreset } from '../../data/outfitPresets';

export const ShopScreen: React.FC = () => {
  const { 
    profile, 
    buyShopItem, 
    equipShopItem, 
    unequipShopItem, 
    cycleCharacterMood, 
    tradeDiamondsForCoins,
    applyOutfitPreset,
    buyOutfitPreset
  } = useGame();

  // Shop starts with Outfit Sets first
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('bundles');
  const [genderFilter, setGenderFilter] = useState<'current' | 'all'>('current');
  
  // Interactive Live Dressing Room preview item
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);
  const [previewPreset, setPreviewPreset] = useState<OutfitPreset | null>(null);

  // Compute character config with live preview item or preset applied
  const previewCharacterConfig = { ...profile.character };
  if (previewPreset) {
    if (previewPreset.character.outfit) previewCharacterConfig.outfit = previewPreset.character.outfit as any;
    if (previewPreset.character.outfitColor) previewCharacterConfig.outfitColor = previewPreset.character.outfitColor;
    if (previewPreset.character.hat) previewCharacterConfig.hat = previewPreset.character.hat as any;
    if (previewPreset.character.glasses) previewCharacterConfig.glasses = previewPreset.character.glasses as any;
    if (previewPreset.character.accessory) previewCharacterConfig.accessory = previewPreset.character.accessory as any;
  }
  if (previewItem) {
    switch (previewItem.category) {
      case 'clothes':
        previewCharacterConfig.outfit = previewItem.itemValue as any;
        break;
      case 'hats':
        previewCharacterConfig.hat = previewItem.itemValue as any;
        break;
      case 'glasses':
        previewCharacterConfig.glasses = previewItem.itemValue as any;
        break;
      case 'accessories':
        previewCharacterConfig.accessory = previewItem.itemValue as any;
        break;
      case 'pets':
        previewCharacterConfig.pet = previewItem.itemValue as any;
        break;
      case 'backgrounds':
        previewCharacterConfig.background = previewItem.itemValue as any;
        break;
    }
  }

  // Filter items for currently selected category
  const categoryItems = SHOP_ITEMS.filter(item => {
    if (item.category !== selectedCategory) return false;
    if (genderFilter === 'current') {
      return !item.gender || item.gender === 'all' || item.gender === profile.character.gender;
    }
    return true;
  });

  // Reorganized categories: Sets first, then Clothes, then accessories, hats, glasses, gear, pets, auras, stickers
  const categories: { id: ShopCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'bundles', label: '🏷️ Outfit Sets (12% OFF)', icon: <Tag className="w-4 h-4 text-emerald-400" /> },
    { id: 'clothes', label: '👔 Clothes & Jackets', icon: <Shirt className="w-4 h-4 text-blue-400" /> },
    { id: 'hats', label: '🧢 Hats & Caps', icon: <HardHat className="w-4 h-4 text-amber-300" /> },
    { id: 'glasses', label: '👓 Glasses', icon: <Glasses className="w-4 h-4 text-cyan-400" /> },
    { id: 'accessories', label: '👑 Gear', icon: <Crown className="w-4 h-4 text-yellow-400" /> },
    { id: 'pets', label: '✨ Pets', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'backgrounds', label: '🌌 Auras', icon: <ImageIcon className="w-4 h-4 text-indigo-400" /> },
    { id: 'stickers', label: '😄 Stickers', icon: <Smile className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleAction = (item: ShopItem) => {
    const isOwned = profile.inventory.includes(item.id) || item.price === 0;

    if (isOwned) {
      equipShopItem(item.category, item.itemValue);
    } else {
      const success = buyShopItem(item);
      if (success) {
        setPreviewItem(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header & Balance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
            COSMETIC REWARD SHOP
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Dressing Room & Armory
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Spend practice coins on caps, hats, glasses, gear, pets, and magical auras!
          </p>
        </div>

        {/* Wallet Badges: Coins & Diamonds */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-300 font-black text-sm sm:text-base shadow-glow-gold">
            <span className="text-xl">🪙</span>
            <span>{profile.role === 'admin' ? '∞ Infinite Coins' : `${profile.coins} Coins`}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/40 text-cyan-300 font-black text-sm sm:text-base shadow-sm">
            <span className="text-xl">💎</span>
            <span>{profile.diamonds || 0} Diamonds</span>
            {(profile.diamonds || 0) > 0 && (
              <button
                onClick={() => tradeDiamondsForCoins(1)}
                className="ml-1.5 py-1 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs active:scale-95 transition-all shadow"
                title="Trade 1 Diamond for 5 Coins"
              >
                Trade 1 💎 ➡️ 5 🪙
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: Dressing Room (Left 4 cols) & Shop Catalog (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Dressing Room Preview (Sticky & stays in view when scrolling on ALL devices) */}
        <div className="lg:col-span-4 sticky top-16 lg:top-20 self-start z-30">
          <div className="card-game p-3.5 sm:p-6 border-2 border-purple-500/40 bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 text-center space-y-2.5 sm:space-y-3 shadow-2xl backdrop-blur-md">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE DRESSING ROOM</span>
            </div>

            {/* Character Stage with Ambient Aura */}
            <div 
              className="py-2 sm:py-4 px-2 rounded-3xl bg-slate-950/60 border border-slate-800 flex items-center justify-center min-h-[140px] sm:min-h-[220px] transition-all"
              style={{
                boxShadow: previewCharacterConfig.background !== 'default' 
                  ? '0 0 35px rgba(139, 92, 246, 0.25)' 
                  : 'none'
              }}
            >
              <div className="block sm:hidden">
                <ModularCharacter config={previewCharacterConfig} size={110} animate={true} />
              </div>
              <div className="hidden sm:block">
                <ModularCharacter config={previewCharacterConfig} size={180} animate={true} />
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-xs sm:text-base text-white">{profile.name || 'Hero'}</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {previewItem 
                  ? `Previewing: ${previewItem.name}` 
                  : 'Currently equipped'}
              </p>
            </div>

            {/* Quick Mood Selector inside Dressing Room */}
            <div className="hidden sm:flex flex-col items-center gap-1 pt-1">
              <QuickMoodBar size="sm" />
            </div>

            {previewItem && (
              <button
                onClick={() => setPreviewItem(null)}
                className="text-xs font-bold text-indigo-400 hover:text-white underline pt-0.5"
              >
                Reset Preview
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Categories & Items Catalog */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundService.playClick();
                    setSelectedCategory(cat.id);
                    setPreviewItem(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all border-2 ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-game-btn scale-105'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Bar: Style Filter & Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 pl-2">
                Catalog:{' '}
                <strong className="text-white">
                  {selectedCategory === 'bundles' 
                    ? OUTFIT_PRESETS.length 
                    : selectedCategory === 'stickers' 
                    ? STICKERS.length 
                    : categoryItems.length}
                </strong>{' '}
                {selectedCategory === 'bundles' ? 'ready-to-wear sets' : 'items'} available
              </span>

              {selectedCategory !== 'stickers' && (
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setGenderFilter('current')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      genderFilter === 'current'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {profile.character.gender === 'woman' ? "👧 Women's Style" : "👦 Men's Style"}
                  </button>
                  <button
                    onClick={() => setGenderFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      genderFilter === 'all'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌟 All Styles
                  </button>
                </div>
              )}
            </div>

          {/* VIEW: DISCOUNTED OUTFIT SETS / BUNDLES */}
          {selectedCategory === 'bundles' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OUTFIT_PRESETS
                .filter(preset => genderFilter === 'current' ? preset.gender === profile.character.gender : true)
                .map(preset => {
                  const isOwnedAll = preset.includedItemIds.every(id => profile.inventory.includes(id));
                  const isPreviewingThis = previewPreset?.id === preset.id;
                  const canAfford = profile.role === 'admin' || profile.coins >= preset.bundlePrice;

                  return (
                    <div
                      key={preset.id}
                      className={`card-game p-5 flex flex-col justify-between border-2 transition-all ${
                        isPreviewingThis
                          ? 'border-emerald-400 bg-emerald-950/25 shadow-glow-emerald'
                          : 'border-slate-700 bg-slate-900/90 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {preset.badge}
                          </span>
                          <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                            🔥 {preset.discountPercent}% OFF BUNDLE
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-white">{preset.name}</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{preset.description}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 line-through block">
                              Individual: 🪙 {preset.originalPrice}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm font-black text-amber-300">
                              <span>Set Price:</span>
                              <span>🪙 {preset.bundlePrice}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              setPreviewItem(null);
                              setPreviewPreset(preset);
                            }}
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                          >
                            {isPreviewingThis ? 'Previewing ✓' : 'Try On Set'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                        {isOwnedAll ? (
                          <button
                            onClick={() => {
                              applyOutfitPreset(preset);
                              setPreviewPreset(null);
                            }}
                            className="btn-game-emerald w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Equip Full Set</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const success = buyOutfitPreset(preset);
                              if (success) setPreviewPreset(null);
                            }}
                            disabled={!canAfford}
                            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98 ${
                              canAfford
                                ? 'btn-game-gold text-slate-950'
                                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            }`}
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Buy Set for 🪙 {preset.bundlePrice}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : selectedCategory === 'stickers' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STICKERS.map(sticker => {
                const isOwned = profile.unlockedStickers.includes(sticker.id) || sticker.price === 0;

                return (
                  <div
                    key={sticker.id}
                    className="card-game p-4 flex items-center justify-between gap-3 border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
                        {sticker.emoji}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm">{sticker.title}</h4>
                        <p className="text-xs text-slate-400">{sticker.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isOwned ? (
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (profile.coins >= sticker.price) {
                              soundService.playCoin();
                              profile.unlockedStickers.push(sticker.id);
                              buyShopItem({
                                id: sticker.id,
                                name: sticker.title,
                                category: 'stickers',
                                price: sticker.price,
                                rarity: 'rare',
                                description: sticker.description,
                                itemType: 'sticker',
                                itemValue: sticker.id,
                              });
                            } else {
                              soundService.playError();
                            }
                          }}
                          disabled={profile.coins < sticker.price}
                          className="btn-game-gold py-1.5 px-3 font-bold text-xs flex items-center gap-1 disabled:opacity-50"
                        >
                          <span>🪙 {sticker.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW: HATS, GLASSES, GEAR, PETS, AURAS */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categoryItems.map(item => {
                const isOwned = profile.inventory.includes(item.id) || item.price === 0;
                
                // Check if currently equipped
                let isEquipped = false;
                if (item.category === 'clothes' && profile.character.outfit === item.itemValue) isEquipped = true;
                if (item.category === 'hats' && profile.character.hat === item.itemValue) isEquipped = true;
                if (item.category === 'glasses' && profile.character.glasses === item.itemValue) isEquipped = true;
                if (item.category === 'accessories' && profile.character.accessory === item.itemValue) isEquipped = true;
                if (item.category === 'pets' && profile.character.pet === item.itemValue) isEquipped = true;
                if (item.category === 'backgrounds' && profile.character.background === item.itemValue) isEquipped = true;

                const isPreviewing = previewItem?.id === item.id;

                let rarityColor = 'border-slate-700';
                if (item.rarity === 'rare') rarityColor = 'border-cyan-500/50';
                if (item.rarity === 'epic') rarityColor = 'border-purple-500/50';
                if (item.rarity === 'legendary') rarityColor = 'border-amber-500/50';

                return (
                  <div
                    key={item.id}
                    onClick={() => setPreviewItem(item)}
                    className={`card-game p-4.5 flex flex-col justify-between border-2 transition-all cursor-pointer ${
                      isPreviewing 
                        ? 'border-purple-400 bg-purple-950/30 shadow-glow-primary' 
                        : isEquipped
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : `${rarityColor} hover:border-slate-500 hover:bg-slate-800`
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300' :
                            item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                            item.rarity === 'rare' ? 'bg-cyan-500/20 text-cyan-300' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {item.rarity}
                          </span>
                          {item.gender && item.gender !== 'all' && (
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                              item.gender === 'woman' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {item.gender === 'woman' ? '👧 Woman' : '👦 Man'}
                            </span>
                          )}
                        </div>

                        {isEquipped && (
                          <span className="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            <span>EQUIPPED</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-base text-white mt-2">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300"
                      >
                        Try on
                      </button>

                      {isEquipped ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unequipShopItem(item.category);
                            if (previewItem?.id === item.id) setPreviewItem(null);
                          }}
                          className="py-1.5 px-3 rounded-xl border border-rose-500/50 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 font-bold text-xs transition-colors"
                        >
                          Unequip
                        </button>
                      ) : isOwned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(item);
                          }}
                          className="btn-game-primary py-1.5 px-4 font-bold text-xs"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(item);
                          }}
                          disabled={profile.role !== 'admin' && profile.coins < item.price}
                          className="btn-game-gold py-1.5 px-3.5 font-extrabold text-xs flex items-center gap-1 disabled:opacity-40"
                        >
                          <span>🪙 {item.price}</span>
                          <span>{profile.role === 'admin' ? 'UNLOCK (ADMIN)' : 'BUY'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Floating Sticky Preview Dock */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50 flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/95 border-2 border-purple-500/70 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-purple-500/40 overflow-hidden flex items-center justify-center shrink-0">
          <ModularCharacter config={previewCharacterConfig} size="sm" animate={true} />
        </div>
        <div className="text-left pr-1 max-w-[130px]">
          <span className="text-[10px] font-black uppercase text-purple-400 block truncate">
            {previewItem ? 'Previewing' : 'Equipped'}
          </span>
          <span className="text-xs font-bold text-white block truncate">
            {previewItem ? previewItem.name : (profile.name || 'Hero')}
          </span>
        </div>
        {previewItem && (
          <button
            onClick={() => setPreviewItem(null)}
            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold"
            title="Reset Preview"
          >
            ✕
          </button>
        )}
      </div>

    </div>
  );
};
