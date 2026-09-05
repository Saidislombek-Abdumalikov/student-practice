import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, CheckCircle2, Headphones, AlertCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface RestrictedListeningPlayerProps {
  audioText?: string;
  audioUrl?: string;
  targetMinListens?: number;
  initialListens?: number;
  onListenCompleted?: (currentCount: number, totalSeconds: number) => void;
}

export const RestrictedListeningPlayer: React.FC<RestrictedListeningPlayerProps> = ({
  audioText,
  audioUrl,
  targetMinListens = 3,
  initialListens = 0,
  onListenCompleted
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listenCount, setListenCount] = useState(initialListens);
  const [totalSecondsListened, setTotalSecondsListened] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthTimerRef = useRef<any>(null);

  // Compute estimated duration for text-to-speech (~130 words per min)
  const estimatedTtsDuration = audioText ? Math.max(15, Math.ceil(audioText.split(' ').length / 2.2)) : 30;

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(Math.floor(audio.duration));
      };

      audio.ontimeupdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };

      audio.onended = () => {
        setIsPlaying(false);
        handleCompletedCycle();
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    } else {
      setDuration(estimatedTtsDuration);
    }
  }, [audioUrl, audioText]);

  // Handle SpeechSynthesis simulation progress
  useEffect(() => {
    if (!audioUrl && isPlaying) {
      synthTimerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          setTotalSecondsListened(s => s + 1);
          if (next >= duration) {
            clearInterval(synthTimerRef.current);
            setIsPlaying(false);
            handleCompletedCycle();
            return duration;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(synthTimerRef.current);
    }

    return () => clearInterval(synthTimerRef.current);
  }, [isPlaying, audioUrl, duration]);

  const handleCompletedCycle = () => {
    soundService.playSuccess();
    const newCount = listenCount + 1;
    setListenCount(newCount);
    if (onListenCompleted) {
      onListenCompleted(newCount, totalSecondsListened);
    }
  };

  const handlePlayPause = () => {
    soundService.playClick();
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      // Start or resume
      if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else if (audioText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(audioText);
        utterance.lang = 'en-US';
        utterance.rate = 0.90;
        synthRef.current = utterance;
        
        utterance.onend = () => {
          setIsPlaying(false);
          handleCompletedCycle();
        };

        window.speechSynthesis.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  // Rewind back 10 seconds (Allowed!)
  const handleRewind10 = () => {
    soundService.playClick();
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.floor((currentTime / duration) * 100)) : 0;
  const isRequirementMet = listenCount >= targetMinListens;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="card-game p-5 bg-slate-900/95 border-2 border-indigo-500/40 rounded-3xl shadow-xl space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Restricted English Audio Player</h3>
            <p className="text-[11px] text-slate-400 font-medium">Forward scrubbing disabled • Rewind -10s allowed</p>
          </div>
        </div>

        {/* Listen Counter Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-black ${
          isRequirementMet 
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
            : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
        }`}>
          {isRequirementMet ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
          <span>Listened: {listenCount} / {targetMinListens} times</span>
        </div>
      </div>

      {/* Progress Bar (Strictly locked: Cannot click forward) */}
      <div className="space-y-1.5">
        <div 
          className="relative w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700 select-none cursor-not-allowed"
          title="Forward scrubbing is locked for homework integrity. Listen actively!"
        >
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercent}%` }}
          >
            {isPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[10px] uppercase font-sans text-indigo-400 font-black">
            🔒 Forward Seek Locked
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pt-1">
        {/* Rewind -10s Button */}
        <button
          onClick={handleRewind10}
          className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          title="Rewind 10 seconds back"
        >
          <RotateCcw className="w-4 h-4" />
          <span>-10s</span>
        </button>

        {/* Play / Pause Primary Button */}
        <button
          onClick={handlePlayPause}
          className={`py-3 px-8 rounded-2xl text-sm font-black flex items-center gap-2.5 shadow-game-btn transition-all active:scale-95 ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-primary'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isPlaying ? 'Pause Audio' : currentTime > 0 ? 'Continue Audio' : 'Start Listening'}</span>
        </button>
      </div>

      {/* Requirement Notice */}
      {!isRequirementMet && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Teacher required listening to this audio at least <strong>{targetMinListens} times</strong>. Write the words in your notebook while listening!
          </span>
        </div>
      )}
    </div>
  );
};
