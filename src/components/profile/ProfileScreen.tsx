import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { 
  CharacterGender, 
  SkinTone, 
  HairStyle, 
  HairColor, 
  CharacterExpression,
  OutfitType,
  OutfitColor,
  HatType,
  GlassesType,
  AccessoryType,
  PetType,
  BackgroundType
} from '../../types';
import { soundService } from '../../services/soundService';
import { formatTimeSpent, formatExactDateTime } from '../../services/presenceService';
import { 
  User, 
  Clock, 
  CheckCircle2, 
  Palette, 
  Award, 
  ArrowLeft, 
  LogOut,
  History,
  Gift,
  Shirt,
  Sparkles
} from 'lucide-react';

const SKIN_TONES: { color: SkinTone; label: string }[] = [
  { color: '#FFDFC4', label: 'Oq' },
  { color: '#F0C08A', label: 'Bug‘doyrang' },
  { color: '#D49B6A', label: 'Tilla' },
  { color: '#A1663B', label: 'Qorachadan' },
  { color: '#5C381E', label: 'Qoramtir' },
];

const HAIR_STYLES_MAN: { id: HairStyle; label: string }[] = [
  { id: 'fade', label: 'Fade' },
  { id: 'curly_top', label: 'Jingalak' },
  { id: 'side_sweep', label: 'Yonlama' },
  { id: 'afro', label: 'Afro' },
];

const HAIR_STYLES_WOMAN: { id: HairStyle; label: string }[] = [
  { id: 'ponytail', label: 'Dumba (Ponytail)' },
  { id: 'wavy_bob', label: 'To‘lqinsimon bob' },
  { id: 'braids', label: 'O‘rilgan soch' },
  { id: 'afro', label: 'Afro' },
];

const HAIR_COLORS: { color: HairColor; label: string }[] = [
  { color: '#1E293B', label: 'Qora' },
  { color: '#4A2E18', label: 'Jigarrang' },
  { color: '#D97706', label: 'Sariq (Blonde)' },
  { color: '#991B1B', label: 'Qizg‘ish' },
  { color: '#3B82F6', label: 'Ko‘k' },
  { color: '#8B5CF6', label: 'Binafsha' },
];

const OUTFITS: { id: OutfitType; label: string; gender?: 'all' | 'man' | 'woman' }[] = [
  { id: 'hoodie', label: 'Xudi (Hoodie)', gender: 'all' },
  { id: 'varsity', label: 'Kollej kurtkasi', gender: 'all' },
  { id: 'casual_tee', label: 'Futbolka', gender: 'all' },
  { id: 'blazer', label: 'Pidjak (Blazer)', gender: 'all' },
  { id: 'explorer', label: 'Sayohat kiyimi', gender: 'all' },
  { id: 'cyber_jacket', label: 'Kiber kurtka', gender: 'all' },
  { id: 'knit_sweater', label: 'Qalin sviter', gender: 'all' },
  { id: 'tracksuit', label: 'Sport kostyumi', gender: 'all' },
  { id: 'leather_biker', label: 'Charm kurtka', gender: 'all' },
  { id: 'dress', label: 'Ko‘ylak (Dress)', gender: 'woman' },
  { id: 'summer_top', label: 'Yozgi kofta', gender: 'woman' },
  { id: 'turtleneck', label: 'Vodolazka', gender: 'woman' },
  { id: 'hoodie_cropped', label: 'Kalta xudi', gender: 'woman' },
  { id: 'kimono', label: 'Kimono', gender: 'woman' },
];

const OUTFIT_COLORS: { color: OutfitColor; label: string }[] = [
  { color: '#6366F1', label: 'Indigo' },
  { color: '#10B981', label: 'Zumrad' },
  { color: '#F43F5E', label: 'Pushti / Qizil' },
  { color: '#F59E0B', label: 'Sariq / Oltin' },
  { color: '#8B5CF6', label: 'Binafsha' },
  { color: '#06B6D4', label: 'Havorang' },
  { color: '#3B82F6', label: 'Moviy' },
  { color: '#1E293B', label: 'To‘q qora' },
];

