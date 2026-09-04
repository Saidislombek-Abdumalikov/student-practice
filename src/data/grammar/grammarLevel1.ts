import { GrammarUnitDefinition } from '../../types';

export const GRAMMAR_LEVEL_1_UNITS: GrammarUnitDefinition[] = [
  // UNIT 1: Pronouns & Basic Sentence Structure
  {
    id: 'l1_u1',
    unitNumber: 1,
    levelId: 'level_1',
    title: 'Unit 1: Pronouns & Sentence Structure',
    titleUz: '1-Boʻlim: Olmoshlar va Gap Tuzilishi',
    description: 'Master subject pronouns, object pronouns, possessives, and demonstratives.',
    topics: [
      {
        id: 'l1_u1_t1',
        unitId: 'l1_u1',
        levelId: 'level_1',
        title: 'Subject & Object Pronouns',
        titleUz: 'Kishilik Olmoshlari (Bosh va Toʻldiruvchi)',
        slug: 'subject-object-pronouns',
        description: 'Learn when to use I vs Me, He vs Him, She vs Her, We vs Us, and They vs Them.',
        difficulty: 'easy',
        estimatedMinutes: 8,
        prerequisites: [],
        lesson: {
          id: 'les_l1_u1_t1',
          topicId: 'l1_u1_t1',
          whatIsItEn: 'Subject pronouns do the action (before the verb). Object pronouns receive the action (after the verb or preposition).',
          whatIsItUz: 'Subject pronouns harakatni bajaradi (feʼldan oldin keladi). Object pronouns esa harakatni qabul qiladi (feʼl yoki predlogdan keyin keladi).',
          formula: 'Subject Pronoun + Verb + Object Pronoun',
          positiveStructure: {
            rule: 'Subject: I, you, he, she, it, we, they | Object: me, you, him, her, it, us, them',
            example: 'She called him yesterday.',
            exampleUz: 'U (qiz) kecha unga (oʻgʻil bolaga) qoʻngʻiroq qildi.',
          },
          negativeStructure: {
            rule: 'Place object pronoun directly after the negative verb or preposition.',
            example: 'I did not see them at the library.',
            exampleUz: 'Men ularni kutubxonada koʻrmadim.',
          },
          questionStructure: {
            rule: 'Did + Subject + Verb + Object Pronoun?',
            example: 'Can you help us with this task?',
            exampleUz: 'Bu vazifada bizga yordam bera olasizmi?',
          },
          shortAnswers: {
            positive: 'Yes, she loves him.',
            negative: 'No, they did not invite us.',
          },
          examples: [
            { en: 'He gave me a wonderful English book.', uz: 'U menga ajoyib ingliz tili kitobini berdi.', highlight: 'He ... me' },
            { en: 'We saw her at the conference.', uz: 'Biz uni konferensiyada koʻrdik.', highlight: 'We ... her' },
            { en: 'Listen to them carefully.', uz: 'Ularni diqqat bilan tinglang.', highlight: 'them' },
          ],
          signalWords: ['to me', 'for him', 'with us', 'after them'],
          commonMistakes: [
            {
              incorrect: 'Me and my friend are learning English.',
              correct: 'My friend and I are learning English.',
              explanationUz: 'Gapning egasi oʻrnida me emas, balki I ishlatiladi.',
            },
            {
              incorrect: 'Give it to he.',
              correct: 'Give it to him.',
              explanationUz: 'Predlogdan (to) keyin kishilik olmoshi toʻldiruvchi shaklda (him) boʻlishi shart.',
            },
          ],
          studyTips: [
            'Test tip: Remove the other person in a sentence to check if you need "I" or "me".',
            'Always put object pronouns after prepositions (with us, for her, to them).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u1_1',
            topicId: 'l1_u1_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct subject pronoun to complete the sentence:',
            sentenceWithBlank: '___ invited my brother to the party.',
            options: ['She', 'Her', 'Him', 'Them'],
            correctAnswer: 'She',
            explanationEn: 'The blank is the subject before the verb "invited", so subject pronoun "She" is correct.',
            explanationUz: 'Feʼldan ("invited") oldin ega keladi, shuning uchun "She" toʻgʻri.',
            difficulty: 'easy',
          },
          {
            id: 'g_l1_u1_2',
            topicId: 'l1_u1_t1',
            type: 'fill_blank',
            prompt: 'Fill in the blank with the correct object pronoun for (we):',
            sentenceWithBlank: 'Our teacher gave ___ extra grammar exercises.',
            options: ['us', 'we', 'our', 'ours'],
            correctAnswer: 'us',
            explanationEn: 'After the verb "gave", we need the object pronoun "us".',
            explanationUz: 'Feʼldan keyin obyekt olmoshi "us" (bizga) ishlatiladi.',
            difficulty: 'easy',
          },
          {
            id: 'g_l1_u1_3',
            topicId: 'l1_u1_t1',
            type: 'true_false',
            prompt: 'Is this sentence grammatically correct?',
            sentenceWithBlank: 'Please send this message to him immediately.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanationEn: '"to him" is correct because prepositions take object pronouns.',
            explanationUz: 'Toʻgʻri, "to" predlogidan keyin "him" obʼyekt shakli toʻgʻri kelgan.',
            difficulty: 'easy',
          },
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u1_1',
            topicId: 'l1_u1_t1',
            type: 'multiple_choice',
            prompt: 'Select the correct pronoun:',
            sentenceWithBlank: 'Can you call ___ when you arrive?',
            options: ['me', 'I', 'my', 'mine'],
            correctAnswer: 'me',
            explanationEn: 'After the verb "call", use the object pronoun "me".',
            explanationUz: 'Feʼldan keyin "me" (menga) toʻgʻri.',
            difficulty: 'easy',
          },
          {
            id: 'p_l1_u1_2',
            topicId: 'l1_u1_t1',
            type: 'sentence_builder',
            prompt: 'Arrange the words in the correct order:',
            scrambledWords: ['She', 'visited', 'them', 'yesterday'],
            correctAnswer: 'She visited them yesterday',
            explanationEn: 'Correct English word order: Subject (She) + Verb (visited) + Object (them) + Time (yesterday).',
            explanationUz: 'Ingliz tilida soʻz tartibi: Ega (She) + Feʼl (visited) + Toʻldiruvchi (them) + Vaqt (yesterday).',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u1_3',
            topicId: 'l1_u1_t1',
            type: 'error_correction',
            prompt: 'Find and correct the error in the sentence:',
            wrongSentence: 'My sister and me went to the library.',
            errorWord: 'me',
            correction: 'I',
            correctAnswer: 'My sister and I went to the library.',
            explanationEn: 'When part of a compound subject, use "I", not "me".',
            explanationUz: 'Ega vazifasida "me" emas, "I" ishlatiladi: My sister and I.',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u1_4',
            topicId: 'l1_u1_t1',
            type: 'translation_uz_en',
            prompt: 'Translate into English:',
            sentenceWithBlank: 'Biz ularni har kuni maktabda koʻramiz.',
            options: [
              'We see them at school every day.',
              'We see they at school every day.',
              'Us see them at school every day.',
              'They see we at school every day.',
            ],
            correctAnswer: 'We see them at school every day.',
            explanationEn: 'Subject is "We", object is "them".',
            explanationUz: 'Ega "We", toʻldiruvchi "them".',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u1_5',
            topicId: 'l1_u1_t1',
            type: 'matching',
            prompt: 'Match subject pronouns to their corresponding object pronouns:',
            matchingPairs: [
              { left: 'I', right: 'me' },
              { left: 'He', right: 'him' },
              { left: 'She', right: 'her' },
              { left: 'We', right: 'us' },
            ],
            correctAnswer: 'I:me,He:him,She:her,We:us',
            explanationEn: 'I -> me, He -> him, She -> her, We -> us.',
            explanationUz: 'Kishilik olmoshlarining bosh va toʻldiruvchi juftliklari.',
            difficulty: 'easy',
          },
        ],
        testQuestions: [
          {
            id: 't_l1_u1_1',
            topicId: 'l1_u1_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct pronouns:',
            sentenceWithBlank: '___ told ___ a very funny story.',
            options: ['He / us', 'Him / we', 'He / we', 'Him / us'],
            correctAnswer: 'He / us',
            explanationEn: '"He" is the subject before told; "us" is the object receiving the story.',
            explanationUz: '"He" ega, "us" esa toʻldiruvchi.',
            difficulty: 'medium',
          },
          {
            id: 't_l1_u1_2',
            topicId: 'l1_u1_t1',
            type: 'multiple_choice',
            prompt: 'Between you and ___, this grammar is easy!',
            sentenceWithBlank: 'Between you and ___, this grammar is easy!',
            options: ['me', 'I', 'my', 'mine'],
            correctAnswer: 'me',
            explanationEn: '"Between" is a preposition, so it requires an object pronoun (me).',
            explanationUz: '"Between" predlog boʻlgani uchun undan keyin "me" keladi.',
            difficulty: 'hard',
          },
          {
            id: 't_l1_u1_3',
            topicId: 'l1_u1_t1',
            type: 'fill_blank',
            prompt: 'Complete with the correct pronoun:',
            sentenceWithBlank: 'Where is Malika? I need to speak to ___.',
            options: ['her', 'she', 'hers', 'him'],
            correctAnswer: 'her',
            explanationEn: 'After the preposition "to", use feminine object pronoun "her".',
            explanationUz: '"to" predlogidan keyin ayol kishi uchun "her" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            id: 't_l1_u1_4',
            topicId: 'l1_u1_t1',
            type: 'true_false',
            prompt: 'Is this sentence correct: "The teacher asked they to be quiet."?',
            sentenceWithBlank: 'The teacher asked they to be quiet.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanationEn: 'Incorrect! It must be "asked them", not "asked they".',
            explanationUz: 'Notoʻgʻri! "asked" feʼlidan keyin "them" boʻlishi kerak.',
            difficulty: 'medium',
          },
          {
            id: 't_l1_u1_5',
            topicId: 'l1_u1_t1',
            type: 'sentence_builder',
            prompt: 'Form the correct question:',
            scrambledWords: ['Did', 'you', 'see', 'her', 'today?'],
            correctAnswer: 'Did you see her today?',
            explanationEn: 'Standard question order: Did + Subject (you) + Verb (see) + Object (her) + Time (today)?',
            explanationUz: 'Soʻroq gap tartibi: Did + you + see + her + today?',
            difficulty: 'medium',
          },
        ],
        flashcards: [
          {
            id: 'f_l1_u1_1',
            front: 'Subject vs Object Pronoun Rule',
            back: 'Subject pronouns come BEFORE the verb (I, you, he, she, it, we, they).\nObject pronouns come AFTER the verb or preposition (me, you, him, her, it, us, them).',
            formula: 'Subject + Verb + Object',
            example: 'She helped me yesterday.',
            uzbekNote: 'Ega feʼldan oldin, toʻldiruvchi esa feʼl yoki predlogdan keyin keladi.',
          },
          {
            id: 'f_l1_u1_2',
            front: 'Common Trap: "between you and ___"',
            back: 'Always say "between you and ME", never "between you and I", because "between" is a preposition.',
            example: 'Between you and me, this game is awesome.',
            uzbekNote: 'Between predlog boʻlgani uchun doimo "me" ishlatiladi.',
          },
        ],
      },
      {
        id: 'l1_u1_t2',
        unitId: 'l1_u1',
        levelId: 'level_1',
        title: 'Possessive Adjectives & Pronouns',
        titleUz: 'Egalik Sifatlari va Egalik Olmoshlari',
        slug: 'possessive-adjectives-pronouns',
        description: 'Distinguish between my/mine, your/yours, his, her/hers, our/ours, and their/theirs.',
        difficulty: 'easy',
        estimatedMinutes: 7,
        prerequisites: ['l1_u1_t1'],
        lesson: {
          id: 'les_l1_u1_t2',
          topicId: 'l1_u1_t2',
          whatIsItEn: 'Possessive adjectives (my, your, his, her, our, their) MUST be followed by a noun. Possessive pronouns (mine, yours, his, hers, ours, theirs) stand alone WITHOUT a noun.',
          whatIsItUz: 'Egalik sifatlari (my, your, his, her, our, their) orqasidan ot kelishi SHART. Egalik olmoshlari (mine, yours, his, hers, ours, theirs) esa otsiz yolgʻiz keladi.',
          formula: 'Possessive Adjective + Noun  VS  Possessive Pronoun (No noun)',
          positiveStructure: {
            rule: 'This is my bag. (Adjective) = This bag is mine. (Pronoun)',
            example: 'This is her notebook, and that is yours.',
            exampleUz: 'Bu uning daftari, anavi esa sizniki.',
          },
          negativeStructure: {
            rule: 'That is not his jacket. = That jacket is not his.',
            example: 'These keys are not ours.',
            exampleUz: 'Bu kalitlar bizniki emas.',
          },
          questionStructure: {
            rule: 'Whose + noun + is this? / Is this + possessive pronoun?',
            example: 'Is this car theirs or yours?',
            exampleUz: 'Bu mashina ularnikimi yoki siznikimi?',
          },
          examples: [
            { en: 'That is my coat, and this one is yours.', uz: 'Anavi mening paltom, bu esa sizniki.', highlight: 'my coat ... yours' },
            { en: 'Her phone is new, but mine is old.', uz: 'Uning telefoni yangi, lekin meniki eski.', highlight: 'Her phone ... mine' },
            { en: 'Their house is big, but ours is cozy.', uz: 'Ularning uyi katta, lekin bizniki shinam.', highlight: 'Their house ... ours' },
          ],
          signalWords: ['Whose ... ?', 'mine', 'yours', 'hers', 'ours', 'theirs'],
          commonMistakes: [
            {
              incorrect: 'This is mine book.',
              correct: 'This is my book. / This book is mine.',
              explanationUz: 'Otning oldida "mine" emas, "my" ishlatiladi. "Mine" dan keyin ot ishlatilmaydi.',
            },
            {
              incorrect: 'The dog wagged it\'s tail.',
              correct: 'The dog wagged its tail.',
              explanationUz: 'its = egalik (uning); it\'s = it is (qisqartma). Apostrof qoʻyilmaydi.',
            },
          ],
          studyTips: [
            'Remember: words with "-s" at the end (yours, hers, ours, theirs) usually replace the noun completely!',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u1_4',
            topicId: 'l1_u1_t2',
            type: 'multiple_choice',
            prompt: 'Complete the sentence with the correct possessive form:',
            sentenceWithBlank: 'Is this pencil ___?',
            options: ['yours', 'your', 'you', 'yours pencil'],
            correctAnswer: 'yours',
            explanationEn: 'At the end without a noun following it, use possessive pronoun "yours".',
            explanationUz: 'Gap oxirida ot boʻlmagani uchun "yours" (sizniki) ishlatiladi.',
            difficulty: 'easy',
          },
          {
            id: 'g_l1_u1_5',
            topicId: 'l1_u1_t2',
            type: 'fill_blank',
            prompt: 'Choose the correct form to fill the blank:',
            sentenceWithBlank: 'She left ___ jacket in the classroom.',
            options: ['her', 'hers', 'she', 'him'],
            correctAnswer: 'her',
            explanationEn: 'Before the noun "jacket", we must use the possessive adjective "her".',
            explanationUz: '"jacket" oti oldida egalik sifati "her" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u1_6",
            "topicId": "l1_u1_t2",
            "type": "multiple_choice",
            "prompt": "Complete with the correct possessive adjective:",
            "sentenceWithBlank": "We love ___ new English teacher.",
            "options": [
                        "our",
                        "ours",
                        "us",
                        "we"
            ],
            "correctAnswer": "our",
            "explanationEn": "Before the noun phrase 'new English teacher', use possessive adjective 'our'.",
            "explanationUz": "'new English teacher' oti oldidan 'our' (bizning) egalik sifati qoʻyiladi.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u1_6',
            topicId: 'l1_u1_t2',
            type: 'multiple_choice',
            prompt: 'Which word correctly completes the sentence?',
            sentenceWithBlank: 'My laptop is fast, but ___ is even faster.',
            options: ['theirs', 'their', 'them', 'they'],
            correctAnswer: 'theirs',
            explanationEn: '"theirs" stands alone as the subject meaning "their laptop".',
            explanationUz: '"theirs" ot oʻrnida yolgʻiz kelib "ularniki" maʼnosini bildiradi.',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u1_7',
            topicId: 'l1_u1_t2',
            type: 'error_correction',
            prompt: 'Find and fix the error:',
            wrongSentence: 'That is mine backpack on the desk.',
            errorWord: 'mine',
            correction: 'my',
            correctAnswer: 'That is my backpack on the desk.',
            explanationEn: 'Before the noun "backpack", use "my", not "mine".',
            explanationUz: '"backpack" oti oldida "my" boʻlishi shart.',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u1_8",
            "topicId": "l1_u1_t2",
            "type": "fill_blank",
            "prompt": "Choose the correct word:",
            "sentenceWithBlank": "This is my coffee and that one is ___.",
            "options": [
                        "yours",
                        "your",
                        "you",
                        "yours coffee"
            ],
            "correctAnswer": "yours",
            "explanationEn": "Use 'yours' when replacing the noun phrase 'your coffee'.",
            "explanationUz": "Gap oxirida ot takrorlanmasligi uchun 'yours' (sizniki) ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u1_9",
            "topicId": "l1_u1_t2",
            "type": "multiple_choice",
            "prompt": "Which sentence is grammatically correct?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "The cat licked its paws.",
                        "The cat licked it's paws.",
                        "The cat licked its' paws.",
                        "The cat licked paws its."
            ],
            "correctAnswer": "The cat licked its paws.",
            "explanationEn": "'its' (without apostrophe) is possessive. 'it\\'s' means 'it is'.",
            "explanationUz": "Egalik uchun apostrofsiz 'its' ishlatiladi. 'it\\'s' bu 'it is' ning qisqartmasi.",
            "difficulty": "medium"
},
          {
            "id": "p_l1_u1_10",
            "topicId": "l1_u1_t2",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Bu telefon siznikimi yoki unikimi (oʻgʻil bola)?",
            "options": [
                        "Is this phone yours or his?",
                        "Is this phone your or him?",
                        "Is this phone yours or he?",
                        "Is this phone you or his?"
            ],
            "correctAnswer": "Is this phone yours or his?",
            "explanationEn": "Both 'yours' and 'his' are possessive pronouns standing without nouns.",
            "explanationUz": "Ikkala olmosh ham otsiz mustaqil kelgani uchun 'yours' va 'his' qoʻllanadi.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u1_6',
            topicId: 'l1_u1_t2',
            type: 'multiple_choice',
            prompt: 'Whose keys are these? — They are ___.',
            options: ['mine', 'my', 'me', 'I'],
            correctAnswer: 'mine',
            explanationEn: '"mine" stands alone to answer "whose" (they are mine).',
            explanationUz: 'Savolga javoban "ular meniki" deb aytish uchun "mine" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            id: 't_l1_u1_7',
            topicId: 'l1_u1_t2',
            type: 'true_false',
            prompt: 'Is this sentence correct: "The cat licked it\'s paw."?',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanationEn: 'False! The possessive form is "its" without an apostrophe.',
            explanationUz: 'Notoʻgʻri! Egalik olmoshi apostrofsiz "its" boʻladi. it\'s = it is.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u1_8",
            "topicId": "l1_u1_t2",
            "type": "multiple_choice",
            "prompt": "Their house is large, but ___ has a swimming pool.",
            "options": [
                        "ours",
                        "our",
                        "we",
                        "us"
            ],
            "correctAnswer": "ours",
            "explanationEn": "'ours' functions as the subject pronoun meaning 'our house'.",
            "explanationUz": "'ours' bu yerda ega vazifasida 'bizning uyimiz' maʼnosini bildiradi.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u1_9",
            "topicId": "l1_u1_t2",
            "type": "fill_blank",
            "prompt": "Alex forgot ___ keys at home this morning.",
            "options": [
                        "his",
                        "him",
                        "he",
                        "its"
            ],
            "correctAnswer": "his",
            "explanationEn": "Alex is male, so his possessive adjective before 'keys' is 'his'.",
            "explanationUz": "Alex oʻgʻil bola, 'keys' oldida egalik sifati 'his' boʻladi.",
            "difficulty": "easy"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u1_3',
            front: 'My vs Mine / Her vs Hers',
            back: 'My / Your / Her / Our / Their + NOUN (e.g. my book)\nMine / Yours / Hers / Ours / Theirs (NO NOUN, stands alone)',
            example: 'This is my pen. That pen is mine.',
            uzbekNote: 'My + ot, Mine esa otsiz yolgʻiz ishlatiladi.',
          },
        ],
      },
    ],
  },

  // UNIT 2: Articles & Noun Forms
  {
    id: 'l1_u2',
    unitNumber: 2,
    levelId: 'level_1',
    title: 'Unit 2: Articles & Nouns',
    titleUz: '2-Boʻlim: Artikl va Otlar',
    description: 'Master a, an, the, plural nouns, and countable vs uncountable words.',
    topics: [
      {
        id: 'l1_u2_t1',
        unitId: 'l1_u2',
        levelId: 'level_1',
        title: 'Indefinite & Definite Articles (A, An, The)',
        titleUz: 'Noaniq va Aniq Artikllar (A, An, The)',
        slug: 'articles-a-an-the',
        description: 'Understand when to use a/an (singular countable, first mention) and the (specific, unique, or known).',
        difficulty: 'easy',
        estimatedMinutes: 8,
        prerequisites: ['l1_u1_t1'],
        lesson: {
          id: 'les_l1_u2_t1',
          topicId: 'l1_u2_t1',
          whatIsItEn: 'Use A before consonant sounds (a book, a university). Use AN before vowel sounds (an apple, an hour). Use THE when both speaker and listener know which specific thing is meant.',
          whatIsItUz: 'Undosh tovushdan boshlansa "A" (a car), unli tovushdan boshlansa "AN" (an orange, an hour). Tinglovchi va soʻzlovchiga aniq maʼlum narsalar uchun "THE" ishlatiladi.',
          formula: 'A/AN + Singular Countable Noun  |  THE + Specific Noun',
          positiveStructure: {
            rule: 'First mention: a/an | Second mention: the',
            example: 'I bought a laptop yesterday. The laptop is amazing.',
            exampleUz: 'Men kecha noutbuk sotib oldim. Noutbuk ajoyib ekan.',
          },
          negativeStructure: {
            rule: 'No article with plural/uncountable nouns when speaking in general.',
            example: 'Children love sweets. (Not "The children love the sweets")',
            exampleUz: 'Bolalar shirinliklarni yaxshi koʻrishadi (Umumiy maʼnoda artiklsiz).',
          },
          questionStructure: {
            rule: 'Is there a ... ? / Did you see the ... ?',
            example: 'Can you turn off the light, please?',
            exampleUz: 'Iltimos, chiroqni oʻchirib qoʻya olasizmi?',
          },
          examples: [
            { en: 'She is an honest person.', uz: 'U halol inson (unli tovush /ɒ/ sababli an).', highlight: 'an honest' },
            { en: 'He studies at a university in Tashkent.', uz: 'U Toshkentdagi universitetda oʻqiydi (/j/ undosh tovush sababli a).', highlight: 'a university' },
            { en: 'The sun rises in the east.', uz: 'Quyosh sharqdan chiqadi (yagona narsalar uchun the).', highlight: 'The sun ... the east' },
          ],
          signalWords: ['a', 'an', 'the', 'an hour', 'a university', 'the sky'],
          commonMistakes: [
            {
              incorrect: 'He waited for a hour.',
              correct: 'He waited for an hour.',
              explanationUz: '"hour" soʻzidagi "h" oʻqilmaydi, soʻz unli tovush bilan boshlanadi, shuning uchun "an hour".',
            },
            {
              incorrect: 'She is an university student.',
              correct: 'She is a university student.',
              explanationUz: '"university" soʻzi /j/ undosh tovushi bilan boshlanadi, shuning uchun "a university".',
            },
          ],
          studyTips: [
            'Articles depend on SOUND, not letter! Sound like vowel = AN (an MP3 player, an honest man).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u2_1',
            topicId: 'l1_u2_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct article for the sentence:',
            sentenceWithBlank: 'It took us ___ hour to reach the stadium.',
            options: ['an', 'a', 'the', '— (no article)'],
            correctAnswer: 'an',
            explanationEn: '"hour" begins with a silent "h" and a vowel sound, requiring "an".',
            explanationUz: '"hour" soʻzida "h" oʻqilmaydi, unli tovush boʻlgani uchun "an" qoʻyiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u2_2",
            "topicId": "l1_u2_t1",
            "type": "fill_blank",
            "prompt": "Choose the correct article:",
            "sentenceWithBlank": "She ordered ___ cup of coffee and ___ orange juice.",
            "options": [
                        "a / an",
                        "an / a",
                        "the / the",
                        "a / a"
            ],
            "correctAnswer": "a / an",
            "explanationEn": "'cup' begins with consonant /k/ (a cup); 'orange' begins with vowel /ɒ/ (an orange).",
            "explanationUz": "'cup' undosh tovush bilan (a cup), 'orange' esa unli bilan (an orange) boshlanadi.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u2_3",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "Why do we use 'the' in 'Close the door, please'?",
            "sentenceWithBlank": "Close the door, please.",
            "options": [
                        "Because both speaker and listener know which specific door.",
                        "Because doors always take 'the'.",
                        "Because door starts with a consonant.",
                        "Because it is plural."
            ],
            "correctAnswer": "Because both speaker and listener know which specific door.",
            "explanationEn": "'the' is used when the speaker and listener understand which specific object is meant.",
            "explanationUz": "Ikkala suhbatdosh ham aynan qaysi eshik haqida gap ketayotganini aniq bilishadi.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u2_1',
            topicId: 'l1_u2_t1',
            type: 'multiple_choice',
            prompt: 'Select the correct option:',
            sentenceWithBlank: 'Look at ___ moon tonight! It is so bright.',
            options: ['the', 'a', 'an', '—'],
            correctAnswer: 'the',
            explanationEn: 'We use "the" for unique celestial bodies like the moon, the sun, and the sky.',
            explanationUz: 'Koinotdagi yagona narsalar (the moon, the sun) oldidan "the" qoʻyiladi.',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u2_2",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence uses articles correctly?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "He is an honest police officer.",
                        "He is a honest police officer.",
                        "He is the honest police officer always.",
                        "He is an police officer honest."
            ],
            "correctAnswer": "He is an honest police officer.",
            "explanationEn": "'honest' starts with a silent 'h', producing a vowel sound /ɒ/, requiring 'an'.",
            "explanationUz": "'honest' soʻzida 'h' oʻqilmaydi, unli tovush bilan boshlanganligi sababli 'an' qoʻyiladi.",
            "difficulty": "medium"
},
          {
            "id": "p_l1_u2_3",
            "topicId": "l1_u2_t1",
            "type": "fill_blank",
            "prompt": "Fill in the blanks with the correct articles:",
            "sentenceWithBlank": "I bought ___ shirt yesterday. ___ shirt is blue.",
            "options": [
                        "a / The",
                        "the / A",
                        "an / The",
                        "a / A"
            ],
            "correctAnswer": "a / The",
            "explanationEn": "First mention is indefinite (a shirt); second mention is specific (the shirt).",
            "explanationUz": "Birinchi bor tilga olinganda 'a', ikkinchi bor aniq boʻlganda 'the' qoʻyiladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u2_4",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct article for musical instruments:",
            "sentenceWithBlank": "My younger sister plays ___ guitar beautifully.",
            "options": [
                        "the",
                        "a",
                        "an",
                        "no article"
            ],
            "correctAnswer": "the",
            "explanationEn": "We use 'the' with musical instruments after 'play' (play the guitar, play the piano).",
            "explanationUz": "Musiqa asboblarini chalish haqida gapirganda 'the' ishlatiladi (play the guitar).",
            "difficulty": "medium"
},
          {
            "id": "p_l1_u2_5",
            "topicId": "l1_u2_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "U universitetda oʻqiydi.",
            "options": [
                        "She studies at a university.",
                        "She studies at an university.",
                        "She studies at university a.",
                        "She studies at an university school."
            ],
            "correctAnswer": "She studies at a university.",
            "explanationEn": "'university' starts with the consonant glide /j/, requiring 'a'.",
            "explanationUz": "'university' soʻzi /j/ undosh tovush bilan boshlangani uchun 'a' qoʻyiladi.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u2_1',
            topicId: 'l1_u2_t1',
            type: 'multiple_choice',
            prompt: 'She wants to study at ___ university in London.',
            options: ['a', 'an', 'the', 'no article'],
            correctAnswer: 'a',
            explanationEn: '"university" starts with the consonant sound /j/, so use "a".',
            explanationUz: '"university" soʻzi /j/ undosh tovush bilan boshlanadi, shuning uchun "a" toʻgʻri.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u2_2",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "Paris is ___ capital of France.",
            "options": [
                        "the",
                        "a",
                        "an",
                        "—"
            ],
            "correctAnswer": "the",
            "explanationEn": "Countries only have one unique capital city, so 'the' is required.",
            "explanationUz": "Fransiyaning poytaxti yagona boʻlgani uchun 'the capital' boʻladi.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u2_3",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "He works as ___ architect in New York.",
            "options": [
                        "an",
                        "a",
                        "the",
                        "—"
            ],
            "correctAnswer": "an",
            "explanationEn": "Jobs take 'a' or 'an'. 'architect' begins with vowel /ɑː/, requiring 'an'.",
            "explanationUz": "Kasblar oldidan 'a/an' ishlatiladi. 'architect' unli bilan boshlangani uchun 'an'.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u2_4",
            "topicId": "l1_u2_t1",
            "type": "multiple_choice",
            "prompt": "Do you prefer ___ tea or coffee in the morning?",
            "options": [
                        "— (no article)",
                        "the",
                        "a",
                        "an"
            ],
            "correctAnswer": "— (no article)",
            "explanationEn": "Uncountable nouns in general statements do not take articles.",
            "explanationUz": "Umumiy maʼnoda choy yoki kofe sanalmaydigan ot boʻlgani uchun artikl olinmaydi.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u2_1',
            front: 'A vs AN: Sound Rule',
            back: 'A + Consonant Sound (a car, a university, a European)\nAN + Vowel Sound (an apple, an hour, an MBA)',
            example: 'An honest man studies at a university.',
            uzbekNote: 'Harfga emas, TOVUSHga qaraladi: an hour, a university.',
          },
        ],
      },
    ],
  },

  // UNIT 3: Verb BE
  {
    id: 'l1_u3',
    unitNumber: 3,
    levelId: 'level_1',
    title: 'Unit 3: Verb BE & There is / are',
    titleUz: '3-Boʻlim: To BE Feʼli va There is / There are',
    description: 'Master am, is, are, affirmative, negative, questions, and existence with There is/are.',
    topics: [
      {
        id: 'l1_u3_t1',
        unitId: 'l1_u3',
        levelId: 'level_1',
        title: 'To BE: Am, Is, Are',
        titleUz: 'To BE: Am, Is, Are (Hozirgi Zamon)',
        slug: 'verb-be-am-is-are',
        description: 'Form positive, negative, and question sentences with the fundamental verb BE.',
        difficulty: 'easy',
        estimatedMinutes: 8,
        prerequisites: ['l1_u1_t1'],
        lesson: {
          id: 'les_l1_u3_t1',
          topicId: 'l1_u3_t1',
          whatIsItEn: 'The verb BE connects a subject to a state, identity, age, or location. I -> am, He/She/It -> is, We/You/They -> are.',
          whatIsItUz: 'To BE feʼli kim yoki qayerdalikni, holatni bildiradi. I -> am, He/She/It -> is, You/We/They -> are.',
          formula: 'Subject + am/is/are + Adjective / Noun / Place',
          positiveStructure: {
            rule: 'I am (I\'m) | He/She/It is (He\'s) | You/We/They are (They\'re)',
            example: 'She is a talented English student.',
            exampleUz: 'U iqtidorli ingliz tili oʻquvchisi.',
          },
          negativeStructure: {
            rule: 'Subject + am not / is not (isn\'t) / are not (aren\'t)',
            example: 'They are not at home right now.',
            exampleUz: 'Ular hozir uyda emaslar.',
          },
          questionStructure: {
            rule: 'Am/Is/Are + Subject + Rest of sentence?',
            example: 'Are you ready for the vocabulary challenge?',
            exampleUz: 'Siz lugʻat bellashuviga tayyormisiz?',
          },
          shortAnswers: {
            positive: 'Yes, I am. / Yes, she is. / Yes, they are.',
            negative: 'No, I\'m not. / No, she isn\'t. / No, they aren\'t.',
          },
          examples: [
            { en: 'I am ready to learn grammar.', uz: 'Men grammatika oʻrganishga tayyorman.', highlight: 'am ready' },
            { en: 'Tashkent is the capital of Uzbekistan.', uz: 'Toshkent Oʻzbekistonning poytaxti.', highlight: 'is the capital' },
            { en: 'Are they from Samarkand?', uz: 'Ular Samarqanddanmi?', highlight: 'Are they' },
          ],
          signalWords: ['now', 'today', 'always', 'at the moment'],
          commonMistakes: [
            {
              incorrect: 'Are you agree with me?',
              correct: 'Do you agree with me?',
              explanationUz: '"Agree" bu feʼl (to be emas), shuning uchun "Do you agree" boʻladi.',
            },
            {
              incorrect: 'Yes, I\'m. (in short answer)',
              correct: 'Yes, I am.',
              explanationUz: 'Qisqa ijobiy javoblarda qisqartma (I\'m) ishlatilmaydi, toʻliq "Yes, I am" deyiladi.',
            },
          ],
          studyTips: [
            'In positive short answers, NEVER contract: Say "Yes, she is", never "Yes, she\'s".',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u3_1',
            topicId: 'l1_u3_t1',
            type: 'multiple_choice',
            prompt: 'Complete with the correct form of BE:',
            sentenceWithBlank: 'My brother and I ___ very proud of you.',
            options: ['are', 'am', 'is', 'be'],
            correctAnswer: 'are',
            explanationEn: '"My brother and I" = "We", so the correct verb is "are".',
            explanationUz: '"My brother and I" bu "We" (biz), shuning uchun "are" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u3_2",
            "topicId": "l1_u3_t1",
            "type": "fill_blank",
            "prompt": "Complete the sentence with the correct form of TO BE:",
            "sentenceWithBlank": "They ___ at the library right now.",
            "options": [
                        "are",
                        "is",
                        "am",
                        "be"
            ],
            "correctAnswer": "are",
            "explanationEn": "'They' is plural third-person and takes 'are'.",
            "explanationUz": "'They' koʻplik olmoshi boʻlib, 'are' bilan qoʻllanadi.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u3_3",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct negative form of TO BE:",
            "sentenceWithBlank": "No, she ___ a doctor. She is a nurse.",
            "options": [
                        "isn't",
                        "aren't",
                        "am not",
                        "doesn't"
            ],
            "correctAnswer": "isn't",
            "explanationEn": "Negative of 'she is' is 'she isn't' (or 'she is not').",
            "explanationUz": "'She' uchun inkor shakli 'isn\\'t' (is not).",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u3_1',
            topicId: 'l1_u3_t1',
            type: 'sentence_builder',
            prompt: 'Build the correct question:',
            scrambledWords: ['Are', 'they', 'ready', 'for', 'class?'],
            correctAnswer: 'Are they ready for class?',
            explanationEn: 'Question order for BE: Are + Subject (they) + ready for class?',
            explanationUz: 'Soʻroq tartibi: Are + they + ready for class?',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u3_2",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "Select the correct question form:",
            "sentenceWithBlank": "___ your brother an engineer?",
            "options": [
                        "Is",
                        "Are",
                        "Am",
                        "Do"
            ],
            "correctAnswer": "Is",
            "explanationEn": "'your brother' is singular (he), requiring 'Is'.",
            "explanationUz": "'your brother' birlikda (u) boʻlgani uchun savol 'Is' bilan boshlanadi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u3_3",
            "topicId": "l1_u3_t1",
            "type": "fill_blank",
            "prompt": "Complete the short answer:",
            "sentenceWithBlank": "Are you ready for the test? — Yes, I ___.",
            "options": [
                        "am",
                        "are",
                        "is",
                        "'m ready"
            ],
            "correctAnswer": "am",
            "explanationEn": "In positive short answers, never contract: 'Yes, I am.' (not 'Yes, I\\'m').",
            "explanationUz": "Qisqa tasdiq javoblarda qisqartma qilinmaydi: 'Yes, I am.' toʻgʻri.",
            "difficulty": "medium"
},
          {
            "id": "p_l1_u3_4",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "Complete with the correct forms:",
            "sentenceWithBlank": "Tom and Jerry ___ cartoon characters, and Mickey ___ too.",
            "options": [
                        "are / is",
                        "is / is",
                        "are / are",
                        "is / are"
            ],
            "correctAnswer": "are / is",
            "explanationEn": "'Tom and Jerry' is plural (are); 'Mickey' is singular (is).",
            "explanationUz": "Tom va Jerry ikkita (are); Mickey esa bitta (is).",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u3_5",
            "topicId": "l1_u3_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Biz bugun juda charchaganmiz.",
            "options": [
                        "We are very tired today.",
                        "We is very tired today.",
                        "We am very tired today.",
                        "We tired are very today."
            ],
            "correctAnswer": "We are very tired today.",
            "explanationEn": "'We' takes 'are': 'We are very tired today.'",
            "explanationUz": "'We' bilan 'are' ishlatiladi: 'We are very tired today.'",
            "difficulty": "easy"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u3_1',
            topicId: 'l1_u3_t1',
            type: 'multiple_choice',
            prompt: 'Are you from Uzbekistan? — Yes, ___.',
            options: ['I am', 'I\'m', 'I do', 'I are'],
            correctAnswer: 'I am',
            explanationEn: 'In short positive answers, do not contract. Use full "Yes, I am".',
            explanationUz: 'Qisqa ijobiy javoblarda qisqartirilmaydi: Yes, I am.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u3_2",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "Where ___ the children right now?",
            "options": [
                        "are",
                        "is",
                        "am",
                        "do"
            ],
            "correctAnswer": "are",
            "explanationEn": "'children' is the plural of 'child', taking 'are'.",
            "explanationUz": "'children' (bolalar) koʻplik boʻlgani uchun 'are' tanlanadi.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u3_3",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "I ___ cold. Can you please close the window?",
            "options": [
                        "am",
                        "is",
                        "are",
                        "have"
            ],
            "correctAnswer": "am",
            "explanationEn": "In English feelings and physical states use TO BE: 'I am cold' (not 'I have cold').",
            "explanationUz": "Ingliz tilida sovuq qotish to be bilan aytiladi: 'I am cold'.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u3_4",
            "topicId": "l1_u3_t1",
            "type": "multiple_choice",
            "prompt": "Neither Mark nor his friends ___ here today.",
            "options": [
                        "are",
                        "is",
                        "am",
                        "be"
            ],
            "correctAnswer": "are",
            "explanationEn": "In 'neither... nor', the verb agrees with the closer subject ('his friends' -> are).",
            "explanationUz": "'neither... nor' da feʼl oʻziga yaqin turgan otga moslashadi ('his friends' -> are).",
            "difficulty": "hard"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u3_1',
            front: 'Verb BE Forms (Present)',
            back: 'I -> am\nHe / She / It -> is\nYou / We / They -> are',
            formula: 'Subject + BE + Adjective/Noun',
            example: 'We are students.',
            uzbekNote: 'I am, He/She/It is, We/You/They are.',
          },
        ],
      },
    ],
  },

  // UNIT 4: HAVE & HAVE GOT
  {
    id: 'l1_u4',
    unitNumber: 4,
    levelId: 'level_1',
    title: 'Unit 4: Have & Have Got',
    titleUz: '4-Boʻlim: Have va Have got (Egalik)',
    description: 'Learn possession in British and American English with have, has, and have got.',
    topics: [
      {
        id: 'l1_u4_t1',
        unitId: 'l1_u4',
        levelId: 'level_1',
        title: 'Have vs Have got',
        titleUz: 'Have va Have got (Bor / Mavjud)',
        slug: 'have-vs-have-got',
        description: 'Express ownership of items, family relations, and characteristics.',
        difficulty: 'easy',
        estimatedMinutes: 7,
        prerequisites: ['l1_u3_t1'],
        lesson: {
          id: 'les_l1_u4_t1',
          topicId: 'l1_u4_t1',
          whatIsItEn: '"Have" and "Have got" both express possession in the present. Have got is very common in spoken British English.',
          whatIsItUz: '"Have" va "have got" hozirgi zamonda biror narsaga egalikni bildiradi (menda bor).',
          formula: 'I/You/We/They have got | He/She/It has got',
          positiveStructure: {
            rule: 'I\'ve got a laptop. = I have a laptop. | She\'s got two cats. = She has two cats.',
            example: 'He has got an interesting question.',
            exampleUz: 'Unda qiziq bir savol bor.',
          },
          negativeStructure: {
            rule: 'haven\'t got / hasn\'t got  VS  don\'t have / doesn\'t have',
            example: 'We haven\'t got enough time today.',
            exampleUz: 'Bugun bizda yetarli vaqt yoʻq.',
          },
          questionStructure: {
            rule: 'Have you got ... ?  VS  Do you have ... ?',
            example: 'Have you got an extra pen?',
            exampleUz: 'Sizda ortiqcha ruchka bormi?',
          },
          shortAnswers: {
            positive: 'Yes, I have. / Yes, I do.',
            negative: 'No, I haven\'t. / No, I don\'t.',
          },
          examples: [
            { en: 'I have got a new dictionary.', uz: 'Menda yangi lugʻat bor.', highlight: 'have got' },
            { en: 'She hasn\'t got any siblings.', uz: 'Uning aka-uka yoki opa-singillari yoʻq.', highlight: 'hasn\'t got' },
          ],
          signalWords: ['have got', 'has got', 'haven\'t got', 'hasn\'t got'],
          commonMistakes: [
            {
              incorrect: 'She have got a car.',
              correct: 'She has got a car.',
              explanationUz: 'Uchinchi shaxs birlikda (He/She/It) "has got" ishlatiladi.',
            },
          ],
          studyTips: [
            'Do NOT use "did" with "got": Say "Did you have a car?", not "Did you have got".',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u4_1',
            topicId: 'l1_u4_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct form for (she):',
            sentenceWithBlank: 'She ___ a very beautiful pronunciation.',
            options: ['has got', 'have got', 'having', 'is got'],
            correctAnswer: 'has got',
            explanationEn: 'With "She", we use "has got".',
            explanationUz: '"She" bilan "has got" toʻgʻri keladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u4_2",
            "topicId": "l1_u4_t1",
            "type": "fill_blank",
            "prompt": "Complete with the correct form of 'have got':",
            "sentenceWithBlank": "She ___ a brand new red bicycle.",
            "options": [
                        "has got",
                        "have got",
                        "is got",
                        "having"
            ],
            "correctAnswer": "has got",
            "explanationEn": "'She' is third-person singular, so use 'has got'.",
            "explanationUz": "'She' uchinchi shaxs birlik boʻlgani uchun 'has got' ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u4_3",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct question format:",
            "sentenceWithBlank": "___ you got any brothers or sisters?",
            "options": [
                        "Have",
                        "Do",
                        "Are",
                        "Has"
            ],
            "correctAnswer": "Have",
            "explanationEn": "In British English 'have got' questions invert: 'Have you got...?'",
            "explanationUz": "'Have you got...?' soʻrogʻida 'Have' oldinga chiqadi.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u4_1',
            topicId: 'l1_u4_t1',
            type: 'multiple_choice',
            prompt: 'Complete the question:',
            sentenceWithBlank: '___ you got your passport with you?',
            options: ['Have', 'Do', 'Are', 'Has'],
            correctAnswer: 'Have',
            explanationEn: 'We ask "Have you got ... ?"',
            explanationUz: '"Have you got" soʻroq shakli toʻgʻri.',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u4_2",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence is in correct American English?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "Do you have any pets?",
                        "Have you any pets?",
                        "Do you have got pets?",
                        "Are you have any pets?"
            ],
            "correctAnswer": "Do you have any pets?",
            "explanationEn": "In standard American English, 'Do you have...?' is standard for possession questions.",
            "explanationUz": "Amerikacha ingliz tilida soʻroq 'Do you have...?' shaklida yasaladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u4_3",
            "topicId": "l1_u4_t1",
            "type": "fill_blank",
            "prompt": "Fill in the negative blank:",
            "sentenceWithBlank": "We ___ enough time to finish this today.",
            "options": [
                        "haven't got",
                        "hasn't got",
                        "not have",
                        "no have got"
            ],
            "correctAnswer": "haven't got",
            "explanationEn": "'We' takes 'haven\\'t got' in the negative.",
            "explanationUz": "'We' uchun inkor shakl 'haven\\'t got'.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u4_4",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence is INCORRECT?",
            "sentenceWithBlank": "Find the incorrect sentence:",
            "options": [
                        "I had got a bicycle when I was 7.",
                        "I had a bicycle when I was 7.",
                        "I have got a bicycle now.",
                        "I have a bicycle now."
            ],
            "correctAnswer": "I had got a bicycle when I was 7.",
            "explanationEn": "'Have got' is ONLY used in the Present. In the Past, always use 'had' alone.",
            "explanationUz": "'Have got' faqat hozirgi zamonda ishlatiladi! Oʻtgan zamonda faqat 'had' boʻladi.",
            "difficulty": "hard"
},
          {
            "id": "p_l1_u4_5",
            "topicId": "l1_u4_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Uning (qiz bola) ikkita ukasi bor.",
            "options": [
                        "She has got two younger brothers.",
                        "She have got two younger brothers.",
                        "She is got two younger brothers.",
                        "She having two younger brothers."
            ],
            "correctAnswer": "She has got two younger brothers.",
            "explanationEn": "'She has got two younger brothers' correctly expresses possession.",
            "explanationUz": "'She' bilan 'has got' ishlatiladi.",
            "difficulty": "easy"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u4_1',
            topicId: 'l1_u4_t1',
            type: 'multiple_choice',
            prompt: 'He ___ any questions for the teacher.',
            options: ['hasn\'t got', 'haven\'t got', 'not have', 'isn\'t got'],
            correctAnswer: 'hasn\'t got',
            explanationEn: 'He + hasn\'t got.',
            explanationUz: 'He uchun inkor shakl "hasn\'t got".',
            difficulty: 'easy',
          },
          {
            "id": "t_l1_u4_2",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "___ he got a spare pen I could borrow?",
            "options": [
                        "Has",
                        "Have",
                        "Does",
                        "Is"
            ],
            "correctAnswer": "Has",
            "explanationEn": "'he' requires 'Has' with 'got': 'Has he got...?'",
            "explanationUz": "'he' uchinchi shaxs boʻlgani uchun 'Has he got' boʻladi.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u4_3",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "He ___ a shower every morning at 7:00 AM.",
            "options": [
                        "has",
                        "has got",
                        "is having got",
                        "having"
            ],
            "correctAnswer": "has",
            "explanationEn": "For actions and routines (have a shower, have lunch), use 'have', NEVER 'have got'.",
            "explanationUz": "Dush qabul qilish, ovqatlanish kabi harakatlarda faqat 'have' ishlatiladi ('have got' emas).",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u4_4",
            "topicId": "l1_u4_t1",
            "type": "multiple_choice",
            "prompt": "They don't ___ any homework for tomorrow.",
            "options": [
                        "have",
                        "has",
                        "have got",
                        "having"
            ],
            "correctAnswer": "have",
            "explanationEn": "After the auxiliary 'don\\'t', the base verb 'have' is used.",
            "explanationUz": "'don\\'t' yordamchi feʼlidan keyin feʼlning asosi 'have' keladi.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u4_1',
            front: 'Have got / Has got',
            back: 'I / You / We / They have got\nHe / She / It has got',
            formula: 'Subject + have/has got + Object',
            example: 'He has got two tickets.',
            uzbekNote: 'Menda bor / Unda bor maʼnosida.',
          },
        ],
      },
    ],
  },

  // UNIT 5: Present Simple
  {
    id: 'l1_u5',
    unitNumber: 5,
    levelId: 'level_1',
    title: 'Unit 5: Present Simple Tense',
    titleUz: '5-Boʻlim: Present Simple (Hozirgi Oddiy Zamon)',
    description: 'Master routines, habits, universal facts, third-person -s/-es, don\'t/doesn\'t, and frequency adverbs.',
    topics: [
      {
        id: 'l1_u5_t1',
        unitId: 'l1_u5',
        levelId: 'level_1',
        title: 'Present Simple: Affirmative & Third-Person -s',
        titleUz: 'Present Simple: Darak Gap va -s/-es Qoʻshimchasi',
        slug: 'present-simple-affirmative',
        description: 'Understand regular habits, facts, and the spelling rules for he, she, and it.',
        difficulty: 'easy',
        estimatedMinutes: 8,
        prerequisites: ['l1_u1_t1', 'l1_u3_t1'],
        lesson: {
          id: 'les_l1_u5_t1',
          topicId: 'l1_u5_t1',
          whatIsItEn: 'Use Present Simple for daily routines, permanent situations, habits, and scientific facts.',
          whatIsItUz: 'Kundalik odatlar, takrorlanuvchi harakatlar va umumiy haqiqatlar uchun Present Simple ishlatiladi.',
          formula: 'I/You/We/They + Verb | He/She/It + Verb + s/es',
          positiveStructure: {
            rule: 'Add -s or -es to verb with He, She, It. Verbs ending in -ch, -sh, -ss, -x, -o take -es (watches, goes).',
            example: 'He works at an IT company in Tashkent.',
            exampleUz: 'U Toshkentdagi IT kompaniyasida ishlaydi.',
          },
          negativeStructure: {
            rule: 'He/She/It doesn\'t + BASE verb (the -s disappears!).',
            example: 'She doesn\'t drink coffee in the evening.',
            exampleUz: 'U kechqurun kofe ichmaydi.',
          },
          questionStructure: {
            rule: 'Do / Does + Subject + Base verb?',
            example: 'Does he study English every single day?',
            exampleUz: 'U har kuni ingliz tili oʻrganadimi?',
          },
          shortAnswers: {
            positive: 'Yes, he does. / Yes, they do.',
            negative: 'No, he doesn\'t. / No, they don\'t.',
          },
          examples: [
            { en: 'I study twenty new words every morning.', uz: 'Men har tong 20 ta yangi soʻz oʻrganaman.', highlight: 'study' },
            { en: 'My sister speaks three foreign languages.', uz: 'Mening singlim 3 ta xorijiy tilda gapiradi.', highlight: 'speaks' },
            { en: 'Water boils at 100 degrees Celsius.', uz: 'Suv 100 darajada qaynaydi (ilmiy haqiqat).', highlight: 'boils' },
          ],
          signalWords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Sundays'],
          commonMistakes: [
            {
              incorrect: 'He study English every day.',
              correct: 'He studies English every day.',
              explanationUz: 'He/She/It bilan feʼlga -s/-es qoʻshiladi. study -> studies.',
            },
            {
              incorrect: 'She doesn\'t likes tea.',
              correct: 'She doesn\'t like tea.',
              explanationUz: 'doesn\'t yordamchi feʼlidan keyin asosiy feʼlga -s qoʻshilmaydi!',
            },
          ],
          studyTips: [
            'Golden rule: In negatives and questions, does takes the "s", so the main verb stays clean!',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u5_1',
            topicId: 'l1_u5_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct verb form for Present Simple:',
            sentenceWithBlank: 'My father ___ to work by metro every morning.',
            options: ['goes', 'go', 'going', 'is go'],
            correctAnswer: 'goes',
            explanationEn: '"My father" is He (3rd person singular), so "go" takes "-es" -> "goes".',
            explanationUz: '"My father" bu uchinchi shaxs birlik (He), shuning uchun "goes".',
            difficulty: 'easy',
          },
          {
            id: 'g_l1_u5_2',
            topicId: 'l1_u5_t1',
            type: 'fill_blank',
            prompt: 'Complete with the negative auxiliary verb:',
            sentenceWithBlank: 'She ___ watch television during weekdays.',
            options: ['doesn\'t', 'don\'t', 'isn\'t', 'not'],
            correctAnswer: 'doesn\'t',
            explanationEn: 'Third person singular negative in Present Simple uses "doesn\'t".',
            explanationUz: 'Uchinchi shaxs birlik uchun inkor "doesn\'t".',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u5_3",
            "topicId": "l1_u5_t1",
            "type": "fill_blank",
            "prompt": "Complete with the third-person singular form:",
            "sentenceWithBlank": "My mother ___ delicious bread every Sunday.",
            "options": [
                        "bakes",
                        "bake",
                        "baking",
                        "is bake"
            ],
            "correctAnswer": "bakes",
            "explanationEn": "'My mother' is she, so add -s to the verb: 'bakes'.",
            "explanationUz": "'My mother' (u) uchinchi shaxs birlik boʻlgani uchun feʼlga -s qoʻshiladi: bakes.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u5_1',
            topicId: 'l1_u5_t1',
            type: 'sentence_builder',
            prompt: 'Build the correct sentence with adverbs of frequency:',
            scrambledWords: ['He', 'always', 'arrives', 'on', 'time'],
            correctAnswer: 'He always arrives on time',
            explanationEn: 'Adverbs of frequency (always) come before main verbs (arrives).',
            explanationUz: 'Chastota ravishlari (always) asosiy feʼldan oldin keladi.',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u5_2',
            topicId: 'l1_u5_t1',
            type: 'error_correction',
            prompt: 'Correct the grammatical error:',
            wrongSentence: 'My brother don\'t like spicy food.',
            errorWord: 'don\'t',
            correction: 'doesn\'t',
            correctAnswer: 'My brother doesn\'t like spicy food.',
            explanationEn: 'My brother = he, which takes "doesn\'t", not "don\'t".',
            explanationUz: 'My brother (u) bilan "doesn\'t" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            id: 'p_l1_u5_3',
            topicId: 'l1_u5_t1',
            type: 'translation_uz_en',
            prompt: 'Translate into English:',
            sentenceWithBlank: 'Siz har kuni inglizcha kitob oʻqiysizmi?',
            options: [
              'Do you read an English book every day?',
              'Are you read an English book every day?',
              'Does you read an English book every day?',
              'Did you read an English book every day?',
            ],
            correctAnswer: 'Do you read an English book every day?',
            explanationEn: 'Present Simple question with "you" starts with "Do you read...?"',
            explanationUz: 'Present Simple soʻrogʻi "Do you read...?" bilan tuziladi.',
            difficulty: 'medium',
          },
          {
            "id": "p_l1_u5_4",
            "topicId": "l1_u5_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct question form:",
            "sentenceWithBlank": "___ your father work on weekends?",
            "options": [
                        "Does",
                        "Do",
                        "Is",
                        "Are"
            ],
            "correctAnswer": "Does",
            "explanationEn": "Third-person singular questions in Present Simple use 'Does'.",
            "explanationUz": "'your father' birlikda (he) boʻlgani uchun savol 'Does' bilan yasaladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u5_5",
            "topicId": "l1_u5_t1",
            "type": "multiple_choice",
            "prompt": "He ___ to school by bus; he usually walks.",
            "options": [
                        "doesn't go",
                        "don't go",
                        "doesn't goes",
                        "isn't go"
            ],
            "correctAnswer": "doesn't go",
            "explanationEn": "Negative third-person: doesn\\'t + base form (go).",
            "explanationUz": "Inkor shaklida 'doesn\\'t' dan keyin feʼlning oʻzi (go) keladi, -s olinmaydi.",
            "difficulty": "easy"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u5_1',
            topicId: 'l1_u5_t1',
            type: 'multiple_choice',
            prompt: 'Where ___ your best friend live?',
            options: ['does', 'do', 'is', 'are'],
            correctAnswer: 'does',
            explanationEn: '"your best friend" is singular (he/she), so we use auxiliary "does".',
            explanationUz: '"your best friend" bitta kishi (he/she), shuning uchun "does" kerak.',
            difficulty: 'easy',
          },
          {
            id: 't_l1_u5_2',
            topicId: 'l1_u5_t1',
            type: 'true_false',
            prompt: 'Is this sentence correct: "She doesn\'t speaks Spanish."?',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanationEn: 'False! After "doesn\'t", the verb must be base form: "doesn\'t speak".',
            explanationUz: 'Notoʻgʻri! "doesn\'t" dan keyin feʼlga -s qoʻshilmaydi: doesn\'t speak.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u5_3",
            "topicId": "l1_u5_t1",
            "type": "multiple_choice",
            "prompt": "Water ___ at 100 degrees Celsius.",
            "options": [
                        "boils",
                        "boil",
                        "is boiling",
                        "boiled"
            ],
            "correctAnswer": "boils",
            "explanationEn": "Scientific facts and general truths always use Present Simple with third-person -s.",
            "explanationUz": "Ilmiy faktlar va tabiat qonunlari har doim Present Simple da boʻladi (boils).",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u5_4",
            "topicId": "l1_u5_t1",
            "type": "multiple_choice",
            "prompt": "What time ___ the train leave?",
            "options": [
                        "does",
                        "do",
                        "is",
                        "will"
            ],
            "correctAnswer": "does",
            "explanationEn": "Scheduled timetables use Present Simple with 'does' for singular 'the train'.",
            "explanationUz": "Jadval boʻyicha qatnovchi poyezd (the train) uchun 'does' ishlatiladi.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u5_1',
            front: 'Present Simple: He / She / It Rule',
            back: 'Positive: Verb + s/es (He plays)\nNegative: doesn\'t + base verb (He doesn\'t play)\nQuestion: Does he play?',
            formula: 'Subject + Verb(s/es)',
            example: 'She lives in Tashkent.',
            uzbekNote: 'doesn\'t va does kelganda feʼldagi -s tushib qoladi.',
          },
        ],
      },
    ],
  },

  // UNIT 6: Present Continuous
  {
    id: 'l1_u6',
    unitNumber: 6,
    levelId: 'level_1',
    title: 'Unit 6: Present Continuous & Contrast',
    titleUz: '6-Boʻlim: Present Continuous va Zamonlar Qiyosi',
    description: 'Actions happening right now, am/is/are + V-ing, and contrasting with Present Simple.',
    topics: [
      {
        id: 'l1_u6_t1',
        unitId: 'l1_u6',
        levelId: 'level_1',
        title: 'Present Continuous: Actions in Progress',
        titleUz: 'Present Continuous: Ayni Paytda Roʻy Berayotgan Harakatlar',
        slug: 'present-continuous-actions-now',
        description: 'Form am/is/are + V-ing for actions taking place at the moment of speaking.',
        difficulty: 'easy',
        estimatedMinutes: 8,
        prerequisites: ['l1_u3_t1', 'l1_u5_t1'],
        lesson: {
          id: 'les_l1_u6_t1',
          topicId: 'l1_u6_t1',
          whatIsItEn: 'Use Present Continuous for activities happening right now, temporary situations, and current changes.',
          whatIsItUz: 'Ayni nutq soʻzlanayotgan paytda sodir boʻlayotgan harakatlar yoki vaqtinchalik holatlar uchun ishlatiladi.',
          formula: 'Subject + am/is/are + Verb-ing',
          positiveStructure: {
            rule: 'I am playing | She is studying | They are practicing',
            example: 'I am practicing my English grammar right now.',
            exampleUz: 'Men ayni damda ingliz tili grammatikamni mashq qilyapman.',
          },
          negativeStructure: {
            rule: 'Subject + am not / isn\'t / aren\'t + Verb-ing',
            example: 'He isn\'t watching TV; he is reading a book.',
            exampleUz: 'U televizor koʻrayotgani yoʻq, u kitob oʻqiyapti.',
          },
          questionStructure: {
            rule: 'Am/Is/Are + Subject + Verb-ing?',
            example: 'What are you doing at the moment?',
            exampleUz: 'Ayni damda nima qilyapsiz?',
          },
          examples: [
            { en: 'Look! It is raining outside.', uz: 'Qarang! Tashqarida yomgʻir yogʻyapti.', highlight: 'is raining' },
            { en: 'Be quiet, the baby is sleeping.', uz: 'Ovozingizni chiqarmang, chaqaloq uxlayapti.', highlight: 'is sleeping' },
          ],
          signalWords: ['now', 'right now', 'at the moment', 'currently', 'Look!', 'Listen!'],
          commonMistakes: [
            {
              incorrect: 'I am understand this lesson.',
              correct: 'I understand this lesson.',
              explanationUz: '"Understand", "know", "like" kabi stative (holat) feʼllari continuous zamonda ishlatilmaydi.',
            },
          ],
          studyTips: [
            'Signal words like "Look!" or "Listen!" are dead giveaways that you need Present Continuous.',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u6_1',
            topicId: 'l1_u6_t1',
            type: 'multiple_choice',
            prompt: 'Complete with Present Continuous:',
            sentenceWithBlank: 'Listen! The birds ___ so sweetly in the garden.',
            options: ['are singing', 'sing', 'is singing', 'sings'],
            correctAnswer: 'are singing',
            explanationEn: '"The birds" is plural (they), and "Listen!" indicates action happening right now.',
            explanationUz: '"The birds" koʻplik, "Listen!" esa harakat ayni paytda boʻlayotganini bildiradi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u6_2",
            "topicId": "l1_u6_t1",
            "type": "fill_blank",
            "prompt": "Complete the sentence in Present Continuous:",
            "sentenceWithBlank": "They ___ football in the park at the moment.",
            "options": [
                        "are playing",
                        "is playing",
                        "play",
                        "playing"
            ],
            "correctAnswer": "are playing",
            "explanationEn": "'They' requires 'are' + verb-ing: 'are playing'.",
            "explanationUz": "'They' uchun 'are' + feʼl-ing ishlatiladi: 'are playing'.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u6_3",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "Which spelling of the -ing form is correct?",
            "sentenceWithBlank": "The children are ___ in the pool.",
            "options": [
                        "swimming",
                        "swiming",
                        "swimying",
                        "swim"
            ],
            "correctAnswer": "swimming",
            "explanationEn": "Short vowel + single consonant doubles the final consonant: swim -> swimming.",
            "explanationUz": "Qisqa unli va bitta undosh bilan tugagan feʼllarda oxirgi harf ikkilanadi: swim -> swimming.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u6_1',
            topicId: 'l1_u6_t1',
            type: 'multiple_choice',
            prompt: 'Contrast: Routine vs Right Now:',
            sentenceWithBlank: 'He usually walks to work, but today he ___ a taxi.',
            options: ['is taking', 'takes', 'take', 'taken'],
            correctAnswer: 'is taking',
            explanationEn: '"today" shows a temporary action contrasting with his regular routine.',
            explanationUz: '"today" odatdan tashqari vaqtinchalik harakatni ifodalaydi -> is taking.',
            difficulty: 'medium',
          },
          {
            "id": "p_l1_u6_2",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "Why is 'I am knowing the answer' incorrect?",
            "sentenceWithBlank": "I ___ the answer.",
            "options": [
                        "know",
                        "am knowing",
                        "knowing",
                        "am know"
            ],
            "correctAnswer": "know",
            "explanationEn": "'know' is a stative verb and is NOT used in continuous tenses.",
            "explanationUz": "'know' holat feʼli boʻlib, Continuous (davomli) zamonlarda ishlatilmaydi.",
            "difficulty": "medium"
},
          {
            "id": "p_l1_u6_3",
            "topicId": "l1_u6_t1",
            "type": "fill_blank",
            "prompt": "Complete the negative sentence:",
            "sentenceWithBlank": "Be quiet! The baby ___ right now.",
            "options": [
                        "is sleeping",
                        "sleeps",
                        "is sleep",
                        "slept"
            ],
            "correctAnswer": "is sleeping",
            "explanationEn": "'Be quiet!' signals an action currently happening right now.",
            "explanationUz": "'Be quiet!' hozir sodir boʻlayotgan harakat belgisi: is sleeping.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u6_4",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct question in Present Continuous:",
            "sentenceWithBlank": "___ you ___ for the bus?",
            "options": [
                        "Are / waiting",
                        "Do / waiting",
                        "Are / wait",
                        "Is / waiting"
            ],
            "correctAnswer": "Are / waiting",
            "explanationEn": "Question form: Are + subject (you) + verb-ing (waiting)?",
            "explanationUz": "Soʻroq shakli: Are you waiting?",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u6_5",
            "topicId": "l1_u6_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "U (qiz bola) hozir kitob oʻqiyapti.",
            "options": [
                        "She is reading a book now.",
                        "She reads a book now.",
                        "She is read a book now.",
                        "She reading a book now."
            ],
            "correctAnswer": "She is reading a book now.",
            "explanationEn": "'She is reading a book now' correctly expresses an action in progress.",
            "explanationUz": "Ayni paytdagi davomli harakat: 'She is reading a book now'.",
            "difficulty": "easy"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u6_1',
            topicId: 'l1_u6_t1',
            type: 'multiple_choice',
            prompt: 'Why ___ you wearing a coat inside the warm house?',
            options: ['are', 'do', 'is', 'have'],
            correctAnswer: 'are',
            explanationEn: 'Are + you + wearing (Present Continuous question).',
            explanationUz: 'Why are you wearing... ?',
            difficulty: 'easy',
          },
          {
            "id": "t_l1_u6_2",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "Look! It ___ outside.",
            "options": [
                        "is snowing",
                        "snows",
                        "snowed",
                        "is snow"
            ],
            "correctAnswer": "is snowing",
            "explanationEn": "'Look!' alerts us to an action happening right in front of us: is snowing.",
            "explanationUz": "'Look!' ayni daqiqadagi harakatga eʼtibor qaratadi: is snowing.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u6_3",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "I usually drink coffee, but today I ___ tea.",
            "options": [
                        "am drinking",
                        "drink",
                        "drank",
                        "drinks"
            ],
            "correctAnswer": "am drinking",
            "explanationEn": "Routine = Simple (drink); Temporary exception = Continuous (am drinking).",
            "explanationUz": "Doimiy odat Present Simple, lekin vaqtinchalik oʻzgarish Present Continuous boʻladi.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u6_4",
            "topicId": "l1_u6_t1",
            "type": "multiple_choice",
            "prompt": "Which of the following verbs can NEVER be continuous?",
            "options": [
                        "believe",
                        "run",
                        "eat",
                        "watch"
            ],
            "correctAnswer": "believe",
            "explanationEn": "'believe' is a stative verb expressing mental state; it cannot take -ing in continuous.",
            "explanationUz": "'believe' (ishonmoq) aqliy holat feʼli boʻlib, Continuous shaklda ishlatilmaydi.",
            "difficulty": "hard"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u6_1',
            front: 'Present Simple vs Present Continuous',
            back: 'Simple: Habits, routines, facts (I drink tea every day).\nContinuous: Happening right now (I am drinking tea right now).',
            formula: 'am/is/are + Verb-ing',
            example: 'I usually study at night, but now I am sleeping.',
            uzbekNote: 'Doimiy odat -> Simple; Ayni damda -> Continuous.',
          },
        ],
      },
    ],
  },

  // UNIT 7: Ability & Instructions (Can/Can't, Imperatives)
  {
    id: 'l1_u7',
    unitNumber: 7,
    levelId: 'level_1',
    title: 'Unit 7: Ability & Instructions',
    titleUz: '7-Boʻlim: Imkoniyat (Can/Can\'t) va Buyruqlar',
    description: 'Express physical/mental ability with can, give instructions with imperatives, and make suggestions with Let\'s.',
    topics: [
      {
        id: 'l1_u7_t1',
        unitId: 'l1_u7',
        levelId: 'level_1',
        title: 'Can & Can\'t for Ability & Permission',
        titleUz: 'Can va Can\'t: Qobiliyat va Ruxsat',
        slug: 'modal-can-cant',
        description: 'Use the modal verb can for ability, possibility, requests, and permission.',
        difficulty: 'easy',
        estimatedMinutes: 7,
        prerequisites: ['l1_u1_t1'],
        lesson: {
          id: 'les_l1_u7_t1',
          topicId: 'l1_u7_t1',
          whatIsItEn: 'Can is a modal verb that never changes (no -s, no -ed). It is followed by the bare infinitive (verb without to).',
          whatIsItUz: 'Can modal feʼli shaxsga qarab oʻzgarmaydi (-s qoʻshilmaydi). Undan keyin "to"siz feʼl keladi.',
          formula: 'Subject + can/can\'t + Base Verb',
          positiveStructure: {
            rule: 'I/You/He/She/We/They can swim.',
            example: 'She can speak three languages fluently.',
            exampleUz: 'U uchta tilda erkin gapira oladi.',
          },
          negativeStructure: {
            rule: 'cannot / can\'t (no "to")',
            example: 'I can\'t come to the practice today.',
            exampleUz: 'Men bugun mashgʻulotga kela olmayman.',
          },
          questionStructure: {
            rule: 'Can + Subject + Base Verb?',
            example: 'Can you swim across this river?',
            exampleUz: 'Siz bu daryodan suzib oʻta olasizmi?',
          },
          examples: [
            { en: 'Can I borrow your pencil, please?', uz: 'Ruxsat soʻrash: Qalamingizni olib tursam boʻladimi?', highlight: 'Can I borrow' },
          ],
          signalWords: ['can', 'can\'t', 'cannot', 'Can you ... ?'],
          commonMistakes: [
            {
              incorrect: 'He cans swim.',
              correct: 'He can swim.',
              explanationUz: 'Can modal feʼliga hech qachon -s qoʻshilmaydi!',
            },
            {
              incorrect: 'I can to speak English.',
              correct: 'I can speak English.',
              explanationUz: 'Can feʼlidan keyin "to" qoʻyilmaydi.',
            },
          ],
          studyTips: [
            'Never put "to" after can! Say "I can go", never "I can to go".',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u7_1',
            topicId: 'l1_u7_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct form:',
            sentenceWithBlank: 'He ___ play the piano very well.',
            options: ['can', 'cans', 'can to', 'is can'],
            correctAnswer: 'can',
            explanationEn: 'Modal verbs like "can" do not add -s for third person singular.',
            explanationUz: '"can" feʼliga -s qoʻshilmaydi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u7_2",
            "topicId": "l1_u7_t1",
            "type": "fill_blank",
            "prompt": "Complete the sentence with the modal verb for ability:",
            "sentenceWithBlank": "He ___ speak four different languages fluently.",
            "options": [
                        "can",
                        "cans",
                        "is can",
                        "can to"
            ],
            "correctAnswer": "can",
            "explanationEn": "Modal 'can' never takes -s or 'to': 'can speak'.",
            "explanationUz": "Modal feʼl 'can' hech qachon -s olmaydi va undan keyin 'to' kelmaydi.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u7_3",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct polite request:",
            "sentenceWithBlank": "___ you please open the window?",
            "options": [
                        "Can",
                        "Are",
                        "Do",
                        "May to"
            ],
            "correctAnswer": "Can",
            "explanationEn": "'Can you please...' is used for common informal requests.",
            "explanationUz": "'Can you please...' kundalik iltimoslarda ishlatiladi.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u7_1',
            topicId: 'l1_u7_t1',
            type: 'multiple_choice',
            prompt: 'Select the grammatical sentence:',
            sentenceWithBlank: '___',
            options: [
              'She can drive a car.',
              'She can to drive a car.',
              'She cans drive a car.',
              'She can driving a car.',
            ],
            correctAnswer: 'She can drive a car.',
            explanationEn: 'can + bare infinitive (drive).',
            explanationUz: 'can + feʼlning asosi (drive).',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u7_2",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence has correct grammar?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "She can swim very well.",
                        "She can swims very well.",
                        "She cans swim very well.",
                        "She can to swim very well."
            ],
            "correctAnswer": "She can swim very well.",
            "explanationEn": "Modal verbs are followed by bare infinitive without 'to' or '-s'.",
            "explanationUz": "Modal feʼllardan soʻng feʼl oʻzgarishsiz keladi (to va s siz).",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u7_3",
            "topicId": "l1_u7_t1",
            "type": "fill_blank",
            "prompt": "Complete with the negative of 'can':",
            "sentenceWithBlank": "I am so busy that I ___ come to your party tonight.",
            "options": [
                        "can't",
                        "don't can",
                        "am not can",
                        "can not to"
            ],
            "correctAnswer": "can't",
            "explanationEn": "Negative of can is 'can\\'t' (or 'cannot').",
            "explanationUz": "'can' ning inkori 'can\\'t' yoki 'cannot' boʻladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u7_4",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "Can penguins fly? — No, they ___.",
            "options": [
                        "can't",
                        "don't",
                        "aren't",
                        "won't"
            ],
            "correctAnswer": "can't",
            "explanationEn": "Short answer to 'Can...?': 'No, they can\\'t.'",
            "explanationUz": "'Can' bilan berilgan savolga qisqa javob: 'No, they can\\'t.'",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u7_5",
            "topicId": "l1_u7_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Siz gitara chala olasizmi?",
            "options": [
                        "Can you play the guitar?",
                        "Do you can play guitar?",
                        "Are you play guitar?",
                        "Can you to play guitar?"
            ],
            "correctAnswer": "Can you play the guitar?",
            "explanationEn": "Invert 'Can' and 'you': 'Can you play the guitar?'",
            "explanationUz": "Qobiliyat soʻrogʻi: 'Can you play the guitar?'",
            "difficulty": "easy"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u7_1',
            topicId: 'l1_u7_t1',
            type: 'fill_blank',
            prompt: 'Fill in the blank:',
            sentenceWithBlank: 'Sorry, I ___ hear you. The music is too loud.',
            options: ['can\'t', 'am not', 'don\'t can', 'not can'],
            correctAnswer: 'can\'t',
            explanationEn: 'can\'t = cannot.',
            explanationUz: 'Eshita olmayapman -> can\'t hear.',
            difficulty: 'easy',
          },
          {
            "id": "t_l1_u7_2",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "I am sorry, but you ___ park your car here; it is forbidden.",
            "options": [
                        "can't",
                        "don't have to",
                        "should",
                        "can"
            ],
            "correctAnswer": "can't",
            "explanationEn": "'can\\'t' expresses prohibition / lack of permission.",
            "explanationUz": "'can\\'t' bu yerda taqiqni va ruxsat yoʻqligini bildiradi.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u7_3",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "How many languages ___ your grandfather speak?",
            "options": [
                        "can",
                        "does can",
                        "is can",
                        "cans"
            ],
            "correctAnswer": "can",
            "explanationEn": "In wh-questions with modal can: Question word + can + subject + verb.",
            "explanationUz": "Wh-soʻroqlarda: How many languages + can + subject + verb.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u7_4",
            "topicId": "l1_u7_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence expresses permission?",
            "options": [
                        "You can leave the room when you finish.",
                        "Cheetahs can run up to 100 km/h.",
                        "I can lift 50 kilograms.",
                        "Fish can breathe underwater."
            ],
            "correctAnswer": "You can leave the room when you finish.",
            "explanationEn": "'You can leave' grants permission; the other options describe physical ability.",
            "explanationUz": "'You can leave' ruxsat berishni bildiradi, qolganlari jismoniy qobiliyat haqida.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u7_1',
            front: 'Modal CAN Rules',
            back: '1. No "-s" with he/she/it (He can, NOT He cans)\n2. No "to" after it (I can go, NOT I can to go)',
            formula: 'Subject + can + Verb (base)',
            example: 'She can play chess.',
            uzbekNote: 'Qobiliyat va ruxsat uchun. Hech qachon -s yoki to olmaydi.',
          },
        ],
      },
    ],
  },

  // UNIT 8: Prepositions of Place & Time
  {
    id: 'l1_u8',
    unitNumber: 8,
    levelId: 'level_1',
    title: 'Unit 8: Prepositions of Place & Time',
    titleUz: '8-Boʻlim: Oʻrin-joy va Vaqt Predloglari (In, On, At)',
    description: 'Master the pyramid of prepositions: in (general), on (more specific), at (exact point).',
    topics: [
      {
        id: 'l1_u8_t1',
        unitId: 'l1_u8',
        levelId: 'level_1',
        title: 'Prepositions of Time: In, On, At',
        titleUz: 'Vaqt Predloglari: In, On, At',
        slug: 'prepositions-of-time-in-on-at',
        description: 'Understand the rule of specificity for years, months, days, dates, and clock times.',
        difficulty: 'easy',
        estimatedMinutes: 7,
        prerequisites: ['l1_u1_t1'],
        lesson: {
          id: 'les_l1_u8_t1',
          topicId: 'l1_u8_t1',
          whatIsItEn: 'AT is for precise clock times and holidays (at 5 PM, at night). ON is for days and dates (on Monday, on May 9th). IN is for months, years, centuries, and long periods (in July, in 2026).',
          whatIsItUz: 'AT aniq soat va tunda (at 7:00, at night). ON kunlar va sanalarda (on Friday, on June 1st). IN oylar, yillar va fasllarda (in July, in 2026, in summer).',
          formula: 'AT (precise time) | ON (days/dates) | IN (longer periods)',
          positiveStructure: {
            rule: 'at 8:00 AM | on Friday | in September | in 2026',
            example: 'Our English exam is on Tuesday at 9:00 AM.',
            exampleUz: 'Bizning ingliz tili imtihonimiz seshanba kuni ertalab soat 9:00 da.',
          },
          negativeStructure: {
            rule: 'Same prepositions apply in negative statements.',
            example: 'I don\'t study late at night.',
            exampleUz: 'Men kechasi dars qilmayman.',
          },
          questionStructure: {
            rule: 'What time ... at? / When ... in?',
            example: 'Were you born in June or in July?',
            exampleUz: 'Siz iyundami yoki iyuldami tugʻilgansiz?',
          },
          examples: [
            { en: 'I wake up at 7 o\'clock.', uz: 'Men soat 7 da uygʻonaman.', highlight: 'at 7 o\'clock' },
            { en: 'We have no classes on Sundays.', uz: 'Yakshanba kunlari darsimiz boʻlmaydi.', highlight: 'on Sundays' },
            { en: 'It is very warm in summer.', uz: 'Yozda havo juda issiq boʻladi.', highlight: 'in summer' },
          ],
          signalWords: ['at 5:00', 'at noon', 'at night', 'on Monday', 'on my birthday', 'in 2025', 'in May'],
          commonMistakes: [
            {
              incorrect: 'I will see you in Monday.',
              correct: 'I will see you on Monday.',
              explanationUz: 'Hafta kunlari oldidan doimo "on" ishlatiladi.',
            },
            {
              incorrect: 'He was born at 1995.',
              correct: 'He was born in 1995.',
              explanationUz: 'Yillar oldidan "in" ishlatiladi.',
            },
          ],
          studyTips: [
            'Think of a pyramid: IN (broad: centuries, years, months) -> ON (middle: days, dates) -> AT (narrow point: clock time).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u8_1',
            topicId: 'l1_u8_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct preposition:',
            sentenceWithBlank: 'Our next vocabulary tournament starts ___ 3:30 PM.',
            options: ['at', 'on', 'in', 'by'],
            correctAnswer: 'at',
            explanationEn: 'Specific clock times always use "at".',
            explanationUz: 'Aniq soat vaqtlari oldidan "at" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u8_2",
            "topicId": "l1_u8_t1",
            "type": "fill_blank",
            "prompt": "Fill in the correct preposition of time:",
            "sentenceWithBlank": "Our final exam is ___ Monday morning.",
            "options": [
                        "on",
                        "in",
                        "at",
                        "by"
            ],
            "correctAnswer": "on",
            "explanationEn": "Days of the week (Monday, Monday morning) always take 'on'.",
            "explanationUz": "Hafta kunlari oldidan har doim 'on' qoʻyiladi (on Monday morning).",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u8_3",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "Which preposition is used for specific clock times?",
            "sentenceWithBlank": "The movie starts ___ 8:30 PM.",
            "options": [
                        "at",
                        "on",
                        "in",
                        "to"
            ],
            "correctAnswer": "at",
            "explanationEn": "Precise times on the clock take 'at' (at 8:30 PM, at midnight).",
            "explanationUz": "Aniq soat koʻrsatkichlari oldidan 'at' ishlatiladi (at 8:30 PM).",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u8_1',
            topicId: 'l1_u8_t1',
            type: 'multiple_choice',
            prompt: 'Complete the sentence:',
            sentenceWithBlank: 'Independence Day is celebrated ___ September 1st.',
            options: ['on', 'in', 'at', 'to'],
            correctAnswer: 'on',
            explanationEn: 'Specific dates use "on".',
            explanationUz: 'Aniq sanalar oldidan "on" qoʻyiladi.',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u8_2",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "Which preposition is used for seasons and years?",
            "sentenceWithBlank": "They moved to Tashkent ___ 2021.",
            "options": [
                        "in",
                        "on",
                        "at",
                        "since"
            ],
            "correctAnswer": "in",
            "explanationEn": "Years, centuries, and seasons take 'in' (in 2021, in summer).",
            "explanationUz": "Yillar, asrlar va fasllar oldidan 'in' ishlatiladi (in 2021, in summer).",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u8_3",
            "topicId": "l1_u8_t1",
            "type": "fill_blank",
            "prompt": "Complete with the correct preposition:",
            "sentenceWithBlank": "I love drinking hot chocolate ___ winter.",
            "options": [
                        "in",
                        "on",
                        "at",
                        "for"
            ],
            "correctAnswer": "in",
            "explanationEn": "Seasons take 'in' (in winter, in spring).",
            "explanationUz": "Fasllar oldidan 'in' qoʻyiladi: in winter.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u8_4",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct pair of prepositions:",
            "sentenceWithBlank": "The party is ___ Saturday ___ 7 o'clock.",
            "options": [
                        "on / at",
                        "in / at",
                        "at / on",
                        "on / in"
            ],
            "correctAnswer": "on / at",
            "explanationEn": "Day of the week takes 'on'; clock time takes 'at'.",
            "explanationUz": "Kunlar uchun 'on', aniq soat uchun 'at'.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u8_5",
            "topicId": "l1_u8_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "U tunda ishlashni yoqtiradi.",
            "options": [
                        "He likes working at night.",
                        "He likes working in night.",
                        "He likes working on night.",
                        "He likes work by night."
            ],
            "correctAnswer": "He likes working at night.",
            "explanationEn": "The fixed expression is 'at night' (contrast with 'in the morning/afternoon/evening').",
            "explanationUz": "Tunda iborasi har doim 'at night' boʻladi.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u8_1',
            topicId: 'l1_u8_t1',
            type: 'multiple_choice',
            prompt: 'We always travel to the mountains ___ summer.',
            options: ['in', 'at', 'on', 'to'],
            correctAnswer: 'in',
            explanationEn: 'Seasons use "in" (in summer, in winter).',
            explanationUz: 'Fasllar oldidan "in" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "t_l1_u8_2",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "Independence Day of Uzbekistan is celebrated ___ September 1st.",
            "options": [
                        "on",
                        "in",
                        "at",
                        "by"
            ],
            "correctAnswer": "on",
            "explanationEn": "Specific calendar dates with a day number take 'on'.",
            "explanationUz": "Aniq sana (kun koʻrsatilgan sana) oldidan 'on' qoʻyiladi.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u8_3",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "What do you normally do ___ the weekend?",
            "options": [
                        "at / on",
                        "in",
                        "to",
                        "for"
            ],
            "correctAnswer": "at / on",
            "explanationEn": "British English commonly uses 'at the weekend'; American uses 'on the weekend'.",
            "explanationUz": "Britaniya inglizchasida 'at the weekend', Amerikada 'on the weekend' toʻgʻri.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u8_4",
            "topicId": "l1_u8_t1",
            "type": "multiple_choice",
            "prompt": "We have a meeting ___ next Monday.",
            "options": [
                        "— (no preposition)",
                        "on",
                        "in",
                        "at"
            ],
            "correctAnswer": "— (no preposition)",
            "explanationEn": "Before 'next', 'last', 'this', and 'every', do NOT use a preposition.",
            "explanationUz": "'next', 'last', 'this', 'every' soʻzlari oldidan predlog qoʻyilmaydi!",
            "difficulty": "hard"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u8_1',
            front: 'Time Pyramid: IN / ON / AT',
            back: 'AT = Specific time (at 4 PM, at night)\nON = Days & Dates (on Monday, on May 9)\nIN = Months, Years, Seasons (in July, in 2026, in winter)',
            formula: 'AT (point) | ON (day) | IN (period)',
            example: 'On Friday at 6 PM in winter.',
            uzbekNote: 'At soatda, On kunda, In oy/yil/faslda.',
          },
        ],
      },
    ],
  },

  // UNIT 9: Past Simple Tense
  {
    id: 'l1_u9',
    unitNumber: 9,
    levelId: 'level_1',
    title: 'Unit 9: Past Simple & Was/Were',
    titleUz: '9-Boʻlim: Past Simple (Oʻtgan Oddiy Zamon)',
    description: 'Completed past actions, regular -ed endings, irregular verbs, didn\'t, and questions with Did.',
    topics: [
      {
        id: 'l1_u9_t1',
        unitId: 'l1_u9',
        levelId: 'level_1',
        title: 'Past Simple: Regular & Irregular Verbs',
        titleUz: 'Past Simple: Toʻgʻri va Notoʻgʻri Feʼllar',
        slug: 'past-simple-regular-irregular',
        description: 'Express completed actions in the past with specific time references.',
        difficulty: 'medium',
        estimatedMinutes: 9,
        prerequisites: ['l1_u5_t1'],
        lesson: {
          id: 'les_l1_u9_t1',
          topicId: 'l1_u9_t1',
          whatIsItEn: 'Use Past Simple for completed actions that happened at a definite time in the past. Regular verbs add -ed (played, arrived). Irregular verbs change completely (go -> went, see -> saw).',
          whatIsItUz: 'Oʻtmishda aniq bir vaqtda sodir boʻlib tugallangan harakatlar uchun ishlatiladi. Toʻgʻri feʼllar -ed oladi, notoʻgʻri feʼllar shaklini oʻzgartiradi (went, bought).',
          formula: 'Subject + Verb-2 (ed / irregular form)',
          positiveStructure: {
            rule: 'I/You/He/She/We/They visited Tashkent yesterday. / We bought a new car.',
            example: 'I learned twenty new words yesterday.',
            exampleUz: 'Men kecha yigirmata yangi soʻz oʻrgandim.',
          },
          negativeStructure: {
            rule: 'Subject + didn\'t + BASE verb (the verb returns to form 1!)',
            example: 'I didn\'t understand the question at first.',
            exampleUz: 'Men boshida savolni tushunmadim.',
          },
          questionStructure: {
            rule: 'Did + Subject + BASE verb?',
            example: 'Did you finish your grammar practice yesterday?',
            exampleUz: 'Kecha grammatika mashqini tugatdingizmi?',
          },
          shortAnswers: {
            positive: 'Yes, I did. / Yes, we did.',
            negative: 'No, I didn\'t. / No, we didn\'t.',
          },
          examples: [
            { en: 'We went to Samarkand last weekend.', uz: 'Biz oʻtgan dam olish kunlarida Samarqandga bordik.', highlight: 'went ... last weekend' },
            { en: 'Did you see that amazing goal?', uz: 'Siz oʻsha ajoyib golni koʻrdingizmi?', highlight: 'Did you see' },
            { en: 'She didn\'t call me yesterday.', uz: 'U kecha menga qoʻngʻiroq qilmadi.', highlight: 'didn\'t call' },
          ],
          signalWords: ['yesterday', 'last night', 'last week', 'in 2020', 'two days ago', 'when I was young'],
          commonMistakes: [
            {
              incorrect: 'I didn\'t went to school yesterday.',
              correct: 'I didn\'t go to school yesterday.',
              explanationUz: 'didn\'t yordamchi feʼlidan keyin feʼlning 1-shakli (go) ishlatiladi, went emas!',
            },
            {
              incorrect: 'Did you saw him?',
              correct: 'Did you see him?',
              explanationUz: 'Did soʻrogʻidan keyin feʼlning 1-shakli (see) keladi.',
            },
          ],
          studyTips: [
            'Whenever "did" or "didn\'t" is present, the main verb ALWAYS sleeps in its 1st base form!',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u9_1',
            topicId: 'l1_u9_t1',
            type: 'multiple_choice',
            prompt: 'Complete with the correct past form:',
            sentenceWithBlank: 'We ___ a wonderful documentary about space yesterday.',
            options: ['watched', 'watch', 'are watching', 'watches'],
            correctAnswer: 'watched',
            explanationEn: '"yesterday" marks Past Simple, so regular verb "watch" takes "-ed".',
            explanationUz: '"yesterday" oʻtgan zamon belgisi, shuning uchun "watched".',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u9_2",
            "topicId": "l1_u9_t1",
            "type": "fill_blank",
            "prompt": "Complete with the past tense of 'go':",
            "sentenceWithBlank": "Last summer, my family ___ to Samarkand by train.",
            "options": [
                        "went",
                        "goed",
                        "goes",
                        "gone"
            ],
            "correctAnswer": "went",
            "explanationEn": "'go' is an irregular verb whose past simple form is 'went'.",
            "explanationUz": "'go' notoʻgʻri feʼl boʻlib, oʻtgan zamon shakli 'went'.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u9_3",
            "topicId": "l1_u9_t1",
            "type": "multiple_choice",
            "prompt": "Choose the correct question in Past Simple:",
            "sentenceWithBlank": "___ you ___ the new museum yesterday?",
            "options": [
                        "Did / visit",
                        "Did / visited",
                        "Do / visited",
                        "Were / visit"
            ],
            "correctAnswer": "Did / visit",
            "explanationEn": "In questions with 'Did', the main verb stays in base form: Did + subject + V1.",
            "explanationUz": "'Did' ishlatilganda asosiy feʼl boshlangʻich shaklda qoladi (visit).",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u9_1',
            topicId: 'l1_u9_t1',
            type: 'error_correction',
            prompt: 'Fix the past tense mistake:',
            wrongSentence: 'She didn\'t bought any vegetables.',
            errorWord: 'bought',
            correction: 'buy',
            correctAnswer: 'She didn\'t buy any vegetables.',
            explanationEn: 'After "didn\'t", use the base verb "buy".',
            explanationUz: '"didn\'t" dan keyin feʼlning asosi "buy" boʻladi.',
            difficulty: 'medium',
          },
          {
            id: 'p_l1_u9_2',
            topicId: 'l1_u9_t1',
            type: 'sentence_builder',
            prompt: 'Arrange the past question:',
            scrambledWords: ['Did', 'you', 'arrive', 'on', 'time?'],
            correctAnswer: 'Did you arrive on time?',
            explanationEn: 'Did + Subject (you) + Verb (arrive) + on time?',
            explanationUz: 'Did + ega + feʼl asosi + toʻldiruvchi.',
            difficulty: 'easy',
          },
          {
            "id": "p_l1_u9_3",
            "topicId": "l1_u9_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence has the correct negative past form?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "I didn't see him at the conference.",
                        "I didn't saw him at the conference.",
                        "I not saw him at the conference.",
                        "I didn't seen him at the conference."
            ],
            "correctAnswer": "I didn't see him at the conference.",
            "explanationEn": "Negative is 'didn\\'t' + bare infinitive 'see'.",
            "explanationUz": "Inkor shaklda: didn\\'t + feʼlning asosi (see).",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u9_4",
            "topicId": "l1_u9_t1",
            "type": "fill_blank",
            "prompt": "Complete with the irregular past form of 'buy':",
            "sentenceWithBlank": "She ___ a new laptop two days ago.",
            "options": [
                        "bought",
                        "buyed",
                        "boughted",
                        "buys"
            ],
            "correctAnswer": "bought",
            "explanationEn": "The past simple of 'buy' is 'bought'.",
            "explanationUz": "'buy' feʼlining oʻtgan zamoni 'bought'.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u9_5",
            "topicId": "l1_u9_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Kecha biz juda qiziqarli kitob oʻqidik.",
            "options": [
                        "Yesterday we read a very interesting book.",
                        "Yesterday we readed a very interesting book.",
                        "Yesterday we did readed a very interesting book.",
                        "Yesterday we were read a very interesting book."
            ],
            "correctAnswer": "Yesterday we read a very interesting book.",
            "explanationEn": "Past simple of 'read' is spelled 'read' (pronounced /red/).",
            "explanationUz": "'read' feʼlining oʻtgan zamon yozilishi oʻzgarmaydi ('read'), lekin talaffuzi /red/.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u9_1',
            topicId: 'l1_u9_t1',
            type: 'multiple_choice',
            prompt: 'Where ___ you go last summer?',
            options: ['did', 'do', 'were', 'have'],
            correctAnswer: 'did',
            explanationEn: 'Where did you go last summer? (Past Simple question).',
            explanationUz: 'Oʻtgan zamon soʻrogʻi "did" bilan tuziladi.',
            difficulty: 'easy',
          },
          {
            "id": "t_l1_u9_2",
            "topicId": "l1_u9_t1",
            "type": "multiple_choice",
            "prompt": "They ___ at home last night; they were at the cinema.",
            "options": [
                        "weren't",
                        "wasn't",
                        "didn't be",
                        "didn't were"
            ],
            "correctAnswer": "weren't",
            "explanationEn": "Past negative of 'to be' for 'they' is 'weren\\'t'.",
            "explanationUz": "'They' uchun to be ning oʻtgan zamon inkori 'weren\\'t'.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u9_3",
            "topicId": "l1_u9_t1",
            "type": "multiple_choice",
            "prompt": "Why did you ___ your keys?",
            "options": [
                        "lose",
                        "lost",
                        "loosing",
                        "losed"
            ],
            "correctAnswer": "lose",
            "explanationEn": "After 'did', always use the base form of the verb: 'lose'.",
            "explanationUz": "'did' dan keyin feʼl asosi 'lose' keladi.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u9_4",
            "topicId": "l1_u9_t1",
            "type": "multiple_choice",
            "prompt": "He ___ down the stairs and ___ his arm.",
            "options": [
                        "fell / broke",
                        "falled / breaked",
                        "fell / breaked",
                        "fall / broke"
            ],
            "correctAnswer": "fell / broke",
            "explanationEn": "Both 'fall' (fell) and 'break' (broke) are irregular verbs.",
            "explanationUz": "Ikkala feʼl ham notoʻgʻri: fall -> fell, break -> broke.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u9_1',
            front: 'Past Simple: Did / Didn\'t Rule',
            back: 'Positive: Verb-2 (went, bought, played)\nNegative: didn\'t + Verb-1 (didn\'t go, didn\'t buy)\nQuestion: Did you go?',
            formula: 'didn\'t / Did + Base Verb',
            example: 'I didn\'t see him yesterday.',
            uzbekNote: 'Didn\'t va Did bor joyda feʼl 1-shaklida boʻladi!',
          },
        ],
      },
    ],
  },

  // UNIT 10: Future Forms & Comparisons
  {
    id: 'l1_u10',
    unitNumber: 10,
    levelId: 'level_1',
    title: 'Unit 10: Future & Comparisons',
    titleUz: '10-Boʻlim: Kelasi Zamon va Sifat Darajalari',
    description: 'Plans with be going to, predictions with will, and comparing things with comparative/superlative adjectives.',
    topics: [
      {
        id: 'l1_u10_t1',
        unitId: 'l1_u10',
        levelId: 'level_1',
        title: 'Future: Be Going To vs Will',
        titleUz: 'Kelasi Zamon: Be Going To va Will',
        slug: 'future-be-going-to-vs-will',
        description: 'Distinguish between planned intentions (be going to) and spontaneous decisions / predictions (will).',
        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l1_u3_t1', 'l1_u5_t1'],
        lesson: {
          id: 'les_l1_u10_t1',
          topicId: 'l1_u10_t1',
          whatIsItEn: 'Use "be going to" for intentions and plans decided BEFORE speaking, or predictions based on current evidence (Look at those black clouds!). Use "will" for instant decisions made at the moment of speaking, promises, and general opinions.',
          whatIsItUz: '"Be going to" oldindan rejalashtirilgan niyatlar yoki koʻz oʻngimizdagi dalilga asoslangan bashoratlarda ishlatiladi. "Will" esa gapirib turgan paytda toʻsatdan chiqarilgan qarorlar va vaʼdalarda ishlatiladi.',
          formula: 'be going to + Verb  VS  will + Verb',
          positiveStructure: {
            rule: 'I am going to study abroad next year. | I will help you with your bag.',
            example: 'She is going to start a new job on Monday.',
            exampleUz: 'U dushanba kuni yangi ish boshlamoqchi (aniq reja).',
          },
          negativeStructure: {
            rule: 'won\'t (will not)  |  not going to',
            example: 'I won\'t forget to practice my words.',
            exampleUz: 'Soʻzlarimni mashq qilishni unutmayman (vaʼda).',
          },
          questionStructure: {
            rule: 'Are you going to ... ?  |  Will you ... ?',
            example: 'What are you going to do after class?',
            exampleUz: 'Darsdan keyin nima qilmoqchisiz?',
          },
          examples: [
            { en: 'The phone is ringing. — I will answer it!', uz: 'Telefon jiringlayapti. — Men javob beraman! (toʻsatdan qaror)', highlight: 'I will answer' },
            { en: 'Look at the sky! It is going to rain.', uz: 'Osmonga qarang! Yomgʻir yogʻmoqchi (dalil bor).', highlight: 'is going to rain' },
          ],
          signalWords: ['tomorrow', 'next week', 'soon', 'I think', 'I promise', 'Look at ...'],
          commonMistakes: [
            {
              incorrect: 'I am going to help you right now! (instant offer)',
              correct: 'I will help you right now!',
              explanationUz: 'Ayni daqiqadagi yordam taklifi uchun "will" toʻgʻri keladi.',
            },
          ],
          studyTips: [
            'Planned before speaking = BE GOING TO. Decided right now = WILL.',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u10_1',
            topicId: 'l1_u10_t1',
            type: 'multiple_choice',
            prompt: 'Complete with the spontaneous decision:',
            sentenceWithBlank: 'It is very cold in here. — I ___ close the window.',
            options: ['will', 'am going to', 'going to', 'shall not'],
            correctAnswer: 'will',
            explanationEn: 'Spontaneous decision made right now requires "will".',
            explanationUz: 'Ayni paytda chiqarilgan qaror uchun "will" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u10_2",
            "topicId": "l1_u10_t1",
            "type": "fill_blank",
            "prompt": "Complete with the spontaneous decision form:",
            "sentenceWithBlank": "The phone is ringing. — Don't worry, I ___ get it.",
            "options": [
                        "will",
                        "am going to",
                        "am getting",
                        "go to"
            ],
            "correctAnswer": "will",
            "explanationEn": "Spontaneous decision made at the moment of speaking takes 'will'.",
            "explanationUz": "Gapirayotgan paytda toʻsatdan chiqarilgan qaror uchun 'will' ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u10_3",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "When do we use 'be going to'?",
            "sentenceWithBlank": "Choose the correct usage:",
            "options": [
                        "For plans and intentions decided before speaking.",
                        "Only for formal contracts.",
                        "For actions that happened yesterday.",
                        "Only with third-person subjects."
            ],
            "correctAnswer": "For plans and intentions decided before speaking.",
            "explanationEn": "'be going to' expresses prior plans and intentions.",
            "explanationUz": "'be going to' oldindan rejalashtirilgan maqsad va rejalar uchun qoʻllanadi.",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u10_1',
            topicId: 'l1_u10_t1',
            type: 'multiple_choice',
            prompt: 'Select the planned future intention:',
            sentenceWithBlank: 'We have bought the tickets. We ___ fly to London tomorrow.',
            options: ['are going to', 'will', 'flew', 'going to'],
            correctAnswer: 'are going to',
            explanationEn: 'Tickets are bought, so it is a definite plan: "are going to fly".',
            explanationUz: 'Chiptalar olingan, demak aniq reja: are going to fly.',
            difficulty: 'medium',
          },
          {
            "id": "p_l1_u10_2",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "Look at those dark clouds! It ___ rain.",
            "options": [
                        "is going to",
                        "will",
                        "rains",
                        "is raining to"
            ],
            "correctAnswer": "is going to",
            "explanationEn": "Predictions based on present visible evidence use 'be going to'.",
            "explanationUz": "Koʻz oʻngimizdagi aniq dalilga (qora bulutlar) asoslangan bashoratda 'is going to' ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u10_3",
            "topicId": "l1_u10_t1",
            "type": "fill_blank",
            "prompt": "Complete the promise with 'will':",
            "sentenceWithBlank": "I promise I ___ tell anyone your secret.",
            "options": [
                        "won't",
                        "am not going to",
                        "don't",
                        "not will"
            ],
            "correctAnswer": "won't",
            "explanationEn": "Promises and guarantees commonly use 'will / won\\'t'.",
            "explanationUz": "Vaʼdalar uchun 'will / won\\'t' ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u10_4",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "What ___ you ___ do after graduation?",
            "options": [
                        "are / going to",
                        "will / going to",
                        "do / will",
                        "are / will"
            ],
            "correctAnswer": "are / going to",
            "explanationEn": "Question format for future plan: Are you going to do...?",
            "explanationUz": "Kelajak reja soʻrogʻi: What are you going to do...?",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u10_5",
            "topicId": "l1_u10_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Menimcha, ertaga havo quyoshli boʻladi.",
            "options": [
                        "I think it will be sunny tomorrow.",
                        "I think it is going to be sunny tomorrow.",
                        "I think it is sunny tomorrow.",
                        "I think it will being sunny tomorrow."
            ],
            "correctAnswer": "I think it will be sunny tomorrow.",
            "explanationEn": "Opinions with 'I think' typically take 'will'.",
            "explanationUz": "'I think' (menimcha) bilan bildirilgan shaxsiy fikrlar odatda 'will' bilan aytiladi.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u10_1',
            topicId: 'l1_u10_t1',
            type: 'multiple_choice',
            prompt: 'Look at those dark storm clouds! It ___ rain.',
            options: ['is going to', 'will', 'rains', 'has rained'],
            correctAnswer: 'is going to',
            explanationEn: 'Prediction based on present evidence (dark clouds) uses "is going to".',
            explanationUz: 'Koʻz oldimizdagi dalilga asoslangan bashorat: is going to.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u10_2",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "I forgot my wallet! — Don't worry, I ___ lend you some money.",
            "options": [
                        "will",
                        "am going to",
                        "lend",
                        "am lending to"
            ],
            "correctAnswer": "will",
            "explanationEn": "Instant offer / decision made right now: 'will'.",
            "explanationUz": "Ayni paytda yordam taklif qilish: 'will'.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u10_3",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "They have already bought the tickets. They ___ visit Madrid next week.",
            "options": [
                        "are going to",
                        "will",
                        "would",
                        "visited"
            ],
            "correctAnswer": "are going to",
            "explanationEn": "They already bought tickets, showing an established prior plan: 'are going to'.",
            "explanationUz": "Chiptalar sotib olingan, demak oldindan qatʼiy rejalashtirilgan: 'are going to'.",
            "difficulty": "medium"
},
          {
            "id": "t_l1_u10_4",
            "topicId": "l1_u10_t1",
            "type": "multiple_choice",
            "prompt": "In fifty years, people ___ live on Mars.",
            "options": [
                        "will",
                        "are going to",
                        "is going to",
                        "can to"
            ],
            "correctAnswer": "will",
            "explanationEn": "Distant future speculation without present evidence uses 'will'.",
            "explanationUz": "Uzoq kelajak haqidagi shaxsiy taxmin 'will' bilan aytiladi.",
            "difficulty": "medium"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u10_1',
            front: 'Will vs Be Going To',
            back: 'WILL: Instant decision, promise, opinion (I\'ll help you)\nBE GOING TO: Pre-planned intention or evidence right now (I\'m going to visit Samarkand)',
            formula: 'will + V  vs  be going to + V',
            example: 'I am going to study abroad.',
            uzbekNote: 'Oldindan reja = be going to. Hozirgi qaror = will.',
          },
        ],
      },
    ],
  },

  // UNIT 11: Modals & Connecting Ideas
  {
    id: 'l1_u11',
    unitNumber: 11,
    levelId: 'level_1',
    title: 'Unit 11: Modals & Conjunctions',
    titleUz: '11-Boʻlim: Modal Feʼllar va Bogʻlovchilar',
    description: 'Obligation with must and have to, advice with should, and linking clauses with and, but, because, so.',
    topics: [
      {
        id: 'l1_u11_t1',
        unitId: 'l1_u11',
        levelId: 'level_1',
        title: 'Must, Have to & Should',
        titleUz: 'Must, Have to va Should (Majburiyat va Maslahat)',
        slug: 'modals-must-have-to-should',
        description: 'Understand necessity, rules, prohibitions, and giving friendly recommendations.',
        difficulty: 'medium',
        estimatedMinutes: 8,
        prerequisites: ['l1_u7_t1'],
        lesson: {
          id: 'les_l1_u11_t1',
          topicId: 'l1_u11_t1',
          whatIsItEn: 'MUST is strong personal obligation or written rules. MUSTN\'T means prohibition (do not do it!). HAVE TO is an external rule or law. SHOULD is friendly advice or recommendation.',
          whatIsItUz: 'MUST qatʼiy majburiyat yoki qoida. MUSTN\'T taqiq (aslo mumkin emas!). HAVE TO tashqi qoida yoki shart. SHOULD esa maslahat (qilsangiz yaxshi boʻlardi).',
          formula: 'must / have to / should + Base Verb',
          positiveStructure: {
            rule: 'You must wear a seatbelt. | You should sleep 8 hours.',
            example: 'Students must arrive before 9:00 AM.',
            exampleUz: 'Oʻquvchilar 9:00 dan oldin yetib kelishlari shart (qoida).',
          },
          negativeStructure: {
            rule: 'mustn\'t (prohibition!) vs don\'t have to (not necessary, optional)',
            example: 'You mustn\'t use your phone during the final exam.',
            exampleUz: 'Yakuniy imtihon paytida telefondan foydalanish taqiqlanadi.',
          },
          questionStructure: {
            rule: 'Should I ... ?  |  Do I have to ... ?',
            example: 'Should I review my mistakes now?',
            exampleUz: 'Xatolarimni hozir koʻrib chiqsam yaxshimi?',
          },
          examples: [
            { en: 'You should practice your speaking daily.', uz: 'Har kuni gapirishni mashq qilishingiz kerak (maslahat).', highlight: 'should practice' },
            { en: 'Tomorrow is Sunday, so I don\'t have to wake up early.', uz: 'Ertaga yakshanba, shuning uchun erta turishim shart emas (ixtiyoriy).', highlight: 'don\'t have to' },
          ],
          signalWords: ['must', 'mustn\'t', 'should', 'shouldn\'t', 'have to', 'don\'t have to'],
          commonMistakes: [
            {
              incorrect: 'You mustn\'t come tomorrow if you are busy.',
              correct: 'You don\'t have to come tomorrow if you are busy.',
              explanationUz: '"mustn\'t" taqiqni bildiradi. "Kelishingiz shart emas (ixtiyoriy)" deyish uchun "don\'t have to" ishlatiladi.',
            },
          ],
          studyTips: [
            'Crucial distinction: Mustn\'t = Forbidden! Don\'t have to = Optional (not necessary).',
          ],
        },
        guidedQuestions: [
          {
            id: 'g_l1_u11_1',
            topicId: 'l1_u11_t1',
            type: 'multiple_choice',
            prompt: 'Choose the correct advice modal:',
            sentenceWithBlank: 'You look very tired. You ___ go to bed early tonight.',
            options: ['should', 'mustn\'t', 'has to', 'shall'],
            correctAnswer: 'should',
            explanationEn: 'Giving friendly advice uses "should".',
            explanationUz: 'Doʻstona maslahat berishda "should" ishlatiladi.',
            difficulty: 'easy',
          },
          {
            "id": "g_l1_u11_2",
            "topicId": "l1_u11_t1",
            "type": "fill_blank",
            "prompt": "Choose the modal verb for gentle advice:",
            "sentenceWithBlank": "You look very tired. You ___ go to bed early tonight.",
            "options": [
                        "should",
                        "must",
                        "have to",
                        "has to"
            ],
            "correctAnswer": "should",
            "explanationEn": "'should' gives advice and recommendations ('it is a good idea').",
            "explanationUz": "'should' maslahat berishda ishlatiladi ('yaxshi boʻlardi').",
            "difficulty": "easy"
},
          {
            "id": "g_l1_u11_3",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "What does 'mustn't' mean?",
            "sentenceWithBlank": "You mustn't smoke in the hospital.",
            "options": [
                        "It is strictly forbidden.",
                        "You don't need to, but you can if you want.",
                        "It is recommended.",
                        "It is your choice."
            ],
            "correctAnswer": "It is strictly forbidden.",
            "explanationEn": "'mustn\\'t' indicates strong prohibition (it is against the law/rules).",
            "explanationUz": "'mustn\\'t' qatʼiy taqiqni bildiradi (mumkin emas, taqiqlangan).",
            "difficulty": "easy"
}
        ],
        practiceQuestions: [
          {
            id: 'p_l1_u11_1',
            topicId: 'l1_u11_t1',
            type: 'multiple_choice',
            prompt: 'Select the prohibition modal:',
            sentenceWithBlank: 'You ___ touch that live electrical wire! It is dangerous.',
            options: ['mustn\'t', 'don\'t have to', 'should', 'needn\'t'],
            correctAnswer: 'mustn\'t',
            explanationEn: '"mustn\'t" expresses strict prohibition for dangerous actions.',
            explanationUz: 'Xavfli taqiq uchun "mustn\'t" ishlatiladi.',
            difficulty: 'medium',
          },
          {
            "id": "p_l1_u11_2",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "Tomorrow is Sunday, so I ___ wake up early.",
            "options": [
                        "don't have to",
                        "mustn't",
                        "shouldn't",
                        "have to not"
            ],
            "correctAnswer": "don't have to",
            "explanationEn": "'don\\'t have to' expresses lack of obligation (no need to do it).",
            "explanationUz": "'don\\'t have to' majburiyat yoʻqligini bildiradi (zaruriyat yoʻq).",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u11_3",
            "topicId": "l1_u11_t1",
            "type": "fill_blank",
            "prompt": "Complete with the third-person form of 'have to':",
            "sentenceWithBlank": "Every doctor ___ wear a white coat.",
            "options": [
                        "has to",
                        "have to",
                        "must to",
                        "should to"
            ],
            "correctAnswer": "has to",
            "explanationEn": "'Every doctor' is singular, requiring 'has to'.",
            "explanationUz": "'Every doctor' birlikda boʻlgani uchun 'has to' boʻladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u11_4",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "Which sentence is grammatically correct?",
            "sentenceWithBlank": "Choose the correct sentence:",
            "options": [
                        "You should eat more fresh vegetables.",
                        "You should to eat more fresh vegetables.",
                        "You should eating more fresh vegetables.",
                        "You should eats more fresh vegetables."
            ],
            "correctAnswer": "You should eat more fresh vegetables.",
            "explanationEn": "'should' is followed by bare infinitive without 'to'.",
            "explanationUz": "'should' dan keyin feʼl hech qanday qoʻshimchasiz keladi.",
            "difficulty": "easy"
},
          {
            "id": "p_l1_u11_5",
            "topicId": "l1_u11_t1",
            "type": "translation_uz_en",
            "prompt": "Translate into English:",
            "sentenceWithBlank": "Muzeyda suratga olish mumkin emas (taqiqlangan).",
            "options": [
                        "You mustn't take photos in the museum.",
                        "You don't have to take photos in the museum.",
                        "You should take photos in the museum.",
                        "You must to not take photos in the museum."
            ],
            "correctAnswer": "You mustn't take photos in the museum.",
            "explanationEn": "Prohibition uses 'mustn\\'t': 'You mustn\\'t take photos in the museum.'",
            "explanationUz": "Taqiq uchun 'mustn\\'t' ishlatiladi.",
            "difficulty": "medium"
}
        ],
        testQuestions: [
          {
            id: 't_l1_u11_1',
            topicId: 'l1_u11_t1',
            type: 'multiple_choice',
            prompt: 'Museum entry is free today! We ___ buy any tickets.',
            options: ['don\'t have to', 'mustn\'t', 'should', 'aren\'t'],
            correctAnswer: 'don\'t have to',
            explanationEn: 'Free entry means buying tickets is not necessary: "don\'t have to".',
            explanationUz: 'Chipta olish shart emas (bepul): don\'t have to.',
            difficulty: 'medium',
          },
          {
            "id": "t_l1_u11_2",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "All passengers ___ show their passports at immigration control.",
            "options": [
                        "must",
                        "should",
                        "can to",
                        "ought"
            ],
            "correctAnswer": "must",
            "explanationEn": "Official legal rule/requirement uses 'must' or 'have to'.",
            "explanationUz": "Qonuniy talab va majburiyat: 'must'.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u11_3",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "You have a bad cough. You ___ see a doctor.",
            "options": [
                        "should",
                        "have",
                        "must to",
                        "ought"
            ],
            "correctAnswer": "should",
            "explanationEn": "Friendly sensible advice uses 'should'.",
            "explanationUz": "Foydali doʻstona maslahat: 'should'.",
            "difficulty": "easy"
},
          {
            "id": "t_l1_u11_4",
            "topicId": "l1_u11_t1",
            "type": "multiple_choice",
            "prompt": "Did you ___ wear a uniform when you were at school?",
            "options": [
                        "have to",
                        "must",
                        "had to",
                        "should"
            ],
            "correctAnswer": "have to",
            "explanationEn": "In past questions with 'Did', use base form 'have to': Did you have to...?",
            "explanationUz": "'Did' bilan savol berilganda oʻtgan zamon majburiyati 'have to' orqali soʻraladi.",
            "difficulty": "hard"
}
        ],
        flashcards: [
          {
            id: 'f_l1_u11_1',
            front: 'Mustn\'t vs Don\'t have to',
            back: 'MUSTN\'T = Prohibited! Do not do it! (You mustn\'t cheat)\nDON\'T HAVE TO = Not necessary, optional (You don\'t have to pay)',
            formula: 'mustn\'t (forbidden) vs don\'t have to (optional)',
            example: 'You don\'t have to wear a suit.',
            uzbekNote: 'Mustn\'t = taqiqlangan! Don\'t have to = shart emas, ixtiyoriy.',
          },
        ],
      },
    ],
  },

  // UNIT 12: Level 1 Comprehensive Final Exam
  {
    id: 'l1_u12',
    unitNumber: 12,
    levelId: 'level_1',
    title: 'Unit 12: Level 1 Mastery Exam',
    titleUz: '12-Boʻlim: 1-Daraja Yakuniy Sertifikat Imtihoni',
    description: 'Comprehensive 15-topic mixed grammar test. Score 80%+ to unlock Level 1 Certification!',
    topics: [
      {
        id: 'l1_u12_t1',
        unitId: 'l1_u12',
        levelId: 'level_1',
        title: 'Level 1 Final Certification Exam',
        titleUz: '1-Daraja Yakuniy Imtihon',
        slug: 'level-1-final-exam',
        description: 'Test all Level 1 grammar foundations: Pronouns, BE, Present Simple, Continuous, Past Simple, Future, and Modals.',
        difficulty: 'hard',
        estimatedMinutes: 15,
        prerequisites: ['l1_u1_t1', 'l1_u5_t1', 'l1_u6_t1', 'l1_u9_t1', 'l1_u10_t1', 'l1_u11_t1'],
        lesson: {
          id: 'les_l1_u12_t1',
          topicId: 'l1_u12_t1',
          whatIsItEn: 'This comprehensive exam evaluates your mastery of all 11 foundational grammar units.',
          whatIsItUz: 'Ushbu imtihon barcha 11 ta boshlangʻich grammatika boʻlimi boʻyicha bilimlaringizni sinovdan oʻtkazadi.',
          positiveStructure: {
            rule: 'Mix of all Level 1 rules.',
            example: 'Pass with 80% or higher to earn the Level 1 Foundation Champion Badge!',
            exampleUz: '80% yoki undan yuqori natija bilan 1-Daraja Chempion nishonini qoʻlga kiriting!',
          },
          negativeStructure: { rule: '', example: '', exampleUz: '' },
          questionStructure: { rule: '', example: '', exampleUz: '' },
          examples: [],
          signalWords: [],
          commonMistakes: [],
          studyTips: [
            'Read each sentence carefully and check the time signals before selecting your answer.',
          ],
        },
        guidedQuestions: [],
        practiceQuestions: [],
        testQuestions: [
          {
            id: 'exam_l1_1',
            topicId: 'l1_u12_t1',
            type: 'multiple_choice',
            prompt: 'She ___ her homework before having dinner yesterday.',
            options: ['finished', 'finishes', 'finish', 'is finishing'],
            correctAnswer: 'finished',
            explanationEn: '"yesterday" marks completed action in Past Simple.',
            explanationUz: '"yesterday" oʻtgan zamon belgisi -> finished.',
            difficulty: 'easy',
          },
          {
            id: 'exam_l1_2',
            topicId: 'l1_u12_t1',
            type: 'multiple_choice',
            prompt: 'Where ___ your parents live?',
            options: ['do', 'does', 'is', 'are'],
            correctAnswer: 'do',
            explanationEn: '"your parents" is plural (they), so use "do".',
            explanationUz: '"parents" koʻplik boʻlgani uchun "do".',
            difficulty: 'easy',
          },
          {
            id: 'exam_l1_3',
            topicId: 'l1_u12_t1',
            type: 'multiple_choice',
            prompt: 'Listen! Someone ___ on the front door.',
            options: ['is knocking', 'knocks', 'knocked', 'are knocking'],
            correctAnswer: 'is knocking',
            explanationEn: '"Listen!" signals Present Continuous happening right now.',
            explanationUz: '"Listen!" ayni daqiqadagi harakatni bildiradi -> is knocking.',
            difficulty: 'medium',
          },
          {
            id: 'exam_l1_4',
            topicId: 'l1_u12_t1',
            type: 'multiple_choice',
            prompt: 'Tomorrow is a holiday, so we ___ go to school.',
            options: ['don\'t have to', 'mustn\'t', 'should', 'can'],
            correctAnswer: 'don\'t have to',
            explanationEn: 'Not necessary to go because it is a holiday: don\'t have to.',
            explanationUz: 'Bayram boʻlgani uchun borish shart emas: don\'t have to.',
            difficulty: 'medium',
          },
          {
            id: 'exam_l1_5',
            topicId: 'l1_u12_t1',
            type: 'multiple_choice',
            prompt: 'Look at the score! Our team ___ win the match.',
            options: ['is going to', 'will', 'wins', 'won'],
            correctAnswer: 'is going to',
            explanationEn: 'Prediction with present evidence: is going to.',
            explanationUz: 'Dalilga asoslangan kelasi zamon bashorati: is going to.',
            difficulty: 'medium',
          },
          {
            "id": "exam_l1_6",
            "topicId": "l1_u12_t1",
            "type": "multiple_choice",
            "prompt": "They ___ in London for three years before moving to Paris.",
            "options": [
                        "lived",
                        "lives",
                        "are living",
                        "has lived"
            ],
            "correctAnswer": "lived",
            "explanationEn": "Completed past state in the past uses Past Simple: lived.",
            "explanationUz": "Oʻtgan zamonda yakunlangan holat: lived.",
            "difficulty": "medium"
},
          {
            "id": "exam_l1_7",
            "topicId": "l1_u12_t1",
            "type": "multiple_choice",
            "prompt": "This backpack isn't mine. Is it ___?",
            "options": [
                        "yours",
                        "your",
                        "you",
                        "you're"
            ],
            "correctAnswer": "yours",
            "explanationEn": "Independent possessive pronoun: yours.",
            "explanationUz": "Otsiz mustaqil egalik olmoshi: yours.",
            "difficulty": "easy"
},
          {
            "id": "exam_l1_8",
            "topicId": "l1_u12_t1",
            "type": "multiple_choice",
            "prompt": "I usually have lunch ___ noon.",
            "options": [
                        "at",
                        "in",
                        "on",
                        "by"
            ],
            "correctAnswer": "at",
            "explanationEn": "'noon' takes preposition 'at' (at noon, at midnight).",
            "explanationUz": "'noon' (peshin) oldidan 'at' ishlatiladi.",
            "difficulty": "easy"
},
          {
            "id": "exam_l1_9",
            "topicId": "l1_u12_t1",
            "type": "multiple_choice",
            "prompt": "Look! The bus ___ around the corner.",
            "options": [
                        "is coming",
                        "comes",
                        "came",
                        "will come"
            ],
            "correctAnswer": "is coming",
            "explanationEn": "'Look!' signals an action occurring right now: is coming.",
            "explanationUz": "'Look!' hozir sodir boʻlayotgan harakat: is coming.",
            "difficulty": "easy"
},
          {
            "id": "exam_l1_10",
            "topicId": "l1_u12_t1",
            "type": "multiple_choice",
            "prompt": "You ___ touch that wire! It is extremely dangerous.",
            "options": [
                        "mustn't",
                        "don't have to",
                        "can",
                        "should"
            ],
            "correctAnswer": "mustn't",
            "explanationEn": "Direct warning and strong prohibition: mustn\\'t.",
            "explanationUz": "Xavfli taqiq: mustn\\'t.",
            "difficulty": "medium"
}
        ],
        flashcards: [],
      },
    ],
  },
];
