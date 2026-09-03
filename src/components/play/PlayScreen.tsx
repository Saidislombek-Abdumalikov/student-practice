import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { VocabularyWord, UserProfile } from '../../types';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { peerDuelService, ActiveDuelMatch, DuelQuestionItem } from '../../services/peerDuelService';
import { 
  Swords, 
  Trophy, 
  Timer, 
  Volume2, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Flame, 
  Coins, 
  Play, 
  ArrowRight, 
  Zap, 
  Award,
  Clock,
  Check,
  CornerDownLeft,
  Delete,
  AlertCircle,
  Loader2
} from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type DuelDrillType = 'mixed' | 'multiple_choice' | 'spelling' | 'unscramble';

export const PlayScreen: React.FC<{ initialMatch?: ActiveDuelMatch | null }> = ({ initialMatch }) => {
  const { 
    profile, 
    allAccounts, 
    curriculumUnits, 
    activeUnitId, 
    addXP, 
    addCoins, 
    awardDiamondToAccount,
    tradeDiamondsForCoins,
    recordMistake 
  } = useGame();

  const currentUnit = curriculumUnits.find(u => u.id === activeUnitId) || curriculumUnits[0];
  const unitWords = currentUnit.words;

  // Classmates available for peer match (excluding admin and current user)
  const classmates = useMemo(() => {
    return allAccounts.filter(a => a.role !== 'admin' && a.id !== profile.id);
  }, [allAccounts, profile.id]);

  // Match State:
  // 'setup' | 'waiting_accept' | 'invite_expired' | 'playing' | 'waiting_opponent_finish' | 'results' | 'solo_sprint'
  const [matchState, setMatchState] = useState<
    'setup' | 'waiting_accept' | 'invite_expired' | 'playing' | 'waiting_opponent_finish' | 'results' | 'solo_sprint'
  >(initialMatch ? 'playing' : 'setup');

  // Active Live Match
  const [activeMatch, setActiveMatch] = useState<ActiveDuelMatch | null>(initialMatch || null);

  // Selected Opponent for Challenger
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(() => {
    return classmates[0]?.id || 'usr_ruxshona';
  });

  // Selected Round Length: strictly 10 (1 Diamond) or 15 (2 Diamonds)
  const [roundSize, setRoundSize] = useState<10 | 15>(10);

  // Selected Game Format
  const [drillType, setDrillType] = useState<DuelDrillType>('mixed');

  // 25-Second Invitation Countdown State
  const [inviteTimeLeft, setInviteTimeLeft] = useState<number>(25);

  // Match Questions
  const [questions, setQuestions] = useState<DuelQuestionItem[]>(initialMatch?.questions || []);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);

  // My Live Score & Time
  const [myScore, setMyScore] = useState<number>(0);
  const [myTime, setMyTime] = useState<number>(0);

  // Opponent Live Score & Time (received from peer)
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentTime, setOpponentTime] = useState<number>(0);

  // Live Timer State for current turn
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Multiple Choice feedback
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Spelling & Typing state
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [spellingFeedback, setSpellingFeedback] = useState<'correct' | 'wrong' | null>(null);
  const spellingInputRef = useRef<HTMLInputElement>(null);

  // Unscramble state
  const [pickedLetters, setPickedLetters] = useState<{ id: string; letter: string }[]>([]);
  const [unscrambleAvailable, setUnscrambleAvailable] = useState<{ id: string; letter: string }[]>([]);
  const [unscrambleFeedback, setUnscrambleFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Diamond trade notification
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Opponent profile
  const opponent = useMemo(() => {
    if (activeMatch) {
      const oppId = activeMatch.challengerId === profile.id ? activeMatch.opponentId : activeMatch.challengerId;
      return allAccounts.find(a => a.id === oppId) || {
        id: oppId,
        name: activeMatch.challengerId === profile.id ? activeMatch.opponentName : activeMatch.challengerName,
        character: activeMatch.challengerId === profile.id ? activeMatch.opponentCharacter : activeMatch.challengerCharacter,
      } as UserProfile;
    }
    return allAccounts.find(a => a.id === selectedOpponentId) || classmates[0] || profile;
  }, [activeMatch, selectedOpponentId, allAccounts, profile, classmates]);

  // Diamond Reward: 10 words -> 1 Diamond, 15 words -> 2 Diamonds
  // 🔥 2X REWARD FOR MIXED BATTLE: 10 words -> 2 Diamonds, 15 words -> 4 Diamonds!
  const baseReward = roundSize === 15 ? 2 : 1;
  const calculatedReward = drillType === 'mixed' ? baseReward * 2 : baseReward;
  const diamondReward = (activeMatch?.diamondReward) || calculatedReward;

  // -------------------------------------------------------------
  // REAL-TIME PEER DUEL SUBSCRIPTION (Across Devices / Supabase)
  // -------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = peerDuelService.subscribe((match, eventType) => {
      // 1. If my challenge was accepted by the opponent!
      if (
        eventType === 'challenge_accepted' && 
        match.challengerId === profile.id && 
        matchState === 'waiting_accept'
      ) {
        soundService.playSuccess();
        setActiveMatch(match);
        setQuestions(match.questions);
        setCurrentQuestionIdx(0);
        setMyScore(0);
        setMyTime(0);
        setElapsedTime(0);
        resetDrillInputs(match.questions[0]);
        setMatchState('playing');
      }

      // 2. If opponent declined
      if (
        eventType === 'challenge_declined' && 
        match.challengerId === profile.id && 
        matchState === 'waiting_accept'
      ) {
        soundService.playError();
        setMatchState('invite_expired');
      }

      // 3. Score update or Match completed
      if (activeMatch && match.matchId === activeMatch.matchId) {
        setActiveMatch(match);
        const isChallenger = profile.id === match.challengerId;
        const theirRes = isChallenger ? match.opponentResult : match.challengerResult;
        
        if (theirRes) {
          setOpponentScore(theirRes.score);
          setOpponentTime(theirRes.time);
        }

        // Both players finished!
        if (match.status === 'completed' || (match.challengerResult && match.opponentResult)) {
          setMatchState('results');
          soundService.playLevelUp();
          confetti({ particleCount: 90, spread: 80 });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [profile.id, matchState, activeMatch]);

  // -------------------------------------------------------------
  // 25-Second Invitation Countdown for Challenger
  // -------------------------------------------------------------
  useEffect(() => {
    let inviteTimer: any = null;
    if (matchState === 'waiting_accept') {
      setInviteTimeLeft(25);
      inviteTimer = setInterval(() => {
        setInviteTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(inviteTimer);
            soundService.playError();
            setMatchState('invite_expired');
            if (activeMatch) {
              peerDuelService.declineChallenge(activeMatch);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (inviteTimer) clearInterval(inviteTimer);
    };
  }, [matchState, activeMatch]);

  // -------------------------------------------------------------
  // Question Generator
  // -------------------------------------------------------------
  const generateQuestions = (count: number, format: DuelDrillType): DuelQuestionItem[] => {
    let sourceWords = [...unitWords];
    if (sourceWords.length < count) {
      const allWords = curriculumUnits.flatMap(u => u.words);
      sourceWords = [...sourceWords, ...allWords];
    }
    const chosenWords = shuffleArray(sourceWords).slice(0, count);

    return chosenWords.map((word, index) => {
      let qType: 'multiple_choice' | 'spelling' | 'unscramble' = 'multiple_choice';
      if (format === 'mixed') {
        const types: ('multiple_choice' | 'spelling' | 'unscramble')[] = ['multiple_choice', 'spelling', 'unscramble'];
        qType = types[index % types.length];
      } else {
        qType = format;
      }

      // Generate 4 Multiple Choice options
      const wrong = shuffleArray(sourceWords.filter(w => w.id !== word.id))
        .slice(0, 3)
        .map(w => ({ text: w.uzbekTranslation, isCorrect: false }));
      const allChoices = shuffleArray([
        { text: word.uzbekTranslation, isCorrect: true },
        ...wrong
      ]);

      // Generate Scrambled Letters
      const letterTiles = word.word
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .split('')
        .map((char, i) => ({ id: `${word.id}_l_${i}`, letter: char }));
      const scrambledTiles = shuffleArray(letterTiles);

      return {
        id: `q_${index}_${word.id}`,
        type: qType,
        word: {
          id: word.id,
          word: word.word,
          phonetic: word.phonetic,
          uzbekTranslation: word.uzbekTranslation,
        },
        choices: allChoices,
        scrambledLetters: scrambledTiles,
      };
    });
  };

  // Reset drill inputs on new question
  const resetDrillInputs = (question: DuelQuestionItem | undefined) => {
    setSelectedChoiceIdx(null);
    setIsAnswering(false);
    setTypedAnswer('');
    setSpellingFeedback(null);
    setPickedLetters([]);
    setUnscrambleFeedback(null);
    if (question && question.type === 'unscramble') {
      setUnscrambleAvailable([...question.scrambledLetters]);
    } else {
      setUnscrambleAvailable([]);
    }
  };

  // Send REAL Duel Invitation to classmate
  const sendDuelInvitation = () => {
    soundService.playClick();
    const newQuestions = generateQuestions(roundSize, drillType);
    setQuestions(newQuestions);

    const match: ActiveDuelMatch = {
      matchId: `duel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      challengerId: profile.id,
      challengerName: profile.name || 'Challenger',
      challengerCharacter: profile.character,
      opponentId: opponent.id,
      opponentName: opponent.name,
      opponentCharacter: opponent.character,
      roundSize,
      diamondReward: drillType === 'mixed' ? (roundSize === 15 ? 4 : 2) : (roundSize === 15 ? 2 : 1),
      drillType,
      questions: newQuestions,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + 25000,
    };

    setActiveMatch(match);
    peerDuelService.sendChallenge(match);
    setMatchState('waiting_accept');
  };

  // Start Solo Warm-up (Coins & XP only, NO diamonds)
  const startSoloWarmup = () => {
    soundService.playClick();
    const newQuestions = generateQuestions(roundSize, drillType);
    setQuestions(newQuestions);
    setActiveMatch(null);
    setCurrentQuestionIdx(0);
    setMyScore(0);
    setMyTime(0);
    setElapsedTime(0);
    resetDrillInputs(newQuestions[0]);
    setMatchState('solo_sprint');
  };

  // Live Stopwatch for active round
  useEffect(() => {
    if (matchState === 'playing' || matchState === 'solo_sprint') {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(parseFloat(((Date.now() - startTime) / 1000).toFixed(1)));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [matchState]);

  // Focus spelling input on question switch
  useEffect(() => {
    const q = questions[currentQuestionIdx];
    if (q && q.type === 'spelling' && (matchState === 'playing' || matchState === 'solo_sprint')) {
      setTimeout(() => {
        spellingInputRef.current?.focus();
      }, 150);
    }
    if (q && q.type === 'unscramble') {
      setPickedLetters([]);
      setUnscrambleAvailable([...q.scrambledLetters]);
    }
  }, [currentQuestionIdx, matchState]);

  const activeQ = questions[currentQuestionIdx];

  // Advance question or finish round
  const advanceQuestion = (wasCorrect: boolean) => {
    let newScore = myScore;
    if (wasCorrect) {
      soundService.playCoin();
      newScore = myScore + 1;
      setMyScore(newScore);
    } else {
      soundService.playError();
      if (activeQ) recordMistake(activeQ.word as any);
    }

    setTimeout(() => {
      if (currentQuestionIdx + 1 < questions.length) {
        const nextIdx = currentQuestionIdx + 1;
        setCurrentQuestionIdx(nextIdx);
        resetDrillInputs(questions[nextIdx]);
      } else {
        // Round Finished by current player!
        soundService.playSuccess();
        setMyTime(elapsedTime);

        if (matchState === 'solo_sprint') {
          setMatchState('results');
          soundService.playLevelUp();
          confetti({ particleCount: 50, spread: 60 });
        } else if (activeMatch) {
          // Broadcast player's result
          const updated = peerDuelService.submitPlayerResult(
            activeMatch, 
            profile.id, 
            newScore, 
            elapsedTime
          );

          if (updated.challengerResult && updated.opponentResult) {
            setMatchState('results');
            soundService.playLevelUp();
            confetti({ particleCount: 90, spread: 80 });
          } else {
            // Waiting for opponent to complete their round
            setMatchState('waiting_opponent_finish');
          }
        }
      }
    }, 700);
  };

  // Multiple Choice Click
  const handleSelectChoice = (choiceIdx: number) => {
    if (isAnswering || !activeQ) return;
    setIsAnswering(true);
    setSelectedChoiceIdx(choiceIdx);
    const isCorrect = activeQ.choices[choiceIdx].isCorrect;
    advanceQuestion(isCorrect);
  };

  // Spelling & Typing Submit
  const handleSpellingSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswering || !activeQ) return;

    setIsAnswering(true);
    const cleanTyped = typedAnswer.trim().toLowerCase();
    const cleanTarget = activeQ.word.word.trim().toLowerCase();
    const isCorrect = cleanTyped === cleanTarget;

    setSpellingFeedback(isCorrect ? 'correct' : 'wrong');
    advanceQuestion(isCorrect);
  };

  // Word Unscramble Tile Click
  const handlePickUnscrambleLetter = (tile: { id: string; letter: string }) => {
    if (isAnswering || !activeQ) return;
    soundService.playClick();
    const newPicked = [...pickedLetters, tile];
    const newAvailable = unscrambleAvailable.filter(t => t.id !== tile.id);
    setPickedLetters(newPicked);
    setUnscrambleAvailable(newAvailable);

    const targetWord = activeQ.word.word.toUpperCase().replace(/[^A-Z]/g, '');
    if (newPicked.length === targetWord.length) {
      setIsAnswering(true);
      const builtWord = newPicked.map(p => p.letter).join('');
      const isCorrect = builtWord === targetWord;
      setUnscrambleFeedback(isCorrect ? 'correct' : 'wrong');
      advanceQuestion(isCorrect);
    }
  };

  const handleRemoveUnscrambleLetter = (tile: { id: string; letter: string }) => {
    if (isAnswering) return;
    soundService.playClick();
    setPickedLetters(prev => prev.filter(t => t.id !== tile.id));
    setUnscrambleAvailable(prev => [...prev, tile]);
  };

  // Determine Duel Winner (or Solo stats)
  const isSolo = matchState === 'solo_sprint' || !activeMatch;

  const winnerInfo = useMemo(() => {
    if (matchState !== 'results') return null;
    if (isSolo) {
      return {
        winnerId: profile.id,
        winnerName: profile.name || 'You',
        reason: 'Solo Warm-up Complete!',
        isP1: true,
        isTie: false,
        isSolo: true,
      };
    }

    const p1Id = activeMatch.challengerId;
    const p1Score = activeMatch.challengerResult?.score ?? (profile.id === p1Id ? myScore : opponentScore);
    const p1Time = activeMatch.challengerResult?.time ?? (profile.id === p1Id ? myTime : opponentTime);

    const p2Id = activeMatch.opponentId;
    const p2Score = activeMatch.opponentResult?.score ?? (profile.id === p2Id ? myScore : opponentScore);
    const p2Time = activeMatch.opponentResult?.time ?? (profile.id === p2Id ? myTime : opponentTime);

    if (p1Score > p2Score) {
      return {
        winnerId: p1Id,
        winnerName: activeMatch.challengerName,
        reason: `Found more correct words (${p1Score} vs ${p2Score})!`,
        isP1: true,
        isTie: false,
        isSolo: false,
        p1Score, p1Time, p2Score, p2Time
      };
    } else if (p2Score > p1Score) {
      return {
        winnerId: p2Id,
        winnerName: activeMatch.opponentName,
        reason: `Found more correct words (${p2Score} vs ${p1Score})!`,
        isP1: false,
        isTie: false,
        isSolo: false,
        p1Score, p1Time, p2Score, p2Time
      };
    } else {
      // Tied on score -> Fastest student wins!
      if (p1Time < p2Time) {
        return {
          winnerId: p1Id,
          winnerName: activeMatch.challengerName,
          reason: `Fastest speed (${p1Time}s vs ${p2Time}s)!`,
          isP1: true,
          isTie: false,
          isSolo: false,
          p1Score, p1Time, p2Score, p2Time
        };
      } else if (p2Time < p1Time) {
        return {
          winnerId: p2Id,
          winnerName: activeMatch.opponentName,
          reason: `Fastest speed (${p2Time}s vs ${p1Time}s)!`,
          isP1: false,
          isTie: false,
          isSolo: false,
          p1Score, p1Time, p2Score, p2Time
        };
      } else {
        return {
          winnerId: profile.id,
          winnerName: 'Both Students',
          reason: 'Equal score and speed! Friendly draw!',
          isP1: true,
          isTie: true,
          isSolo: false,
          p1Score, p1Time, p2Score, p2Time
        };
      }
    }
  }, [matchState, activeMatch, profile.id, myScore, myTime, opponentScore, opponentTime, isSolo]);

  // Award Diamonds ONLY in 2-Player Match (Never in warm-up!)
  const hasAwardedRef = useRef(false);
  useEffect(() => {
    if (matchState === 'results' && winnerInfo && !hasAwardedRef.current) {
      hasAwardedRef.current = true;
      if (!winnerInfo.isSolo && !winnerInfo.isTie) {
        awardDiamondToAccount(winnerInfo.winnerId, diamondReward);
        addXP(60);
        addCoins(15);
      } else {
        addXP(40);
        addCoins(15);
      }
    }
    if (matchState === 'setup') {
      hasAwardedRef.current = false;
    }
  }, [matchState, winnerInfo, diamondReward]);

  const handleTradeDiamond = () => {
    const success = tradeDiamondsForCoins(1);
    if (success) {
      confetti({ particleCount: 35, spread: 50 });
      setTradeMessage('Traded 1 💎 for +5 🪙 Coins!');
      setTimeout(() => setTradeMessage(null), 2500);
    }
  };

  // -------------------------------------------------------------
  // VIEW: 25-SECOND WAITING FOR ACCEPT SCREEN (REAL PRODUCTION: NO TEST BUTTON!)
  // -------------------------------------------------------------
  if (matchState === 'waiting_accept') {
    return (
      <div className="max-w-lg mx-auto card-game p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Animated Countdown Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-amber-400 animate-spin" />
          <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-indigo-500/50 flex flex-col items-center justify-center shadow-glow-primary">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xl font-black text-white leading-none mt-1">
              {inviteTimeLeft}s
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            DUEL INVITATION SENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Waiting for {opponent.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Invitation sent to {opponent.name}'s device. Waiting for them to accept ({inviteTimeLeft}s)...
          </p>
        </div>

        {/* Matchup Stakes Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-indigo-500/60 overflow-hidden flex items-center justify-center">
                <ModularCharacter config={profile.character} size="sm" animate={false} />
              </div>
              <span className="text-xs font-bold text-white block mt-1">{profile.name || 'You'}</span>
            </div>
            <div className="text-xl font-black text-amber-400 animate-pulse">⚔️ VS ⚔️</div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-rose-500/60 overflow-hidden flex items-center justify-center">
                <ModularCharacter config={opponent.character} size="sm" animate={false} />
              </div>
              <span className="text-xs font-bold text-white block mt-1">{opponent.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-800 text-xs font-bold">
            <span className="text-slate-400">{roundSize} Words</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-extrabold flex items-center gap-1">
              Stake: {diamondReward === 2 ? '💎💎 2 Diamonds' : '💎 1 Diamond'}
            </span>
          </div>
        </div>

        {/* Real Production: Only Cancel Button (Opponent accepts on their own device!) */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (activeMatch) peerDuelService.declineChallenge(activeMatch);
              setMatchState('setup');
            }}
            className="btn-game-slate w-full py-3 text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancel Challenge
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: WAITING FOR OPPONENT TO FINISH THEIR ROUND
  // -------------------------------------------------------------
  if (matchState === 'waiting_opponent_finish') {
    return (
      <div className="max-w-md mx-auto card-game p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-3xl">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            YOUR ROUND FINISHED!
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Waiting for {opponent.name}...
          </h2>
          <p className="text-sm font-bold text-indigo-300 mt-1">
            Your Score: {myScore} / {questions.length} • Your Time: {myTime}s
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
          {opponent.name} is currently answering their words on their device. Results will appear automatically as soon as they finish!
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: INVITATION EXPIRED (Timed out after 25s)
  // -------------------------------------------------------------
  if (matchState === 'invite_expired') {
    return (
      <div className="max-w-md mx-auto card-game p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Challenge Expired!</h3>
          <p className="text-xs text-slate-400 mt-1">
            <strong>{opponent.name}</strong> did not accept the match within 25 seconds.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={sendDuelInvitation}
            className="btn-game-primary w-full py-3 text-xs font-black flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-send Challenge (25s)</span>
          </button>
          <button
            onClick={() => setMatchState('setup')}
            className="btn-game-slate w-full py-2.5 text-xs font-bold"
          >
            Choose Another Classmate
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: RESULTS SCREEN
  // -------------------------------------------------------------
  if (matchState === 'results') {
    const isSoloMatch = winnerInfo?.isSolo;

    return (
      <div className="max-w-xl mx-auto card-game p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center text-4xl shadow-glow-primary">
          {isSoloMatch ? '⚡' : '💎'}
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
            {isSoloMatch ? 'SOLO WARM-UP COMPLETED' : 'CLASSMATE DUEL COMPLETE'}
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            {isSoloMatch ? 'Great Warm-up!' : `${winnerInfo?.winnerName} Wins! 🏆`}
          </h2>
          <p className="text-sm font-bold text-amber-300 mt-1">
            {winnerInfo?.reason}
          </p>
        </div>

        {/* Prize Card */}
        <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 ${
          isSoloMatch 
            ? 'bg-amber-500/10 border-amber-500/40' 
            : 'bg-gradient-to-r from-cyan-950/50 via-indigo-950/40 to-cyan-950/50 border-cyan-500/50'
        }`}>
          <div className="flex items-center gap-3 text-left">
            <span className="text-3xl">{isSoloMatch ? '🪙' : '💎'}</span>
            <div>
              <span className="text-[10px] font-black uppercase text-cyan-300 block">Reward</span>
              <span className="text-sm font-black text-white">
                {isSoloMatch 
                  ? '+15 Coins & +40 XP Earned!' 
                  : `+${diamondReward} Diamond${diamondReward > 1 ? 's' : ''} Awarded!`}
              </span>
              {isSoloMatch && (
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  💡 Diamonds are only won in 2-Player Duels!
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleTradeDiamond}
            disabled={(profile.diamonds || 0) < 1}
            className="btn-game-gold py-2 px-3 text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-40 shrink-0"
            title="Trade 1 Diamond for 5 Coins"
          >
            <span>Trade 1 💎 ➡️ 5 🪙</span>
          </button>
        </div>

        {/* Score Comparison */}
        {!isSoloMatch && winnerInfo && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-4 rounded-2xl border-2 text-center space-y-1.5 ${
              winnerInfo.winnerId === profile.id 
                ? 'bg-indigo-950/40 border-indigo-500 shadow-glow-primary' 
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                <ModularCharacter config={profile.character} size="sm" animate={false} />
              </div>
              <h4 className="font-extrabold text-sm text-white truncate">{profile.name || 'You'}</h4>
              <div className="text-2xl font-black text-emerald-400">{myScore} / {questions.length}</div>
              <div className="text-xs font-bold text-slate-400">{myTime}s</div>
              {winnerInfo.winnerId === profile.id && (
                <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                  WINNER {diamondReward === 2 ? '💎💎' : '💎'}
                </span>
              )}
            </div>

            <div className={`p-4 rounded-2xl border-2 text-center space-y-1.5 ${
              winnerInfo.winnerId !== profile.id 
                ? 'bg-indigo-950/40 border-indigo-500 shadow-glow-primary' 
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                <ModularCharacter config={opponent.character} size="sm" animate={false} />
              </div>
              <h4 className="font-extrabold text-sm text-white truncate">{opponent.name}</h4>
              <div className="text-2xl font-black text-emerald-400">{opponentScore} / {questions.length}</div>
              <div className="text-xs font-bold text-slate-400">{opponentTime}s</div>
              {winnerInfo.winnerId !== profile.id && !winnerInfo.isTie && (
                <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                  WINNER {diamondReward === 2 ? '💎💎' : '💎'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {!isSoloMatch ? (
            <button
              onClick={sendDuelInvitation}
              className="btn-game-primary w-full py-3.5 px-6 font-black text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch with {opponent.name} ({diamondReward} 💎)</span>
            </button>
          ) : (
            <button
              onClick={startSoloWarmup}
              className="btn-game-primary w-full py-3.5 px-6 font-black text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Warm-Up Again</span>
            </button>
          )}

          <button
            onClick={() => setMatchState('setup')}
            className="btn-game-slate w-full py-2.5 text-xs font-bold"
          >
            Back to Match Setup
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: ACTIVE GAMEPLAY (Real simultaneous player turn)
  // -------------------------------------------------------------
  if (matchState === 'playing' || matchState === 'solo_sprint') {
    return (
      <div className="max-w-2xl mx-auto space-y-5 pb-24 md:pb-12 animate-in fade-in duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setMatchState('setup')}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit</span>
          </button>

          {/* Active Player */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/35">
            <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
              <ModularCharacter config={profile.character} size="sm" animate={false} />
            </div>
            <span className="text-xs font-black text-indigo-300">
              {matchState === 'solo_sprint' ? 'Solo Sprint: ' : 'Duel: '}
              {profile.name || 'You'}
            </span>
          </div>

          {/* Timer & Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-extrabold text-xs">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{elapsedTime.toFixed(1)}s</span>
            </div>
            <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              {myScore} / {questions.length}
            </div>
          </div>
        </div>

        {activeQ && (
          <div className="card-game p-6 sm:p-8 text-center space-y-6">
            
            {/* Format Badge & Progress */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeQ.type === 'multiple_choice' ? '🎯 MULTIPLE CHOICE' : activeQ.type === 'spelling' ? '⌨️ SPELLING & TYPING' : '🔤 WORD UNSCRAMBLE'}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentQuestionIdx + 1} of {questions.length}
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl sm:text-5xl font-black text-white">
                  {activeQ.type === 'spelling' ? activeQ.word.uzbekTranslation : activeQ.word.word}
                </h2>
                <button
                  onClick={() => speechService.speak(activeQ.word.word, 'normal')}
                  className="p-2 rounded-2xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs font-medium text-slate-400">
                {activeQ.type === 'spelling' 
                  ? 'Type the English translation for this word' 
                  : activeQ.type === 'unscramble' 
                  ? `Meaning: "${activeQ.word.uzbekTranslation}" • Tap letters to spell it!` 
                  : activeQ.word.phonetic}
              </p>
            </div>

            {/* 1. DRILL: MULTIPLE CHOICE */}
            {activeQ.type === 'multiple_choice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {activeQ.choices.map((choice, cIdx) => {
                  let btnStyle = 'border-slate-700/80 bg-slate-800/80 hover:border-indigo-500 text-slate-200';
                  if (selectedChoiceIdx !== null) {
                    if (choice.isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-glow-emerald scale-102';
                    } else if (cIdx === selectedChoiceIdx) {
                      btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-300';
                    } else {
                      btnStyle = 'opacity-40 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleSelectChoice(cIdx)}
                      disabled={isAnswering}
                      className={`py-4 px-5 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{choice.text}</span>
                      {selectedChoiceIdx !== null && choice.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. DRILL: SPELLING & TYPING */}
            {activeQ.type === 'spelling' && (
              <form onSubmit={handleSpellingSubmit} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <input
                    ref={spellingInputRef}
                    type="text"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    disabled={isAnswering}
                    placeholder="Type English word here..."
                    className={`w-full py-4 px-5 rounded-2xl bg-slate-900 border-2 text-center text-lg sm:text-xl font-bold text-white tracking-wide transition-all outline-none ${
                      spellingFeedback === 'correct'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-glow-emerald'
                        : spellingFeedback === 'wrong'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-300'
                        : 'border-indigo-500/50 focus:border-indigo-400'
                    }`}
                  />
                  {spellingFeedback === 'wrong' && (
                    <p className="text-xs font-bold text-rose-400 mt-2">
                      Correct: {activeQ.word.word}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isAnswering || typedAnswer.trim().length === 0}
                    className="btn-game-primary flex-1 py-3 px-4 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <span>Submit Answer</span>
                    <CornerDownLeft className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* 3. DRILL: WORD UNSCRAMBLE */}
            {activeQ.type === 'unscramble' && (
              <div className="max-w-md mx-auto space-y-5">
                {/* Assembled Word Slot */}
                <div className={`min-h-[64px] p-3 rounded-2xl bg-slate-950/80 border-2 flex flex-wrap items-center justify-center gap-2 transition-all ${
                  unscrambleFeedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : unscrambleFeedback === 'wrong'
                    ? 'border-rose-500 bg-rose-500/10'
                    : 'border-slate-700'
                }`}>
                  {pickedLetters.length === 0 ? (
                    <span className="text-xs text-slate-500 font-medium italic">
                      Tap letters below to form the word
                    </span>
                  ) : (
                    pickedLetters.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleRemoveUnscrambleLetter(tile)}
                        disabled={isAnswering}
                        className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg shadow-sm hover:bg-indigo-500 transition-transform active:scale-95"
                      >
                        {tile.letter}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Scrambled Letter Tiles */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {unscrambleAvailable.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handlePickUnscrambleLetter(tile)}
                      disabled={isAnswering}
                      className="w-11 h-11 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-amber-400 text-white font-black text-lg transition-all active:scale-95 shadow-sm"
                    >
                      {tile.letter}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: SETUP SCREEN
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner: Diamond Vault */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-indigo-950/80 border-2 border-cyan-500/40 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
            ONLINE PEER ARENA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Real-Time Classmate Duel ⚔️
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Challenge any online classmate! 10 words awards <strong>1 Diamond 💎</strong>, 15 words awards <strong>2 Diamonds 💎💎</strong>!
          </p>
        </div>

        {/* Diamond Wallet & Exchange */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/40 shrink-0">
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Your Diamonds</span>
            <div className="flex items-center gap-1.5 text-xl font-black text-cyan-400">
              <span>💎</span>
              <span>{profile.diamonds || 0}</span>
            </div>
          </div>
          <button
            onClick={handleTradeDiamond}
            disabled={(profile.diamonds || 0) < 1}
            className="btn-game-gold py-2 px-3 text-xs font-black flex items-center gap-1.5 disabled:opacity-40"
            title="Trade 1 Diamond for 5 Coins"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Trade 1 💎 = 5 🪙</span>
          </button>
        </div>
      </div>

      {tradeMessage && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-xs font-bold animate-in fade-in">
          {tradeMessage}
        </div>
      )}

      {/* Duel Setup Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Player 1 (You) & Player 2 (Opponent) Matchup (8 cols) */}
        <div className="md:col-span-8 card-game p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Choose Classmate to Duel</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              Unit: {currentUnit.title}
            </span>
          </div>

          {/* Versus Visual Banner */}
          <div className="grid grid-cols-5 items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            {/* Player 1 */}
            <div className="col-span-2 text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950 border-2 border-indigo-500 overflow-hidden flex items-center justify-center shadow-glow-primary">
                <ModularCharacter config={profile.character} size="sm" animate={false} />
              </div>
              <h4 className="font-extrabold text-sm text-white truncate">{profile.name || 'You'}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                You
              </span>
            </div>

            {/* VS Badge */}
            <div className="col-span-1 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center font-black text-amber-400 text-sm shadow-glow-gold">
                VS
              </div>
            </div>

            {/* Player 2 */}
            <div className="col-span-2 text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/50 border-2 border-rose-500 overflow-hidden flex items-center justify-center shadow-glow-gold">
                <ModularCharacter config={opponent.character} size="sm" animate={false} />
              </div>
              <h4 className="font-extrabold text-sm text-white truncate">{opponent.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                Opponent
              </span>
            </div>
          </div>

          {/* Select Opponent from Group Mates */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 block">
              Choose Group Mate:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {classmates.map(c => {
                const isSelected = c.id === selectedOpponentId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedOpponentId(c.id);
                    }}
                    className={`p-2.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 shadow-glow-primary'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                      <ModularCharacter config={c.character} size="sm" animate={false} />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">💎 {c.diamonds || 0}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Round Size Selector: ONLY 10 and 15 words */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                Duel Length & Stakes:
              </label>
              {drillType === 'mixed' && (
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                  🔥 2X MIXED MULTIPLIER ACTIVE!
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRoundSize(10)}
                className={`p-3.5 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  roundSize === 10
                    ? 'border-indigo-500 bg-indigo-600/20 shadow-glow-primary'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-black text-white">10 Words</span>
                <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1">
                  Prize: {drillType === 'mixed' ? '💎💎 2 Diamonds (2x)' : '💎 1 Diamond'}
                </span>
              </button>

              <button
                onClick={() => setRoundSize(15)}
                className={`p-3.5 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  roundSize === 15
                    ? 'border-indigo-500 bg-indigo-600/20 shadow-glow-primary'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-sm font-black text-white">15 Words (Championship)</span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  Prize: {drillType === 'mixed' ? '💎💎💎💎 4 Diamonds (2x)' : '💎💎 2 Diamonds'}
                </span>
              </button>
            </div>
          </div>

          {/* Drill Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Drill Format:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'mixed', label: '🎲 Mixed Battle', badge: '🔥 2x 💎' },
                { id: 'multiple_choice', label: '🎯 Multiple Choice' },
                { id: 'spelling', label: '⌨️ Spelling Typing' },
                { id: 'unscramble', label: '🔤 Unscramble' },
              ].map(drill => (
                <button
                  key={drill.id}
                  onClick={() => setDrillType(drill.id as DuelDrillType)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 relative ${
                    drillType === drill.id
                      ? 'border-indigo-400 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{drill.label}</span>
                  {drill.badge && (
                    <span className="text-[9px] font-black text-amber-300 bg-amber-500/30 px-1.5 py-0.2 rounded-full">
                      {drill.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Action */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={sendDuelInvitation}
              className="btn-game-primary w-full py-4 px-6 text-sm font-black flex items-center justify-center gap-2.5 shadow-glow-primary"
            >
              <Swords className="w-5 h-5 text-amber-400" />
              <span>Send Duel Challenge to {opponent.name} (25s)</span>
            </button>

            <button
              onClick={startSoloWarmup}
              className="btn-game-slate w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5 text-slate-400 hover:text-white"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Solo Warm-up Sprint (Coins & XP • No Diamonds)</span>
            </button>
          </div>
        </div>

        {/* Right: Duel Rules & Diamond Economy */}
        <div className="md:col-span-4 space-y-4">
          <div className="card-game p-5 border-2 border-cyan-500/30 bg-gradient-to-b from-slate-900 via-cyan-950/20 to-slate-900 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-black text-sm">
              <Trophy className="w-4 h-4" />
              <span>Real-Time Duel Rules</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-cyan-400">1.</span>
                <span><strong>Live Invite:</strong> When challenged, your classmate receives an alert on their device to accept within 25 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-cyan-400">2.</span>
                <span><strong>Diamond Stakes:</strong> 10 words gives <strong>1 Diamond 💎</strong>. 15 words gives <strong>2 Diamonds 💎💎</strong>!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-cyan-400">3.</span>
                <span><strong>Tie-Breaker:</strong> If both students achieve the same score, the fastest student wins!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-cyan-400">4.</span>
                <span><strong>Drills:</strong> Multiple Choice, Spelling & Typing, and Word Unscramble!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-400">5.</span>
                <span><strong>Warm-Up:</strong> Solo warm-up grants coins & XP, but <strong>no diamonds</strong>. Diamonds are strictly peer duel prizes!</span>
              </li>
            </ul>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <strong>Exchange Rate:</strong> 1 Diamond = 5 Coins! Trade diamonds anytime in the header or shop.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
