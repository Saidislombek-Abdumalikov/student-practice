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
          {
            "id": "g_l3_u1_2",
            "topicId": "l3_u1_t1",
            "type": "fill_blank",
            "prompt": "Complete with Present Perfect Continuous:",
            "sentenceWithBlank": "They are out of breath because they ___ (run) for an hour.",
            "options": [
                        "have been running",
                        "have run",
                        "are running",
                        "were running"
            ],
            "correctAnswer": "have been running",
            "explanationEn": "Focus is on the continuous exertion that produced a visible present effect (out of breath).",
            "explanationUz": "Hozirgi koʻrinib turgan natijaga olib kelgan uzoq davomli harakat: have been running.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u1_3",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "Choose between Present Perfect Simple and Continuous:",
            "sentenceWithBlank": "I ___ three chapters of the novel today.",
            "options": [
                        "have read",
                        "have been reading",
                        "am reading",
                        "had read"
            ],
            "correctAnswer": "have read",
            "explanationEn": "When stating a finished quantity (three chapters), use Present Perfect Simple, NOT Continuous.",
            "explanationUz": "Bajarilgan aniq miqdor (uchta bob) aytilganda Simple (have read) ishlatiladi.",
            "difficulty": "hard"
}
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
          {
            "id": "p_l3_u1_3",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "Why is 'I have been knowing him for ten years' incorrect?",
            "options": [
                        "'know' is a stative verb and cannot be used in continuous aspects.",
                        "'for' should be 'since'.",
                        "'have' must agree with 'years'.",
                        "'knowing' requires past tense."
            ],
            "correctAnswer": "'know' is a stative verb and cannot be used in continuous aspects.",
            "explanationEn": "Stative verbs (know, have, like, believe) cannot be used in continuous tenses.",
            "explanationUz": "'know' holat feʼli boʻlib, continuous shaklda ishlatilmaydi; toʻgʻrisi: have known.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u1_4",
            "topicId": "l3_u1_t1",
            "type": "fill_blank",
            "prompt": "Complete with the correct continuous form:",
            "sentenceWithBlank": "How long ___ she ___ for the company?",
            "options": [
                        "has / been working",
                        "have / been working",
                        "is / working",
                        "did / work"
            ],
            "correctAnswer": "has / been working",
            "explanationEn": "'she' takes 'has been working' to ask about ongoing duration.",
            "explanationUz": "'she' uchinchi shaxs boʻlgani uchun: has she been working?",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u1_5",
            "topicId": "l3_u1_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Ertalabdan beri yomgʻir tinmay yogʻyapti.",
            "options": [
                        "It has been raining non-stop since morning.",
                        "It is raining non-stop since morning.",
                        "It has rained non-stop for morning.",
                        "It was raining non-stop from morning."
            ],
            "correctAnswer": "It has been raining non-stop since morning.",
            "explanationEn": "Ongoing weather activity starting in past: 'It has been raining non-stop since morning.'",
            "explanationUz": "Oʻtmishdan boshlanib hozir ham davom etayotgan harakat: has been raining.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u1_6",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "His hands are covered in paint because he ___ the living room.",
            "options": [
                        "has been painting",
                        "has painted",
                        "painted",
                        "is painted"
            ],
            "correctAnswer": "has been painting",
            "explanationEn": "Side-effect of a recent ongoing activity: has been painting.",
            "explanationUz": "Yaqinda davom etgan ishning koʻrinib turgan asorati: has been painting.",
            "difficulty": "medium"
}
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
          {
            "id": "t_l3_u1_2",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "We ___ this project for six months, but we still haven't finished.",
            "options": [
                        "have been developing",
                        "have developed",
                        "developed",
                        "are developing"
            ],
            "correctAnswer": "have been developing",
            "explanationEn": "Duration of an incomplete ongoing project: have been developing.",
            "explanationUz": "Tugallanmagan, davom etayotgan loyiha davomiyligi: have been developing.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u1_3",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "She is exhausted. She ___ all day for the medical board examination.",
            "options": [
                        "has been revising",
                        "has revised",
                        "revises",
                        "was revised"
            ],
            "correctAnswer": "has been revising",
            "explanationEn": "'all day' with present exhaustion stresses the continuous process: has been revising.",
            "explanationUz": "'all day' taʼkidi va charchoq holati: has been revising.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u1_4",
            "topicId": "l3_u1_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence emphasizes the COMPLETION of the action?",
            "options": [
                        "I have repaired the car; you can drive it now.",
                        "I have been repairing the car all afternoon.",
                        "I was repairing the car when you called.",
                        "I will be repairing the car tomorrow."
            ],
            "correctAnswer": "I have repaired the car; you can drive it now.",
            "explanationEn": "Present Perfect Simple (have repaired) focuses on completion and the final product.",
            "explanationUz": "Present Perfect Simple harakatning toʻliq yakunlangani va natijasiga urgʻu beradi.",
            "difficulty": "hard"
}
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
          {
            "id": "g_l3_u1_5",
            "topicId": "l3_u1_t2",
            "type": "fill_blank",
            "prompt": "Complete with the Past Perfect Continuous form:",
            "sentenceWithBlank": "The ground was wet because it ___ (rain) heavily for hours.",
            "options": [
                        "had been raining",
                        "has been raining",
                        "was raining",
                        "had rained"
            ],
            "correctAnswer": "had been raining",
            "explanationEn": "Past condition (was wet) caused by earlier continuous process in the past: had been raining.",
            "explanationUz": "Oʻtmishdagi natijaga sabab boʻlgan undan oldingi davomli harakat: had been raining.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u1_6",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "How does Past Perfect clarify the chronological order of two past events?",
            "options": [
                        "It shows which event happened earlier than the other past event.",
                        "It indicates that both events happened at the same second.",
                        "It turns the sentence into a passive clause.",
                        "It is only used in poetry."
            ],
            "correctAnswer": "It shows which event happened earlier than the other past event.",
            "explanationEn": "Past Perfect explicitly marks the 'earlier past' event.",
            "explanationUz": "Past Perfect oʻtgan zamondagi ikki voqeadan qaysi biri oldinroq sodir boʻlganini koʻrsatadi.",
            "difficulty": "easy"
}
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
          {
            "id": "p_l3_u1_8",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "By the time he turned twenty-five, he ___ three successful companies.",
            "options": [
                        "had founded",
                        "founded",
                        "has founded",
                        "was founding"
            ],
            "correctAnswer": "had founded",
            "explanationEn": "'By the time' + past milestone requires Past Perfect: had founded.",
            "explanationUz": "'By the time' oʻtgan zamon marrasi bilan Past Perfect talab qiladi: had founded.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u1_9",
            "topicId": "l3_u1_t2",
            "type": "fill_blank",
            "prompt": "Complete the sentence:",
            "sentenceWithBlank": "They ___ (walk) for nearly five hours before they reached the mountain cabin.",
            "options": [
                        "had been walking",
                        "were walking",
                        "have walked",
                        "had walked to"
            ],
            "correctAnswer": "had been walking",
            "explanationEn": "Duration of an activity in progress prior to reaching the cabin: had been walking.",
            "explanationUz": "Boshqa oʻtgan voqeadan oldingi uzoq davom etgan harakat: had been walking.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u1_10",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "He didn't want to see the film because he ___ the book previously.",
            "options": [
                        "had already read",
                        "already read",
                        "has already read",
                        "was reading"
            ],
            "correctAnswer": "had already read",
            "explanationEn": "Prior past completion explaining his past reaction: had already read.",
            "explanationUz": "Oldinroq oʻqib boʻlganligi sababli: had already read.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u1_11",
            "topicId": "l3_u1_t2",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Biz yetib borganimizda, poyezd allaqachon joʻnab ketgan edi.",
            "options": [
                        "When we arrived, the train had already left.",
                        "When we had arrived, the train already left.",
                        "When we arrived, the train has already left.",
                        "When we were arriving, the train left."
            ],
            "correctAnswer": "When we arrived, the train had already left.",
            "explanationEn": "Earlier departure in the past: 'the train had already left.'",
            "explanationUz": "Oldinroq joʻnab ketgan: the train had already left.",
            "difficulty": "medium"
}
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
          {
            "id": "t_l3_u1_6",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "No sooner ___ the door than the alarm went off.",
            "options": [
                        "had he unlocked",
                        "he had unlocked",
                        "did he unlock",
                        "has he unlocked"
            ],
            "correctAnswer": "had he unlocked",
            "explanationEn": "'No sooner had + subject + V3 ... than' is the inverted past perfect construction.",
            "explanationUz": "'No sooner had + ega + V3 ... than' inversiya formulasi.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u1_7",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "She realized she ___ her purse at the restaurant.",
            "options": [
                        "had left",
                        "left",
                        "has left",
                        "was leaving"
            ],
            "correctAnswer": "had left",
            "explanationEn": "Leaving the purse took place before the realization in the past: had left.",
            "explanationUz": "Hamyonni unutib qoldirish anglab yetishdan oldin yuz bergan: had left.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u1_8",
            "topicId": "l3_u1_t2",
            "type": "multiple_choice",
            "prompt": "At that point, we ___ each other for nearly two decades.",
            "options": [
                        "had known",
                        "had been knowing",
                        "knew",
                        "have known"
            ],
            "correctAnswer": "had known",
            "explanationEn": "'know' is stative and uses Past Perfect Simple (had known), not Continuous.",
            "explanationUz": "'know' holat feʼli boʻlgani uchun Past Perfect Simple (had known) boʻladi.",
            "difficulty": "hard"
}
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
        guidedQuestions: [
          {
            "id": "g_l3_u2_1",
            "topicId": "l3_u2_t1",
            "type": "fill_blank",
            "prompt": "Complete with Future Continuous for an action in progress at a specific future time:",
            "sentenceWithBlank": "This time tomorrow, I ___ (lie) on the beach in Bali.",
            "options": [
                        "will be lying",
                        "will lie",
                        "am lying",
                        "will have lied"
            ],
            "correctAnswer": "will be lying",
            "explanationEn": "Future Continuous formula: will be + V-ing.",
            "explanationUz": "Kelasi zamondagi aniq paytda davom etayotgan harakat: will be lying.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u2_2",
            "topicId": "l3_u2_t1",
            "type": "fill_blank",
            "prompt": "Complete with Future Perfect for an action completed before a future deadline:",
            "sentenceWithBlank": "By 2030, scientists ___ (find) a cure for many rare diseases.",
            "options": [
                        "will have found",
                        "will be finding",
                        "will find",
                        "have found"
            ],
            "correctAnswer": "will have found",
            "explanationEn": "Future Perfect formula: will have + V3.",
            "explanationUz": "Kelajakdagi maʼlum bir muddatgacha yakunlanadigan harakat: will have found.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u2_3",
            "topicId": "l3_u2_t1",
            "type": "multiple_choice",
            "prompt": "What key signal word typically introduces the deadline for Future Perfect?",
            "sentenceWithBlank": "___ next Friday, the contractors will have finished the renovation.",
            "options": [
                        "By",
                        "At",
                        "While",
                        "During"
            ],
            "correctAnswer": "By",
            "explanationEn": "'By' indicates completion at or before a specified future time.",
            "explanationUz": "'By' kelasi zamondagi oxirgi muddatni bildiradi (jumagacha).",
            "difficulty": "easy"
}
        ],
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
          },
          {
            "id": "p_l3_u2_3",
            "topicId": "l3_u2_t1",
            "type": "multiple_choice",
            "prompt": "Don't phone between 7 and 8 PM because we ___ dinner then.",
            "options": [
                        "will be having",
                        "will have had",
                        "have",
                        "will have"
            ],
            "correctAnswer": "will be having",
            "explanationEn": "Action in progress during that specific time window: will be having.",
            "explanationUz": "Oʻsha vaqt oraligʻida davom etayotgan boʻladi: will be having.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u2_4",
            "topicId": "l3_u2_t1",
            "type": "fill_blank",
            "prompt": "Complete with Future Perfect:",
            "sentenceWithBlank": "By the time you wake up, I ___ (already / leave) for the airport.",
            "options": [
                        "will have already left",
                        "will be already leaving",
                        "will already leave",
                        "had already left"
            ],
            "correctAnswer": "will have already left",
            "explanationEn": "Completion prior to another future event (by the time you wake up): will have already left.",
            "explanationUz": "Kelasi voqeadan oldinroq tugallanadigan harakat: will have already left.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u2_5",
            "topicId": "l3_u2_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Kelasi yilga borib, men bu kompaniyada 10 yil ishlagan boʻlaman.",
            "options": [
                        "By next year, I will have worked at this company for ten years.",
                        "By next year, I will work at this company for ten years.",
                        "By next year, I am working at this company for ten years.",
                        "By next year, I will be worked at this company for ten years."
            ],
            "correctAnswer": "By next year, I will have worked at this company for ten years.",
            "explanationEn": "'By next year, I will have worked...'",
            "explanationUz": "Kelasi yilgacha boʻlgan muddat: will have worked.",
            "difficulty": "hard"
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
          },
          {
            "id": "t_l3_u2_2",
            "topicId": "l3_u2_t1",
            "type": "multiple_choice",
            "prompt": "Will you ___ using the printer for much longer? I have urgent files to print.",
            "options": [
                        "be",
                        "have been",
                        "have",
                        "to be"
            ],
            "correctAnswer": "be",
            "explanationEn": "Polite inquiry about someone's routine future plans: Will you be using...?",
            "explanationUz": "Xushmuomalalik bilan birovning rejasini soʻrash: Will you be using...?",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u2_3",
            "topicId": "l3_u2_t1",
            "type": "multiple_choice",
            "prompt": "By November, the author ___ her fifth novel.",
            "options": [
                        "will have published",
                        "will be publishing",
                        "will publish",
                        "is publishing"
            ],
            "correctAnswer": "will have published",
            "explanationEn": "Accomplished milestone before November: will have published.",
            "explanationUz": "Noyabrgacha yakunlanadigan natija: will have published.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u2_4",
            "topicId": "l3_u2_t1",
            "type": "multiple_choice",
            "prompt": "By the end of this decade, artificial intelligence ___ transformed many industries.",
            "options": [
                        "will have",
                        "will be",
                        "is going to be",
                        "has"
            ],
            "correctAnswer": "will have",
            "explanationEn": "will have + transformed (Future Perfect).",
            "explanationUz": "will have + transformed (Future Perfect).",
            "difficulty": "medium"
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
        guidedQuestions: [
          {
            "id": "g_l3_u4_1",
            "topicId": "l3_u4_t1",
            "type": "fill_blank",
            "prompt": "Complete the negative adverb inversion:",
            "sentenceWithBlank": "Rarely ___ such extraordinary dedication in a student.",
            "options": [
                        "have I seen",
                        "I have seen",
                        "did I saw",
                        "I saw"
            ],
            "correctAnswer": "have I seen",
            "explanationEn": "After restrictive adverbs (rarely, seldom), invert auxiliary and subject: have I seen.",
            "explanationUz": "Inkor/cheklovchi ravishlar gap boshida kelganda inversiya boʻladi: have I seen.",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u4_2",
            "topicId": "l3_u4_t1",
            "type": "multiple_choice",
            "prompt": "Why do formal writers use negative inversion?",
            "options": [
                        "For dramatic rhetorical emphasis and formal stylistic elegance.",
                        "Because auxiliary verbs are forbidden at the end.",
                        "To turn statements into interrogative questions.",
                        "Only when speaking in slang."
            ],
            "correctAnswer": "For dramatic rhetorical emphasis and formal stylistic elegance.",
            "explanationEn": "Inversion creates dramatic literary emphasis and stylistic sophistication.",
            "explanationUz": "Inversiya nutqqa yorqin emotsional va rasmiy uslubiy urgʻu beradi.",
            "difficulty": "easy"
},
          {
            "id": "g_l3_u4_3",
            "topicId": "l3_u4_t1",
            "type": "fill_blank",
            "prompt": "Complete with 'Little':",
            "sentenceWithBlank": "Little ___ what consequences his decision would bring.",
            "options": [
                        "did he realize",
                        "he realized",
                        "he did realize",
                        "had he realized"
            ],
            "correctAnswer": "did he realize",
            "explanationEn": "Past Simple inversion with Little: Little did + subject + bare infinitive (realize).",
            "explanationUz": "Past Simple inversiyasi: Little did he realize.",
            "difficulty": "hard"
}
        ],
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
          },
          {
            "id": "p_l3_u4_3",
            "topicId": "l3_u4_t1",
            "type": "multiple_choice",
            "prompt": "Seldom ___ so many prominent scientists gathered in one room.",
            "options": [
                        "have there been",
                        "there have been",
                        "there were",
                        "were there have"
            ],
            "correctAnswer": "have there been",
            "explanationEn": "Seldom + have + there + been (inverted existential structure).",
            "explanationUz": "Seldom + have there been inversiya tartibi.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u4_4",
            "topicId": "l3_u4_t1",
            "type": "fill_blank",
            "prompt": "Invert 'Under no circumstances':",
            "sentenceWithBlank": "Under no circumstances ___ staff members discuss confidential data.",
            "options": [
                        "should",
                        "they should",
                        "should they to",
                        "must to"
            ],
            "correctAnswer": "should",
            "explanationEn": "Under no circumstances should + subject + bare infinitive.",
            "explanationUz": "'Under no circumstances' qatʼiy taqiqida yordamchi feʼl oldinga oʻtadi: should staff members discuss.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u4_5",
            "topicId": "l3_u4_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English using inversion:",
            "sentenceWithBlank": "U hech qachon bunday xatoga yoʻl qoʻymagan.",
            "options": [
                        "Never had he made such a mistake.",
                        "Never he had made such a mistake.",
                        "Never did he made such a mistake.",
                        "Never has he make such a mistake."
            ],
            "correctAnswer": "Never had he made such a mistake.",
            "explanationEn": "Inverted structure: 'Never had he made such a mistake.'",
            "explanationUz": "Inversiya: Never had he made...",
            "difficulty": "hard"
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
          },
          {
            "id": "t_l3_u4_2",
            "topicId": "l3_u4_t1",
            "type": "multiple_choice",
            "prompt": "Not only ___ fluent in English, but she also speaks German and Mandarin.",
            "options": [
                        "is she",
                        "she is",
                        "does she",
                        "has she"
            ],
            "correctAnswer": "is she",
            "explanationEn": "'Not only is she...' correctly inverts the subject and the verb 'to be'.",
            "explanationUz": "'Not only' bilan boshlangan gapda to be inversiya boʻladi: Not only is she...",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u4_3",
            "topicId": "l3_u4_t1",
            "type": "multiple_choice",
            "prompt": "Only after the investigation was completed ___ the truth revealed.",
            "options": [
                        "was",
                        "it was",
                        "did",
                        "had"
            ],
            "correctAnswer": "was",
            "explanationEn": "With 'Only after...', inversion happens in the main clause: was the truth revealed.",
            "explanationUz": "'Only after...' iborasida inversiya asosiy gapda boʻladi: was the truth revealed.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u4_4",
            "topicId": "l3_u4_t1",
            "type": "multiple_choice",
            "prompt": "Scarcely ___ the stage when the applause erupted.",
            "options": [
                        "had the soloist stepped onto",
                        "the soloist had stepped onto",
                        "did the soloist step onto",
                        "has the soloist stepped onto"
            ],
            "correctAnswer": "had the soloist stepped onto",
            "explanationEn": "Scarcely had + subject + V3 ... when.",
            "explanationUz": "Scarcely had + ega + V3 ... when formulasi.",
            "difficulty": "hard"
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
        guidedQuestions: [
          {
            "id": "g_l3_u5_1",
            "topicId": "l3_u5_t1",
            "type": "fill_blank",
            "prompt": "Complete the causative structure:",
            "sentenceWithBlank": "I need to have my car ___ (service) before the long trip.",
            "options": [
                        "serviced",
                        "servicing",
                        "service",
                        "to service"
            ],
            "correctAnswer": "serviced",
            "explanationEn": "Causative formula: have + object + V3 (past participle).",
            "explanationUz": "Kauzativ formula: have + obyekt + V3 (serviced).",
            "difficulty": "easy"
},
          {
            "id": "g_l3_u5_2",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "Difference between 'I cut my hair' and 'I had my hair cut':",
            "options": [
                        "'I had my hair cut' means a barber or professional did it for me.",
                        "'I cut my hair' means someone else did it.",
                        "They mean the exact same thing.",
                        "'I had my hair cut' is in Future Simple."
            ],
            "correctAnswer": "'I had my hair cut' means a barber or professional did it for me.",
            "explanationEn": "Causative shows arranging for another person to perform a professional service.",
            "explanationUz": "'I had my hair cut' sartaroshga sochimni oldirdim degan maʼnoni beradi.",
            "difficulty": "easy"
},
          {
            "id": "g_l3_u5_3",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "Which verb is slightly more informal and conversational than 'have' in causatives?",
            "sentenceWithBlank": "I must ___ my passport renewed next week.",
            "options": [
                        "get",
                        "make",
                        "let",
                        "cause"
            ],
            "correctAnswer": "get",
            "explanationEn": "'get something done' is very common in informal and spoken English.",
            "explanationUz": "'get something done' soʻzlashuvda 'have something done' oʻrnida keng ishlatiladi.",
            "difficulty": "easy"
}
        ],
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
          },
          {
            "id": "p_l3_u5_3",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "We are having our house ___ by professional decorators this week.",
            "options": [
                        "painted",
                        "painting",
                        "to paint",
                        "paint"
            ],
            "correctAnswer": "painted",
            "explanationEn": "have + object (our house) + V3 (painted).",
            "explanationUz": "have + house + painted (V3).",
            "difficulty": "easy"
},
          {
            "id": "p_l3_u5_4",
            "topicId": "l3_u5_t1",
            "type": "fill_blank",
            "prompt": "Complete the causative expressing an unfortunate event:",
            "sentenceWithBlank": "Poor David had his wallet ___ on the crowded metro.",
            "options": [
                        "stolen",
                        "steal",
                        "stealing",
                        "to steal"
            ],
            "correctAnswer": "stolen",
            "explanationEn": "'have something done' can also express an unfortunate mishap that happens to you.",
            "explanationUz": "Kauzativ salbiy noxush hodisalar uchun ham ishlatiladi: had his wallet stolen.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u5_5",
            "topicId": "l3_u5_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Men koʻzoynagimni tuzattirdim.",
            "options": [
                        "I had my glasses repaired.",
                        "I repaired my glasses myself.",
                        "I got repaired my glasses.",
                        "I made my glasses repair."
            ],
            "correctAnswer": "I had my glasses repaired.",
            "explanationEn": "Causative structure: 'I had my glasses repaired.'",
            "explanationUz": "Kauzativ shakl: 'I had my glasses repaired.'",
            "difficulty": "medium"
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
          },
          {
            "id": "t_l3_u5_2",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "How often do you have your teeth ___ by a dentist?",
            "options": [
                        "checked",
                        "check",
                        "checking",
                        "to check"
            ],
            "correctAnswer": "checked",
            "explanationEn": "have + teeth + checked (V3).",
            "explanationUz": "have + teeth + checked.",
            "difficulty": "easy"
},
          {
            "id": "t_l3_u5_3",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "The manager got the assistant ___ the summary report before 5 PM.",
            "options": [
                        "to write",
                        "write",
                        "written",
                        "writing"
            ],
            "correctAnswer": "to write",
            "explanationEn": "Active causative with 'get': get + person + TO infinitive (get the assistant to write).",
            "explanationUz": "Faol kauzativda: 'get' shaxs bilan kelganda 'to' talab qiladi (get the assistant to write).",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u5_4",
            "topicId": "l3_u5_t1",
            "type": "multiple_choice",
            "prompt": "The CEO made the staff ___ over the weekend.",
            "options": [
                        "work",
                        "to work",
                        "worked",
                        "working"
            ],
            "correctAnswer": "work",
            "explanationEn": "Active causative with 'make': make + person + BARE infinitive (without to).",
            "explanationUz": "'make' feʼli majburlash maʼnosida to-siz keladi: made the staff work.",
            "difficulty": "hard"
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
          {
            "id": "g_l3_u3_2",
            "topicId": "l3_u3_t1",
            "type": "fill_blank",
            "prompt": "Complete the Third Conditional sentence for a past regret:",
            "sentenceWithBlank": "If I had studied harder, I ___ (pass) the exam.",
            "options": [
                        "would have passed",
                        "would pass",
                        "will pass",
                        "had passed"
            ],
            "correctAnswer": "would have passed",
            "explanationEn": "Third Conditional main clause: would have + V3 (past participle).",
            "explanationUz": "Uchinchi shart mayli asosiy qismi: would have + V3 (oʻtgan zamon afsusi).",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u3_3",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "What does a Mixed Conditional (Past condition with Present result) look like?",
            "sentenceWithBlank": "If he hadn't missed the flight yesterday, he ___ with us today.",
            "options": [
                        "would be",
                        "would have been",
                        "will be",
                        "had been"
            ],
            "correctAnswer": "would be",
            "explanationEn": "Past unreal condition (hadn't missed) with present unreal result (would be today).",
            "explanationUz": "Oʻtmishdagi shart (hadn't missed) hozirgi natija bilan (would be today) bogʻlanganda aralash shart (Mixed Conditional) boʻladi.",
            "difficulty": "hard"
}
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
          {
            "id": "p_l3_u3_2",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "If we ___ the map, we wouldn't have gotten completely lost in the forest.",
            "options": [
                        "had checked",
                        "checked",
                        "would check",
                        "would have checked"
            ],
            "correctAnswer": "had checked",
            "explanationEn": "Third conditional if-clause requires Past Perfect: had checked.",
            "explanationUz": "Uchinchi shart if qismida Past Perfect (had checked) keladi.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u3_3",
            "topicId": "l3_u3_t1",
            "type": "fill_blank",
            "prompt": "Complete with the modal for past missed opportunity:",
            "sentenceWithBlank": "If you had warned me earlier, I ___ (could / help) you.",
            "options": [
                        "could have helped",
                        "could help",
                        "can help",
                        "had helped"
            ],
            "correctAnswer": "could have helped",
            "explanationEn": "'could have + V3' expresses past unreal ability or possibility.",
            "explanationUz": "Oʻtmishda imkoniyat boʻlgan lekin amalga oshmagan: could have helped.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u3_4",
            "topicId": "l3_u3_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Agar u taklifingizni qabul qilganida, hozir direktoringiz boʻlardi.",
            "options": [
                        "If she had accepted your offer, she would be your director now.",
                        "If she accepted your offer, she would have been your director now.",
                        "If she had accepted your offer, she would have been your director now.",
                        "If she would accept your offer, she will be director now."
            ],
            "correctAnswer": "If she had accepted your offer, she would be your director now.",
            "explanationEn": "Mixed conditional: If + had accepted (past), would be (present now).",
            "explanationUz": "Aralash shart: If + had accepted (oʻtmish) -> would be (hozir).",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u3_5",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence expresses a regret about an impossible past?",
            "options": [
                        "If I hadn't spent all my savings, I would have bought that apartment.",
                        "If I don't spend my savings, I will buy that apartment.",
                        "If I had money, I would buy that apartment.",
                        "If I spend money, I regret it."
            ],
            "correctAnswer": "If I hadn't spent all my savings, I would have bought that apartment.",
            "explanationEn": "Third conditional (If hadn't spent... would have bought) reflects on impossible past regret.",
            "explanationUz": "Oʻtmishdagi oʻzgarmas pushaymonlik: If I hadn't spent... would have bought.",
            "difficulty": "medium"
}
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
          {
            "id": "t_l3_u3_2",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "Had they known about the severe storm, they ___ the sailing expedition.",
            "options": [
                        "would have postponed",
                        "would postpone",
                        "will postpone",
                        "had postponed"
            ],
            "correctAnswer": "would have postponed",
            "explanationEn": "Inverted Third Conditional (Had they known = If they had known) pairs with would have postponed.",
            "explanationUz": "Inversiyali uchinchi shart (Had they known) asosiy gapda would have postponed bilan keladi.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u3_3",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "If you weren't so stubborn, you ___ to her advice yesterday.",
            "options": [
                        "would have listened",
                        "would listen",
                        "listened",
                        "had listened"
            ],
            "correctAnswer": "would have listened",
            "explanationEn": "Mixed Conditional (general trait present: weren't so stubborn -> past result: would have listened).",
            "explanationUz": "Aralash shart: hozirgi feʼl-atvor (weren't stubborn) -> kechagi xatti-harakat (would have listened).",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u3_4",
            "topicId": "l3_u3_t1",
            "type": "multiple_choice",
            "prompt": "Without your generous financial support, the clinic ___ bankrupt years ago.",
            "options": [
                        "would have gone",
                        "would go",
                        "had gone",
                        "went"
            ],
            "correctAnswer": "would have gone",
            "explanationEn": "'Without...' functions as a conditional prepositional phrase: would have gone.",
            "explanationUz": "'Without' (sizning yordamingizsiz) uchinchi shart maʼnosida: would have gone.",
            "difficulty": "hard"
}
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
          {
            "id": "g_l3_u6_2",
            "topicId": "l3_u6_t1",
            "type": "fill_blank",
            "prompt": "Complete with past deduction of logical certainty:",
            "sentenceWithBlank": "The streets are soaking wet. It ___ (rain) during the night.",
            "options": [
                        "must have rained",
                        "can't have rained",
                        "should rain",
                        "must rain"
            ],
            "correctAnswer": "must have rained",
            "explanationEn": "100% past logical certainty: must have + V3 (must have rained).",
            "explanationUz": "Oʻtmishdagi harakatga nisbatan mantiqiy qatʼiy xulosa: must have rained.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u6_3",
            "topicId": "l3_u6_t1",
            "type": "fill_blank",
            "prompt": "Complete with past deduction of impossibility:",
            "sentenceWithBlank": "He was in hospital in London yesterday. He ___ (commit) the robbery in Madrid!",
            "options": [
                        "can't have committed",
                        "must have committed",
                        "mustn't have committed",
                        "might commit"
            ],
            "correctAnswer": "can't have committed",
            "explanationEn": "Past impossibility is expressed by 'can't have + V3' (or 'couldn't have + V3').",
            "explanationUz": "Oʻtmishdagi mantiqiy imkonsizlik: can\\'t have committed.",
            "difficulty": "medium"
}
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
          {
            "id": "p_l3_u6_2",
            "topicId": "l3_u6_t1",
            "type": "multiple_choice",
            "prompt": "Why is 'He mustn't have stolen the money' incorrect to mean impossibility?",
            "options": [
                        "'mustn't have' does not exist for deduction; use 'can't have' or 'couldn't have'.",
                        "'stolen' is the wrong participle.",
                        "'money' is uncountable.",
                        "'mustn't' is only for questions."
            ],
            "correctAnswer": "'mustn't have' does not exist for deduction; use 'can't have' or 'couldn't have'.",
            "explanationEn": "To express past deduction of impossibility, English strictly uses 'can't have + V3'.",
            "explanationUz": "Oʻtgan zamon mantiqiy imkonsizligida faqat 'can\\'t have + V3' qoʻllanadi.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u6_3",
            "topicId": "l3_u6_t1",
            "type": "fill_blank",
            "prompt": "Complete with past 50% possibility:",
            "sentenceWithBlank": "I can't find my keys anywhere. I ___ (leave) them in the taxi.",
            "options": [
                        "might have left",
                        "must left",
                        "can have left",
                        "should have left"
            ],
            "correctAnswer": "might have left",
            "explanationEn": "'might have + V3' conveys ~50% possibility about a past event.",
            "explanationUz": "Oʻtmishdagi ehtimollik: might have left (balki qoldirib ketgandirman).",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u6_4",
            "topicId": "l3_u6_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "U (oʻgʻil bola) poezdga kechikkan boʻlsa kerak (ishonch bilan).",
            "options": [
                        "He must have missed the train.",
                        "He can't have missed the train.",
                        "He might missed the train.",
                        "He should have missed the train."
            ],
            "correctAnswer": "He must have missed the train.",
            "explanationEn": "Definite deduction: 'He must have missed the train.'",
            "explanationUz": "Ishonch bilan xulosa: 'He must have missed the train.'",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u6_5",
            "topicId": "l3_u6_t1",
            "type": "multiple_choice",
            "prompt": "You ___ (tell) me the truth instead of lying to my face!",
            "options": [
                        "should have told",
                        "must have told",
                        "can't have told",
                        "might have told"
            ],
            "correctAnswer": "should have told",
            "explanationEn": "'should have + V3' expresses past criticism or unfulfilled obligation.",
            "explanationUz": "'should have + V3' oʻtgan zamondagi tanqid yoki bajarilmagan majburiyatni bildiradi.",
            "difficulty": "medium"
}
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
          {
            "id": "t_l3_u6_2",
            "topicId": "l3_u6_t1",
            "type": "multiple_choice",
            "prompt": "Nobody answered the door. They ___ out for lunch.",
            "options": [
                        "must have gone",
                        "can't have gone",
                        "should have gone",
                        "might go"
            ],
            "correctAnswer": "must have gone",
            "explanationEn": "Logical deduction based on absence: must have gone.",
            "explanationUz": "Eshik ochilmaganligiga asoslangan xulosa: must have gone.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u6_3",
            "topicId": "l3_u6_t1",
            "type": "multiple_choice",
            "prompt": "She ___ that difficult exam without preparing thoroughly; she worked so hard!",
            "options": [
                        "couldn't have passed",
                        "must have passed",
                        "must pass",
                        "should pass"
            ],
            "correctAnswer": "couldn't have passed",
            "explanationEn": "Expressing that passing without studying was impossible: couldn't have passed.",
            "explanationUz": "Tayyorgarliksiz oʻtish imkonsiz edi: couldn't have passed.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u6_4",
            "topicId": "l3_u6_t1",
            "type": "multiple_choice",
            "prompt": "Why didn't you ask me? I ___ you a lift to the station.",
            "options": [
                        "could have given",
                        "must have given",
                        "can have given",
                        "should give"
            ],
            "correctAnswer": "could have given",
            "explanationEn": "'could have given' expresses an unfulfilled past capability/willingness.",
            "explanationUz": "Amalga oshmagan oʻtmishdagi yordam imkoniyati: could have given.",
            "difficulty": "medium"
}
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
          {
            "id": "g_l3_u10_2",
            "topicId": "l3_u10_t1",
            "type": "fill_blank",
            "prompt": "Complete the inversion with 'At no time':",
            "sentenceWithBlank": "At no time ___ in danger during the expedition.",
            "options": [
                        "were the climbers",
                        "the climbers were",
                        "did the climbers were",
                        "had the climbers"
            ],
            "correctAnswer": "were the climbers",
            "explanationEn": "At no time + auxiliary (were) + subject (the climbers).",
            "explanationUz": "At no time + yordamchi feʼl (were) + ega (the climbers).",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u10_3",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "Which time expression requires inversion in the second clause?",
            "options": [
                        "Not until, Only when, Only after",
                        "Never, Rarely, Seldom",
                        "Under no circumstances, On no account",
                        "Hardly, Scarcely, Barely"
            ],
            "correctAnswer": "Not until, Only when, Only after",
            "explanationEn": "'Not until', 'Only when', and 'Only after' invert the main clause, not the subordinate clause.",
            "explanationUz": "'Not until' va 'Only when' ergash gapda emas, asosiy gapda inversiya hosil qiladi.",
            "difficulty": "hard"
}
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
          {
            "id": "p_l3_u10_2",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "On no account ___ this red button be pressed.",
            "options": [
                        "must",
                        "it must",
                        "must to",
                        "should to"
            ],
            "correctAnswer": "must",
            "explanationEn": "'On no account must + subject + be pressed.'",
            "explanationUz": "Inversiya: On no account must...",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u10_3",
            "topicId": "l3_u10_t1",
            "type": "fill_blank",
            "prompt": "Complete the inversion with 'No sooner':",
            "sentenceWithBlank": "No sooner ___ the phone than it rang again.",
            "options": [
                        "had I hung up",
                        "I had hung up",
                        "did I hang up",
                        "hung I up"
            ],
            "correctAnswer": "had I hung up",
            "explanationEn": "No sooner had + subject + V3 ... than.",
            "explanationUz": "No sooner had + ega + V3 ... than.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u10_4",
            "topicId": "l3_u10_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English using inversion:",
            "sentenceWithBlank": "Faqat ertasi kuni u nima boʻlganini tushundi.",
            "options": [
                        "Only the next day did he understand what had happened.",
                        "Only the next day he understood what had happened.",
                        "Only the next day had he understood what had happened.",
                        "Only the next day did he understood what had happened."
            ],
            "correctAnswer": "Only the next day did he understand what had happened.",
            "explanationEn": "Inversion: 'Only the next day did he understand...'",
            "explanationUz": "Inversiya: 'Only the next day did he understand...'",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u10_5",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence has correct negative inversion syntax?",
            "options": [
                        "Barely had the plane taken off when the engine sputtered.",
                        "Barely the plane had taken off when the engine sputtered.",
                        "Barely did the plane taken off when the engine sputtered.",
                        "Barely had the plane took off when the engine sputtered."
            ],
            "correctAnswer": "Barely had the plane taken off when the engine sputtered.",
            "explanationEn": "Barely had + subject + V3 (taken off).",
            "explanationUz": "Barely had + ega + V3 (taken off).",
            "difficulty": "hard"
}
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
          {
            "id": "t_l3_u10_2",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "Not until I got home ___ that I had left my briefcase at work.",
            "options": [
                        "did I notice",
                        "I noticed",
                        "had I noticed",
                        "I did notice"
            ],
            "correctAnswer": "did I notice",
            "explanationEn": "With 'Not until [clause]', invert the main clause: did I notice.",
            "explanationUz": "'Not until' ergash gapidan keyingi asosiy gapda inversiya boʻladi: did I notice.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u10_3",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "In no way ___ responsible for their negligent actions.",
            "options": [
                        "am I",
                        "I am",
                        "do I",
                        "have I"
            ],
            "correctAnswer": "am I",
            "explanationEn": "'In no way am I responsible.'",
            "explanationUz": "Inversiya: In no way am I responsible.",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u10_4",
            "topicId": "l3_u10_t1",
            "type": "multiple_choice",
            "prompt": "Nowhere else in the world ___ such incredible hospitality.",
            "options": [
                        "will you find",
                        "you will find",
                        "you find",
                        "find you"
            ],
            "correctAnswer": "will you find",
            "explanationEn": "'Nowhere else...' requires subject-verb inversion: will you find.",
            "explanationUz": "'Nowhere else...' inversiya talab qiladi: will you find.",
            "difficulty": "hard"
}
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
        guidedQuestions: [
          {
            "id": "g_l3_u7_1",
            "topicId": "l3_u7_t1",
            "type": "fill_blank",
            "prompt": "Invert First Conditional with 'Should':",
            "sentenceWithBlank": "___ you require any further assistance, please do not hesitate to contact us.",
            "options": [
                        "Should",
                        "If should",
                        "Were",
                        "Had"
            ],
            "correctAnswer": "Should",
            "explanationEn": "First conditional inversion: Should + subject + bare infinitive (replaces 'If you should require').",
            "explanationUz": "Birinchi shart inversiyasi: 'Should you require...' ('If you require...' oʻrnida rasmiy shakl).",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u7_2",
            "topicId": "l3_u7_t1",
            "type": "fill_blank",
            "prompt": "Invert Second Conditional with 'Were':",
            "sentenceWithBlank": "___ I to accept this job offer, I would have to relocate to Tokyo.",
            "options": [
                        "Were",
                        "Should",
                        "Had",
                        "Was"
            ],
            "correctAnswer": "Were",
            "explanationEn": "Second conditional inversion: Were + subject + to + infinitive.",
            "explanationUz": "Ikkinchi shart inversiyasi: Were + ega + to + feʼl (Were I to accept).",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u7_3",
            "topicId": "l3_u7_t1",
            "type": "fill_blank",
            "prompt": "Invert Third Conditional with 'Had':",
            "sentenceWithBlank": "___ we known about the cancellation, we would not have traveled.",
            "options": [
                        "Had",
                        "Were",
                        "Should",
                        "If had"
            ],
            "correctAnswer": "Had",
            "explanationEn": "Third conditional inversion: Had + subject + V3 (replaces 'If we had known').",
            "explanationUz": "Uchinchi shart inversiyasi: Had + ega + V3 (Had we known).",
            "difficulty": "hard"
}
        ],
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
          },
          {
            "id": "p_l3_u7_3",
            "topicId": "l3_u7_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence demonstrates correct inverted conditional grammar?",
            "options": [
                        "Should anyone call, tell them I will return after lunch.",
                        "Should anyone calls, tell them I will return after lunch.",
                        "If should anyone call, tell them I will return after lunch.",
                        "Should to anyone call, tell them I will return after lunch."
            ],
            "correctAnswer": "Should anyone call, tell them I will return after lunch.",
            "explanationEn": "Inversion with 'Should' takes bare infinitive 'call' without '-s' or 'to'.",
            "explanationUz": "'Should' bilan inversiyada feʼl qoʻshimchasiz 'call' boʻladi.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u7_4",
            "topicId": "l3_u7_t1",
            "type": "fill_blank",
            "prompt": "Complete the negative inverted conditional:",
            "sentenceWithBlank": "Had it ___ for your timely warning, we would have suffered severe losses.",
            "options": [
                        "not been",
                        "been not",
                        "not were",
                        "had not"
            ],
            "correctAnswer": "not been",
            "explanationEn": "Negative inversion: Had it not been for... (means 'If it had not been for...').",
            "explanationUz": "Inkor inversiya: 'Had it not been for...' (sizning ogohlantirishingiz boʻlmaganida).",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u7_5",
            "topicId": "l3_u7_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English using conditional inversion:",
            "sentenceWithBlank": "Agar savollaringiz boʻlsa, bemalol soʻrang.",
            "options": [
                        "Should you have any questions, feel free to ask.",
                        "Were you have questions, feel free to ask.",
                        "Had you questions, feel free to ask.",
                        "Should you to have questions, feel free to ask."
            ],
            "correctAnswer": "Should you have any questions, feel free to ask.",
            "explanationEn": "'Should you have any questions, feel free to ask.'",
            "explanationUz": "Rasmiy shart inversiyasi: 'Should you have any questions...'",
            "difficulty": "hard"
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
          },
          {
            "id": "t_l3_u7_2",
            "topicId": "l3_u7_t1",
            "type": "multiple_choice",
            "prompt": "Were the government to raise corporate taxes, many firms ___ relocate overseas.",
            "options": [
                        "would",
                        "will",
                        "did",
                        "had"
            ],
            "correctAnswer": "would",
            "explanationEn": "Second conditional inversion ('Were the government to raise...') takes 'would' in the main clause.",
            "explanationUz": "Ikkinchi shart inversiyasida asosiy gap 'would' bilan keladi.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u7_3",
            "topicId": "l3_u7_t1",
            "type": "multiple_choice",
            "prompt": "Had the firefighter not acted promptly, the whole building ___ down.",
            "options": [
                        "would have burned",
                        "would burn",
                        "burned",
                        "had burned"
            ],
            "correctAnswer": "would have burned",
            "explanationEn": "Inverted Third Conditional takes 'would have + V3'.",
            "explanationUz": "Uchinchi shart inversiyasi 'would have + V3' bilan tugaydi.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u7_4",
            "topicId": "l3_u7_t1",
            "type": "multiple_choice",
            "prompt": "___ you change your mind, please let us know immediately.",
            "options": [
                        "Should",
                        "Were",
                        "Had",
                        "Unless"
            ],
            "correctAnswer": "Should",
            "explanationEn": "Should + you + change (First conditional inversion).",
            "explanationUz": "Should + you + change (inversiya).",
            "difficulty": "medium"
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
        guidedQuestions: [
          {
            "id": "g_l3_u8_1",
            "topicId": "l3_u8_t1",
            "type": "fill_blank",
            "prompt": "Complete with a Present Participle clause for simultaneous actions:",
            "sentenceWithBlank": "___ (feel) exhausted, she decided to take an afternoon nap.",
            "options": [
                        "Feeling",
                        "Felt",
                        "Having felt",
                        "To feel"
            ],
            "correctAnswer": "Feeling",
            "explanationEn": "Present participle (Feeling) replaces 'Because she felt exhausted'.",
            "explanationUz": "Present Participle (Feeling) 'Chunki u charchagan edi' ergash gapining oʻrnida keladi.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u8_2",
            "topicId": "l3_u8_t1",
            "type": "fill_blank",
            "prompt": "Complete with a Perfect Participle clause for an action completed before the main verb:",
            "sentenceWithBlank": "___ (finish) all his tasks, he left the office early.",
            "options": [
                        "Having finished",
                        "Finishing",
                        "Finished",
                        "To have finished"
            ],
            "correctAnswer": "Having finished",
            "explanationEn": "Perfect participle (Having finished) shows that task completion preceded leaving.",
            "explanationUz": "Perfect Participle (Having finished) ish tugatilgandan keyin ketganini koʻrsatadi.",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u8_3",
            "topicId": "l3_u8_t1",
            "type": "multiple_choice",
            "prompt": "What is a 'dangling participle' error?",
            "options": [
                        "When the subject of the participle clause does not match the subject of the main clause.",
                        "When a participle clause is longer than ten words.",
                        "When participles are used in passive voice.",
                        "When a comma is missing before a participle."
            ],
            "correctAnswer": "When the subject of the participle clause does not match the subject of the main clause.",
            "explanationEn": "Participle clauses must share the identical logical subject with the main clause.",
            "explanationUz": "Ravishdosh birikmaning mantiqiy egasi asosiy gapning egasi bilan bir xil boʻlishi shart.",
            "difficulty": "hard"
}
        ],
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
          },
          {
            "id": "p_l3_u8_3",
            "topicId": "l3_u8_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence has a dangling participle mistake?",
            "options": [
                        "Walking through the forest, a snake bit John.",
                        "Walking through the forest, John saw a snake.",
                        "Having finished the test, Maria went home.",
                        "Written in haste, the letter was full of mistakes."
            ],
            "correctAnswer": "Walking through the forest, a snake bit John.",
            "explanationEn": "In 'Walking through the forest, a snake bit John', it absurdly implies the snake was walking.",
            "explanationUz": "Bu jumlada ilon oʻrmonda sayr qilib yurgandek maʼno chiqib qoladi (dangling participle).",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u8_4",
            "topicId": "l3_u8_t1",
            "type": "fill_blank",
            "prompt": "Complete with a Passive Participle clause:",
            "sentenceWithBlank": "___ (shock) by the sudden announcement, nobody said a word.",
            "options": [
                        "Shocked",
                        "Shocking",
                        "Having shocked",
                        "To shock"
            ],
            "correctAnswer": "Shocked",
            "explanationEn": "Past participle (Shocked) expresses the passive feeling: Being shocked by...",
            "explanationUz": "Oʻtgan zamon sifatdoshi majhul maʼnoda: Shocked (hayratda qolgan holda).",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u8_5",
            "topicId": "l3_u8_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English using a participle clause:",
            "sentenceWithBlank": "Uyga yetib kelib, u chiroqni yoqdi.",
            "options": [
                        "Arriving home, she turned on the light.",
                        "Arrived home, she turned on the light.",
                        "Having been arrived home, she turned on the light.",
                        "She arrived home, turned on the light."
            ],
            "correctAnswer": "Arriving home, she turned on the light.",
            "explanationEn": "'Arriving home, she turned on the light.'",
            "explanationUz": "'Arriving home, she turned on the light.'",
            "difficulty": "medium"
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
          },
          {
            "id": "t_l3_u8_2",
            "topicId": "l3_u8_t1",
            "type": "multiple_choice",
            "prompt": "___ no money left, we had to walk all the way home.",
            "options": [
                        "Having",
                        "Had",
                        "Have",
                        "With have"
            ],
            "correctAnswer": "Having",
            "explanationEn": "'Having no money left' (= Because we had no money left).",
            "explanationUz": "'Having no money left' (pulimiz qolmagani uchun).",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u8_3",
            "topicId": "l3_u8_t1",
            "type": "multiple_choice",
            "prompt": "___ several times before, he navigated the narrow trails effortlessly.",
            "options": [
                        "Having visited the area",
                        "Visiting the area",
                        "Visited the area",
                        "To visit the area"
            ],
            "correctAnswer": "Having visited the area",
            "explanationEn": "Perfect participle indicates previous visits occurred prior to his navigating: Having visited.",
            "explanationUz": "Ilgari bir necha bor borganligi tufayli: Having visited.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u8_4",
            "topicId": "l3_u8_t1",
            "type": "multiple_choice",
            "prompt": "___ in 1912, the Titanic sank on its maiden voyage.",
            "options": [
                        "Built",
                        "Building",
                        "Having built",
                        "To build"
            ],
            "correctAnswer": "Built",
            "explanationEn": "Passive past participle: Built in 1912 (= Which was built in 1912).",
            "explanationUz": "Majhul sifatdosh: Built in 1912 (1912-yilda qurilgan).",
            "difficulty": "medium"
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
        guidedQuestions: [
          {
            "id": "g_l3_u9_1",
            "topicId": "l3_u9_t1",
            "type": "fill_blank",
            "prompt": "Complete with Present Subjunctive after 'demand':",
            "sentenceWithBlank": "The inspector demanded that the factory ___ (close) immediately.",
            "options": [
                        "be closed",
                        "is closed",
                        "was closed",
                        "closes"
            ],
            "correctAnswer": "be closed",
            "explanationEn": "Present subjunctive uses the bare base form (be), regardless of person or tense.",
            "explanationUz": "Subjunctive maylida barcha shaxs va zamonlar uchun feʼlning asosi (be) oʻzgarishsiz ishlatiladi.",
            "difficulty": "hard"
},
          {
            "id": "g_l3_u9_2",
            "topicId": "l3_u9_t1",
            "type": "multiple_choice",
            "prompt": "Which verbs commonly trigger the Present Subjunctive in 'that'-clauses?",
            "options": [
                        "demand, insist, suggest, recommend, require",
                        "hope, expect, promise, agree",
                        "see, hear, notice, watch",
                        "think, believe, suppose, guess"
            ],
            "correctAnswer": "demand, insist, suggest, recommend, require",
            "explanationEn": "Verbs of mandate and recommendation mandate the subjunctive in formal English.",
            "explanationUz": "Talab, tavsiya va taklif bildiruvchi feʼllar Subjunctive maylini talab qiladi.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u9_3",
            "topicId": "l3_u9_t1",
            "type": "fill_blank",
            "prompt": "Complete the third-person subjunctive:",
            "sentenceWithBlank": "It is essential that every student ___ (attend) the safety briefing.",
            "options": [
                        "attend",
                        "attends",
                        "attended",
                        "is attending"
            ],
            "correctAnswer": "attend",
            "explanationEn": "In the subjunctive, the third-person singular does NOT take an '-s': 'attend', not 'attends'.",
            "explanationUz": "Subjunctive maylida 3-shaxs birlikda -s qoʻshilmaydi: attend.",
            "difficulty": "hard"
}
        ],
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
          },
          {
            "id": "p_l3_u9_3",
            "topicId": "l3_u9_t1",
            "type": "multiple_choice",
            "prompt": "The doctor recommended that he ___ smoking immediately.",
            "options": [
                        "quit",
                        "quits",
                        "quitted",
                        "quitting"
            ],
            "correctAnswer": "quit",
            "explanationEn": "Subjunctive uses bare base form: quit (not 'quits').",
            "explanationUz": "Subjunctive da feʼl boshlangʻich shaklda qoladi: quit.",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u9_4",
            "topicId": "l3_u9_t1",
            "type": "fill_blank",
            "prompt": "Complete the negative subjunctive:",
            "sentenceWithBlank": "The judge ordered that the suspect ___ (not / leave) the jurisdiction.",
            "options": [
                        "not leave",
                        "doesn't leave",
                        "didn't leave",
                        "not to leave"
            ],
            "correctAnswer": "not leave",
            "explanationEn": "Negative subjunctive simply places 'not' before the bare infinitive: 'not leave'.",
            "explanationUz": "Inkor subjunctive da feʼl oldidan faqat 'not' qoʻyiladi: not leave.",
            "difficulty": "hard"
},
          {
            "id": "p_l3_u9_5",
            "topicId": "l3_u9_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into formal English using subjunctive:",
            "sentenceWithBlank": "Uchrashuvga kechikmasligingiz juda muhim.",
            "options": [
                        "It is vital that you not be late for the meeting.",
                        "It is vital that you are not late for the meeting.",
                        "It is vital that you won't be late for the meeting.",
                        "It is vital that you don't be late for the meeting."
            ],
            "correctAnswer": "It is vital that you not be late for the meeting.",
            "explanationEn": "Formal subjunctive: 'It is vital that you not be late...'",
            "explanationUz": "Rasmiy Subjunctive: 'It is vital that you not be late...'",
            "difficulty": "hard"
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
          },
          {
            "id": "t_l3_u9_2",
            "topicId": "l3_u9_t1",
            "type": "multiple_choice",
            "prompt": "It is imperative that the government ___ prompt measures.",
            "options": [
                        "take",
                        "takes",
                        "took",
                        "taking"
            ],
            "correctAnswer": "take",
            "explanationEn": "'It is imperative that...' takes subjunctive base verb: take.",
            "explanationUz": "'It is imperative that...' dan keyin subjunctive: take.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u9_3",
            "topicId": "l3_u9_t1",
            "type": "multiple_choice",
            "prompt": "She insisted that he ___ invited to the ceremony.",
            "options": [
                        "be",
                        "is",
                        "was",
                        "were"
            ],
            "correctAnswer": "be",
            "explanationEn": "Passive subjunctive: insisted that he BE invited.",
            "explanationUz": "Majhul subjunctive: insisted that he be invited.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u9_4",
            "topicId": "l3_u9_t1",
            "type": "multiple_choice",
            "prompt": "British English often uses which modal auxiliary as an alternative to the subjunctive?",
            "sentenceWithBlank": "The manager suggested that we ___ review the budget.",
            "options": [
                        "should",
                        "would",
                        "could",
                        "might"
            ],
            "correctAnswer": "should",
            "explanationEn": "In British English, 'should + base verb' is a common alternative to the bare subjunctive.",
            "explanationUz": "Britaniya inglizchasida 'should + feʼl' subjunctive oʻrnida erkin ishlatiladi.",
            "difficulty": "medium"
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
        guidedQuestions: [
          {
            "id": "g_l3_u11_1",
            "topicId": "l3_u11_t1",
            "type": "fill_blank",
            "prompt": "Complete the It-cleft sentence emphasizing the person:",
            "sentenceWithBlank": "___ was John who solved the complex mathematical riddle.",
            "options": [
                        "It",
                        "That",
                        "What",
                        "There"
            ],
            "correctAnswer": "It",
            "explanationEn": "It-cleft formula: It + is/was + emphasized element + that/who.",
            "explanationUz": "It-cleft formulasi: It + was + urgʻu berilgan shaxs + who/that.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u11_2",
            "topicId": "l3_u11_t1",
            "type": "fill_blank",
            "prompt": "Complete the Wh-cleft (pseudo-cleft) sentence:",
            "sentenceWithBlank": "___ we urgently need is a comprehensive long-term strategy.",
            "options": [
                        "What",
                        "That",
                        "It",
                        "Which"
            ],
            "correctAnswer": "What",
            "explanationEn": "Wh-cleft formula: What + clause + is/was + complement.",
            "explanationUz": "Wh-cleft formulasi: What + ergash gap + is/was + toʻldiruvchi.",
            "difficulty": "medium"
},
          {
            "id": "g_l3_u11_3",
            "topicId": "l3_u11_t1",
            "type": "multiple_choice",
            "prompt": "What is the primary stylistic function of a cleft sentence?",
            "options": [
                        "To highlight and emphasize a specific part of the sentence (focus).",
                        "To convert direct speech into reported speech.",
                        "To express uncertainty about the future.",
                        "To ask indirect questions politely."
            ],
            "correctAnswer": "To highlight and emphasize a specific part of the sentence (focus).",
            "explanationEn": "Cleft sentences split a single clause into two parts to focus spotlight on one component.",
            "explanationUz": "Ajratuvchi gaplar (cleft sentences) maʼlum bir boʻlakka kuchli urgʻu berish uchun xizmat qiladi.",
            "difficulty": "easy"
}
        ],
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
          },
          {
            "id": "p_l3_u11_3",
            "topicId": "l3_u11_t1",
            "type": "multiple_choice",
            "prompt": "Transform 'I love her honesty' into an It-cleft:",
            "options": [
                        "It is her honesty that I love.",
                        "What I love is that her honesty.",
                        "Her honesty it is that I love.",
                        "It is me that loves her honesty."
            ],
            "correctAnswer": "It is her honesty that I love.",
            "explanationEn": "It + is + her honesty + that I love.",
            "explanationUz": "It is her honesty that I love (Men yaxshi koʻradigan narsa aynan uning halolligidir).",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u11_4",
            "topicId": "l3_u11_t1",
            "type": "fill_blank",
            "prompt": "Complete the action cleft sentence:",
            "sentenceWithBlank": "All he did ___ apologize and leave the room.",
            "options": [
                        "was",
                        "is",
                        "were",
                        "had"
            ],
            "correctAnswer": "was",
            "explanationEn": "'All he did was + bare infinitive (apologize).'",
            "explanationUz": "'All he did was...' (U faqatgina uzr soʻradi xolos).",
            "difficulty": "medium"
},
          {
            "id": "p_l3_u11_5",
            "topicId": "l3_u11_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English using an It-cleft sentence:",
            "sentenceWithBlank": "Aynan kecha men bu xabarni eshitdim.",
            "options": [
                        "It was yesterday that I heard this news.",
                        "What yesterday I heard this news.",
                        "It is yesterday I heard news.",
                        "That was yesterday that I heard news."
            ],
            "correctAnswer": "It was yesterday that I heard this news.",
            "explanationEn": "It was yesterday that I heard this news.",
            "explanationUz": "Aynan vaqtga urgʻu berish: It was yesterday that I heard this news.",
            "difficulty": "medium"
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
          },
          {
            "id": "t_l3_u11_2",
            "topicId": "l3_u11_t1",
            "type": "multiple_choice",
            "prompt": "___ annoys me most is his total lack of punctuality.",
            "options": [
                        "What",
                        "It",
                        "Which",
                        "That"
            ],
            "correctAnswer": "What",
            "explanationEn": "Pseudo-cleft starting with 'What': What annoys me most is...",
            "explanationUz": "Meni eng gʻazablantiradigan narsa: What annoys me most is...",
            "difficulty": "medium"
},
          {
            "id": "t_l3_u11_3",
            "topicId": "l3_u11_t1",
            "type": "multiple_choice",
            "prompt": "It was in London ___ they first met each other.",
            "options": [
                        "that",
                        "which",
                        "when",
                        "what"
            ],
            "correctAnswer": "that",
            "explanationEn": "In It-clefts emphasizing prepositional phrases (in London), use 'that'.",
            "explanationUz": "It-cleft da oʻrin-joy birikmasi urgʻulanganda 'that' ishlatiladi.",
            "difficulty": "hard"
},
          {
            "id": "t_l3_u11_4",
            "topicId": "l3_u11_t1",
            "type": "multiple_choice",
            "prompt": "All I want for my birthday ___ some peace and quiet.",
            "options": [
                        "is",
                        "are",
                        "be",
                        "was"
            ],
            "correctAnswer": "is",
            "explanationEn": "'All I want... is' takes singular verb 'is' with uncountable abstract complement.",
            "explanationUz": "'All I want is...' birlik feʼli 'is' bilan keladi.",
            "difficulty": "medium"
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
          {
            "id": "exam_l3_6",
            "topicId": "l3_u12_t1",
            "type": "multiple_choice",
            "prompt": "Had I known about your arrival, I ___ you at the airport.",
            "options": [
                        "would have met",
                        "would meet",
                        "had met",
                        "will meet"
            ],
            "correctAnswer": "would have met",
            "explanationEn": "Inverted Third Conditional: Had I known -> would have met.",
            "explanationUz": "Inversiyali uchinchi shart: would have met.",
            "difficulty": "hard"
},
          {
            "id": "exam_l3_7",
            "topicId": "l3_u12_t1",
            "type": "multiple_choice",
            "prompt": "Seldom ___ such an exhilarating performance.",
            "options": [
                        "have we witnessed",
                        "we have witnessed",
                        "did we witnessed",
                        "we witnessed"
            ],
            "correctAnswer": "have we witnessed",
            "explanationEn": "Negative inversion: Seldom have we witnessed.",
            "explanationUz": "Inversiya: Seldom have we witnessed.",
            "difficulty": "hard"
},
          {
            "id": "exam_l3_8",
            "topicId": "l3_u12_t1",
            "type": "multiple_choice",
            "prompt": "The committee recommended that the budget ___ approved without delay.",
            "options": [
                        "be",
                        "is",
                        "was",
                        "to be"
            ],
            "correctAnswer": "be",
            "explanationEn": "Subjunctive base verb after 'recommended that': be.",
            "explanationUz": "Subjunctive feʼl asosi: be.",
            "difficulty": "hard"
},
          {
            "id": "exam_l3_9",
            "topicId": "l3_u12_t1",
            "type": "multiple_choice",
            "prompt": "___ exhausted by the journey, they collapsed into bed immediately.",
            "options": [
                        "Feeling",
                        "Felt",
                        "Having feeling",
                        "To feel"
            ],
            "correctAnswer": "Feeling",
            "explanationEn": "Present participle clause: Feeling exhausted.",
            "explanationUz": "Sifatdosh birikmasi: Feeling exhausted.",
            "difficulty": "medium"
},
          {
            "id": "exam_l3_10",
            "topicId": "l3_u12_t1",
            "type": "multiple_choice",
            "prompt": "By the end of next month, we ___ the research paper.",
            "options": [
                        "will have submitted",
                        "will be submitting",
                        "will submit",
                        "have submitted"
            ],
            "correctAnswer": "will have submitted",
            "explanationEn": "Future deadline milestone: will have submitted.",
            "explanationUz": "Kelasi muddatga qadar bajariladigan harakat: will have submitted.",
            "difficulty": "medium"
}
        ],
        flashcards: [],
      },
    ],
  },
];
