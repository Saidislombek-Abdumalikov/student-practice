import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Cpu, Scan, Check } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface SimulatedAiScannerModalProps {
  photoUrl: string;
  onComplete: () => void;
  onClose: () => void;
}

export const SimulatedAiScannerModal: React.FC<SimulatedAiScannerModalProps> = ({
  photoUrl,
  onComplete,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing AI Handwriting Scanner...');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    soundService.playLevelUp();

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8 + 4);
        if (next >= 100) {
          clearInterval(interval);
          setStatusText('Scan complete! Handwriting verified and submitted.');
          setIsDone(true);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          soundService.playSuccess();
          return 100;
        }

        if (next < 25) {
          setStatusText('AI Vision OCR: Scanning handwritten notebook page...');
        } else if (next < 55) {
          setStatusText('Analyzing English spelling, line margins, and sentence structure...');
        } else if (next < 85) {
          setStatusText('Cross-referencing audio transcript against student transcript...');
        } else {
          setStatusText('Finalizing AI quality index and packaging for teacher review...');
        }

        return next;
      });
    }, 160);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="card-game max-w-md w-full p-6 bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              AI Transcript Scanner
            </span>
            <h3 className="text-lg font-black text-white">Analyzing Notebook Page</h3>
          </div>
        </div>

        {/* Photo Container with Scanning Laser Animation */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border-2 border-indigo-500/40 bg-slate-950 shadow-inner">
          <img 
            src={photoUrl} 
            alt="Handwritten transcript" 
            className="w-full h-full object-cover opacity-85"
          />

          {/* Futuristic Scanning Beam */}
          {!isDone && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce top-1/2 -translate-y-1/2" />
          )}

          {/* Scan Grid Overlay */}
          <div className="absolute inset-0 bg-indigo-950/20 pointer-events-none border border-cyan-500/20" />
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Scan className="w-4 h-4 text-cyan-400" />
              {statusText}
            </span>
            <span className="font-mono text-cyan-400 font-black">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Success / Action Button */}
        {isDone ? (
          <button
            onClick={onComplete}
            className="btn-game-emerald w-full py-3.5 flex items-center justify-center gap-2 font-black text-sm shadow-glow-emerald"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Done! View My Homework</span>
          </button>
        ) : (
          <div className="text-center text-[11px] text-slate-400 font-semibold py-1">
            Please wait while AI verifies your handwriting clarity...
          </div>
        )}

      </div>
    </div>
  );
};
