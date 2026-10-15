import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GiftItem, GiftRequest } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  Gift, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export const GiftsScreen: React.FC = () => {
  const { profile, gifts, giftRequests, purchaseGift, setScreen } = useGame();
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_requests'>('catalog');
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const activeGifts = gifts.filter(g => g.isActive);
  const myRequests = giftRequests.filter(r => r.studentId === profile.id);
  const currentDiamonds = profile.role === 'admin' ? 999999 : (profile.diamonds || 0);

  const handleOpenConfirm = (gift: GiftItem) => {
    soundService.playClick();
    setSelectedGift(gift);
    setFeedbackMsg(null);
  };

  const handleConfirmPurchase = () => {
    if (!selectedGift || isSubmitting) return;

    if (currentDiamonds < selectedGift.diamondPrice && profile.role !== 'admin') {
      soundService.playError();
      setFeedbackMsg({
        text: `Olmoslaringiz yetarli emas! Sizda ${currentDiamonds} ta, sovg'a uchun ${selectedGift.diamondPrice} ta olmos kerak.`,
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    const res = purchaseGift(selectedGift.id);

    if (res.success) {
      setFeedbackMsg({
        text: res.message || "Sovg'a so'rovi qabul qilindi! O'qituvchi tez orada sovg'ani topshiradi.",
        isError: false,
      });
      setTimeout(() => {
        setSelectedGift(null);
        setIsSubmitting(false);
        setActiveTab('my_requests');
      }, 1200);
    } else {
      setFeedbackMsg({
        text: res.message || "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
        isError: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-2 border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Sovg‘alar Bo‘limi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Olmoslar Evaziga Sovg‘alar
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg leading-relaxed">
            Faol o‘qishingiz va imtihonlarda qo‘lga kiritgan olmoslaringiz evaziga admin tasdiqlagan sovg‘alarni tanlang.
          </p>
        </div>

        {/* Diamond Balance Indicator */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 text-center shrink-0 w-full sm:w-auto shadow-md">
          <span className="text-xs font-bold text-slate-400 block mb-1">Mavjud Balans</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">💎</span>
            <span className="text-3xl font-black text-cyan-300">
              {profile.role === 'admin' ? 'Admin (∞)' : currentDiamonds}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block mt-1">
            olmos
          </span>
        </div>
      </div>

      {/* Tabs: Catalog vs My Requests */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('catalog');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'catalog'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Sovg‘alar Katalogi ({activeGifts.length})</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('my_requests');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'my_requests'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Mening So‘rovlarim ({myRequests.length})</span>
        </button>
      </div>

      {/* 1. CATALOG TAB */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {activeGifts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <Gift className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Hozircha sovg‘alar mavjud emas</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                Administrator tez orada yangi sovg‘alarni e’lon qiladi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGifts.map(gift => {
                const canAfford = currentDiamonds >= gift.diamondPrice || profile.role === 'admin';

                return (
                  <div
                    key={gift.id}
                    className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-3">
                      {/* Icon or image */}
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                        {gift.imageUrl ? (
                          <img 
                            src={gift.imageUrl} 
                            alt={gift.name} 
                            className="w-12 h-12 object-cover rounded-xl"
                          />
                        ) : (
                          <span>{gift.icon || '🎁'}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-white leading-tight">
                          {gift.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed min-h-[36px]">
                          {gift.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 font-black text-cyan-300 text-base">
                        <span>💎</span>
                        <span>{gift.diamondPrice}</span>
                        <span className="text-xs font-semibold text-slate-400">olmos</span>
                      </div>

                      <button
                        onClick={() => handleOpenConfirm(gift)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-sm ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {canAfford ? "Sovg‘ani olish" : "Yetarli emas"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. MY REQUESTS TAB */}
      {activeTab === 'my_requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Siz hali sovg‘a so‘ramagansiz</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
                Katalogdan o‘zingizga yoqqan sovg‘ani tanlang va olmoslaringiz evaziga so‘rov yuboring.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map(req => {
                const isDelivered = req.status === 'DELIVERED';
                const formattedDate = new Date(req.requestedAt).toLocaleDateString('uz-UZ', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={req.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                        <span>{req.giftIcon || '🎁'}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-white text-base">{req.giftName}</h4>
                          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                            💎 {req.diamondPrice} olmos
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs">
                          So‘rov yuborilgan vaqt: {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 w-full sm:w-auto">
                      {isDelivered ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-black">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Topshirildi ✅</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                          <Clock className="w-4 h-4 animate-spin-slow" />
                          <span>Kutilmoqda (O‘qituvchi topshiradi)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION PURCHASE MODAL */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-4xl mx-auto shadow-inner">
                {selectedGift.icon || '🎁'}
              </div>
              <h3 className="text-xl font-black text-white">{selectedGift.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{selectedGift.description}</p>
            </div>

            {/* Price & Balance Calculation Card */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Sovg‘a narxi:</span>
                <span className="font-black text-cyan-300 text-sm">💎 {selectedGift.diamondPrice} olmos</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Hozirgi balansingiz:</span>
                <span className="font-bold text-white">💎 {profile.role === 'admin' ? 'Admin' : currentDiamonds} olmos</span>
              </div>
              <div className="pt-2 border-t border-slate-700/80 flex justify-between items-center font-bold">
                <span className="text-slate-200">Xariddan keyingi balans:</span>
                <span className={`font-black text-sm ${
                  (currentDiamonds - selectedGift.diamondPrice < 0 && profile.role !== 'admin') 
                    ? 'text-rose-400' 
                    : 'text-emerald-400'
                }`}>
                  💎 {profile.role === 'admin' ? 'Admin' : Math.max(0, currentDiamonds - selectedGift.diamondPrice)} olmos
                </span>
              </div>
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                feedbackMsg.isError 
                  ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              }`}>
                {feedbackMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedGift(null)}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all disabled:opacity-50"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isSubmitting || (currentDiamonds < selectedGift.diamondPrice && profile.role !== 'admin')}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Rasmiylashtirilmoqda...</span>
                ) : (
                  <span>Ha, tasdiqlayman</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
