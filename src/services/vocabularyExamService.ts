import { 
  UserProfile, 
  CurriculumUnit, 
  VocabularyWord, 
  UnitProgressionStatus, 
  VocabularyExamAttempt, 
  ExamQuestionAnswer, 
  UnitExamRecord,
  ExamQuestionType 
} from '../types';
import { getSupabaseClient } from './supabaseClient';

const REALTIME_EXAM_CHANNEL = 'plc_vocab_exams_realtime';
const LOCAL_EXAM_EVENT_KEY = 'plc_vocab_exam_live_event';

// Fisher-Yates shuffle algorithm for fair randomization
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class VocabularyExamService {
  private static realtimeChannel: any = null;

  /**
   * Broadcast live exam events across devices via Supabase Realtime and localStorage fallback
   */
  public static broadcastLiveExamEvent(eventType: 'start' | 'progress' | 'tab_switch' | 'finalized', payload: {
    studentId: string;
    studentName: string;
    unitId: string;
    attempt: VocabularyExamAttempt;
  }): void {
    try {
      const client = getSupabaseClient();
      if (client) {
        if (!this.realtimeChannel) {
          this.realtimeChannel = client.channel(REALTIME_EXAM_CHANNEL);
          this.realtimeChannel.subscribe();
        }
        this.realtimeChannel.send({
          type: 'broadcast',
          event: 'exam_event',
          payload: { eventType, ...payload, timestamp: Date.now() },
        });
      }
    } catch (e) {
      console.warn('Supabase realtime broadcast failed:', e);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_EXAM_EVENT_KEY, JSON.stringify({
          eventType,
          ...payload,
          timestamp: Date.now() + Math.random(),
        }));
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Subscribe to live exam updates (used by Teacher Admin Live Monitor)
   */
  public static subscribeToLiveExams(callback: (event: any) => void): () => void {
    let localHandler: ((e: StorageEvent) => void) | null = null;
    let sbChannel: any = null;

    try {
      const client = getSupabaseClient();
      if (client) {
        sbChannel = client.channel(REALTIME_EXAM_CHANNEL);
        sbChannel
          .on('broadcast', { event: 'exam_event' }, (msg: any) => {
            if (msg?.payload) callback(msg.payload);
          })
          .subscribe();
      }
    } catch (e) {
      console.warn('Supabase live subscription error:', e);
    }

    if (typeof window !== 'undefined') {
      localHandler = (e: StorageEvent) => {
        if (e.key === LOCAL_EXAM_EVENT_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            callback(parsed);
          } catch {
            // Ignored
          }
        }
      };
      window.addEventListener('storage', localHandler);
    }

    return () => {
      if (localHandler && typeof window !== 'undefined') {
        window.removeEventListener('storage', localHandler);
      }
      if (sbChannel) {
        try {
          sbChannel.unsubscribe();
        } catch {
          // Ignored
        }
      }
    };
  }

  /**
   * Determine dynamic progression status of a unit for a given student:
   * LOCKED | LEARNING | READY_FOR_EXAM | EXAM_IN_PROGRESS | PASSED | FAILED
   */
  public static getUnitStatus(
    student: UserProfile, 
    unitId: string, 
    allUnits: CurriculumUnit[]
  ): UnitProgressionStatus {
    const levelUnits = allUnits
      .filter(u => u.levelId === (student.levelId || 'beginner') && u.unitNumber <= 12)
      .sort((a, b) => a.unitNumber - b.unitNumber);
    const unitIndex = levelUnits.findIndex(u => u.id === unitId);

    // If unit is in completedUnits list
    if (student.completedUnits?.includes(unitId)) {
      return 'PASSED';
    }

    // Check active in-progress attempt
    if (
      student.activeExamAttempt && 
      student.activeExamAttempt.unitId === unitId && 
      student.activeExamAttempt.status === 'active'
    ) {
      return 'EXAM_IN_PROGRESS';
    }

    const record = student.vocabProgression?.[unitId];
    if (record) {
      if (record.status === 'EXAM_IN_PROGRESS') return 'EXAM_IN_PROGRESS';
      if (record.status === 'PASSED') return 'PASSED';
      if (record.status === 'FAILED' && !record.isAuthorizedByTeacher) return 'FAILED';
      if (record.isAuthorizedByTeacher) return 'READY_FOR_EXAM';
      if (record.status === 'LEARNING') return 'LEARNING';
      if (record.status === 'LOCKED') return 'LOCKED';
    }

    // Unit 1 in level starts in LEARNING
    if (unitIndex === 0) {
      return 'LEARNING';
    }

    // Subsequent units (Unit 2, Unit 3, Unit 4, etc.) require previous unit to be PASSED
    if (unitIndex > 0) {
      const prevUnit = levelUnits[unitIndex - 1];
      const prevPassed = 
        student.completedUnits?.includes(prevUnit.id) || 
        student.vocabProgression?.[prevUnit.id]?.status === 'PASSED';

      if (prevPassed) {
        return 'LEARNING';
      }
      return 'LOCKED';
    }

    return 'LEARNING';
  }

  /**
   * Teacher authorizes an official exam attempt for a student and unit
   */
  public static authorizeExam(
    student: UserProfile,
    unitId: string,
    teacherUsername: string = 'Teacher'
  ): { updatedStudent: UserProfile; success: boolean; message: string } {
    const existingProg = student.vocabProgression || {};
    const existingRecord: UnitExamRecord = existingProg[unitId] || {
      unitId,
      status: 'LEARNING',
      isAuthorizedByTeacher: false,
      totalAttempts: 0,
      attemptsHistory: [],
    };

    if (existingRecord.status === 'EXAM_IN_PROGRESS') {
      return {
        updatedStudent: student,
        success: false,
        message: 'Cannot modify authorization: student already has an active exam in progress.',
      };
    }

    const updatedRecord: UnitExamRecord = {
      ...existingRecord,
      isAuthorizedByTeacher: true,
      authorizedAt: new Date().toISOString(),
      authorizedBy: teacherUsername,
      status: 'READY_FOR_EXAM',
    };

    const updatedStudent: UserProfile = {
      ...student,
      vocabProgression: {
        ...existingProg,
        [unitId]: updatedRecord,
      },
    };

    return {
      updatedStudent,
      success: true,
      message: `Successfully authorized exam for Unit ${unitId.replace(/[^0-9]/g, '') || unitId}.`,
    };
  }

  /**
   * Teacher revokes exam authorization before student starts the exam
   */
  public static revokeAuthorization(
    student: UserProfile,
    unitId: string
  ): { updatedStudent: UserProfile; success: boolean; message: string } {
    const existingProg = student.vocabProgression || {};
    const existingRecord = existingProg[unitId];

    if (!existingRecord || !existingRecord.isAuthorizedByTeacher) {
      return {
        updatedStudent: student,
        success: false,
        message: 'Exam is not currently authorized.',
      };
    }

    if (
      existingRecord.status === 'EXAM_IN_PROGRESS' || 
      (student.activeExamAttempt && student.activeExamAttempt.unitId === unitId && student.activeExamAttempt.status === 'active')
    ) {
      return {
        updatedStudent: student,
        success: false,
        message: 'Cannot revoke authorization: an active exam attempt is already in progress.',
      };
    }

    const updatedRecord: UnitExamRecord = {
      ...existingRecord,
      isAuthorizedByTeacher: false,
      status: existingRecord.attemptsHistory?.length > 0 && existingRecord.lastAttemptScore !== undefined && existingRecord.lastAttemptScore < 95 
        ? 'FAILED' 
        : 'LEARNING',
    };

    const updatedStudent: UserProfile = {
      ...student,
      vocabProgression: {
        ...existingProg,
        [unitId]: updatedRecord,
      },
    };

    return {
      updatedStudent,
      success: true,
      message: 'Exam authorization revoked.',
    };
  }

  /**
   * Teacher authorizes a retake attempt for a student who previously failed
   */
  public static authorizeRetake(
    student: UserProfile,
    unitId: string,
    teacherUsername: string = 'Teacher'
  ): { updatedStudent: UserProfile; success: boolean; message: string } {
    const existingProg = student.vocabProgression || {};
    const existingRecord: UnitExamRecord = existingProg[unitId] || {
      unitId,
      status: 'FAILED',
      isAuthorizedByTeacher: false,
      totalAttempts: 0,
      attemptsHistory: [],
    };

    const updatedRecord: UnitExamRecord = {
      ...existingRecord,
      isAuthorizedByTeacher: true,
      authorizedAt: new Date().toISOString(),
      authorizedBy: teacherUsername,
      status: 'READY_FOR_EXAM',
      activeAttemptId: undefined,
    };

    const updatedStudent: UserProfile = {
      ...student,
      activeExamAttempt: null,
      vocabProgression: {
        ...existingProg,
        [unitId]: updatedRecord,
      },
    };

    return {
      updatedStudent,
      success: true,
      message: `Retake authorized for ${student.name}. The student can now take their official retake.`,
    };
  }

  /**
   * Generate comprehensive, multi-format exam questions from unit vocabulary
   */
  public static generateExamQuestions(
    unit: CurriculumUnit, 
    questionCount: number = 30
  ): ExamQuestionAnswer[] {
    const words = unit.words;
    if (words.length === 0) return [];

    // Target count: full unit words count, or 30 questions evenly balanced
    const actualCount = Math.min(questionCount, Math.max(10, words.length));
    const selectedWords = shuffleArray(words).slice(0, actualCount);

    const questionTypes: ExamQuestionType[] = [
      'word_to_meaning',
      'meaning_to_word',
      'context_sentence',
      'spelling_completion',
      'definition_matching',
    ];

    const questions: ExamQuestionAnswer[] = selectedWords.map((word, idx) => {
      const qType = questionTypes[idx % questionTypes.length];
      const qId = `eq_${unit.id}_${idx + 1}_${Date.now()}`;

      // Distractors from other words in the same unit
      const otherWords = words.filter(w => w.id !== word.id);
      const shuffledOthers = shuffleArray(otherWords);

      switch (qType) {
        case 'word_to_meaning': {
          const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.uzbekTranslation);
          const options = shuffleArray([word.uzbekTranslation, ...wrongAnswers]);
          return {
            questionId: qId,
            questionType: 'word_to_meaning',
            targetWordId: word.id,
            targetWord: word.word,
            prompt: `Choose the correct Uzbek translation for the English word:`,
            subPrompt: `"${word.word}" ${word.phonetic ? `(${word.phonetic})` : ''}`,
            options,
            correctAnswer: word.uzbekTranslation,
            studentAnswer: null,
            isCorrect: null,
          };
        }

        case 'meaning_to_word': {
          const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.word);
          const options = shuffleArray([word.word, ...wrongAnswers]);
          return {
            questionId: qId,
            questionType: 'meaning_to_word',
            targetWordId: word.id,
            targetWord: word.word,
            prompt: `Quyidagi oʻzbekcha maʼnoga toʻgʻri keladigan inglizcha soʻzni tanlang:`,
            subPrompt: `«${word.uzbekTranslation}»`,
            options,
            correctAnswer: word.word,
            studentAnswer: null,
            isCorrect: null,
          };
        }

        case 'context_sentence': {
          // Replace target word in example sentence with a blank
          const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
          let sentenceBlank = word.exampleSentence;
          if (regex.test(sentenceBlank)) {
            sentenceBlank = sentenceBlank.replace(regex, '__________');
          } else {
            sentenceBlank = `In our English lesson, we learned the word "__________". (${word.definition})`;
          }
          const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.word);
          const options = shuffleArray([word.word, ...wrongAnswers]);
          return {
            questionId: qId,
            questionType: 'context_sentence',
            targetWordId: word.id,
            targetWord: word.word,
            prompt: `Complete the sentence with the correct vocabulary word:`,
            subPrompt: sentenceBlank,
            options,
            correctAnswer: word.word,
            studentAnswer: null,
            isCorrect: null,
          };
        }

        case 'spelling_completion': {
          const chars = word.word.split('');
          const masked = chars.map((c, i) => {
            if (c === ' ' || c === '-' || c === "'") return c;
            if (i === 0 || i === chars.length - 1) return c;
            return i % 2 === 0 ? '_' : c;
          }).join(' ');

          const wrongSpellings = shuffledOthers.slice(0, 3).map(w => w.word);
          const options = shuffleArray([word.word, ...wrongSpellings]);
          return {
            questionId: qId,
            questionType: 'spelling_completion',
            targetWordId: word.id,
            targetWord: word.word,
            prompt: `Identify the correctly spelled word based on the hint and definition:`,
            subPrompt: `Hint: ${masked} • (${word.definition})`,
            options,
            correctAnswer: word.word,
            studentAnswer: null,
            isCorrect: null,
          };
        }

        case 'definition_matching':
        default: {
          const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.word);
          const options = shuffleArray([word.word, ...wrongAnswers]);
          return {
            questionId: qId,
            questionType: 'definition_matching',
            targetWordId: word.id,
            targetWord: word.word,
            prompt: `Which English word matches this definition?`,
            subPrompt: `"${word.definition}"`,
            options,
            correctAnswer: word.word,
            studentAnswer: null,
            isCorrect: null,
          };
        }
      }
    });

    return questions;
  }

  /**
   * Start or resume an official vocabulary exam attempt
   */
  public static startExam(
    student: UserProfile, 
    unit: CurriculumUnit
  ): { updatedStudent: UserProfile; attempt: VocabularyExamAttempt; success: boolean; error?: string } {
    const unitId = unit.id;
    const existingProg = student.vocabProgression || {};
    const unitRecord = existingProg[unitId];

    // 1. Resume existing active attempt if one already exists
    if (
      student.activeExamAttempt && 
      student.activeExamAttempt.unitId === unitId && 
      student.activeExamAttempt.status === 'active'
    ) {
      return {
        updatedStudent: student,
        attempt: student.activeExamAttempt,
        success: true,
      };
    }

    // 2. Server-side validation: teacher must have authorized the exam
    const isAuthorized = unitRecord?.isAuthorizedByTeacher === true;
    if (!isAuthorized) {
      return {
        updatedStudent: student,
        attempt: null as any,
        success: false,
        error: 'Teacher authorization is required before starting the official final exam.',
      };
    }

    // 3. Generate exam questions
    const questions = this.generateExamQuestions(unit, 30);
    const attemptNumber = (unitRecord?.totalAttempts || 0) + 1;
    const attemptId = `att_${student.id}_${unit.id}_${Date.now()}`;

    const newAttempt: VocabularyExamAttempt = {
      id: attemptId,
      studentId: student.id,
      studentName: student.name,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      levelId: unit.levelId,
      attemptNumber,
      status: 'active',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      questions,
      correctCount: 0,
      scorePercentage: 0,
      passed: false,
      tabSwitchCount: 0,
      lastHeartbeatAt: new Date().toISOString(),
    };

    const updatedRecord: UnitExamRecord = {
      unitId: unit.id,
      status: 'EXAM_IN_PROGRESS',
      isAuthorizedByTeacher: true,
      authorizedAt: unitRecord.authorizedAt,
      authorizedBy: unitRecord.authorizedBy,
      activeAttemptId: attemptId,
      highestScore: unitRecord.highestScore,
      lastAttemptScore: unitRecord.lastAttemptScore,
      totalAttempts: unitRecord.totalAttempts || 0,
      attemptsHistory: unitRecord.attemptsHistory || [],
    };

    const updatedStudent: UserProfile = {
      ...student,
      activeExamAttempt: newAttempt,
      vocabProgression: {
        ...existingProg,
        [unitId]: updatedRecord,
      },
    };

    this.broadcastLiveExamEvent('start', {
      studentId: student.id,
      studentName: student.name,
      unitId: unit.id,
      attempt: newAttempt,
    });

    return {
      updatedStudent,
      attempt: newAttempt,
      success: true,
    };
  }

  /**
   * Submit an answer to a question during an active exam attempt
   */
  public static submitAnswer(
    student: UserProfile,
    attemptId: string,
    questionIndex: number,
    answer: string
  ): { updatedStudent: UserProfile; attempt: VocabularyExamAttempt; success: boolean; isLastQuestion: boolean } {
    const attempt = student.activeExamAttempt;
    if (!attempt || attempt.id !== attemptId || attempt.status !== 'active') {
      return { updatedStudent: student, attempt: attempt as any, success: false, isLastQuestion: false };
    }

    if (questionIndex !== attempt.currentQuestionIndex) {
      return { updatedStudent: student, attempt, success: false, isLastQuestion: false };
    }

    const question = attempt.questions[questionIndex];
    if (!question) {
      return { updatedStudent: student, attempt, success: false, isLastQuestion: false };
    }

    // Evaluate correctness server-side
    const cleanStudent = answer.trim().toLowerCase();
    const cleanCorrect = question.correctAnswer.trim().toLowerCase();
    const isCorrect = cleanStudent === cleanCorrect;

    const updatedQuestion: ExamQuestionAnswer = {
      ...question,
      studentAnswer: answer,
      isCorrect,
      answeredAt: new Date().toISOString(),
    };

    const updatedQuestions = [...attempt.questions];
    updatedQuestions[questionIndex] = updatedQuestion;

    const newCorrectCount = updatedQuestions.filter(q => q.isCorrect === true).length;
    const isLastQuestion = questionIndex >= attempt.totalQuestions - 1;
    const nextIndex = isLastQuestion ? questionIndex : questionIndex + 1;

    const updatedAttempt: VocabularyExamAttempt = {
      ...attempt,
      questions: updatedQuestions,
      currentQuestionIndex: nextIndex,
      correctCount: newCorrectCount,
      lastHeartbeatAt: new Date().toISOString(),
    };

    const updatedStudent: UserProfile = {
      ...student,
      activeExamAttempt: updatedAttempt,
    };

    this.broadcastLiveExamEvent('progress', {
      studentId: student.id,
      studentName: student.name,
      unitId: attempt.unitId,
      attempt: updatedAttempt,
    });

    return {
      updatedStudent,
      attempt: updatedAttempt,
      success: true,
      isLastQuestion,
    };
  }

  /**
   * Record anti-cheat focus loss or tab switch event
   */
  public static recordTabSwitch(
    student: UserProfile, 
    attemptId?: string
  ): { updatedStudent: UserProfile; attempt: VocabularyExamAttempt | null } {
    const attempt = student.activeExamAttempt;
    if (!attempt || (attemptId && attempt.id !== attemptId) || attempt.status !== 'active') {
      return { updatedStudent: student, attempt: null };
    }

    const updatedAttempt: VocabularyExamAttempt = {
      ...attempt,
      tabSwitchCount: (attempt.tabSwitchCount || 0) + 1,
      lastHeartbeatAt: new Date().toISOString(),
    };

    const updatedStudent: UserProfile = {
      ...student,
      activeExamAttempt: updatedAttempt,
    };

    this.broadcastLiveExamEvent('tab_switch', {
      studentId: student.id,
      studentName: student.name,
      unitId: attempt.unitId,
      attempt: updatedAttempt,
    });

    return { updatedStudent, attempt: updatedAttempt };
  }

  /**
   * Finalize the official exam attempt and calculate server-side pass/fail (95% rule)
   */
  public static finalizeExam(
    student: UserProfile,
    attemptIdOrUnits: string | CurriculumUnit[],
    unitsIfId?: CurriculumUnit[]
  ): { updatedStudent: UserProfile; attempt: VocabularyExamAttempt; passed: boolean; scorePercentage: number } {
    let attemptId: string;
    let allUnits: CurriculumUnit[];

    if (typeof attemptIdOrUnits === 'string') {
      attemptId = attemptIdOrUnits;
      allUnits = unitsIfId || [];
    } else {
      attemptId = student.activeExamAttempt?.id || '';
      allUnits = attemptIdOrUnits || [];
    }

    const attempt = student.activeExamAttempt;
    if (!attempt || (attemptId && attempt.id !== attemptId)) {
      throw new Error('Attempt not found or already finalized.');
    }

    const completedAt = new Date().toISOString();
    const startTime = new Date(attempt.startedAt).getTime();
    const endTime = new Date(completedAt).getTime();
    const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));

    const totalQuestions = attempt.totalQuestions;
    const correctCount = attempt.questions.filter(q => q.isCorrect === true).length;
    
    // Strict calculation: floor percentage so failing scores are NEVER rounded up to 95
    const scorePercentage = Math.floor((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= 95;

    const finalizedAttempt: VocabularyExamAttempt = {
      ...attempt,
      status: 'finalized',
      completedAt,
      durationSeconds,
      correctCount,
      scorePercentage,
      passed,
      lastHeartbeatAt: completedAt,
    };

    const unitId = attempt.unitId;
    const existingProg = student.vocabProgression || {};
    const unitRecord: UnitExamRecord = existingProg[unitId] || {
      unitId,
      status: 'EXAM_IN_PROGRESS',
      isAuthorizedByTeacher: true,
      totalAttempts: 0,
      attemptsHistory: [],
    };

    const highestScore = Math.max(unitRecord.highestScore || 0, scorePercentage);
    const history = [...(unitRecord.attemptsHistory || []), finalizedAttempt];

    const updatedRecord: UnitExamRecord = {
      ...unitRecord,
      status: passed ? 'PASSED' : 'FAILED',
      isAuthorizedByTeacher: false, // Must be re-authorized if failed
      activeAttemptId: undefined,
      highestScore,
      lastAttemptScore: scorePercentage,
      passedAt: passed ? completedAt : unitRecord.passedAt,
      failedAt: !passed ? completedAt : unitRecord.failedAt,
      totalAttempts: (unitRecord.totalAttempts || 0) + 1,
      attemptsHistory: history,
    };

    // Progression: if passed, ensure unitId is in completedUnits
    const updatedCompletedUnits = new Set(student.completedUnits || []);
    if (passed) {
      updatedCompletedUnits.add(unitId);
    }

    // Progression: unlock next unit into LEARNING if passed
    const newVocabProg = {
      ...existingProg,
      [unitId]: updatedRecord,
    };

    if (passed) {
      const levelUnits = allUnits
        .filter(u => u.levelId === (student.levelId || 'beginner') && u.unitNumber <= 12)
        .sort((a, b) => a.unitNumber - b.unitNumber);
      const currentIndex = levelUnits.findIndex(u => u.id === unitId);
      if (currentIndex >= 0 && currentIndex + 1 < levelUnits.length) {
        const nextUnit = levelUnits[currentIndex + 1];
        if (!newVocabProg[nextUnit.id]) {
          newVocabProg[nextUnit.id] = {
            unitId: nextUnit.id,
            status: 'LEARNING',
            isAuthorizedByTeacher: false,
            totalAttempts: 0,
            attemptsHistory: [],
          };
        } else if (newVocabProg[nextUnit.id].status === 'LOCKED') {
          newVocabProg[nextUnit.id] = {
            ...newVocabProg[nextUnit.id],
            status: 'LEARNING',
          };
        }
      }
    }

    // Award XP and Coins if passed
    const xpBonus = passed ? 50 : 5;
    const coinsBonus = passed ? 25 : 2;

    const updatedStudent: UserProfile = {
      ...student,
      xp: (student.xp || 0) + xpBonus,
      coins: (student.coins || 0) + coinsBonus,
      activeExamAttempt: null,
      completedUnits: Array.from(updatedCompletedUnits),
      vocabProgression: newVocabProg,
      lastActiveDate: completedAt,
    };

    this.broadcastLiveExamEvent('finalized', {
      studentId: student.id,
      studentName: student.name,
      unitId,
      attempt: finalizedAttempt,
    });

    return {
      updatedStudent,
      attempt: finalizedAttempt,
      passed,
      scorePercentage,
    };
  }
}
