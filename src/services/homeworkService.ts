import { HomeworkAssignment, HomeworkSubmission, HomeworkStatus, LevelId } from '../types';

const HOMEWORK_ASSIGNMENTS_KEY = 'plc_homework_assignments_v1';
const HOMEWORK_SUBMISSIONS_KEY = 'plc_homework_submissions_v1';

export const INITIAL_HOMEWORK_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'hw_listen_u1',
    title: '🎧 Unit 1 Listening: Morning Routine & Daily Habits',
    type: 'listening',
    levelId: 'beginner',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    instructions: 'Listen to the recording carefully at least 3 times. Write down the full English transcript word-for-word in your physical notebook. When finished, take a clear photo of your handwriting and upload it.',
    audioText: "Hello! My name is Alex and I want to tell you about my daily routine. Every morning, I wake up at seven o'clock. First, I drink a glass of fresh water and brush my teeth. Then, I prepare a delicious breakfast with eggs, toast, and hot green tea. At eight o'clock, I pack my backpack and leave for English class. During the day, I study hard and practice new words with my classmates. In the evening, I enjoy reading exciting stories and spending time with my family. Consistency is the secret to mastering English!",
    targetMinListens: 3,
  },
  {
    id: 'hw_read_u2',
    title: '🎙️ Unit 2 Reading & Translation: The Ancient Silk Road',
    type: 'reading',
    levelId: 'beginner',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    instructions: 'Read the English passage below. Send TWO voice recordings: 1) Read the full English text out loud clearly with good pronunciation. 2) Read one sentence in English, then immediately translate it into Uzbek (sentence-by-sentence).',
    readingPassage: 'Uzbekistan is a country with rich history, legendary scholars, and ancient architecture. Cities like Samarkand and Bukhara were vital stops on the Great Silk Road. Travelers and merchants traded silk, spices, and precious gems across continents. Today, young students learn foreign languages to connect with the world and share their culture. Speaking English with confidence opens countless doors for the future.',
    translationInstructions: 'Read Sentence 1 in English -> Translate Sentence 1 into Uzbek. Repeat for all 5 sentences so your teacher can verify both your English accent and Uzbek translation comprehension.',
  },
  {
    id: 'hw_listen_u3',
    title: '🎧 Unit 3 Listening: A Journey Through London',
    type: 'listening',
    levelId: 'elementary',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    instructions: 'Listen closely at least 3 times. Pay special attention to past tense verbs (visited, arrived, took, stood, loved, wrote). Write the complete transcript in your notebook, check your spelling, and take a photo of your notebook to upload.',
    audioText: 'Last summer, Sarah visited London for the very first time. She arrived at Heathrow Airport on a sunny afternoon and took the Underground straight to Westminster. As she stepped out of the station, the famous Big Ben clock tower stood tall against the blue sky. She loved walking across the Millennium Bridge and visiting world-class museums. Sarah wrote in her travel diary that traveling teaches you more about life than any textbook ever could.',
    targetMinListens: 3,
  }
];

export class HomeworkService {
  public static loadAssignments(): HomeworkAssignment[] {
    try {
      const raw = localStorage.getItem(HOMEWORK_ASSIGNMENTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HomeworkAssignment[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load homework assignments from storage:', err);
    }

    try {
      localStorage.setItem(HOMEWORK_ASSIGNMENTS_KEY, JSON.stringify(INITIAL_HOMEWORK_ASSIGNMENTS));
    } catch {
      // Storage unavailable
    }
    return [...INITIAL_HOMEWORK_ASSIGNMENTS];
  }

  public static saveAssignments(assignments: HomeworkAssignment[]): void {
    try {
      localStorage.setItem(HOMEWORK_ASSIGNMENTS_KEY, JSON.stringify(assignments));
    } catch (err) {
      console.warn('Failed to save homework assignments:', err);
    }
  }

  public static loadSubmissions(): HomeworkSubmission[] {
    try {
      const raw = localStorage.getItem(HOMEWORK_SUBMISSIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HomeworkSubmission[];
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load homework submissions:', err);
    }
    return [];
  }

  public static saveSubmissions(submissions: HomeworkSubmission[]): void {
    try {
      localStorage.setItem(HOMEWORK_SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (err) {
      console.warn('Failed to save homework submissions:', err);
    }
  }

  public static getAssignmentById(id: string): HomeworkAssignment | undefined {
    const list = this.loadAssignments();
    return list.find(a => a.id === id);
  }

  public static getSubmissionsForStudent(studentId: string): HomeworkSubmission[] {
    const subs = this.loadSubmissions();
    return subs.filter(s => s.studentId === studentId);
  }

  public static getSubmissionForAssignment(assignmentId: string, studentId: string): HomeworkSubmission | undefined {
    const subs = this.loadSubmissions();
    return subs.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  }

  public static submitListeningHomework(params: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    listenCount: number;
    totalListenTimeSeconds: number;
    transcriptPhotoUrl: string;
  }): HomeworkSubmission {
    const subs = this.loadSubmissions();
    const existingIndex = subs.findIndex(s => s.assignmentId === params.assignmentId && s.studentId === params.studentId);

    const submission: HomeworkSubmission = {
      id: existingIndex >= 0 ? subs[existingIndex].id : 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      assignmentId: params.assignmentId,
      studentId: params.studentId,
      studentName: params.studentName,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      listenCount: params.listenCount,
      totalListenTimeSeconds: params.totalListenTimeSeconds,
      transcriptPhotoUrl: params.transcriptPhotoUrl,
      aiCheckStatus: 'verified',
    };

    if (existingIndex >= 0) {
      subs[existingIndex] = { ...subs[existingIndex], ...submission };
    } else {
      subs.push(submission);
    }

    this.saveSubmissions(subs);
    return submission;
  }

  public static submitReadingHomework(params: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    readOutLoudAudioUrl: string;
    readTranslateAudioUrl: string;
  }): HomeworkSubmission {
    const subs = this.loadSubmissions();
    const existingIndex = subs.findIndex(s => s.assignmentId === params.assignmentId && s.studentId === params.studentId);

    const submission: HomeworkSubmission = {
      id: existingIndex >= 0 ? subs[existingIndex].id : 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      assignmentId: params.assignmentId,
      studentId: params.studentId,
      studentName: params.studentName,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      listenCount: 0,
      totalListenTimeSeconds: 0,
      readOutLoudAudioUrl: params.readOutLoudAudioUrl,
      readTranslateAudioUrl: params.readTranslateAudioUrl,
    };

    if (existingIndex >= 0) {
      subs[existingIndex] = { ...subs[existingIndex], ...submission };
    } else {
      subs.push(submission);
    }

    this.saveSubmissions(subs);
    return submission;
  }

  public static gradeSubmission(
    submissionId: string, 
    gradeScore: number, 
    feedback: string, 
    status: HomeworkStatus
  ): boolean {
    const subs = this.loadSubmissions();
    const sub = subs.find(s => s.id === submissionId);
    if (!sub) return false;

    sub.gradeScore = gradeScore;
    sub.feedback = feedback;
    sub.status = status;

    this.saveSubmissions(subs);
    return true;
  }

  public static createAssignment(data: Omit<HomeworkAssignment, 'id' | 'createdAt'>): HomeworkAssignment {
    const list = this.loadAssignments();
    const newAssignment: HomeworkAssignment = {
      ...data,
      id: 'hw_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newAssignment);
    this.saveAssignments(list);
    return newAssignment;
  }

  public static deleteAssignment(id: string): boolean {
    const list = this.loadAssignments().filter(a => a.id !== id);
    this.saveAssignments(list);
    return true;
  }
}
