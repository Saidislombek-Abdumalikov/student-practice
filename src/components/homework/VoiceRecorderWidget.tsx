import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Volume2, AlertCircle } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VoiceRecorderWidgetProps {
  label: string;
  instructions: string;
  existingAudioUrl?: string;
  onAudioRecorded: (base64AudioUrl: string) => void;
}

export const VoiceRecorderWidget: React.FC<VoiceRecorderWidgetProps> = ({
  label,
  instructions,
  existingAudioUrl,
  onAudioRecorded
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  const startRecording = async () => {
    soundService.playClick();
    setPermissionError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setAudioUrl(base64Data);
          onAudioRecorded(base64Data);
          soundService.playSuccess();
        };

        // Stop all tracks to turn off mic light
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      setPermissionError('Microphone permission denied. Please allow microphone access in your browser.');
    }
  };

  const stopRecording = () => {
    soundService.playClick();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    soundService.playClick();
    if (!audioUrl) return;

    if (!playbackAudioRef.current) {
      const audio = new Audio(audioUrl);
      playbackAudioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      playbackAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      playbackAudioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleResetRecording = () => {
    soundService.playClick();
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingSeconds(0);
    onAudioRecorded('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            {label}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{instructions}</p>
        </div>

        {audioUrl && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            Recorded
          </span>
        )}
      </div>

      {permissionError && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Recording in progress */}
      {isRecording ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/40 border border-rose-500/50">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-black text-rose-300 uppercase tracking-wider">
              Recording Voice... ({formatTime(recordingSeconds)})
            </span>
          </div>

          <button
            onClick={stopRecording}
            className="py-1.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      ) : audioUrl ? (
        /* Playback and Retake */
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <button
              onClick={togglePlayback}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-sm active:scale-95"
              title={isPlaying ? 'Pause playback' : 'Play my recording'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="text-xs">
              <div className="font-bold text-white">Voice Recording Ready</div>
              <div className="text-[11px] text-slate-400">Click to listen before submitting</div>
            </div>
          </div>

          <button
            onClick={handleResetRecording}
            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-700"
            title="Record again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-record</span>
          </button>
        </div>
      ) : (
        /* Ready to start */
        <button
          onClick={startRecording}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Mic className="w-4 h-4 text-indigo-400" />
          <span>Tap to Record Voice</span>
        </button>
      )}
    </div>
  );
};