const HATS: { id: HatType; label: string }[] = [
  { id: 'none', label: 'Bosh kiyimsiz' },
  { id: 'snapback', label: 'Kepka (Snapback)' },
  { id: 'beanie', label: 'Qishki shapka (Beanie)' },
  { id: 'bucket_hat', label: 'Panama (Bucket)' },
  { id: 'baseball_cap', label: 'Beysbolka' },
  { id: 'crown', label: 'Toj (Crown)' },
  { id: 'tiara', label: 'Malika toji (Tiara)' },
  { id: 'cat_ears', label: 'Mushuk quloqlari' },
  { id: 'ribbon_bow', label: 'Bantik' },
  { id: 'flower_crown', label: 'Gulchambar' },
  { id: 'beret', label: 'Beretka' },
  { id: 'headband', label: 'Bosh bog‘ichi' },
  { id: 'fedora', label: 'Shlyapa (Fedora)' },
  { id: 'cowboy', label: 'Kovboy shlyapasi' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'top_hat', label: 'Silindr shapka' },
  { id: 'ninja_headband', label: 'Ninja bog‘ichi' },
  { id: 'wizard', label: 'Sehrgar qalpoq' },
];

const GLASSES: { id: GlassesType; label: string }[] = [
  { id: 'none', label: 'Ko‘zoynaksiz' },
  { id: 'specs', label: 'Klassik ko‘zoynak' },
  { id: 'sunglasses', label: 'Quyosh ko‘zoynagi' },
  { id: 'retro_round', label: 'Dumaloq retro' },
  { id: 'heart_shades', label: 'Yurakcha ko‘zoynak' },
  { id: 'aviator', label: 'Aviator' },
  { id: 'cat_eye', label: 'Mushuk ko‘zli' },
  { id: 'star_shades', label: 'Yulduzcha ko‘zoynak' },
];

const ACCESSORIES: { id: AccessoryType; label: string }[] = [
  { id: 'none', label: 'Aksessuarsiz' },
  { id: 'headphones', label: 'Quloqchin (Headphones)' },
  { id: 'gold_chain', label: 'Oltin zanjir' },
  { id: 'backpack', label: 'Ryukzak' },
  { id: 'pearl_necklace', label: 'Marvarid marjon' },
  { id: 'scarf', label: 'Sharf' },
  { id: 'silver_pendant', label: 'Kumush zanjir' },
  { id: 'choker', label: 'Choker' },
  { id: 'bowtie', label: 'Kapalak galstuk' },
  { id: 'medal', label: 'Oltin medal' },
];

const PETS: { id: PetType; label: string; emoji: string }[] = [
  { id: 'none', label: 'Uy hayvonsiz', emoji: '🚫' },
  { id: 'cat', label: 'Mushukcha', emoji: '🐱' },
  { id: 'robot_pup', label: 'Robot kuchukcha', emoji: '🐶' },
  { id: 'owl', label: 'Boyo‘g‘li', emoji: '🦉' },
  { id: 'bunny', label: 'Quyoncha', emoji: '🐰' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'dragon', label: 'Ajdaho', emoji: '🐲' },
  { id: 'phoenix', label: 'Humokush (Phoenix)', emoji: '🦅' },
  { id: 'slime', label: 'Slime', emoji: '🟢' },
];

const BACKGROUNDS: { id: BackgroundType; label: string }[] = [
  { id: 'default', label: 'Standart' },
  { id: 'cosmic', label: 'Kosmos' },
  { id: 'sunset', label: 'Quyosh botishi' },
  { id: 'cyber', label: 'Kiber shahar' },
  { id: 'emerald_grove', label: 'Zumrad o‘rmon' },
  { id: 'sakura', label: 'Sakura bog‘i' },
  { id: 'aurora', label: 'Shimol yog‘dusi' },
  { id: 'starlight', label: 'Yulduzli tun' },
  { id: 'bubblegum', label: 'Pushti orom' },
  { id: 'matrix', label: 'Matritsa' },
];

const EXPRESSIONS: { id: CharacterExpression; label: string; emoji: string }[] = [
  { id: 'idle', label: 'Xotirjam', emoji: '🙂' },
  { id: 'happy', label: 'Xursand', emoji: '😄' },
  { id: 'thinking', label: 'Fikrchan', emoji: '🤔' },
  { id: 'victory', label: 'G‘alaba', emoji: '😎' },
  { id: 'oops', label: 'Hayratda', emoji: '😮' },
];

