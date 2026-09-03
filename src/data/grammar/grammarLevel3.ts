import { GrammarUnitDefinition } from '../../types';

export const GRAMMAR_LEVEL_3_UNITS: GrammarUnitDefinition[] = [
  // UNIT 1: Advanced Perfect & Continuous Tenses
  {
    id: 'l3_u1',
    unitNumber: 1,
    levelId: 'level_3',
    title: 'Unit 1: Advanced Perfect & Continuous Tenses',
    titleUz: '1-Boʻlim: Mukammal va Davomli Murakkab Zamonlar',
    description: 'Master Present Perfect Continuous, Past Perfect (had + V3), and Past Perfect Continuous.',
    topics: [
      {
        id: 'l3_u1_t1',
        unitId: 'l3_u1',
        levelId: 'level_3',
        title: 'Present Perfect Continuous (have/has been + V-ing)',
        titleUz: 'Present Perfect Continuous (Davom Etib Kelayotgan Harakat)',
        slug: 'present-perfect-continuous',
        description: 'Focus on ongoing duration (for/since) and recent activity with visible present evidence.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l2_u2_t1'],
        lesson: {
          id: 'les_l3_u1_t1',
          topicId: 'l3_u1_t1',
          whatIsItEn: 'Use Present Perfect Continuous to emphasize the DURATION of an activity that began in the past and is still continuing now, or has just stopped with visible present results (e.g. "I\'m exhausted because I have been running").',

          whatIsItUz: 'Oʻtmishda boshlanib, hozirgacha DAVOM ETIB KELAYOTGAN harakatning davomiyligini taʼkidlash uchun (for/since bilan), yoki hozirgina toʻxtagan va asorati koʻrinib turgan harakatlar uchun.',
          formula: 'Subject + have/has been + Verb-ing',
          positiveStructure: {
            rule: 'I have been studying English for three years. | She has been working all day.',
            example: 'He has been coding for six hours without a break.',
            exampleUz: 'U tanaffussiz olti soatdan beri kod yozib kelmoqda.',
          },
          negativeStructure: {
            rule: "haven\'t / hasn\'t been + Verb-ing",

            example: "I haven\'t been sleeping well lately.",

            exampleUz: 'Oxirgi paytlarda yaxshi uxlay olmayapman.',
          },
          questionStructure: {
            rule: 'How long have you been + Verb-ing?',
            example: 'How long have you been learning English grammar?',
            exampleUz: 'Qancha vaqtdan beri ingliz tili grammatikasini oʻrganib kelyapsiz?',
          },
          examples: [
            { en: 'The ground is completely wet because it has been raining.', uz: 'Yer jiqqa hoʻl, chunki yomgʻir yogʻib turgan edi (natija koʻrinib turibdi).', highlight: 'has been raining' },
            { en: 'I have been waiting for you since 2 o\'clock!', uz: 'Men sizni soat ikkidan beri kutyapman!', highlight: 'have been waiting' },
          ],
          signalWords: ['for', 'since', 'how long', 'all day', 'lately', 'recently'],
          commonMistakes: [
            {
              incorrect: 'I am knowing him for 5 years.',
              correct: 'I have known him for 5 years.',
              explanationUz: 'Stative (holat) feʼllari (know, believe, like) continuous shaklni olmaydi! Present Perfect Simple (have known) ishlatiladi.',
            },
          ],
          studyTips: [
            'Present Perfect Simple = "How many / how much" (completed result). Present Perfect Continuous = "How long" (duration).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l3_u1_1',
            topicId: 'l3_u1_t1',
            type: 'multiple_choice',
            prompt: 'Complete with Present Perfect Continuous for duration:',
            sentenceWithBlank: 'She is exhausted because she ___ tennis for three hours.',
            options: ['has been playing', 'is playing', 'has played', 'plays'],
            correctAnswer: 'has been playing',
            explanationEn: 'Emphasizing the 3-hour ongoing duration resulting in exhaustion: "has been playing".',
            explanationUz: 'Uch soatlik davomiy harakat va uning hozirgi charchoq natijasi: has been playing.',
            difficulty: 'medium',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l3_u1_1',
            topicId: 'l3_u1_t1',
            type: 'sentence_builder',
            prompt: 'Assemble the question correctly:',
            scrambledWords: ['How', 'long', 'have', 'you', 'been', 'studying', 'here?'],
            correctAnswer: 'How long have you been studying here?',
            explanationEn: 'Question structure: How long + have + you + been + studying + here?',
            explanationUz: 'Soʻroq tartibi: How long have you been studying here?',
            difficulty: 'medium',
          },
        ],
        testQuestions: [
          {
            id: 't_l3_u1_1',
            topicId: 'l3_u1_t1',
            type: 'multiple_choice',
            prompt: 'I ___ for your email all morning! Where have you been?',
            options: ['have been waiting', 'am waiting', 'wait', 'had waited'],
            correctAnswer: 'have been waiting',
            explanationEn: '"all morning" highlights duration leading up to the present: "have been waiting".',
            explanationUz: '"all morning" tongdan beri davom etganini bildiradi -> have been waiting.',
            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l3_u1_1',
            front: 'Present Perfect Simple vs Continuous',
            back: 'Simple: Focus on COMPLETED RESULT / QUANTITY (I have written 3 essays)\nContinuous: Focus on DURATION / ACTIVITY (I have been writing essays all morning)',
            formula: 'have/has been + V-ing',
            example: 'How long have you been waiting?',
            uzbekNote: 'Simple = natija/miqdor (3 ta yozdim); Continuous = jarayon/davomiylik (ertalabdan beri yozyapman).',
          },
        ],
      },
      {
        id: 'l3_u1_t2',
        unitId: 'l3_u1',
        levelId: 'level_3',
        title: 'Past Perfect (had + V3): The Past Before the Past',
        titleUz: 'Past Perfect (Oʻtmishdan Oldingi Oʻtmish)',
        slug: 'past-perfect-had-v3',
        description: 'Clarify which event happened earlier when discussing two past actions.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l1_u9_t1', 'l2_u2_t1'],
        lesson: {
          id: 'les_l3_u1_t2',
          topicId: 'l3_u1_t2',
          whatIsItEn: 'Use the Past Perfect (had + V3) to make clear that one action in the past happened BEFORE another past action.',
          whatIsItUz: 'Oʻtmishda sodir boʻlgan ikki harakatdan qaysi biri OLDINROQ yuz berganini aniq koʻrsatish uchun (oʻtmishdan oldingi oʻtmish).',
          formula: 'Subject + had + Past Participle (V3)',
          positiveStructure: {
            rule: 'When I arrived at the station, the train had already left.',
            example: 'By the time the teacher entered, the students had finished the test.',
            exampleUz: 'Oʻqituvchi kirib kelguncha, oʻquvchilar testni tugatib boʻlishgan edi.',
          },
          negativeStructure: {
            rule: "hadn\'t + V3",

            example: "I hadn\'t seen such a breathtaking view before that trip.",

            exampleUz: 'Oʻsha sayohatga qadar bunday hayratlanarli manzarani koʻrmagan edim.',
          },
          questionStructure: {
            rule: 'Had + Subject + V3 before ... ?',
            example: 'Had you studied English before you moved to London?',
            exampleUz: 'Londonga koʻchishingizdan oldin ingliz tili oʻrganganmidingiz?',
          },
          examples: [
            { en: 'He couldn\'t unlock the door because he had lost his keys.', uz: 'U eshikni ocha olmadi, chunki kalitlarini yoʻqotib qoʻygan edi (oldin yoʻqotgan).', highlight: 'had lost' },
          ],
          signalWords: ['by the time', 'before', 'already', 'after', 'until that day'],
          commonMistakes: [
            {
              incorrect: 'When I arrived, the film already started.',
              correct: 'When I arrived, the film had already started.',
              explanationUz: 'Kino mening kelishimdan oldin boshlanib boʻlgan, shuning uchun "had already started" boʻladi.',
            },
          ],
          studyTips: [
            'Timeline trick: Earlier past action = HAD + V3. Later past action = Past Simple (V2).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l3_u1_2',
            topicId: 'l3_u1_t2',
            type: 'multiple_choice',
            prompt: 'Identify the earlier past action:',
            sentenceWithBlank: 'By the time we reached the cinema, the movie ___ already ___.',
            options: ['had / started', 'has / started', 'was / starting', 'did / start'],
            correctAnswer: 'had / started',
            explanationEn: 'The movie started before we reached the cinema: "had already started".',
            explanationUz: 'Kino biz yetib borishimizdan oldin boshlangan: had already started.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l3_u1_2',
            topicId: 'l3_u1_t2',
            type: 'error_correction',
            prompt: 'Fix the timeline error:',
            wrongSentence: 'She was sad because she failed the exam.',
            errorWord: 'failed',
            correction: 'had failed',
            correctAnswer: 'She was sad because she had failed the exam.',
            explanationEn: 'Failing the exam occurred before she was sad: "had failed".',
            explanationUz: 'Imtihondan yiqilish xafa boʻlishdan oldin sodir boʻlgan: had failed.',
            difficulty: 'medium',
          },
        ],
        testQuestions: [
          {
            id: 't_l3_u1_2',
            topicId: 'l3_u1_t2',
            type: 'multiple_choice',
            prompt: "I didn\'t recognize Bobur because he ___ his hair.",

            options: ['had dyed', 'has dyed', 'dyes', 'was dyeing'],
            correctAnswer: 'had dyed',
            explanationEn: 'The hair dyeing happened before the moment of meeting: "had dyed".',
            explanationUz: 'Sochini boʻyash uchrashuvdan oldin roʻy bergan: had dyed.',
            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l3_u1_2',
            front: 'Past Perfect Timeline Formula',
            back: 'Action 1 (Earlier in past) = HAD + V3\nAction 2 (Later in past) = Past Simple (V2)',
            formula: 'By the time + V2, Subject + had + V3',
            example: 'When I got home, they had already eaten dinner.',
            uzbekNote: 'Eng birinchi boʻlgani had + V3, undan keyingisi V2 boʻladi.',
          },
        ],
      },
    ],
  },

  // UNIT 2: Future Nuances (Future Continuous & Future Perfect)
  {
    id: 'l3_u2',
    unitNumber: 2,
    levelId: 'level_3',
    title: 'Unit 2: Future Continuous & Future Perfect',
    titleUz: '2-Boʻlim: Future Continuous va Future Perfect Zamonlari',
    description: 'Predict actions in progress at a future moment (will be doing) and actions completed before a future deadline (will have done).',
    topics: [
      {
        id: 'l3_u2_t1',
        unitId: 'l3_u2',
        levelId: 'level_3',
        title: 'Future Continuous vs Future Perfect',
        titleUz: 'Kelasi Davomli va Kelasi Tugallangan Zamon',
        slug: 'future-continuous-and-future-perfect',
        description: 'By 2030, I will have graduated. This time tomorrow, I will be flying to London.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l1_u10_t1'],
        lesson: {
          id: 'les_l3_u2_t1',
          whatIsItEn: 'Use Future Continuous (will be + V-ing) for an action that will be in progress at a specific time in the future. Use Future Perfect (will have + V3) for an action that will be finished BEFORE a deadline.',
          whatIsItUz: 'Future Continuous: kelajakdagi aniq bir paytda davom etayotgan harakat (will be + V-ing). Future Perfect: kelajakdagi muddatgacha tugallanib boʻladigan harakat (by 5 PM, by tomorrow -> will have + V3).',
          formula: 'FC: will be + V-ing | FP: will have + V3',
          positiveStructure: {
            rule: "By next year, I will have finished my bachelor\'s degree.",

            example: 'This time next week, we will be relaxing on the beach.',
            exampleUz: 'Keyingi hafta ayni shu paytda biz sohilda dam olayotgan boʻlamiz.',
          },
          negativeStructure: {
            rule: "won\'t have + V3 by then",
            example: "They won\'t have completed the bridge by December.",

            exampleUz: 'Dekabrgacha koʻprikni qurib bitkaza olishmaydi.',
          },
          questionStructure: {
            rule: 'Will you have saved enough money by next summer?',
            example: 'What will you be doing at 3 PM tomorrow?',
            exampleUz: 'Ertaga soat 15:00 da nima qilayotgan boʻlasiz?',
          },
          examples: [
            { en: 'By 2030, scientists will have found new clean energy sources.', uz: '2030-yilgacha olimlar yangi toza energiya manbalarini kashf etib boʻlishadi.', highlight: 'will have found' },
          ],
          signalWords: ['by then', 'by next year', 'by 5 o\'clock', 'this time tomorrow', 'in five years\' time'],
          commonMistakes: [
            { incorrect: 'By tomorrow I will finish the report.', correct: 'By tomorrow I will have finished the report.', explanationUz: '"By + kelasi vaqt" boʻlsa, harakat oʻsha paytgacha tugashini bildirish uchun Future Perfect (will have finished) qoʻyiladi.' }
          ],
          studyTips: ['Whenever you see "BY + future time" (by next month, by 6 PM), choose FUTURE PERFECT!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u2_q1',
            topicId: 'l3_u2_t1',
            type: 'multiple_choice',
            prompt: "Don\'t call me at 9 PM tonight; I ___ my favorite football match.",
            options: ['will be watching', 'will have watched', 'watch', 'am watched'],
            correctAnswer: 'will be watching',
            explanationEn: 'Action will be in progress at 9 PM: Future Continuous "will be watching".',
            explanationUz: 'Soat 21:00 da harakat ayni davom etayotgan boʻladi: will be watching.',
            difficulty: 'medium'
          },
          {
            id: 'l3_u2_q2',
            topicId: 'l3_u2_t1',
            type: 'multiple_choice',
            prompt: 'By the time you return from vacation, we ___ the entire project.',
            options: ['will have completed', 'will be completing', 'completed', 'are completed'],
            correctAnswer: 'will have completed',
            explanationEn: 'Action will be finished before a future point: Future Perfect "will have completed".',
            explanationUz: '"By the time..." kelasi muddatgacha tugallanadigan ish: will have completed.',
            difficulty: 'hard'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u2_tq1',
            topicId: 'l3_u2_t1',
            type: 'multiple_choice',
            prompt: "In two years\' time, she ___ English for a whole decade.",

            options: ['will have been teaching', 'will teach', 'is teaching', 'taught'],
            correctAnswer: 'will have been teaching',
            explanationEn: 'Continuous duration up to a future point: Future Perfect Continuous "will have been teaching".',
            explanationUz: 'Kelajakdagi davomiylik: will have been teaching.',
            difficulty: 'challenge'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 4: Negative Inversion for Formal Emphasis
  {
    id: 'l3_u4',
    unitNumber: 4,
    levelId: 'level_3',
    title: 'Unit 4: Inversion for Formal Emphasis',
    titleUz: '4-Boʻlim: Rasmiy Urgʻu Uchun Inversiya (Teskari Tartib)',
    description: 'Master elegant C1 structures starting with Never, Rarely, Seldom, Hardly, and Not only.',
    topics: [
      {
        id: 'l3_u4_t1',
        unitId: 'l3_u4',
        levelId: 'level_3',
        title: 'Negative Adverb Inversion',
        titleUz: 'Inkor Ravishlar Bilan Inversiya',
        slug: 'negative-inversion-c1',
        description: 'Hardly had I..., Never have I seen..., Seldom does one see...',
        difficulty: 'challenge',
        estimatedMinutes: 12,
        prerequisites: ['l3_u1_t1'],
        lesson: {
          id: 'les_l3_u4_t1',
          whatIsItEn: 'When a negative or restrictive adverbial is placed at the front of a sentence for dramatic or formal emphasis, the subject and auxiliary verb invert (just like in a question).',
          whatIsItUz: 'Rasmiy yoki badiiy nutqda inkor soʻzlar (Never, Rarely, Seldom, Hardly) gap boshiga chiqqanda, yordamchi feʼl egadan oldinga oʻtadi.',
          formula: 'Negative Word + Auxiliary Verb + Subject + Main Verb',
          positiveStructure: {
            rule: 'Never have I seen such a masterpiece.',
            example: 'Rarely do we encounter such dedication.',
            exampleUz: 'Kamdan-kam hollarda bunday fidoyilikka guvoh boʻlamiz.',
          },
          negativeStructure: {
            rule: 'Not only did he win, but he also broke the record.',
            example: 'Under no circumstances should you open this door.',
            exampleUz: 'Hech qanday holatda bu eshikni ochmasligingiz kerak.',
          },
          questionStructure: {
            rule: 'Hardly had she sat down when the bell rang.',
            example: 'No sooner had they arrived than the storm began.',
            exampleUz: 'Ular yetib kelishi bilanoq boʻron boshlandi.',
          },
          examples: [
            { en: 'Seldom has a player shown such incredible skill.', uz: 'Kamdan-kam oʻyinchi bunday yuksak mahorat koʻrsatgan.', highlight: 'Seldom has a player shown' }
          ],
          signalWords: ['Never', 'Rarely', 'Seldom', 'Hardly... when', 'No sooner... than', 'Under no circumstances'],
          commonMistakes: [
            { incorrect: 'Never I have seen this.', correct: 'Never have I seen this.', explanationUz: 'Inversiyada yordamchi feʼl "have" egadan oldinga chiqishi shart.' }
          ],
          studyTips: ['Treat the word order exactly like a question after the negative phrase!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u4_q1',
            topicId: 'l3_u4_t1',
            type: 'multiple_choice',
            prompt: 'Rarely ___ such an inspiring speech in my entire career.',
            options: ['have I heard', 'I have heard', 'did I heard', 'I heard'],
            correctAnswer: 'have I heard',
            explanationEn: 'Inversion requires auxiliary "have" before the subject "I".',
            explanationUz: 'Inversiya qoidasiga koʻra yordamchi feʼl "have" egadan oldinda keladi: have I heard.',
            difficulty: 'challenge'
          },
          {
            id: 'l3_u4_q2',
            topicId: 'l3_u4_t1',
            type: 'multiple_choice',
            prompt: 'Not only ___ fluent in English, but she also speaks German and Arabic.',
            options: ['is she', 'she is', 'does she', 'she does'],
            correctAnswer: 'is she',
            explanationEn: 'After "Not only", inverted word order is used: "is she".',
            explanationUz: '"Not only" dan keyin teskari tartib: is she.',
            difficulty: 'hard'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u4_tq1',
            topicId: 'l3_u4_t1',
            type: 'multiple_choice',
            prompt: 'No sooner had we reached the summit ___ it began to hail heavily.',
            options: ['than', 'when', 'then', 'as'],
            correctAnswer: 'than',
            explanationEn: '"No sooner" is paired specifically with "than".',
            explanationUz: '"No sooner" har doim "than" bilan juftlashadi.',
            difficulty: 'hard'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 5: Causatives (Have & Get Something Done)
  {
    id: 'l3_u5',
    unitNumber: 5,
    levelId: 'level_3',
    title: 'Unit 5: Causatives (Have & Get Something Done)',
    titleUz: '5-Boʻlim: Sabab Nisbati (Xizmatlardan Foydalanish)',
    description: 'Learn how to describe having a service done by someone else.',
    topics: [
      {
        id: 'l3_u5_t1',
        unitId: 'l3_u5',
        levelId: 'level_3',
        title: 'Passive Causatives (Have/Get + Object + V3)',
        titleUz: 'Majhul Sabab Nisbati (Birovga Qildirmoq)',
        slug: 'causatives-mastery',
        description: 'Have your hair cut, get your car serviced, have a house built.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l2_u9_t1'],
        lesson: {
          id: 'les_l3_u5_t1',
          whatIsItEn: 'Use "have/get + object + V3" when you arrange for someone else (often a professional) to do a job for you.',
          whatIsItUz: 'Biror ishni oʻzingiz emas, boshqa birov (mutaxassis) orqali bajartirganda "have/get something done" strukturasi ishlatiladi.',
          formula: 'Subject + have/get (in any tense) + Object + V3 (Past Participle)',
          positiveStructure: {
            rule: 'I had my car repaired yesterday.',
            example: 'She is having her wedding dress designed by a master tailor.',
            exampleUz: 'U toʻy koʻylagini usta tikuvchiga tiktiryapti.',
          },
          negativeStructure: {
            rule: "We haven\'t had our roof fixed yet.",
            example: "He didn\'t get his tooth pulled out.",

            exampleUz: 'U tishini oldirtirmadi.',
          },
          questionStructure: {
            rule: 'Where do you have your suits dry-cleaned?',
            example: 'Did you have your hair cut yesterday?',
            exampleUz: 'Kecha sochingizni kestirdingizmi?',
          },
          examples: [
            { en: 'I must get my passport renewed before the trip.', uz: 'Safar oldidan pasportimni yangilatishim shart.', highlight: 'get my passport renewed' }
          ],
          signalWords: ['have something done', 'get something done', 'repaired', 'checked'],
          commonMistakes: [
            { incorrect: 'I cut my hair yesterday at the salon.', correct: 'I had my hair cut yesterday at the salon.', explanationUz: 'Sartarosh kesgan boʻlsa, "had my hair cut" deyiladi; "I cut my hair" oʻzingiz qaychi bilan kesganingizni bildiradi.' }
          ],
          studyTips: ['Remember the formula: HAVE + THING + V3.']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u5_q1',
            topicId: 'l3_u5_t1',
            type: 'multiple_choice',
            prompt: "Ali didn\'t repair the air conditioner himself. He had it ___ by an engineer.",
            options: ['repaired', 'repair', 'repairing', 'to repair'],
            correctAnswer: 'repaired',
            explanationEn: 'Causative structure: have + object (it) + V3 (repaired).',
            explanationUz: 'Sabab nisbati: had it + V3 (repaired).',
            difficulty: 'medium'
          },
          {
            id: 'l3_u5_q2',
            topicId: 'l3_u5_t1',
            type: 'multiple_choice',
            prompt: 'How often do you ___ your eyes tested by the doctor?',
            options: ['have', 'do', 'make', 'let'],
            correctAnswer: 'have',
            explanationEn: 'Causative for medical/professional services: "have your eyes tested".',
            explanationUz: 'Shifokorga koʻrikdan oʻtkazish: have your eyes tested.',
            difficulty: 'easy'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u5_tq1',
            topicId: 'l3_u5_t1',
            type: 'multiple_choice',
            prompt: 'We are planning to have our whole apartment ___ next spring.',
            options: ['renovated', 'renovate', 'renovating', 'renovates'],
            correctAnswer: 'renovated',
            explanationEn: 'have + object + V3: have our apartment renovated.',
            explanationUz: 'Kvartirani taʼmirlatmoq: have our apartment renovated.',
            difficulty: 'medium'
          }
        ],
        flashcards: []
      }
    ]
  },
  // UNIT 3: Advanced Conditionals (Second, Third, Mixed)
  {
    id: 'l3_u3',
    unitNumber: 3,
    levelId: 'level_3',
    title: 'Unit 3: Advanced Conditionals & Unreal Situations',
    titleUz: '3-Boʻlim: 2 va 3-Shart Mayllari hamda Aralash Shartlar',
    description: 'Hypothetical present (Second Conditional), impossible past regrets (Third Conditional), and Mixed Conditionals.',
    topics: [
      {
        id: 'l3_u3_t1',
        unitId: 'l3_u3',
        levelId: 'level_3',
        title: 'Second & Third Conditionals: Imaginary & Past Regrets',
        titleUz: '2 va 3-Shart Ergash Gaplar: Xayoliy Holatlar va Afsuslar',
        slug: 'second-third-conditionals-mastery',
        description: 'Express unreal present wishes (Second Conditional) and past hypothetical regrets (Third Conditional).',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l2_u7_t1', 'l3_u1_t2'],
        lesson: {
          id: 'les_l3_u3_t1',
          topicId: 'l3_u3_t1',
          whatIsItEn: 'Second Conditional is for imaginary/unreal present or future situations (If I had a million dollars, I would buy a spaceship). Third Conditional is for impossible past regrets (If I had studied harder, I would have passed the exam).',
          whatIsItUz: 'Second Conditional: Hozirgi zamondagi xayoliy, noreal holatlar (If + Past Simple, would + base verb). Third Conditional: Oʻtmishda oʻzgarmas boʻlib oʻtib ketgan afsuslar (If + had + V3, would have + V3).',
          formula: '2nd: If + V2, would + V(base) | 3rd: If + had + V3, would have + V3',
          positiveStructure: {
            rule: "2nd: If I were you, I would take the job. | 3rd: If we had taken a taxi, we wouldn\'t have missed the flight.",

            example: 'If I knew her number, I would call her right now.',
            exampleUz: 'Agar uning raqamini bilganimda edi, hozir qoʻngʻiroq qilgan boʻlardim (lekin bilmayman).',
          },
          negativeStructure: {
            rule: "wouldn\'t + V(base) / wouldn\'t have + V3",

            example: "If he hadn\'t overslept, he wouldn\'t have missed the meeting.",

            exampleUz: 'Agar u uxlab qolmaganida edi, uchrashuvga kechikmagan boʻlardi.',
          },
          questionStructure: {
            rule: 'What would you do if ... ?  |  What would you have done if ... ?',
            example: 'Where would you live if you could choose any country?',
            exampleUz: 'Xohlagan mamlakatingizni tanlay olganingizda, qayerda yashagan boʻlardingiz?',
          },
          examples: [
            { en: 'If I were you, I would focus on English vocabulary.', uz: 'Sizning oʻrningizda boʻlganimda, ingliz tili lugʻatiga eʼtibor qaratgan boʻlardim.', highlight: 'If I were you ... would focus' },
            { en: 'If they had invited us, we would have attended the wedding.', uz: 'Agar ular bizni taklif qilishganida edi, toʻyga borgan boʻlardik (afsuski, taklif qilishmadi).', highlight: 'had invited ... would have attended' },
          ],
          signalWords: ['if', 'would', 'would have', 'If I were you', 'supposing'],
          commonMistakes: [
            {
              incorrect: 'If I would have known, I would tell you.',
              correct: 'If I had known, I would have told you.',
              explanationUz: 'Shart (IF) qismida "would have" ishlatilmaydi! If qismida "had + V3" boʻladi.',
            },
            {
              incorrect: 'If I was you...',
              correct: 'If I were you...',
              explanationUz: 'Noreal shart gaplarda rasmiy qoidaga koʻra barcha shaxslar uchun "were" ishlatiladi.',
            },
          ],
          studyTips: [
            '2nd conditional = UNREAL NOW (If I were rich...). 3rd conditional = TOO LATE, PAST REGRET (If I had known...).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l3_u3_1',
            topicId: 'l3_u3_t1',
            type: 'multiple_choice',
            prompt: 'Complete the Second Conditional imaginary sentence:',
            sentenceWithBlank: 'If I ___ a bird, I would fly across the oceans.',
            options: ['were', 'am', 'will be', 'had been'],
            correctAnswer: 'were',
            explanationEn: 'In Second Conditional unreal hypothetical statements, use "were" for all persons.',
            explanationUz: 'Noreal xayoliy shartda barcha shaxslar uchun "were" ishlatiladi.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l3_u3_1',
            topicId: 'l3_u3_t1',
            type: 'multiple_choice',
            prompt: 'Third Conditional (Past regret):',
            sentenceWithBlank: 'If we had left ten minutes earlier, we ___ the traffic jam.',
            options: ['would have avoided', 'would avoid', 'will avoid', 'avoided'],
            correctAnswer: 'would have avoided',
            explanationEn: 'Third conditional result clause: "would have + V3".',
            explanationUz: '3-shart maylining natija qismi: would have + V3.',
            difficulty: 'hard',
          },
        ],
        testQuestions: [
          {
            id: 't_l3_u3_1',
            topicId: 'l3_u3_t1',
            type: 'error_correction',
            prompt: 'Correct the conditional clause error:',
            wrongSentence: 'If you would have told me earlier, I could have helped you.',
            errorWord: 'would have told',
            correction: 'had told',
            correctAnswer: 'If you had told me earlier, I could have helped you.',
            explanationEn: 'Never put "would have" in the IF-clause: use "had told".',
            explanationUz: 'If qismida "would have" boʻlmaydi, had + V3 boʻladi.',
            difficulty: 'hard',
          },
        ],
        flashcards: [
          {
            id: 'f_l3_u3_1',
            front: '2nd vs 3rd Conditional',
            back: '2nd (Unreal Now): If + V2, would + V(base)\n3rd (Past Regret): If + had + V3, would have + V3',
            formula: '2nd: If + V2, would + V  |  3rd: If + had + V3, would have + V3',
            example: 'If I had won, I would have bought a house.',
            uzbekNote: '2-shart hozirgi orzu; 3-shart oʻtgan zamondagi afsus.',
          },
        ],
      },
    ],
  },

  // UNIT 6: Modals of Deduction & Past Modals
  {
    id: 'l3_u6',
    unitNumber: 6,
    levelId: 'level_3',
    title: 'Unit 6: Modals of Deduction & Past Modals',
    titleUz: "6-Boʻlim: Taxmin Modal Feʼllari (Must have, Can\'t have, Should have)",

    description: "Deduce past events with must have, can\'t have, might have, and express past advice with should have.",

    topics: [
      {
        id: 'l3_u6_t1',
        unitId: 'l3_u6',
        levelId: 'level_3',
        title: "Past Modals of Deduction: Must have / Can\'t have / Might have",

        titleUz: "Oʻtgan Zamon Taxminlari: Must have / Can\'t have / Might have",

        slug: 'past-modals-of-deduction',
        description: 'Draw logical conclusions about past events based on strong present evidence.',
        difficulty: 'hard',
        estimatedMinutes: 10,
        prerequisites: ['l1_u11_t1', 'l3_u1_t2'],
        lesson: {
          id: 'les_l3_u6_t1',
          topicId: 'l3_u6_t1',
          whatIsItEn: "Use MUST HAVE + V3 when you are 95%+ sure something happened in the past. Use CAN\'T HAVE + V3 when you are 95%+ sure something was impossible. Use MIGHT/COULD HAVE + V3 for possibilities.",

          whatIsItUz: "Oʻtmishdagi voqeani 95% ishonch bilan taxmin qilganda: Must have + V3 (aniq boʻlgan). Boʻlishi mutlaqo imkonsiz deb hisoblaganda: Can\'t have + V3. Ehtimol boʻlgandir deganda: Might have + V3.",

          formula: "Subject + must / can\'t / might + have + Past Participle (V3)",

          positiveStructure: {
            rule: 'His lights are off and his car is gone. He must have left already.',
            example: 'She got band 9 in IELTS! She must have studied extremely hard.',
            exampleUz: 'U IELTS dan 9 ball oldi! U juda qattiq oʻqigan boʻlishi aniq.',
          },
          negativeStructure: {
            rule: 'can\'t have + V3 (impossible!) | NOT "mustn\'t have"',

            example: "He can\'t have stolen the money; he was with me all evening.",

            exampleUz: 'U pulni oʻgʻirlagan boʻlishi mumkin emas, u butun oqshom men bilan edi.',
          },
          questionStructure: {
            rule: 'Could he have forgotten about our meeting?',
            example: 'Where could she have put the car keys?',
            exampleUz: 'U mashina kalitlarini qayerga qoʻygan boʻlishi mumkin?',
          },
          examples: [
            { en: 'You should have told me the truth earlier. (Criticism)', uz: 'Menga haqiqatni oldinroq aytishingiz kerak edi (afsuski aytmadingiz).', highlight: 'should have told' },
          ],
          signalWords: ['must have', 'can\'t have', 'might have', 'could have', 'should have'],
          commonMistakes: [
            {
              incorrect: "He mustn\'t have done it! (meaning impossible)",

              correct: "He can\'t have done it!",

              explanationUz: 'Oʻtmishda "boʻlishi imkonsiz" deyish uchun "mustn\'t have" emas, "CAN\'T HAVE + V3" ishlatiladi.',

            },
          ],
          studyTips: [
            'Opposite of "must have done" (99% sure YES) is "can\'t have done" (99% sure NO).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l3_u6_1',
            topicId: 'l3_u6_t1',
            type: 'multiple_choice',
            prompt: 'Choose the logical past deduction:',
            sentenceWithBlank: 'The streets are completely soaked with water. It ___ heavily last night.',
            options: ['must have rained', 'can\'t have rained', 'should have rained', 'will have rained'],
            correctAnswer: 'must have rained',
            explanationEn: 'The soaked streets are clear evidence: it must have rained (certainty).',
            explanationUz: 'Koʻchalar jiqqa hoʻl, demak kechasi yomgʻir yoqqan boʻlishi aniq: must have rained.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l3_u6_1',
            topicId: 'l3_u6_t1',
            type: 'multiple_choice',
            prompt: 'Select the deduction for impossible past event:',
            sentenceWithBlank: 'Aziz was in London yesterday. You ___ seen him in Tashkent!',
            options: ['can\'t have', 'must have', 'should have', 'would have'],
            correctAnswer: "can\'t have",

            explanationEn: 'Since he was in London, seeing him in Tashkent was impossible: "can\'t have seen".',

            explanationUz: "U Londonda boʻlgani sababli, uni Toshkentda koʻrgan boʻlishingiz imkonsiz: can\'t have.",

            difficulty: 'hard',
          },
        ],
        testQuestions: [
          {
            id: 't_l3_u6_1',
            topicId: 'l3_u6_t1',
            type: 'multiple_choice',
            prompt: 'You have a high fever. You ___ gone swimming in that freezing river yesterday.',
            options: ['shouldn\'t have', 'must have', 'can\'t have', 'might have'],
            correctAnswer: "shouldn\'t have",

            explanationEn: 'Expressing past regret/criticism: "You shouldn\'t have gone".',

            explanationUz: "Oʻtgan zamondagi xatodan afsuslanish/tanqid: shouldn\'t have gone.",

            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l3_u6_1',
            front: 'Past Modals of Deduction',
            back: "MUST HAVE + V3 = 95% sure it happened\nCAN\'T HAVE + V3 = 95% sure it was impossible\nSHOULD HAVE + V3 = It was a good idea, but you didn\'t do it",

            formula: 'Modal + have + V3',
            example: 'He must have left his phone at home.',
            uzbekNote: "Must have (aniq shunday boʻlgan), Can\'t have (boʻlishi imkonsiz), Should have (qilishingiz kerak edi).",

          },
        ],
      },
    ],
  },

  // UNIT 10: Inversion & Emphasis
  {
    id: 'l3_u10',
    unitNumber: 10,
    levelId: 'level_3',
    title: 'Unit 10: Inversion & Cleft Sentences',
    titleUz: '10-Boʻlim: Inversiya va Taʼkidlovchi Gaplar (Cleft Sentences)',
    description: 'Advanced dramatic emphasis using negative inversion (Never have I...) and cleft sentences (What I need is...).',
    topics: [
      {
        id: 'l3_u10_t1',
        unitId: 'l3_u10',
        levelId: 'level_3',
        title: 'Negative Inversion (Never / Rarely / Seldom)',
        titleUz: 'Salbiy Inversiya: Soʻz Tartibining Almashinuvi',
        slug: 'negative-inversion-emphasis',
        description: 'Fronting negative adverbs for formal, rhetorical, and dramatic emphasis.',
        difficulty: 'challenge',
        estimatedMinutes: 10,
        prerequisites: ['l1_u5_t1', 'l1_u9_t1', 'l2_u2_t1'],
        lesson: {
          id: 'les_l3_u10_t1',
          topicId: 'l3_u10_t1',
          whatIsItEn: 'When a negative or restrictive adverbial (Never, Rarely, Seldom, Scarcely, Under no circumstances) begins a sentence, the subject and auxiliary verb invert just like a question.',
          whatIsItUz: 'Gap inkor yoki cheklovchi soʻzlar (Never, Rarely, Seldom, Under no circumstances) bilan boshlanganda, gapda soʻroq gapdagidek inversiya roʻy beradi (yordamchi feʼl egadan oldinga oʻtadi).',
          formula: 'Negative Word + Auxiliary Verb + Subject + Main Verb',
          positiveStructure: {
            rule: 'Normal: I have never seen such courage. -> Inversion: Never have I seen such courage.',
            example: 'Rarely does one encounter such extraordinary talent.',
            exampleUz: 'Bunday favqulodda iqtidorni kamdan-kam uchratish mumkin.',
          },
          negativeStructure: {
            rule: 'Under no circumstances should you share your password.',
            example: 'Not only did he win the championship, but he also broke the national record.',
            exampleUz: 'U nafaqat chempionlikni qoʻlga kiritdi, balki milliy rekordni ham yangiladi.',
          },
          questionStructure: {
            rule: 'Seldom have we witnessed such a match.',
            example: 'Hardly had I arrived when the phone rang.',
            exampleUz: 'Yetib kelishim bilanoq telefon jiringladi.',
          },
          examples: [
            { en: 'Never in my life have I been so proud.', uz: 'Hayotimda hech qachon bunchalik faxrlanmagan edim.', highlight: 'Never ... have I been' },
          ],
          signalWords: ['Never', 'Rarely', 'Seldom', 'Hardly ... when', 'Scarcely ... when', 'Not only ... but also'],
          commonMistakes: [
            {
              incorrect: 'Never I have seen this before.',
              correct: 'Never have I seen this before.',
              explanationUz: 'Inversiyada yordamchi feʼl (have) albatta egadan (I) oldinga chiqishi shart!',
            },
          ],
          studyTips: [
            'Remember: Treat negative inversion just like a question structure right after the negative word: Never + DID I GO (not never I went).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l3_u10_1',
            topicId: 'l3_u10_t1',
            type: 'multiple_choice',
            prompt: 'Complete the inverted sentence:',
            sentenceWithBlank: 'Rarely ___ such dedication in a young learner.',
            options: ['have we seen', 'we have seen', 'we saw', 'did we saw'],
            correctAnswer: 'have we seen',
            explanationEn: 'After restrictive adverb "Rarely", invert auxiliary and subject: "have we seen".',
            explanationUz: '"Rarely"dan keyin inversiya: have we seen.',
            difficulty: 'hard',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l3_u10_1',
            topicId: 'l3_u10_t1',
            type: 'sentence_builder',
            prompt: 'Construct the inverted sentence:',
            scrambledWords: ['Never', 'have', 'I', 'heard', 'such', 'a', 'story'],
            correctAnswer: 'Never have I heard such a story',
            explanationEn: 'Negative Inversion: Never + have + I + heard + such a story.',
            explanationUz: 'Inversiya tartibi: Never have I heard such a story.',
            difficulty: 'hard',
          },
        ],
        testQuestions: [
          {
            id: 't_l3_u10_1',
            topicId: 'l3_u10_t1',
            type: 'multiple_choice',
            prompt: 'Not only ___ the exam, but he also achieved the highest score in the country.',
            options: ['did he pass', 'he passed', 'passed he', 'he did pass'],
            correctAnswer: 'did he pass',
            explanationEn: '"Not only" at the start requires question inversion: "did he pass".',
            explanationUz: '"Not only" gap boshida kelsa soʻroq inversiyasi boʻladi: did he pass.',
            difficulty: 'challenge',
          },
        ],
        flashcards: [
          {
            id: 'f_l3_u10_1',
            front: 'Negative Inversion Formula',
            back: 'Negative Word (Never / Rarely / Seldom / Hardly) + AUXILIARY + SUBJECT + Verb',
            formula: 'Never / Rarely + Aux + Subject + Verb',
            example: 'Never will I forget this day.',
            uzbekNote: 'Inkor soʻzdan keyin xuddi soʻroq gap kabi yordamchi feʼl oldinga chiqadi.',
          },
        ],
      },
    ],
  },

    // UNIT 7: Inverted & Advanced Conditionals (Had I known, Should you need)
  {
    id: 'l3_u7',
    unitNumber: 7,
    levelId: 'level_3',
    title: 'Unit 7: Inverted & Omitted IF Conditionals',
    titleUz: '7-Boʻlim: "IF"siz Inversiyali Shart Ergash Gaplar',
    description: 'Master advanced C1 structures: Had I known, Were you to ask, Should you need assistance.',
    topics: [
      {
        id: 'l3_u7_t1',
        unitId: 'l3_u7',
        levelId: 'level_3',
        title: 'Conditional Inversion (Should / Were / Had)',
        titleUz: 'Shart Gaplarda Inversiya (Should, Were, Had)',
        slug: 'conditional-inversion',
        description: 'Drop IF and invert the subject and auxiliary: Had he arrived earlier...',
        difficulty: 'challenge',
        estimatedMinutes: 12,
        prerequisites: ['l3_u3_t1'],
        lesson: {
          id: 'les_l3_u7_t1',
          whatIsItEn: 'In formal and academic writing, "if" can be omitted by inverting the subject with "should" (Type 1), "were" (Type 2), or "had" (Type 3).',
          whatIsItUz: 'Rasmiy va akademik ingliz tilida "if" tushirib qoldirilib, gap "Should", "Were" yoki "Had" bilan boshlanadi.',
          formula: 'Had + Subject + V3... | Were + Subject + to V1... | Should + Subject + V1...',
          positiveStructure: {
            rule: 'Had I known about the meeting, I would have attended.',
            example: "Had she arrived on time, we wouldn\'t have missed the flight.",

            exampleUz: 'U vaqtida yetib kelganida, parvozni oʻtkazib yubormagan boʻlar edik.',
          },
          negativeStructure: {
            rule: "Had + Subject + NOT + V3 (never contract to Hadn\'t I!)",
            example: 'Had they not intervened, the situation would have worsened.',
            exampleUz: 'Ular aralashmaganida, vaziyat yanada ogʻirlashgan boʻlardi.',
          },
          questionStructure: {
            rule: 'Should you have any inquiries, please contact our support team.',
            example: 'Should you require further information, do not hesitate to ask.',
            exampleUz: 'Qoʻshimcha maʼlumot kerak boʻlsa, soʻrashdan tortinmang.',
          },
          examples: [
            { en: 'Were it not for your support, I could never have succeeded.', uz: 'Sizning qoʻllab-quvvatlovingiz boʻlmaganida, hech qachon muvaffaqiyatga erisha olmasdim.', highlight: 'Were it not for' }
          ],
          signalWords: ['Had I...', 'Were you...', 'Should you...', 'Were it not for...'],
          commonMistakes: [
            { incorrect: 'Hadn\'t I seen it myself, I wouldn\'t believe it.', correct: 'Had I not seen it myself, I wouldn\'t believe it.', explanationUz: 'Inversiyada inkor qisqartirilmaydi: "Had I not seen" boʻladi, "Hadn\'t I" xato.' }
          ],
          studyTips: ['Had + V3 = If + had + V3. Should + V1 = If + present verb.']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u7_q1',
            topicId: 'l3_u7_t1',
            type: 'multiple_choice',
            prompt: '___ you require any further assistance, please inform the front desk.',
            options: ['Should', 'If should', 'Had', 'Were'],
            correctAnswer: 'Should',
            explanationEn: 'Formal Type 1 inversion uses "Should you require".',
            explanationUz: 'Rasmiy 1-tur shart gapda: Should you require.',
            difficulty: 'challenge'
          },
          {
            id: 'l3_u7_q2',
            topicId: 'l3_u7_t1',
            type: 'multiple_choice',
            prompt: 'Had the weather ___ better, we would have hiked up the mountain.',
            options: ['been', 'was', 'be', 'being'],
            correctAnswer: 'been',
            explanationEn: 'Inverted Type 3 conditional: Had + subject + V3 (been).',
            explanationUz: '3-tur shart inversiyasi: Had the weather been.',
            difficulty: 'hard'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u7_tq1',
            topicId: 'l3_u7_t1',
            type: 'multiple_choice',
            prompt: 'Were they ___ the contract now, they would save thousands of dollars.',
            options: ['to sign', 'signed', 'sign', 'signing'],
            correctAnswer: 'to sign',
            explanationEn: 'Inverted Type 2 conditional uses "Were + subject + to + V1".',
            explanationUz: '2-tur shart inversiyasi: Were they to sign.',
            difficulty: 'challenge'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 8: Participle Clauses (-ing and -ed Clauses)
  {
    id: 'l3_u8',
    unitNumber: 8,
    levelId: 'level_3',
    title: 'Unit 8: Participle Clauses (-ing and -ed Clauses)',
    titleUz: '8-Boʻlim: Sifatdoshli Qisqartma Birikmalar (-ing va -ed)',
    description: 'Compress clauses into sophisticated participle phrases: Having finished, Walking home, Built in 1920.',
    topics: [
      {
        id: 'l3_u8_t1',
        unitId: 'l3_u8',
        levelId: 'level_3',
        title: 'Present & Perfect Participle Clauses',
        titleUz: 'Hozirgi va Oʻtgan Sifatdosh Birikmalari',
        slug: 'participle-clauses',
        description: 'Having passed the exam, he celebrated. Surrounded by trees, the cottage was quiet.',
        difficulty: 'challenge',
        estimatedMinutes: 11,
        prerequisites: ['l2_u8_t1'],
        lesson: {
          id: 'les_l3_u8_t1',
          whatIsItEn: 'Participle clauses replace adverbial or relative clauses to make writing more concise and elegant. Present participle (-ing) = active; Past participle (-ed/V3) = passive; Perfect participle (Having + V3) = completed prior action.',
          whatIsItUz: 'Gaplarni qisqartirib ixcham qilish: -ing faol harakat, -ed majhul nisbat, Having + V3 esa oldinroq tugagan harakat uchun.',
          formula: 'Having + V3, Subject + Verb... | V-ing, Subject + Verb...',
          positiveStructure: {
            rule: 'Having completed his homework, Sardor went out to play.',
            example: 'Feeling exhausted, she went to bed early.',
            exampleUz: 'Juda charchaganini his qilib, u erta uxlashga yotdi.',
          },
          negativeStructure: {
            rule: 'Not knowing what to say, he remained silent.',
            example: 'Not having received any reply, we sent a follow-up email.',
            exampleUz: 'Hech qanday javob olmagach, qayta xat yubordik.',
          },
          questionStructure: {
            rule: 'Having heard the news, what did you do?',
            example: 'Seen from above, what does the city look like?',
            exampleUz: 'Tepadan qaralganda shahar qanday koʻrinadi?',
          },
          examples: [
            { en: 'Having lived in London for five years, she speaks British English fluently.', uz: 'Londonda besh yil yashaganligi sababli, u ingliz tilida ravon gapiradi.', highlight: 'Having lived' }
          ],
          signalWords: ['Having + V3', 'Feeling...', 'Knowing...', 'Not having...'],
          commonMistakes: [
            { incorrect: 'Walking into the room, the window was broken. (Dangling modifier)', correct: 'Walking into the room, I noticed the broken window.', explanationUz: 'Sifatdosh birikmaning egasi asosiy gapdagi ega bilan bir xil boʻlishi shart.' }
          ],
          studyTips: ['Make sure the subject of the participle is the exact same subject as the main clause!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u8_q1',
            topicId: 'l3_u8_t1',
            type: 'multiple_choice',
            prompt: '___ all his money on cryptocurrency, he had to borrow from friends.',
            options: ['Having lost', 'Losing', 'Lost', 'Have lost'],
            correctAnswer: 'Having lost',
            explanationEn: 'Action completed before the main verb: Perfect participle "Having lost".',
            explanationUz: 'Oldinroq tugallangan harakat uchun: Having lost.',
            difficulty: 'challenge'
          },
          {
            id: 'l3_u8_q2',
            topicId: 'l3_u8_t1',
            type: 'multiple_choice',
            prompt: '___ by hundreds of fans, the famous singer smiled and waved.',
            options: ['Surrounded', 'Surrounding', 'Having surrounded', 'Surround'],
            correctAnswer: 'Surrounded',
            explanationEn: 'Passive meaning (she was surrounded by fans): use past participle "Surrounded".',
            explanationUz: 'Majhul maʼno (muxlislar bilan oʻrab olingan): Surrounded.',
            difficulty: 'hard'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u8_tq1',
            topicId: 'l3_u8_t1',
            type: 'multiple_choice',
            prompt: '___ how to solve the calculus problem, the student asked the tutor for guidance.',
            options: ['Not knowing', 'Not know', 'Knowing not', 'Didn\'t know'],
            correctAnswer: 'Not knowing',
            explanationEn: 'Negative present participle: "Not + V-ing" -> "Not knowing".',
            explanationUz: 'Inkor sifatdosh: Not knowing.',
            difficulty: 'hard'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 9: Subjunctive & Formulaic Structures
  {
    id: 'l3_u9',
    unitNumber: 9,
    levelId: 'level_3',
    title: 'Unit 9: The Subjunctive Mood & Formal Structures',
    titleUz: '9-Boʻlim: Subjunktiv (Istak-Buyruq Mayli)',
    description: 'Use the bare infinitive in formal clauses: It is vital that he be present; I demand that she apologize.',
    topics: [
      {
        id: 'l3_u9_t1',
        unitId: 'l3_u9',
        levelId: 'level_3',
        title: 'Present Subjunctive with Demand, Suggest, Vital',
        titleUz: 'Rasmiy Subjunktiv (Demand, Suggest, Vital)',
        slug: 'subjunctive-mood',
        description: 'Base form of verb used for all persons: It is essential that he attend.',
        difficulty: 'challenge',
        estimatedMinutes: 10,
        prerequisites: ['l3_u4_t1'],
        lesson: {
          id: 'les_l3_u9_t1',
          whatIsItEn: 'In formal English, verbs like demand, recommend, insist, and adjectives like vital, essential take a that-clause with the base form of the verb (bare infinitive) for all persons, including he/she/it (no -s, no was/is).',
          whatIsItUz: 'Rasmiy ingliz tilida talab, taklif va zarurat ifodalanganda, "that"dan keyin barcha shaxslar uchun feʼlning noaniq (boshlangʻich) shakli ishlatiladi: he be, she attend (hech qanday -s qoʻshilmaydi).',
          formula: 'It is essential that + Subject + Verb (base form)',
          positiveStructure: {
            rule: 'The judge insisted that he TELL the whole truth.',
            example: 'It is vital that every candidate be on time.',
            exampleUz: 'Har bir nomzod oʻz vaqtida kelishi oʻta muhim.',
          },
          negativeStructure: {
            rule: "that + Subject + NOT + Verb (no auxiliary do/does!)",
            example: 'I recommend that she not accept the offer without a contract.',
            exampleUz: 'U shartnomasiz taklifni qabul qilmasligini maslahat beraman.',
          },
          questionStructure: {
            rule: 'Did the doctor recommend that you take this medicine?',
            example: 'Is it necessary that we be present at the ceremony?',
            exampleUz: 'Marosimda hozir boʻlishimiz shartmi?',
          },
          examples: [
            { en: 'The manager requested that the report be submitted by Friday.', uz: 'Menejer hisobot juma kunigacha topshirilishini talab qildi.', highlight: 'that the report be submitted' }
          ],
          signalWords: ['essential that', 'vital that', 'demand that', 'suggest that', 'insist that'],
          commonMistakes: [
            { incorrect: 'It is essential that he goes there.', correct: 'It is essential that he go there.', explanationUz: 'Subjunktivda 3-shaxs birlikda ham -s qoʻshilmaydi: "that he go" toʻgʻri.' }
          ],
          studyTips: ['No -s on the verb, and the verb BE remains simply "be" (not is, are, was)!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u9_q1',
            topicId: 'l3_u9_t1',
            type: 'multiple_choice',
            prompt: 'The board of directors demands that the CEO ___ immediately.',
            options: ['resign', 'resigns', 'resigned', 'will resign'],
            correctAnswer: 'resign',
            explanationEn: 'Subjunctive takes base form "resign" without third-person -s.',
            explanationUz: 'Subjunktiv qoidasiga koʻra feʼlga -s qoʻshilmaydi: resign.',
            difficulty: 'challenge'
          },
          {
            id: 'l3_u9_q2',
            topicId: 'l3_u9_t1',
            type: 'multiple_choice',
            prompt: 'It is crucial that every student ___ aware of the examination rules.',
            options: ['be', 'is', 'was', 'are'],
            correctAnswer: 'be',
            explanationEn: 'Subjunctive form of the verb "to be" is always "be".',
            explanationUz: 'Subjunktivda "to be" feʼli shaxsga qaramay "be" boʻlib qoladi.',
            difficulty: 'challenge'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u9_tq1',
            topicId: 'l3_u9_t1',
            type: 'multiple_choice',
            prompt: 'I suggest that she ___ the decision until tomorrow morning.',
            options: ['not make', 'doesn\'t make', 'not makes', 'didn\'t make'],
            correctAnswer: 'not make',
            explanationEn: 'Negative subjunctive uses "not + base verb" without auxiliary: "not make".',
            explanationUz: 'Inkor subjunktivda do/does qoʻyilmaydi: not make.',
            difficulty: 'challenge'
          }
        ],
        flashcards: []
      }
    ]
  },

  // UNIT 11: Cleft Sentences & Discourse Markers
  {
    id: 'l3_u11',
    unitNumber: 11,
    levelId: 'level_3',
    title: 'Unit 11: Cleft Sentences for Laser Focus',
    titleUz: '11-Boʻlim: Ajratuvchi Urgʻu Gaplar (Cleft Sentences)',
    description: 'Split sentences to put laser focus on specific details: "It was his courage that saved us", "What I need is a vacation".',
    topics: [
      {
        id: 'l3_u11_t1',
        unitId: 'l3_u11',
        levelId: 'level_3',
        title: 'It-Clefts & Wh-Clefts',
        titleUz: 'It-Cleft va Wh-Cleft Konstruksiyalari',
        slug: 'cleft-sentences',
        description: 'What I really want is... It was yesterday that...',
        difficulty: 'hard',
        estimatedMinutes: 9,
        prerequisites: ['l3_u4_t1'],
        lesson: {
          id: 'les_l3_u11_t1',
          whatIsItEn: 'Cleft sentences divide a normal sentence into two parts to emphasize a specific element. IT-cleft: "It was X that/who..."; WH-cleft: "What I really love about teaching IS the students."',
          whatIsItUz: 'Gapdagi maʼlum bir boʻlakka kuchli urgʻu berish uchun gap ikki boʻlakka ajratiladi: "Meni hayron qoldirgan narsa bu..." yoki "Aynan u...".',
          formula: 'It is/was + EMPHASIZED NOUN + that/who... | What + clause + is/was...',
          positiveStructure: {
            rule: 'What we need most is a clear strategy.',
            example: 'It was Malika who solved the complex puzzle first.',
            exampleUz: 'Murakkab jumboqni birinchi boʻlib yechgan aynan Malika edi.',
          },
          negativeStructure: {
            rule: "It wasn\'t the price that bothered me, but the quality.",
            example: "What I don\'t understand is why he left so suddenly.",

            exampleUz: 'Men tushunmagan narsa bu uning nega bunchalik toʻsatdan ketib qolganidir.',
          },
          questionStructure: {
            rule: 'Was it your brother who called you?',
            example: 'What is it that makes this university so special?',
            exampleUz: 'Bu universitetni bunchalik oʻzgacha qilayotgan narsa nima?',
          },
          examples: [
            { en: 'All I want for my birthday is a quiet day with family.', uz: 'Tugʻilgan kunimga xohlagan yagona narsam — oilam bilan sokin kun.', highlight: 'All I want is' }
          ],
          signalWords: ['It was... that', 'What I need is', 'All I want is', 'The reason why... is'],
          commonMistakes: [
            { incorrect: 'What I want is learn English.', correct: 'What I want is to learn English.', explanationUz: 'Cleft gapda ot-kesim kelganda infinitiv "to learn" ishlatiladi.' }
          ],
          studyTips: ['Use Cleft sentences in your IELTS Writing Task 2 and Speaking Part 3 to score Band 8.0+!']
        },
        guidedQuestions: [],
        practiceQuestions: [
          {
            id: 'l3_u11_q1',
            topicId: 'l3_u11_t1',
            type: 'multiple_choice',
            prompt: "___ made the victory so memorable was the team\'s unbreakable spirit.",

            options: ['What', 'That', 'Which', 'It'],
            correctAnswer: 'What',
            explanationEn: 'Wh-cleft begins with "What" to mean "The thing that...": "What made the victory...".',
            explanationUz: 'Urgʻuli Wh-cleft gap "What" bilan boshlanadi: What made the victory...',
            difficulty: 'hard'
          },
          {
            id: 'l3_u11_q2',
            topicId: 'l3_u11_t1',
            type: 'multiple_choice',
            prompt: 'It was because of your timely advice ___ I avoided a costly mistake.',
            options: ['that', 'which', 'what', 'whose'],
            correctAnswer: 'that',
            explanationEn: 'It-cleft formula: It was + phrase + that.',
            explanationUz: 'It-cleft formulasida: It was [sabab] that.',
            difficulty: 'medium'
          }
        ],
        testQuestions: [
          {
            id: 'l3_u11_tq1',
            topicId: 'l3_u11_t1',
            type: 'multiple_choice',
            prompt: 'All he really cared about ___ the happiness of his children.',
            options: ['was', 'were', 'been', 'being'],
            correctAnswer: 'was',
            explanationEn: '"All he really cared about" acts as a singular concept: takes singular verb "was".',
            explanationUz: '"All he cared about" birlik hisoblanadi: was.',
            difficulty: 'hard'
          }
        ],
        flashcards: []
      }
    ]
  },
// UNIT 12: Level 3 Comprehensive Mastery Final Exam
  {
    id: 'l3_u12',
    unitNumber: 12,
    levelId: 'level_3',
    title: 'Unit 12: Level 3 Grand Mastery Exam',
    titleUz: '12-Boʻlim: 3-Daraja Oliy Sertifikat Imtihoni',
    description: 'Mastery assessment covering Advanced Perfect Tenses, Mixed Conditionals, Past Modals, and Inversion. Pass with 80%+ to become a Certified English Grammar Master!',
    topics: [
      {
        id: 'l3_u12_t1',
        unitId: 'l3_u12',
        levelId: 'level_3',
        title: 'Level 3 Grand Mastery Certification Exam',
        titleUz: '3-Daraja Oliy Imtihon',
        slug: 'level-3-final-exam',
        description: 'The definitive challenge for advanced English learners. Tests all Level 3 grammar nuances.',
        difficulty: 'challenge',
        estimatedMinutes: 20,
        prerequisites: ['l3_u1_t1', 'l3_u1_t2', 'l3_u3_t1', 'l3_u6_t1', 'l3_u10_t1'],
        lesson: {
          id: 'les_l3_u12_t1',
          topicId: 'l3_u12_t1',
          whatIsItEn: 'The final certification exam for the English Grammar Learning Platform.',
          whatIsItUz: 'Platformaning eng yuqori darajadagi yakuniy sertifikat imtihoni.',
          positiveStructure: { rule: '', example: '', exampleUz: '' },
          negativeStructure: { rule: '', example: '', exampleUz: '' },
          questionStructure: { rule: '', example: '', exampleUz: '' },
          examples: [],
          signalWords: [],
          commonMistakes: [],
          studyTips: [
            'Check for subtle clues: stative verbs, inversion triggers, and conditional timeframes.',
          ],
        },
        guidedQuestions: [],
        practiceQuestions: [],
        testQuestions: [
          {
            id: 'exam_l3_1',
            topicId: 'l3_u12_t1',
            type: 'multiple_choice',
            prompt: 'By the time the rescue team arrived, the hikers ___ all their supplies.',
            options: ['had exhausted', 'have exhausted', 'exhausted', 'were exhausting'],
            correctAnswer: 'had exhausted',
            explanationEn: 'Past action completed before another past event: Past Perfect "had exhausted".',
            explanationUz: 'Qutqaruvchilar kelguncha zaxiralar tugab boʻlgan: had exhausted.',
            difficulty: 'hard',
          },
          {
            id: 'exam_l3_2',
            topicId: 'l3_u12_t1',
            type: 'multiple_choice',
            prompt: 'If she had listened to my advice, she ___ in trouble right now.',
            options: ['wouldn\'t be', 'wouldn\'t have been', 'won\'t be', 'isn\'t'],
            correctAnswer: "wouldn\'t be",

            explanationEn: 'Mixed conditional: past condition (had listened) with present result (right now) -> "wouldn\'t be".',

            explanationUz: "Aralash shart (oʻtmishdagi shartning hozirgi natijasi): wouldn\'t be right now.",

            difficulty: 'challenge',
          },
          {
            id: 'exam_l3_3',
            topicId: 'l3_u12_t1',
            type: 'multiple_choice',
            prompt: 'Rarely ___ such an inspiring lecture at university.',
            options: ['have I attended', 'I have attended', 'I attended', 'did I attended'],
            correctAnswer: 'have I attended',
            explanationEn: 'Negative inversion with "Rarely": auxiliary "have" precedes subject "I".',
            explanationUz: 'Inversiya: have I attended.',
            difficulty: 'hard',
          },
          {
            id: 'exam_l3_4',
            topicId: 'l3_u12_t1',
            type: 'multiple_choice',
            prompt: 'He has no memory of the collision. He ___ his head during the accident.',
            options: ['must have bumped', 'can\'t have bumped', 'should have bumped', 'would bump'],
            correctAnswer: 'must have bumped',
            explanationEn: 'Strong logical past deduction based on memory loss: "must have bumped".',
            explanationUz: 'Xotira yoʻqolishi dalil: must have bumped (boshini urib olgan boʻlishi aniq).',
            difficulty: 'hard',
          },
          {
            id: 'exam_l3_5',
            topicId: 'l3_u12_t1',
            type: 'multiple_choice',
            prompt: 'How long ___ for the results to be published?',
            options: ['have you been waiting', 'are you waiting', 'do you wait', 'did you waited'],
            correctAnswer: 'have you been waiting',
            explanationEn: 'Duration with "How long": Present Perfect Continuous "have you been waiting".',
            explanationUz: '"How long" bilan davomiylik: have you been waiting.',
            difficulty: 'medium',
          },
        ],
        flashcards: [],
      },
    ],
  },
];
