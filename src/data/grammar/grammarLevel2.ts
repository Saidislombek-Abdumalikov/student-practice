import { GrammarUnitDefinition } from '../../types';

export const GRAMMAR_LEVEL_2_UNITS: GrammarUnitDefinition[] = [
  // UNIT 1: Past Continuous & Narrative Tenses
  {
    id: 'l2_u1',
    unitNumber: 1,
    levelId: 'level_2',
    title: 'Unit 1: Past Continuous & Interrupted Actions',
    titleUz: '1-Boʻlim: Past Continuous va Kesishuvchi Harakatlar',
    description: 'Master was/were + V-ing, background descriptions, and contrasting with Past Simple using while and when.',
    topics: [
      {
        id: 'l2_u1_t1',
        unitId: 'l2_u1',
        levelId: 'level_2',
        title: 'Past Continuous vs Past Simple (When & While)',
        titleUz: 'Past Continuous va Past Simple (When va While)',
        slug: 'past-continuous-vs-past-simple',
        description: 'Understand longer background actions interrupted by shorter completed actions.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l1_u9_t1'],
        lesson: {
          id: 'les_l2_u1_t1',
          topicId: 'l2_u1_t1',
          whatIsItEn: 'Use Past Continuous (was/were + V-ing) for a longer ongoing activity in the past. Use Past Simple (V2) for a shorter event that interrupted it. Usually: "While + Past Continuous, Past Simple" or "Past Continuous when + Past Simple".',
          whatIsItUz: 'Oʻtmishda uzoq davom etayotgan harakat (Past Continuous) paytida qisqa harakat sodir boʻlsa (Past Simple). "While"dan keyin Continuous, "when"dan keyin Simple keladi.',
          formula: 'While + was/were + V-ing, Subject + V2',
          positiveStructure: {
            rule: 'I/He/She/It was studying | You/We/They were studying',
            example: 'I was studying grammar when my friend called me.',
            exampleUz: 'Doʻstim qoʻngʻiroq qilganida, men grammatika oʻrganayotgan edim.',
          },
          negativeStructure: {
            rule: "wasn\'t / weren\'t + Verb-ing",

            example: "They weren\'t paying attention while the teacher was explaining.",

            exampleUz: 'Oʻqituvchi tushuntirayotgan paytda ular diqqat bilan quloq solishmayotgan edi.',
          },
          questionStructure: {
            rule: 'Were / Was + Subject + Verb-ing?',
            example: 'What were you doing at 8:00 PM yesterday?',
            exampleUz: 'Kecha soat 20:00 da nima qilayotgan edingiz?',
          },
          examples: [
            { en: 'While she was cooking, she dropped a plate.', uz: 'U ovqat pishirayotganida, likopchani tushirib yubordi.', highlight: 'was cooking ... dropped' },
            { en: 'The sun was shining and birds were singing.', uz: 'Quyosh charaqlab, qushlar sayrab turgan edi (oʻtmish foni).', highlight: 'was shining ... were singing' },
          ],
          signalWords: ['while', 'when', 'as', 'at 5 PM yesterday', 'all morning'],
          commonMistakes: [
            {
              incorrect: 'While I cooked, the phone was ringing.',
              correct: 'While I was cooking, the phone rang.',
              explanationUz: 'Uzoq davom etgan harakat "was cooking" (Continuous), toʻsatdan jiringlagani esa "rang" (Simple).',
            },
          ],
          studyTips: [
            'Rule of thumb: WHILE loves CONTINUOUS (While I was sleeping...), WHEN loves SIMPLE (when he arrived).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l2_u1_1',
            topicId: 'l2_u1_t1',
            type: 'multiple_choice',
            prompt: 'Complete the sentence with the correct tense:',
            sentenceWithBlank: 'While we ___ in the park, it suddenly started to rain.',
            options: ['were walking', 'walked', 'are walking', 'have walked'],
            correctAnswer: 'were walking',
            explanationEn: 'After "while", describe the ongoing background activity with Past Continuous: "were walking".',
            explanationUz: '"while"dan keyin davomiy harakat boʻlgani uchun "were walking".',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l2_u1_1',
            topicId: 'l2_u1_t1',
            type: 'error_correction',
            prompt: 'Find and fix the tense error:',
            wrongSentence: 'I was sleeping when the alarm was ringing.',
            errorWord: 'was ringing',
            correction: 'rang',
            correctAnswer: 'I was sleeping when the alarm rang.',
            explanationEn: 'The interrupting action after "when" takes Past Simple "rang".',
            explanationUz: '"when"dan keyin keluvchi toʻsatdan kesuvchi harakat Past Simple (rang) boʻladi.',
            difficulty: 'medium',
          },
          {
            id: 'p_l2_u1_2',
            topicId: 'l2_u1_t1',
            type: 'sentence_builder',
            prompt: 'Assemble the sentence correctly:',
            scrambledWords: ['He', 'hurt', 'his', 'leg', 'while', 'playing', 'football'],
            correctAnswer: 'He hurt his leg while playing football',
            explanationEn: 'Correct order: Main clause + while + participle/clause.',
            explanationUz: 'Toʻgʻri soʻz tartibi.',
            difficulty: 'medium',
          },
        ],
        testQuestions: [
          {
            id: 't_l2_u1_1',
            topicId: 'l2_u1_t1',
            type: 'multiple_choice',
            prompt: 'What ___ you doing when I called you last night?',
            options: ['were', 'did', 'was', 'are'],
            correctAnswer: 'were',
            explanationEn: 'Were + you + doing (Past Continuous question).',
            explanationUz: 'Past Continuous soʻrogʻi: What were you doing?',
            difficulty: 'easy',
          },
        ],
        flashcards: [
          {
            id: 'f_l2_u1_1',
            front: 'When vs While in Past Tenses',
            back: 'WHILE + Past Continuous (longer ongoing action: while I was reading)\nWHEN + Past Simple (short interrupting action: when the lights went out)',
            formula: 'While was/were + V-ing, Subject + V2',
            example: 'While I was driving, it started to snow.',
            uzbekNote: 'While davomli harakatni, when esa qisqa kesuvchi harakatni oladi.',
          },
        ],
      },
    ],
  },

  // UNIT 2: Present Perfect
  {
    id: 'l2_u2',
    unitNumber: 2,
    levelId: 'level_2',
    title: 'Unit 2: Present Perfect (Experience & Result)',
    titleUz: '2-Boʻlim: Present Perfect (Tajriba va Natija)',
    description: 'Master have/has + V3, life experience with ever/never, recent events with just/already/yet, and duration with for/since.',
    topics: [
      {
        id: 'l2_u2_t1',
        unitId: 'l2_u2',
        levelId: 'level_2',
        title: 'Present Perfect: Ever, Never, Just, Already, Yet',
        titleUz: 'Present Perfect: Ever, Never, Just, Already, Yet',
        slug: 'present-perfect-ever-never-just-already-yet',
        description: 'Connect past actions to the present moment through experiences, recent completions, and expectations.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l1_u4_t1', 'l1_u9_t1'],
        lesson: {
          id: 'les_l2_u2_t1',
          topicId: 'l2_u2_t1',
          whatIsItEn: 'Use Present Perfect when a past action has an effect or connection to NOW. We do NOT specify exact past time. Use "ever/never" for life experience, "just" for a moment ago, "already" for earlier than expected, and "yet" in negatives/questions.',
          whatIsItUz: 'Oʻtmishda boʻlgan, lekin natijasi HOZIRDA koʻrinib turgan harakatlar uchun. Aniq vaqt (yesterday, in 2020) aytilmaydi! Ever/never hayotiy tajribada, just hozirgina, already allaqachon, yet esa inkor va soʻroqda.',
          formula: 'Subject + have/has + Past Participle (V3 / -ed)',
          positiveStructure: {
            rule: "I/You/We/They have (I\'ve) + V3 | He/She/It has (He\'s) + V3",

            example: 'I have already finished all my vocabulary practice.',
            exampleUz: 'Men allaqachon barcha lugʻat mashqlarimni tugatdim.',
          },
          negativeStructure: {
            rule: "haven\'t / hasn\'t + V3 + yet (at the end)",

            example: "They haven\'t received their exam results yet.",

            exampleUz: 'Ular hali oʻz imtihon natijalarini olishmadi.',
          },
          questionStructure: {
            rule: 'Have/Has + Subject + ever + V3?',
            example: 'Have you ever traveled to the United Kingdom?',
            exampleUz: 'Siz umringizda hech Buyuk Britaniyaga borganmisiz?',
          },
          shortAnswers: {
            positive: 'Yes, I have. / Yes, she has.',
            negative: "No, I haven\'t. / No, she hasn\'t.",

          },
          examples: [
            { en: 'I have lost my passport! (Result: I don\'t have it now)', uz: 'Pasportimni yoʻqotib qoʻydim! (Hozir menda yoʻq)', highlight: 'have lost' },
            { en: 'She has just arrived at the airport.', uz: 'U hozirgina aeroportga yetib keldi.', highlight: 'has just arrived' },
          ],
          signalWords: ['ever', 'never', 'already', 'yet', 'just', 'recently', 'so far', 'for', 'since'],
          commonMistakes: [
            {
              incorrect: 'I have seen him yesterday.',
              correct: 'I saw him yesterday.',
              explanationUz: '"yesterday", "last year" kabi aniq oʻtgan vaqt bilan Present Perfect ishlatilmaydi! Past Simple (saw) kerak.',
            },
            {
              incorrect: "I haven\'t never been to London.",

              correct: 'I have never been to London.',
              explanationUz: '"Never" oʻzi inkor maʼnosini bildiradi, shuning uchun "haven\'t" bilan ikkita inkor qoʻshilmaydi.',

            },
          ],
          studyTips: [
            'If there is an exact past time (yesterday, 2 days ago, in 2021) -> ALWAYS use Past Simple, NOT Present Perfect!',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l2_u2_1',
            topicId: 'l2_u2_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct form for life experience:',
            sentenceWithBlank: '___ you ever eaten sushi?',
            options: ['Have', 'Did', 'Were', 'Do'],
            correctAnswer: 'Have',
            explanationEn: '"Have you ever + V3" is the standard question for life experiences.',
            explanationUz: 'Hayotiy tajriba soʻrovi: "Have you ever eaten...?"',
            difficulty: 'easy',
          },
          {
            id: 'g_l2_u2_2',
            topicId: 'l2_u2_t1',
            type: 'fill_blank',
            prompt: 'Fill in the blank with the negative marker for expectations:',
            sentenceWithBlank: "We haven\'t finished the project ___.",

            options: ['yet', 'already', 'never', 'just'],
            correctAnswer: 'yet',
            explanationEn: '"yet" goes at the end of negative sentences and questions in Present Perfect.',
            explanationUz: '"yet" (hali) inkor gaplarning oxirida keladi.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l2_u2_1',
            topicId: 'l2_u2_t1',
            type: 'error_correction',
            prompt: 'Identify and fix the mistake:',
            wrongSentence: 'I have visited Samarkand last month.',
            errorWord: 'have visited',
            correction: 'visited',
            correctAnswer: 'I visited Samarkand last month.',
            explanationEn: '"last month" specifies finished past time, which requires Past Simple "visited".',
            explanationUz: '"last month" aniq oʻtgan zamon boʻlgani uchun Past Simple "visited" boʻladi.',
            difficulty: 'medium',
          },
          {
            id: 'p_l2_u2_2',
            topicId: 'l2_u2_t1',
            type: 'sentence_builder',
            prompt: 'Arrange the words correctly:',
            scrambledWords: ['She', 'has', 'already', 'done', 'her', 'homework'],
            correctAnswer: 'She has already done her homework',
            explanationEn: '"already" sits between the auxiliary "has" and main verb "done".',
            explanationUz: '"already" have/has va asosiy feʼl oʻrtasida keladi.',
            difficulty: 'easy',
          },
        ],
        testQuestions: [
          {
            id: 't_l2_u2_1',
            topicId: 'l2_u2_t1',
            type: 'multiple_choice',
            prompt: 'He is not hungry because he ___ had lunch.',
            options: ['has just', 'did just', 'just', 'have just'],
            correctAnswer: 'has just',
            explanationEn: 'He + has + just + had lunch (present result).',
            explanationUz: 'U toʻq, chunki hozirgina tushlik qildi: has just had.',
            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l2_u2_1',
            front: 'Present Perfect Signal Positions',
            back: "JUST / ALREADY / NEVER: Between have/has and V3 (I have already eaten)\nYET: At the END of negative sentences and questions (I haven\'t eaten yet)",

            formula: "have/has + already/just + V3  |  haven\'t + V3 + yet",

            example: 'Have you finished yet? — I have already finished.',
            uzbekNote: 'Just/already/never oʻrtada, yet esa gap oxirida keladi.',
          },
        ],
      },
    ],
  },

  // UNIT 7: Conditionals (Zero & First)
  {
    id: 'l2_u7',
    unitNumber: 7,
    levelId: 'level_2',
    title: 'Unit 7: Conditionals (Zero & First)',
    titleUz: '7-Boʻlim: Shart Mayllari (0 va 1-Shart Ergash Gaplar)',
    description: 'General scientific truths (Zero Conditional) and realistic future conditions with if and unless (First Conditional).',
    topics: [
      {
        id: 'l2_u7_t1',
        unitId: 'l2_u7',
        levelId: 'level_2',
        title: 'First Conditional: Real Future Possibilities',
        titleUz: 'First Conditional: Haqiqiy Kelasi Ehtimollar',
        slug: 'first-conditional-real-future',
        description: 'Form if + Present Simple, will + base verb for real future possibilities.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l1_u5_t1', 'l1_u10_t1'],
        lesson: {
          id: 'les_l2_u7_t1',
          topicId: 'l2_u7_t1',
          whatIsItEn: 'Use the First Conditional to talk about realistic conditions and their probable future results. If the condition happens, the result will follow.',
          whatIsItUz: 'Kelajakda amalga oshishi mumkin boʻlgan real shart va uning natijasi uchun. Agar shart bajarilsa, natija kelib chiqadi.',
          formula: 'If + Present Simple, Subject + will + Base Verb',
          positiveStructure: {
            rule: 'If you study hard, you will pass the IELTS exam with band 8.',
            example: 'If it rains tomorrow, we will stay at home.',
            exampleUz: 'Agar ertaga yomgʻir yogʻsa, biz uyda qolamiz.',
          },
          negativeStructure: {
            rule: "If you don\'t practice, you won\'t master grammar. / Unless you practice...",

            example: 'Unless you hurry, you will miss the train.',
            exampleUz: 'Agar shoshilmasangiz, poyezdga kech qolasiz (unless = if not).',
          },
          questionStructure: {
            rule: 'What will you do if it rains?',
            example: 'Where will you go if you win the competition?',
            exampleUz: 'Musobaqada gʻolib boʻlsangiz, qayerga borasiz?',
          },
          examples: [
            { en: 'If I have enough coins, I will buy the golden crown in the shop.', uz: 'Agar yetarli tangalarim boʻlsa, doʻkondan oltin tojni sotib olaman.', highlight: 'If I have ... will buy' },
          ],
          signalWords: ['if', 'unless', 'as soon as', 'provided that'],
          commonMistakes: [
            {
              incorrect: 'If it will rain tomorrow, we will stay home.',
              correct: 'If it rains tomorrow, we will stay home.',
              explanationUz: 'KATTA XATO: "If" bor qismda HECH QACHON "will" ishlatilmaydi! Present Simple (rains) ishlatiladi.',
            },
          ],
          studyTips: [
            'Golden rule: NEVER put "will" inside the IF-clause! If + Present Simple, Main clause + will.',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l2_u7_1',
            topicId: 'l2_u7_t1',
            type: 'multiple_choice',
            prompt: 'Complete the First Conditional clause:',
            sentenceWithBlank: 'If she ___ her exams, she will celebrate with her friends.',
            options: ['passes', 'will pass', 'passed', 'is passing'],
            correctAnswer: 'passes',
            explanationEn: 'In the IF-clause of First Conditional, use Present Simple (passes), never "will pass".',
            explanationUz: '"If" ergash gapida "will" emas, Present Simple (passes) ishlatiladi.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l2_u7_1',
            topicId: 'l2_u7_t1',
            type: 'error_correction',
            prompt: 'Correct the First Conditional mistake:',
            wrongSentence: 'If I will see him, I will give him your message.',
            errorWord: 'will see',
            correction: 'see',
            correctAnswer: 'If I see him, I will give him your message.',
            explanationEn: 'Remove "will" from the IF-clause: "If I see him".',
            explanationUz: '"If" qismidagi "will" olib tashlanadi -> If I see him.',
            difficulty: 'medium',
          },
        ],
        testQuestions: [
          {
            id: 't_l2_u7_1',
            topicId: 'l2_u7_t1',
            type: 'multiple_choice',
            prompt: 'Unless you ___ right now, you will be late for school.',
            options: ['leave', 'will leave', 'don\'t leave', 'left'],
            correctAnswer: 'leave',
            explanationEn: '"Unless" already means "if not", so use affirmative Present Simple: "Unless you leave".',
            explanationUz: '"Unless" oʻzida inkor saqlaydi, shuning uchun "leave" qoʻyiladi.',
            difficulty: 'hard',
          },
        ],
        flashcards: [
          {
            id: 'f_l2_u7_1',
            front: 'First Conditional Golden Rule',
            back: 'IF + Present Simple, WILL + Verb\nNEVER put "will" in the IF-part!',
            formula: 'If + V1(s), will + V(base)',
            example: 'If it rains, we will cancel the picnic.',
            uzbekNote: 'If bor joyda will boʻlmaydi! If it rains, I will stay.',
          },
        ],
      },
    ],
  },

  // UNIT 9: Passive Voice Foundations
  {
    id: 'l2_u9',
    unitNumber: 9,
    levelId: 'level_2',
    title: 'Unit 9: Passive Voice Foundations',
    titleUz: '9-Boʻlim: Majhul Nisbat Asoslari (Passive Voice)',
    description: 'Focus on the action and object rather than the agent with Present and Past Simple Passive.',
    topics: [
      {
        id: 'l2_u9_t1',
        unitId: 'l2_u9',
        levelId: 'level_2',
        title: 'Present & Past Simple Passive',
        titleUz: 'Hozirgi va Oʻtgan Zamon Majhul Nisbati',
        slug: 'present-past-simple-passive',
        description: 'Form is/are + V3 and was/were + V3 when the action is more important than who did it.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l1_u3_t1', 'l1_u9_t1'],
        lesson: {
          id: 'les_l2_u9_t1',
          topicId: 'l2_u9_t1',
          whatIsItEn: 'In active sentences, the subject does the action (Shakespeare wrote Hamlet). In passive sentences, the object becomes the subject because the action itself is what matters (Hamlet was written by Shakespeare).',
          whatIsItUz: 'Majhul nisbatda harakatni kim bajarganidan koʻra, nima qilingani muhimroq boʻladi. Present: am/is/are + V3. Past: was/were + V3.',
          formula: 'Object as Subject + BE (is/are/was/were) + Past Participle (V3)',
          positiveStructure: {
            rule: 'English is spoken all over the world. | The telephone was invented in 1876.',
            example: 'Cotton is grown in Uzbekistan.',
            exampleUz: 'Oʻzbekistonda paxta yetishtiriladi.',
          },
          negativeStructure: {
            rule: "isn\'t / aren\'t / wasn\'t / weren\'t + V3",

            example: "These cars aren\'t manufactured in Europe.",

            exampleUz: 'Bu mashinalar Yevropada ishlab chiqarilmaydi.',
          },
          questionStructure: {
            rule: 'Is/Are/Was/Were + Subject + V3?',
            example: 'When was this historical monument built?',
            exampleUz: 'Bu tarixiy obida qachon qurilgan?',
          },
          examples: [
            { en: 'Millions of messages are sent every day.', uz: 'Har kuni millionlab xabarlar yuboriladi.', highlight: 'are sent' },
            { en: 'The ancient city of Samarkand was founded centuries ago.', uz: 'Qadimiy Samarqand shahri asrlar muqaddam barpo etilgan.', highlight: 'was founded' },
          ],
          signalWords: ['by', 'is made of', 'was built', 'are produced', 'was invented'],
          commonMistakes: [
            {
              incorrect: 'The letter was wrote yesterday.',
              correct: 'The letter was written yesterday.',
              explanationUz: 'Passive doimo 3-shakl (Past Participle) bilan tuziladi: write -> wrote -> WRITTEN.',
            },
          ],
          studyTips: [
            'Remember: Passive ALWAYS needs two ingredients: a form of BE + Verb 3 (Past Participle)!',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l2_u9_1',
            topicId: 'l2_u9_t1',
            type: 'multiple_choice',
            prompt: 'Complete with Present Simple Passive:',
            sentenceWithBlank: 'English ___ by millions of students around the globe.',
            options: ['is learned', 'learns', 'is learning', 'was learned'],
            correctAnswer: 'is learned',
            explanationEn: 'Singular subject "English" + is + V3 "learned".',
            explanationUz: '"English" birlikda, hozirgi majhul nisbat: is learned.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l2_u9_1',
            topicId: 'l2_u9_t1',
            type: 'translation_uz_en',
            prompt: 'Translate into English:',
            sentenceWithBlank: 'Bu kitob 1920-yilda yozilgan.',
            options: [
              'This book was written in 1920.',
              'This book wrote in 1920.',
              'This book was wrote in 1920.',
              'This book is written in 1920.',
            ],
            correctAnswer: 'This book was written in 1920.',
            explanationEn: 'Past passive: was written.',
            explanationUz: 'Oʻtgan zamon majhul nisbati: was written.',
            difficulty: 'medium',
          },
        ],
        testQuestions: [
          {
            id: 't_l2_u9_1',
            topicId: 'l2_u9_t1',
            type: 'multiple_choice',
            prompt: 'The pyramids ___ thousands of years ago.',
            options: ['were built', 'was built', 'built', 'are built'],
            correctAnswer: 'were built',
            explanationEn: 'Plural "pyramids" + were + V3 "built".',
            explanationUz: '"pyramids" koʻplik boʻlgani uchun: were built.',
            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l2_u9_1',
            front: 'Passive Voice Formula',
            back: 'BE + Past Participle (V3)\nPresent: is/are + V3 (is made)\nPast: was/were + V3 (was made)',
            formula: 'BE + V3',
            example: 'The bridge was built in 1990.',
            uzbekNote: 'Doimo BE shakli + feʼlning 3-shakli (V3).',
          },
        ],
      },
    ],
  },

  // UNIT 3: Present Perfect with Ever, Never, Already, Yet & Just
  {
    id: 'l2_u3',
    unitNumber: 3,
    levelId: 'level_2',
    title: 'Unit 3: Present Perfect (Experience & Recent Actions)',
    titleUz: '3-Boʻlim: Present Perfect (Tajriba va Yaqinda Bajarilgan Ishlar)',
    description: 'Master have/has + V3 with ever, never, already, yet, and just to talk about life experience and recent news.',
    topics: [
      {
        id: 'l2_u3_t1',
        unitId: 'l2_u3',
        levelId: 'level_2',
        title: 'Life Experiences: Ever and Never',
        titleUz: 'Hayotiy Tajriba: Ever va Never',
        slug: 'present-perfect-ever-never',
        description: 'Ask and answer about things you have or have not done in your whole life.',
        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l1_u9_t1'],
        lesson: {
          id: 'les_l2_u3_t1',
          whatIsItEn: 'Use Present Perfect (have/has + V3) to talk about experiences at any time up to now. Use "ever" in questions and "never" in negative statements.',
          whatIsItUz: 'Hozirgacha boʻlgan tajribalarni aytishda ishlatiladi. Savolda "ever" (hech), inkorda "never" (hech qachon) keladi.',
          formula: 'Subject + have/has + V3 (Past Participle)',
          positiveStructure: {
            rule: 'I/You/We/They have + V3 | He/She/It has + V3',
            example: 'I have visited Samarkand three times.',
            exampleUz: 'Men Samarqandga uch marta borganman.',
          },
          negativeStructure: {
            rule: "have/has never + V3 OR haven\'t/hasn\'t + V3",
            example: 'She has never tried sushi before.',
            exampleUz: 'U ilgari hech qachon sushi yeb koʻrmagan.',
          },
          questionStructure: {
            rule: 'Have/Has + Subject + ever + V3?',
            example: 'Have you ever flown in a helicopter?',
            exampleUz: 'Hech vertolyotda uchganmisiz?',
          },
          examples: [
            { en: 'Have you ever seen a shooting star?', uz: 'Hech oqqan yulduzni koʻrganmisiz?', highlight: 'Have you ever seen' },
            { en: 'He has never broken a bone.', uz: 'Uning suyagi hech qachon sinmagan.', highlight: 'has never broken' },
          ],
          signalWords: ['ever', 'never', 'before', 'once', 'twice', 'so far'],
          commonMistakes: [
            { incorrect: 'Did you ever went to London?', correct: 'Have you ever been to London?', explanationUz: 'Umumiy hayotiy tajriba uchun Past Simple emas, Present Perfect "been" ishlatiladi.' }
          ],
          studyTips: ['Remember: "been to" means gone and returned; "gone to" means still there!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u3_q1',
            topicId: 'l2_u3_t1',
            type: 'multiple_choice',
            prompt: '___ you ever eaten traditional Italian pizza in Rome?',
            options: ['Have', 'Has', 'Did', 'Were'],
            correctAnswer: 'Have',
            explanationEn: 'Use "Have" with pronoun "you" in Present Perfect questions.',
            explanationUz: '"You" olmoshi bilan "Have" qoʻyiladi.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u3_q2',
            topicId: 'l2_u3_t1',
            type: 'fill_blank',
            prompt: 'Complete the sentence with the correct form of "ride".',
            sentenceWithBlank: 'My younger brother has never ___ a horse.',
            options: ['ridden', 'rode', 'ride', 'riding'],
            correctAnswer: 'ridden',
            explanationEn: 'The V3 (past participle) form of "ride" is "ridden".',
            explanationUz: '"Ride" feʼlining 3-shakli: ridden.',
            difficulty: 'medium'
          },
          {
            id: 'l2_u3_q3',
            topicId: 'l2_u3_t1',
            type: 'multiple_choice',
            prompt: 'Where is Sanjar? — He has ___ to the grocery store; he will be back in 10 minutes.',
            options: ['gone', 'been', 'went', 'go'],
            correctAnswer: 'gone',
            explanationEn: 'He is still at the store, so we use "gone to".',
            explanationUz: 'U hali qaytib kelmagan boʻlsa, "gone" ishlatiladi.',
            difficulty: 'medium'
          },
          {
            id: 'l2_u3_q4',
            topicId: 'l2_u3_t1',
            type: 'error_correction',
            prompt: 'Find and fix the error in the sentence.',
            wrongSentence: 'I have never see such a beautiful sunset before.',
            errorWord: 'see',
            correction: 'seen',
            correctAnswer: 'seen',
            options: ['saw', 'seen', 'seeing', 'sees'],
            explanationEn: 'After "have never", the verb must be in V3 form: "seen".',
            explanationUz: '"Have never" dan keyin feʼl 3-shaklda: seen boʻlishi shart.',
            difficulty: 'hard'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u3_tq1',
            topicId: 'l2_u3_t1',
            type: 'multiple_choice',
            prompt: 'Has Malika finished her homework ___?',
            options: ['yet', 'already', 'ever', 'never'],
            correctAnswer: 'yet',
            explanationEn: 'Use "yet" at the end of negative sentences and questions in Present Perfect.',
            explanationUz: 'Savol va inkor gaplarning oxirida "yet" (hali) keladi.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u3_tq2',
            topicId: 'l2_u3_t1',
            type: 'multiple_choice',
            prompt: 'We have ___ arrived at the airport. Our flight is in two hours.',
            options: ['just', 'yet', 'ever', 'ago'],
            correctAnswer: 'just',
            explanationEn: '"just" means a very short time ago and sits between "have" and V3.',
            explanationUz: '"Just" yaqindagina maʼnosida have va feʼl oʻrtasida keladi.',
            difficulty: 'medium'
          }
        ],
        flashcards: [
          {
            id: 'fc_l2_u3_1',
            front: 'Have you ever + V3?',
            back: 'Hech ... qilganmisiz? (Hayotiy tajribani soʻrash)',
            formula: 'Have + you + ever + V3?',
            example: 'Have you ever been to Japan?'
          }
        ]
      }
    ]
  },

  // UNIT 4: Present Perfect with For & Since vs Past Simple
  {
    id: 'l2_u4',
    unitNumber: 4,
    levelId: 'level_2',
    title: 'Unit 4: Present Perfect with For and Since',
    titleUz: '4-Boʻlim: For va Since bilan Present Perfect',
    description: 'Describe actions that started in the past and continue into the present.',
    topics: [
      {
        id: 'l2_u4_t1',
        unitId: 'l2_u4',
        levelId: 'level_2',
        title: 'Duration: For vs Since',
        titleUz: 'Davomiylik: For va Since',
        slug: 'present-perfect-for-since',
        description: 'Learn when to use "for" (period of time) and "since" (starting point).',
        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l2_u3_t1'],
        lesson: {
          id: 'les_l2_u4_t1',
          whatIsItEn: 'Use "for" with a duration of time (e.g. for 5 years, for two hours). Use "since" with a specific starting point in time (e.g. since 2018, since Monday, since 8 AM).',
          whatIsItUz: '"For" vaqt oraligʻi (5 yil davomida, 2 soat mobaynida), "since" esa boshlanish nuqtasi (2018-yildan beri, dushanbadan buyon) bilan ishlatiladi.',
          formula: 'Subject + have/has + V3 + for / since ...',
          positiveStructure: {
            rule: 'have/has lived ... for 10 years / since 2014',
            example: 'They have lived in Tashkent for ten years.',
            exampleUz: 'Ular Toshkentda oʻn yildan beri yashashadi.',
          },
          negativeStructure: {
            rule: "haven\'t/hasn\'t seen ... since March",
            example: "I haven\'t seen Jasur since last month.",

            exampleUz: 'Jasurni oʻtgan oydan beri koʻrmadim.',
          },
          questionStructure: {
            rule: 'How long + have/has + Subject + V3?',
            example: 'How long have you known each other?',
            exampleUz: 'Bir-biringizni qancha vaqtdan beri taniysizlar?',
          },
          examples: [
            { en: 'She has worked here since 2020.', uz: 'U bu yerda 2020-yildan beri ishlaydi.', highlight: 'since 2020' },
            { en: 'We have studied English for 6 months.', uz: 'Biz 6 oy mobaynida ingliz tili oʻrgandik.', highlight: 'for 6 months' },
          ],
          signalWords: ['for 3 days', 'for a long time', 'since yesterday', 'since 2019', 'How long...?'],
          commonMistakes: [
            { incorrect: 'I know him since 3 years.', correct: 'I have known him for 3 years.', explanationUz: 'Vaqt oraligʻi uchun "since" emas, "for" ishlatiladi, zamon esa Present Perfect boʻladi.' }
          ],
          studyTips: ['FOR = counting time (1, 2, 3...). SINCE = clock or calendar name (May, 2021, 9 o\'clock).']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u4_q1',
            topicId: 'l2_u4_t1',
            type: 'multiple_choice',
            prompt: 'Anvar has played chess ___ he was seven years old.',
            options: ['since', 'for', 'during', 'from'],
            correctAnswer: 'since',
            explanationEn: 'A specific starting point in life takes "since".',
            explanationUz: 'Boshlanish vaqti aniq boʻlsa "since" qoʻyiladi.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u4_q2',
            topicId: 'l2_u4_t1',
            type: 'multiple_choice',
            prompt: 'They have been best friends ___ more than ten years.',
            options: ['for', 'since', 'ago', 'in'],
            correctAnswer: 'for',
            explanationEn: '"more than ten years" is a duration, so use "for".',
            explanationUz: 'Davomiylik oraligʻi uchun "for" qoʻyiladi.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u4_q3',
            topicId: 'l2_u4_t1',
            type: 'fill_blank',
            prompt: 'Fill in the blank with the correct question word.',
            sentenceWithBlank: '___ long have you been learning English?',
            options: ['How', 'What', 'When', 'Why'],
            correctAnswer: 'How',
            explanationEn: 'The question phrase for duration is "How long".',
            explanationUz: 'Davomiylikni soʻrash iborasi: "How long".',
            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u4_tq1',
            topicId: 'l2_u4_t1',
            type: 'multiple_choice',
            prompt: 'I ___ my car in 2022. (Past event at a finished time)',
            options: ['bought', 'have bought', 'was buying', 'buy'],
            correctAnswer: 'bought',
            explanationEn: 'A finished past time like "in 2022" strictly requires Past Simple "bought".',
            explanationUz: 'Tugagan vaqt (in 2022) boʻlgani uchun Past Simple: bought.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 5: Past Perfect & Sequence of Past Events
  {
    id: 'l2_u5',
    unitNumber: 5,
    levelId: 'level_2',
    title: 'Unit 5: Past Perfect (Had + V3)',
    titleUz: '5-Boʻlim: Past Perfect (Had + V3)',
    description: 'Learn how to show which event happened first between two past actions.',
    topics: [
      {
        id: 'l2_u5_t1',
        unitId: 'l2_u5',
        levelId: 'level_2',
        title: 'Past Perfect vs Past Simple',
        titleUz: 'Past Perfect va Past Simple farqi',
        slug: 'past-perfect-vs-past-simple',
        description: 'Understand the "earlier past" action that took place before another past action.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l2_u1_t1', 'l2_u3_t1'],
        lesson: {
          id: 'les_l2_u5_t1',
          whatIsItEn: 'Use Past Perfect (had + V3) to make clear that one action happened BEFORE another action in the past. Action 1 = Past Perfect; Action 2 = Past Simple.',
          whatIsItUz: 'Oʻtmishdagi ikki harakatdan qaysi biri oldinroq sodir boʻlganini koʻrsatish uchun birinchisiga Past Perfect (had + V3), keyingisiga Past Simple qoʻyiladi.',
          formula: 'Subject + had + V3 (Past Participle)',
          positiveStructure: {
            rule: 'Subject + had + V3',
            example: 'When I arrived at the cinema, the movie had already started.',
            exampleUz: 'Kinoteatrga yetib borganimda, kino allaqachon boshlanib boʻlgan edi.',
          },
          negativeStructure: {
            rule: "Subject + hadn\'t + V3",
            example: "He hadn\'t studied before, so the exam was very hard.",

            exampleUz: 'U avval dars qilmagan edi, shuning uchun imtihon juda qiyin boʻldi.',
          },
          questionStructure: {
            rule: 'Had + Subject + V3?',
            example: 'Had you eaten breakfast before you left home?',
            exampleUz: 'Uydan chiqishingizdan oldin nonushta qilganmidingiz?',
          },
          examples: [
            { en: 'She had already packed her suitcase before the taxi arrived.', uz: 'Taksi kelguncha u chamadonini yigʻishtirib boʻlgan edi.', highlight: 'had already packed ... arrived' },
          ],
          signalWords: ['by the time', 'before', 'after', 'already', 'when'],
          commonMistakes: [
            { incorrect: 'When I arrived, the train already left.', correct: 'When I arrived, the train had already left.', explanationUz: 'Poyezd men kelishimdan OLDIN ketib boʻlgan, shuning uchun "had left" ishlatiladi.' }
          ],
          studyTips: ['Draw a timeline: Past Perfect happens FIRST, then Past Simple, then Now.']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u5_q1',
            topicId: 'l2_u5_t1',
            type: 'multiple_choice',
            prompt: 'By the time the fire brigade arrived, the neighbors ___ out the fire.',
            options: ['had put', 'put', 'have put', 'were putting'],
            correctAnswer: 'had put',
            explanationEn: 'The fire was put out first, before the firefighters arrived.',
            explanationUz: 'Yongʻin oʻt oʻchiruvchilar kelishidan oldin oʻchirilgan: had put.',
            difficulty: 'hard'
          },
          {
            id: 'l2_u5_q2',
            topicId: 'l2_u5_t1',
            type: 'fill_blank',
            prompt: 'Complete the sentence with "had" and the V3 of "finish".',
            sentenceWithBlank: 'Nodir ___ his homework before dinner was served.',
            options: ['had finished', 'finished', 'has finished', 'was finishing'],
            correctAnswer: 'had finished',
            explanationEn: 'Earlier past action takes "had finished".',
            explanationUz: 'Oldinroq tugatilgan ish: had finished.',
            difficulty: 'medium'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u5_tq1',
            topicId: 'l2_u5_t1',
            type: 'multiple_choice',
            prompt: "She didn\'t have any money because she ___ her purse on the bus.",

            options: ['had lost', 'lost', 'has lost', 'loses'],
            correctAnswer: 'had lost',
            explanationEn: 'Losing the purse happened before she noticed she had no money.',
            explanationUz: 'Hamyonini oldinroq yoʻqotib qoʻygan: had lost.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 6: Second Conditional (Imaginary Situations)
  {
    id: 'l2_u6',
    unitNumber: 6,
    levelId: 'level_2',
    title: 'Unit 6: Second Conditional (Hypothetical & Dreams)',
    titleUz: '6-Boʻlim: Ikkinchi Shart Ergash Gap (Xayoliy Vaziyatlar)',
    description: 'Talk about unreal, imaginary present or future situations and their results.',
    topics: [
      {
        id: 'l2_u6_t1',
        unitId: 'l2_u6',
        levelId: 'level_2',
        title: 'Second Conditional (If + Past, would + V1)',
        titleUz: '2-Shart: If + Past Simple, would + feʼl',
        slug: 'second-conditional',
        description: 'Express what you would do in hypothetical, unreal situations.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l2_u2_t1'],
        lesson: {
          id: 'les_l2_u6_t1',
          whatIsItEn: 'Use the Second Conditional to imagine unreal, unlikely, or impossible situations in the present or future.',
          whatIsItUz: 'Hozirgi yoki kelasi zamondagi xayoliy, amalga oshishi qiyin yoki nohaqiqiy shartlar uchun ishlatiladi.',
          formula: 'If + Subject + Past Simple (V2), Subject + would + Verb (V1)',
          positiveStructure: {
            rule: 'If I had a million dollars, I would travel around the world.',
            example: 'If I had a million dollars, I would travel around the world.',
            exampleUz: 'Agar menda bir million dollar boʻlganida, dunyo boʻylab sayohat qilgan boʻlardim.',
          },
          negativeStructure: {
            rule: "If + didn\'t + V1, wouldn\'t + V1",
            example: "If she didn\'t work so much, she wouldn\'t feel so stressed.",

            exampleUz: 'U bu qadar koʻp ishlamaganida, oʻzini bunchalik charchagan his qilmasdi.',
          },
          questionStructure: {
            rule: 'What would you do if + Subject + Past Simple?',
            example: 'What would you do if you found a wallet on the street?',
            exampleUz: 'Koʻchada hamyon topib olsangiz nima qilgan boʻlardingiz?',
          },
          examples: [
            { en: 'If I were you, I would take that opportunity.', uz: 'Agar sizning oʻrningizda boʻlganimda, bu imkoniyatdan foydalangan boʻlardim.', highlight: 'If I were you ... would take' }
          ],
          signalWords: ['If I were you', 'If I had...', 'would', 'could', 'might'],
          commonMistakes: [
            { incorrect: 'If I would have a car, I would drive to work.', correct: 'If I had a car, I would drive to work.', explanationUz: 'IF qismida hech qachon "would" ishlatilmaydi, faqat Past Simple keladi.' }
          ],
          studyTips: ['In formal English, use "were" for all subjects in Second Conditional: "If I were you...", "If he were rich...".']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u6_q1',
            topicId: 'l2_u6_t1',
            type: 'multiple_choice',
            prompt: 'If I ___ the President, I would build more modern libraries.',
            options: ['were', 'was', 'am', 'would be'],
            correctAnswer: 'were',
            explanationEn: 'In formal hypothetical conditional, "were" is used for I/he/she.',
            explanationUz: '2-shartda if qismida "were" eng toʻgʻri shakldir.',
            difficulty: 'medium'
          },
          {
            id: 'l2_u6_q2',
            topicId: 'l2_u6_t1',
            type: 'multiple_choice',
            prompt: 'What ___ you do if you won a free ticket to New York?',
            options: ['would', 'will', 'did', 'are'],
            correctAnswer: 'would',
            explanationEn: 'Main clause of Second Conditional uses "would + V1".',
            explanationUz: 'Natija qismida "would" ishlatiladi.',
            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u6_tq1',
            topicId: 'l2_u6_t1',
            type: 'multiple_choice',
            prompt: 'If we had a bigger house, we ___ invite all our relatives.',
            options: ['could', 'can', 'will', 'may'],
            correctAnswer: 'could',
            explanationEn: '"could" is used as the hypothetical past modal for "would be able to".',
            explanationUz: 'Imkoniyatni bildirish uchun "could" ishlatiladi.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 8: Relative Clauses (Who, Which, That, Whose, Where)
  {
    id: 'l2_u8',
    unitNumber: 8,
    levelId: 'level_2',
    title: 'Unit 8: Relative Clauses (Defining People & Things)',
    titleUz: '8-Boʻlim: Bogʻlovchi Olmoshalar (Odamlar va Narsalarni Taʼriflash)',
    description: 'Connect ideas smoothly using who for people, which/that for objects, where for places, and whose for possession.',
    topics: [
      {
        id: 'l2_u8_t1',
        unitId: 'l2_u8',
        levelId: 'level_2',
        title: 'Relative Pronouns: Who, Which, That, Where',
        titleUz: 'Bogʻlovchi Olmoshalar: Who, Which, That, Where',
        slug: 'relative-clauses-defining',
        description: 'Define and give necessary information about nouns.',
        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l1_u4_t1'],
        lesson: {
          id: 'les_l2_u8_t1',
          whatIsItEn: 'Relative pronouns connect two clauses. WHO for people, WHICH for things/animals, THAT for both, WHERE for places, WHOSE for possession.',
          whatIsItUz: 'WHO shaxslar uchun, WHICH narsa/hayvonlar uchun, WHERE joylar uchun, WHOSE esa egalik uchun qoʻyiladi.',
          formula: 'Noun + who/which/that/where + clause',
          positiveStructure: {
            rule: 'The student WHO speaks English is Dilnoza.',
            example: 'The teacher who helped me is very kind.',
            exampleUz: 'Menga yordam bergan oʻqituvchi juda mehribon.',
          },
          negativeStructure: {
            rule: "The computer which doesn\'t work is old.",
            example: "The phone that doesn\'t turn on needs a battery.",

            exampleUz: 'Yonmayotgan telefon batareyaga muhtoj.',
          },
          questionStructure: {
            rule: 'Is that the restaurant where we had dinner?',
            example: 'Is that the cafe where we met last week?',
            exampleUz: 'Oʻtgan hafta biz uchrashgan kafe shumi?',
          },
          examples: [
            { en: 'A doctor is someone who treats sick people.', uz: 'Shifokor — bemorlarni davolaydigan odamdir.', highlight: 'someone who treats' },
            { en: 'This is the book which won the prize.', uz: 'Bu mukofotni yutib olgan kitobdir.', highlight: 'book which won' },
          ],
          signalWords: ['who', 'which', 'that', 'where', 'whose'],
          commonMistakes: [
            { incorrect: 'The man which called you is my uncle.', correct: 'The man who called you is my uncle.', explanationUz: 'Odamlar uchun "which" emas, "who" ishlatiladi.' }
          ],
          studyTips: ['Think: WHO = human; WHICH = object/animal; WHERE = place.']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u8_q1',
            topicId: 'l2_u8_t1',
            type: 'multiple_choice',
            prompt: 'A chef is a professional ___ cooks delicious food in restaurants.',
            options: ['who', 'which', 'where', 'whose'],
            correctAnswer: 'who',
            explanationEn: 'A chef is a person, so we use "who".',
            explanationUz: 'Oshpaz (chef) inson, shuning uchun "who" tanlanadi.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u8_q2',
            topicId: 'l2_u8_t1',
            type: 'multiple_choice',
            prompt: 'This is the park ___ we used to play football every Saturday.',
            options: ['where', 'which', 'who', 'whose'],
            correctAnswer: 'where',
            explanationEn: 'Refers to a location where an action happened: use "where".',
            explanationUz: 'Harakat sodir boʻlgan joyni ifodalash uchun "where" qoʻyiladi.',
            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u8_tq1',
            topicId: 'l2_u8_t1',
            type: 'multiple_choice',
            prompt: 'I met a student ___ father is an astronaut.',
            options: ['whose', 'who', 'which', 'that'],
            correctAnswer: 'whose',
            explanationEn: '"whose" expresses possession (the student\'s father).',

            explanationUz: 'Egalikni ifodalash uchun "whose" (uning otasi) qoʻyiladi.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 10: Reported Speech (Statements & Questions)
  {
    id: 'l2_u10',
    unitNumber: 10,
    levelId: 'level_2',
    title: 'Unit 10: Reported Speech & Indirect Questions',
    titleUz: '10-Boʻlim: Oʻzlashtirma Gap (Reported Speech)',
    description: 'Shift tenses backwards when quoting what another person said in the past.',
    topics: [
      {
        id: 'l2_u10_t1',
        unitId: 'l2_u10',
        levelId: 'level_2',
        title: 'Tense Backshifting in Reported Speech',
        titleUz: 'Oʻzlashtirma Gapda Zamonlarning Bir Pogʻona Oʻtmishga Surilishi',
        slug: 'reported-speech-statements',
        description: 'Convert direct quotes into reported sentences: present becomes past.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l1_u2_t1', 'l1_u9_t1'],
        lesson: {
          id: 'les_l2_u10_t1',
          whatIsItEn: 'When reporting what someone said in the past, verbs shift back one tense: am/is/are -> was/were, Present Simple -> Past Simple, will -> would, can -> could.',
          whatIsItUz: 'Birovning aytgan gapini oʻtmishda aytib berganda zamonlar bir pogʻona orqaga suriladi: is -> was, do -> did, will -> would.',
          formula: 'Subject + said (that) + Subject + Past Tense Verb',
          positiveStructure: {
            rule: 'Direct: "I am tired" -> Reported: He said he was tired.',
            example: 'She said she lived in London.',
            exampleUz: 'U Londonda yashashini aytdi.',
          },
          negativeStructure: {
            rule: 'Direct: "I can\'t swim" -> Reported: He said he couldn\'t swim.',

            example: "He told me he couldn\'t come to the party.",

            exampleUz: 'U bazmga kela olmasligini aytdi.',
          },
          questionStructure: {
            rule: 'He asked me where I lived (no auxiliary inversion!).',
            example: 'She asked me if I liked ice cream.',
            exampleUz: 'U mendan muzqaymoq yoqtirishimni soʻradi.',
          },
          examples: [
            { en: 'Ali said, "I will call you tomorrow." -> Ali said he would call me the next day.', uz: 'Ali ertasi kuni qoʻngʻiroq qilishini aytdi.', highlight: 'will -> would' },
          ],
          signalWords: ['said that', 'told me that', 'asked if', 'the next day', 'the day before'],
          commonMistakes: [
            { incorrect: 'He told that he was busy.', correct: 'He said that he was busy. OR He told me that...', explanationUz: '"Told" soʻzidan keyin kimgaligi (me/us/him) kelishi shart, "said"dan keyin shart emas.' }
          ],
          studyTips: ['SAID that... vs TOLD ME that... Never say "told that"!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u10_q1',
            topicId: 'l2_u10_t1',
            type: 'multiple_choice',
            prompt: 'Anora: "I love learning English." -> Anora said that she ___ learning English.',
            options: ['loved', 'loves', 'will love', 'had loved'],
            correctAnswer: 'loved',
            explanationEn: 'Present Simple "love" shifts back to Past Simple "loved".',
            explanationUz: 'Present Simple oʻtmishga surilib Past Simple boʻladi: loved.',
            difficulty: 'medium'
          },
          {
            id: 'l2_u10_q2',
            topicId: 'l2_u10_t1',
            type: 'multiple_choice',
            prompt: 'Davron told ___ that the exam was cancelled.',
            options: ['me', 'to me', 'that', 'say'],
            correctAnswer: 'me',
            explanationEn: 'The verb "told" requires an indirect object pronoun: "told me".',
            explanationUz: '"Told"dan keyin toʻldiruvchi (me/him/us) keladi: told me.',
            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u10_tq1',
            topicId: 'l2_u10_t1',
            type: 'multiple_choice',
            prompt: '"I will help you," said Bobur. -> Bobur promised that he ___ help me.',
            options: ['would', 'will', 'can', 'should'],
            correctAnswer: 'would',
            explanationEn: 'In reported speech, "will" changes to "would".',
            explanationUz: '"Will" oʻzlashtirma gapda "would"ga aylanadi.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 11: Modals of Deduction (Must, Can\'t, Might, Could)
  {
    id: 'l2_u11',
    unitNumber: 11,
    levelId: 'level_2',
    title: 'Unit 11: Modals of Deduction (Certainty & Possibility)',
    titleUz: "11-Boʻlim: Taxmin va Ishonch Modal Feʼllari (Must, Can\'t, Might)",

    description: 'Express how sure you are about a situation in the present.',
    topics: [
      {
        id: 'l2_u11_t1',
        unitId: 'l2_u11',
        levelId: 'level_2',
        title: "Present Deduction: Must be, Can\'t be, Might be",

        titleUz: "Hozirgi Zamon Taxmini: Must be, Can\'t be, Might be",

        slug: 'modals-of-deduction',
        description: "Must (99% sure YES), Can\'t (99% sure NO), Might/Could (50% maybe).",

        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l1_u11_t1'],
        lesson: {
          id: 'les_l2_u11_t1',
          whatIsItEn: 'Use "must" when you are almost 100% sure something is true. Use "can\'t" when you are sure it is impossible. Use "might" or "could" when you are unsure.',

          whatIsItUz: "100% ishonch bilan tasdiqlash uchun MUST, mutlaqo imkonsiz boʻlsa CAN\'T, 50% ehtimollik boʻlsa MIGHT/COULD ishlatiladi.",

          formula: "Subject + must / can\'t / might / could + Verb (base form)",

          positiveStructure: {
            rule: 'He must be tired after walking 20 kilometers.',
            example: 'The lights are on; someone must be inside.',
            exampleUz: 'Chiroqlar yoniq; ichkarida kimdir boʻlishi aniq.',
          },
          negativeStructure: {
            rule: "It can\'t be true! (It is impossible!)",
            example: "That can\'t be Sanjar — he is in London right now.",

            exampleUz: 'Bu Sanjar boʻlishi mumkin emas — u ayni paytda Londonda.',
          },
          questionStructure: {
            rule: 'Could it be true?',
            example: 'Could this belong to Nilufar?',
            exampleUz: 'Bu Nilufarniki boʻlishi mumkinmi?',
          },
          examples: [
            { en: 'Take an umbrella; it might rain later.', uz: 'Soyabon oling; keyinroq yomgʻir yogʻib qolishi mumkin.', highlight: 'might rain' },
          ],
          signalWords: ["I\'m sure", 'It\'s impossible', 'perhaps', 'maybe', 'definitely'],
          commonMistakes: [
            { incorrect: 'It mustn\'t be true. (meaning impossible)', correct: 'It can\'t be true.', explanationUz: 'Mantiqan imkonsiz degan maʼnoda "mustn\'t" emas, "can\'t" ishlatiladi.' }
          ],
          studyTips: ['MUST = 100% YES. CAN\'T = 100% NO. MIGHT = 50% MAYBE.']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l2_u11_q1',
            topicId: 'l2_u11_t1',
            type: 'multiple_choice',
            prompt: 'Look at the snow falling outside! It ___ freezing out there.',
            options: ['must be', 'can\'t be', 'couldn\'t be', 'won\'t be'],
            correctAnswer: 'must be',
            explanationEn: 'Based on clear evidence (snow), you are almost 100% sure it is freezing.',
            explanationUz: 'Qor yogʻayotganini koʻrib aniq sovuq deb taxmin qilinganda: must be.',
            difficulty: 'easy'
          },
          {
            id: 'l2_u11_q2',
            topicId: 'l2_u11_t1',
            type: 'multiple_choice',
            prompt: 'Aziz just ate three burgers. He ___ hungry now!',
            options: ['can\'t be', 'must be', 'should be', 'might be'],
            correctAnswer: "can\'t be",

            explanationEn: 'It is impossible for him to be hungry after 3 burgers: use "can\'t be".',

            explanationUz: "Uchta burger yeb och boʻlishi mutlaqo imkonsiz: can\'t be.",

            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l2_u11_tq1',
            topicId: 'l2_u11_t1',
            type: 'multiple_choice',
            prompt: "Where are my keys? — I\'m not sure. They ___ in your jacket pocket.",

            options: ['might be', 'must be', 'can\'t be', 'will be'],
            correctAnswer: 'might be',
            explanationEn: 'You are not sure (50% possibility), so use "might be".',
            explanationUz: 'Ishonchsizlik va 50% ehtimollik boʻlsa: might be.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },
  // UNIT 12: Level 2 Comprehensive Final Exam
  {
    id: 'l2_u12',
    unitNumber: 12,
    levelId: 'level_2',
    title: 'Unit 12: Level 2 Mastery Exam',
    titleUz: '12-Boʻlim: 2-Daraja Yakuniy Sertifikat Imtihoni',
    description: 'Comprehensive 15-question exam covering Past Continuous, Present Perfect, Conditionals, Modals, and Passive Voice.',
    topics: [
      {
        id: 'l2_u12_t1',
        unitId: 'l2_u12',
        levelId: 'level_2',
        title: 'Level 2 Final Certification Exam',
        titleUz: '2-Daraja Yakuniy Imtihon',
        slug: 'level-2-final-exam',
        description: 'Test all Level 2 grammar competencies. Score 80%+ to unlock Level 2 Certification and advance to Level 3!',
        difficulty: 'hard',
        estimatedMinutes: 15,
        prerequisites: ['l2_u1_t1', 'l2_u2_t1', 'l2_u7_t1', 'l2_u9_t1'],
        lesson: {
          id: 'les_l2_u12_t1',
          topicId: 'l2_u12_t1',
          whatIsItEn: 'Comprehensive certification exam testing Level 2 intermediate grammar concepts.',
          whatIsItUz: '2-Darajaning barcha oraliq grammatik qoidalarini tekshiruvchi yakuniy sertifikat imtihoni.',
          positiveStructure: { rule: '', example: '', exampleUz: '' },
          negativeStructure: { rule: '', example: '', exampleUz: '' },
          questionStructure: { rule: '', example: '', exampleUz: '' },
          examples: [],
          signalWords: [],
          commonMistakes: [],
          studyTips: [
            'Pay close attention to time prepositions, finished vs unfinished time, and passive voice.',
          ],
        },
        guidedQuestions: [],
        practiceQuestions: [],
        testQuestions: [
          {
            id: 'exam_l2_1',
            topicId: 'l2_u12_t1',
            type: 'multiple_choice',
            prompt: 'I was reading a book when the lights suddenly ___ out.',
            options: ['went', 'was going', 'have gone', 'goes'],
            correctAnswer: 'went',
            explanationEn: 'Short interrupting action in the past takes Past Simple "went".',
            explanationUz: 'Toʻsatdan kesuvchi harakat: went.',
            difficulty: 'medium',
          },
          {
            id: 'exam_l2_2',
            topicId: 'l2_u12_t1',
            type: 'multiple_choice',
            prompt: 'Have you seen the new museum exhibit ___?',
            options: ['yet', 'already', 'never', 'since'],
            correctAnswer: 'yet',
            explanationEn: 'Question at the end uses "yet".',
            explanationUz: 'Savol oxirida "yet" (hali/hech) qoʻyiladi.',
            difficulty: 'easy',
          },
          {
            id: 'exam_l2_3',
            topicId: 'l2_u12_t1',
            type: 'multiple_choice',
            prompt: 'If you ___ your vocabulary daily, you will learn 300 words a month.',
            options: ['practice', 'will practice', 'practiced', 'are practicing'],
            correctAnswer: 'practice',
            explanationEn: 'No "will" in the IF-clause of First Conditional: use "practice".',
            explanationUz: 'If qismida "will" boʻlmaydi -> practice.',
            difficulty: 'medium',
          },
          {
            id: 'exam_l2_4',
            topicId: 'l2_u12_t1',
            type: 'multiple_choice',
            prompt: 'Hamlet ___ by William Shakespeare.',
            options: ['was written', 'is wrote', 'was wrote', 'wrote'],
            correctAnswer: 'was written',
            explanationEn: 'Past passive: was + written (V3).',
            explanationUz: 'Oʻtgan zamon majhul nisbati: was written.',
            difficulty: 'medium',
          },
          {
            id: 'exam_l2_5',
            topicId: 'l2_u12_t1',
            type: 'multiple_choice',
            prompt: "There isn\'t ___ milk left in the fridge.",

            options: ['much', 'many', 'few', 'a few'],
            correctAnswer: 'much',
            explanationEn: '"milk" is uncountable, so in negatives use "much".',
            explanationUz: '"milk" sanalmaydigan ot, inkor gapda "much" ishlatiladi.',
            difficulty: 'easy',
          },
        ],
        flashcards: [],
      },
    ],
  },
];