export const ProfileScreen: React.FC = () => {
  const { 
    profile, 
    updateCharacter, 
    updateLevel, 
    diamondAwardLogs,
    giftRequests,
    logout, 
    setScreen 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'customizer' | 'diamonds' | 'gift_history' | 'info'>('customizer');
  const [customizerSubTab, setCustomizerSubTab] = useState<'base' | 'outfit' | 'hat' | 'glasses' | 'accessory' | 'pet' | 'background'>('outfit');

  const myDiamondLogs = (profile.diamondHistory && profile.diamondHistory.length > 0)
    ? profile.diamondHistory
    : diamondAwardLogs.filter(l => l.studentId === profile.id);

  const myGiftRequests = (profile.giftRequests && profile.giftRequests.length > 0)
    ? profile.giftRequests
    : giftRequests.filter(r => r.studentId === profile.id);

  const handleGenderToggle = (gender: CharacterGender) => {
    soundService.playSuccess();
    if (gender === 'man') {
      const isFeminineOutfit = ['dress', 'summer_top', 'turtleneck', 'hoodie_cropped', 'kimono'].includes(profile.character.outfit);
      updateCharacter({
        gender: 'man',
        hairStyle: 'fade',
        outfit: isFeminineOutfit ? 'hoodie' : profile.character.outfit,
        outfitColor: '#3B82F6',
        hat: ['flower_crown', 'tiara', 'cat_ears', 'ribbon_bow'].includes(profile.character.hat) ? 'none' : profile.character.hat,
        glasses: profile.character.glasses === 'cat_eye' ? 'none' : profile.character.glasses,
        accessory: ['choker', 'pearl_necklace', 'silver_pendant'].includes(profile.character.accessory) ? 'none' : profile.character.accessory,
      });
    } else {
      updateCharacter({
        gender: 'woman',
        hairStyle: 'ponytail',
        outfit: 'dress',
        outfitColor: '#F43F5E',
        hat: profile.character.hat === 'snapback' ? 'none' : profile.character.hat,
        accessory: profile.character.accessory === 'bowtie' ? 'none' : profile.character.accessory,
      });
    }
  };

  return (
    <div className="space-y-5 pb-28 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => { soundService.playClick(); setScreen('home'); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-all active:scale-95 shadow-sm"
          title="Tizimdan chiqish"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>

      {/* Player Showcase Banner */}
      <div className="card-game p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 shadow-game-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Modular Character Spotlight */}
            <div className="p-3 rounded-3xl bg-slate-800/80 border-2 border-indigo-500/60 shadow-inner">
              <ModularCharacter config={profile.character} size={130} animate={true} />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                <span>💎 {profile.diamonds || 0} ta olmos mavjud</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name || 'O‘quvchi'}</h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Ta’lim bosqichi: <span className="text-indigo-400 font-bold uppercase">{profile.levelId}</span>
              </p>

              {/* Move / Switch Curriculum Level */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Bosqich:</span>
                {(['beginner', 'elementary', 'pre_intermediate'] as const).map(lvlId => {
                  const isCur = profile.levelId === lvlId;
                  const label = lvlId === 'beginner' ? 'Beginner' : lvlId === 'elementary' ? 'Elementary' : 'Pre-Intermediate';
                  return (
                    <button
                      key={lvlId}
                      onClick={() => updateLevel(lvlId)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all ${
                        isCur
                          ? 'bg-indigo-600 text-white border border-indigo-400 shadow-sm scale-105'
                          : 'bg-slate-800/90 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Diamond Spotlight Card */}
          <div className="p-4 rounded-3xl bg-slate-800/90 border border-cyan-500/40 text-center min-w-[160px] shadow-lg">
            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
              Olmos balansi
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              💎 {profile.diamonds || 0}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Admin tomonidan beriladi
            </span>
          </div>

        </div>

        {/* Study Time */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-extrabold text-white">Platformada o‘qilgan vaqt</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-bold">
            <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Jami:</span>
              <span className="text-white font-black">{formatTimeSpent(profile.totalTimeSpentMinutes)}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Bugun:</span>
              <span className="text-indigo-300 font-black">{formatTimeSpent(profile.todayTimeSpentMinutes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Personaj kiyintirish, Olmoslar tarixi, Sovg'alar tarixi, Profil */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto scrollbar-none">
        <button
          onClick={() => { soundService.playClick(); setActiveTab('customizer'); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'customizer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kiyintirish (Bepul)</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('diamonds'); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'diamonds'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>Olmoslar tarixi ({myDiamondLogs.length})</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('gift_history'); }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gift_history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" />
          <span>Sovg‘alarim ({myGiftRequests.length})</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('info'); }}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'info'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Ma’lumotlar</span>
        </button>
      </div>

      {/* 1. CHARACTER CUSTOMIZER STUDIO (100% FREE) */}
      {activeTab === 'customizer' && (
        <div className="card-game p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                100% Bepul Kiyintirish Studiyasi
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Personajingiz ko‘rinishini sozlang
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Barcha kiyimlar, aksessuarlar, sochlar va hayvonlar mutlaqo bepul. Xohlagan uslubingizni tanlang!
              </p>
            </div>
          </div>

          {/* Sub-categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'outfit', label: '👕 Kiyimlar' },
              { id: 'base', label: '👤 Tana va Soch' },
              { id: 'hat', label: '🧢 Bosh kiyim' },
              { id: 'glasses', label: '👓 Ko‘zoynak' },
              { id: 'accessory', label: '🎒 Aksessuar' },
              { id: 'pet', label: '🐾 Uy hayvoni' },
              { id: 'background', label: '🌄 Orqa fon' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => { soundService.playClick(); setCustomizerSubTab(sub.id as any); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  customizerSubTab === sub.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* SubTab: OUTFITS */}
          {customizerSubTab === 'outfit' && (
            <div className="space-y-6">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Kiyim modeli (Bepul):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {OUTFITS.filter(o => !o.gender || o.gender === 'all' || o.gender === profile.character.gender).map(item => {
                    const isSelected = profile.character.outfit === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundService.playSuccess();
                          updateCharacter({ outfit: item.id });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-black block">{item.label}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Bepul</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Kiyim rangi:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {OUTFIT_COLORS.map(item => (
                    <button
                      key={item.color}
                      onClick={() => {
                        soundService.playClick();
                        updateCharacter({ outfitColor: item.color });
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${
                        profile.character.outfitColor === item.color
                          ? 'border-white scale-110 ring-2 ring-indigo-400'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubTab: BASE & HAIR */}
          {customizerSubTab === 'base' && (
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Personaj jinsi:
                </span>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <button
                    onClick={() => handleGenderToggle('man')}
                    className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                      profile.character.gender === 'man'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-game-btn'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👦 O‘g‘il bola</span>
                  </button>
                  <button
                    onClick={() => handleGenderToggle('woman')}
                    className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                      profile.character.gender === 'woman'
                        ? 'bg-purple-600 border-purple-400 text-white shadow-game-btn'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👧 Qiz bola</span>
                  </button>
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Teri rangi:
                </span>
                <div className="flex gap-2.5">
                  {SKIN_TONES.map(item => (
                    <button
                      key={item.color}
                      onClick={() => updateCharacter({ skinTone: item.color })}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${
                        profile.character.skinTone === item.color
                          ? 'border-indigo-400 scale-110 ring-2 ring-indigo-400/50'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Soch turmagi:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-md">
                  {(profile.character.gender === 'man' ? HAIR_STYLES_MAN : HAIR_STYLES_WOMAN).map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateCharacter({ hairStyle: item.id })}
                      className={`py-2.5 px-2 text-center rounded-xl font-bold text-xs border transition-all ${
                        profile.character.hairStyle === item.id
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Soch rangi:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {HAIR_COLORS.map(item => (
                    <button
                      key={item.color}
                      onClick={() => updateCharacter({ hairColor: item.color })}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        profile.character.hairColor === item.color
                          ? 'border-white scale-110 ring-2 ring-indigo-400/50'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>

              {/* Facial Mood */}
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                  Kayfiyat / yuz ifodasi:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXPRESSIONS.map(exp => (
                    <button
                      key={exp.id}
                      onClick={() => updateCharacter({ expression: exp.id })}
                      className={`py-2 px-3.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                        profile.character.expression === exp.id
                          ? 'bg-amber-500 border-amber-300 text-slate-900 shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <span>{exp.emoji}</span>
                      <span>{exp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SubTab: HATS */}
          {customizerSubTab === 'hat' && (
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                Bosh kiyimni tanlang (Bepul):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {HATS.map(item => {
                  const isSelected = profile.character.hat === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playSuccess();
                        updateCharacter({ hat: item.id });
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black block">{item.label}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Bepul</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab: GLASSES */}
          {customizerSubTab === 'glasses' && (
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                Ko‘zoynakni tanlang (Bepul):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {GLASSES.map(item => {
                  const isSelected = profile.character.glasses === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playSuccess();
                        updateCharacter({ glasses: item.id });
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black block">{item.label}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Bepul</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab: ACCESSORIES */}
          {customizerSubTab === 'accessory' && (
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                Aksessuarni tanlang (Bepul):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ACCESSORIES.map(item => {
                  const isSelected = profile.character.accessory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playSuccess();
                        updateCharacter({ accessory: item.id });
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black block">{item.label}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Bepul</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab: PETS */}
          {customizerSubTab === 'pet' && (
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                Hamroh hayvonni tanlang (Bepul):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PETS.map(item => {
                  const isSelected = profile.character.pet === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playSuccess();
                        updateCharacter({ pet: item.id });
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className="text-xs font-black block text-left">{item.label}</span>
                        <span className="text-[10px] text-emerald-400 font-bold block text-left">Bepul</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab: BACKGROUNDS */}
          {customizerSubTab === 'background' && (
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                Orqa fonni tanlang (Bepul):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BACKGROUNDS.map(item => {
                  const isSelected = profile.character.background === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playSuccess();
                        updateCharacter({ background: item.id });
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black block">{item.label}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Bepul</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. DIAMOND HISTORY */}
      {activeTab === 'diamonds' && (
        <div className="card-game p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                OLMOSLAR TARIXI
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Berilgan olmoslar qaydnomasi
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Joriy balans</span>
              <span className="text-2xl font-black text-cyan-400">💎 {profile.diamonds || 0}</span>
            </div>
          </div>

          {myDiamondLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Hali olmos berilmagan. Topshiriqlarni to‘liq bajaring yoki imtihonlarda yuqori natija ko‘rsatib, o‘qituvchidan olmos oling!
            </div>
          ) : (
            <div className="space-y-2.5">
              {myDiamondLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-black">
                        +{log.amount} 💎
                      </span>
                      <h4 className="font-bold text-sm text-white">{log.reason}</h4>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Berdi: <strong className="text-slate-300">{log.awardedByName}</strong></span>
                      <span>•</span>
                      <span>{formatExactDateTime(log.awardedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. GIFT REQUESTS HISTORY */}
      {activeTab === 'gift_history' && (
        <div className="card-game p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                SOVG‘ALAR SO‘ROVLARI
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Tanlangan sovg‘alar holati
              </h3>
            </div>
            <button
              onClick={() => setScreen('gifts')}
              className="py-2 px-3.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-all shadow-sm"
            >
              Sovg‘alar katalogini ochish
            </button>
          </div>

          {myGiftRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Siz hali hech qanday sovg‘a so‘rovi yaratmagansiz. "Sovg‘alar" bo‘limidan olmoslaringiz evaziga sovg‘a tanlashingiz mumkin.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myGiftRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{req.giftTitle}</h4>
                      <span className="text-xs text-cyan-400 font-black">
                        💎 {req.diamondPrice} olmos
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      So‘rov vaqti: {formatExactDateTime(req.requestedAt)}
                    </p>
                  </div>

                  <div>
                    {req.status === 'DELIVERED' ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Topshirildi</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Kutilmoqda</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. ACCOUNT INFO */}
      {activeTab === 'info' && (
        <div className="card-game p-6 space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              AKKAUNT MA’LUMOTLARI
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Foydalanuvchi profili
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Ism:</span>
              <span className="font-bold text-white">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Foydalanuvchi nomi:</span>
              <span className="font-mono font-bold text-indigo-300">{profile.username}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Ta’lim bosqichi:</span>
              <span className="font-bold text-emerald-400 uppercase">{profile.levelId}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Olmos balansi:</span>
              <span className="font-bold text-cyan-400">💎 {profile.diamonds || 0} olmos</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
