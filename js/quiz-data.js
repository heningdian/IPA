// Practice quiz content: 10 batches x 10 questions, generated and verified
// programmatically against the real js/g2p.js transcription engine (see
// scripts/build-quiz.js) rather than hand-typed, so every correct answer is
// guaranteed accurate and every set of options is guaranteed to have exactly
// one right answer among four distinct choices.
const QUIZ_BATCHES = [
    {
        "id": 1,
        "title": "IPA → Word",
        "questions": [
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/fə.ˈnɛ.tɪks/",
                "promptIsIPA": true,
                "options": [
                    "Phonics",
                    "Fantastic",
                    "Phonetics",
                    "Phonebook"
                ],
                "answer": "Phonetics",
                "optionsAreIPA": false,
                "audioText": "phonetics"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈlæŋ.ɡwədʒ/",
                "promptIsIPA": true,
                "options": [
                    "Luggage",
                    "Laughter",
                    "Languish",
                    "Language"
                ],
                "answer": "Language",
                "optionsAreIPA": false,
                "audioText": "language"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈæl.fə.ˌbɛt/",
                "promptIsIPA": true,
                "options": [
                    "Altitude",
                    "Alfalfa",
                    "Albatross",
                    "Alphabet"
                ],
                "answer": "Alphabet",
                "optionsAreIPA": false,
                "audioText": "alphabet"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈkæ.tə.ˌpɪ.lɚ/",
                "promptIsIPA": true,
                "options": [
                    "Capital",
                    "Caterpillar",
                    "Category",
                    "Captain"
                ],
                "answer": "Caterpillar",
                "optionsAreIPA": false,
                "audioText": "caterpillar"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈdʒɝ.ni/",
                "promptIsIPA": true,
                "options": [
                    "Journey",
                    "Jury",
                    "Journal",
                    "Jewelry"
                ],
                "answer": "Journey",
                "optionsAreIPA": false,
                "audioText": "journey"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈnɑ.lədʒ/",
                "promptIsIPA": true,
                "options": [
                    "Novelty",
                    "Nourish",
                    "Knowledge",
                    "Naughty"
                ],
                "answer": "Knowledge",
                "optionsAreIPA": false,
                "audioText": "knowledge"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/saɪ.ˈkɑ.lə.dʒi/",
                "promptIsIPA": true,
                "options": [
                    "Sociology",
                    "Physiology",
                    "Cardiology",
                    "Psychology"
                ],
                "answer": "Psychology",
                "optionsAreIPA": false,
                "audioText": "psychology"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/kəm.ˈpju.tɚ/",
                "promptIsIPA": true,
                "options": [
                    "Commuter",
                    "Computer",
                    "Compute",
                    "Comforter"
                ],
                "answer": "Computer",
                "optionsAreIPA": false,
                "audioText": "computer"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/ˈɛ.lə.fənt/",
                "promptIsIPA": true,
                "options": [
                    "Elephant",
                    "Eloquent",
                    "Elegant",
                    "Element"
                ],
                "answer": "Elephant",
                "optionsAreIPA": false,
                "audioText": "elephant"
            },
            {
                "instruction": "Identify the English word for this IPA:",
                "prompt": "/əm.ˈbɹɛ.lə/",
                "promptIsIPA": true,
                "options": [
                    "Umbilical",
                    "Umpire",
                    "Umbrella",
                    "Unbearable"
                ],
                "answer": "Umbrella",
                "optionsAreIPA": false,
                "audioText": "umbrella"
            }
        ]
    },
    {
        "id": 2,
        "title": "Word → IPA",
        "questions": [
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "cat",
                "promptIsIPA": false,
                "options": [
                    "/ˈkæt/",
                    "/ˈɡæt/",
                    "/ˈkɛt/",
                    "/ˈkæk/"
                ],
                "answer": "/ˈkæt/",
                "optionsAreIPA": true,
                "audioText": "cat"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "phone",
                "promptIsIPA": false,
                "options": [
                    "/ˈfaʊn/",
                    "/ˈzoʊn/",
                    "/ˈfoʊl/",
                    "/ˈfoʊn/"
                ],
                "answer": "/ˈfoʊn/",
                "optionsAreIPA": true,
                "audioText": "phone"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "school",
                "promptIsIPA": false,
                "options": [
                    "/ˈnkul/",
                    "/ˈskɝl/",
                    "/ˈskul/",
                    "/ˈskuɹ/"
                ],
                "answer": "/ˈskul/",
                "optionsAreIPA": true,
                "audioText": "school"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "laugh",
                "promptIsIPA": false,
                "options": [
                    "/ˈlɛf/",
                    "/ˈtæf/",
                    "/ˈlæf/",
                    "/ˈlæv/"
                ],
                "answer": "/ˈlæf/",
                "optionsAreIPA": true,
                "audioText": "laugh"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "listen",
                "promptIsIPA": false,
                "options": [
                    "/ˈtɪ.sən/",
                    "/ˈlɪ.səl/",
                    "/ˈlɪ.sən/",
                    "/ˈli.sən/"
                ],
                "answer": "/ˈlɪ.sən/",
                "optionsAreIPA": true,
                "audioText": "listen"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "island",
                "promptIsIPA": false,
                "options": [
                    "/ˈɔɪ.lənd/",
                    "/ˈaɪ.tənd/",
                    "/ˈaɪ.lənɡ/",
                    "/ˈaɪ.lənd/"
                ],
                "answer": "/ˈaɪ.lənd/",
                "optionsAreIPA": true,
                "audioText": "island"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "thumb",
                "promptIsIPA": false,
                "options": [
                    "/ˈθʌɹ/",
                    "/ˈθɑm/",
                    "/ˈθʌn/",
                    "/ˈθʌm/"
                ],
                "answer": "/ˈθʌm/",
                "optionsAreIPA": true,
                "audioText": "thumb"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "castle",
                "promptIsIPA": false,
                "options": [
                    "/ˈkɛ.səl/",
                    "/ˈkæ.səɹ/",
                    "/ˈɡæ.səl/",
                    "/ˈkæ.səl/"
                ],
                "answer": "/ˈkæ.səl/",
                "optionsAreIPA": true,
                "audioText": "castle"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "autumn",
                "promptIsIPA": false,
                "options": [
                    "/ˈɔ.tən/",
                    "/ˈɔ.dəm/",
                    "/ˈoʊ.təm/",
                    "/ˈɔ.təm/"
                ],
                "answer": "/ˈɔ.təm/",
                "optionsAreIPA": true,
                "audioText": "autumn"
            },
            {
                "instruction": "Choose the correct IPA transcription for:",
                "prompt": "honest",
                "promptIsIPA": false,
                "options": [
                    "/ˈɑ.nəsk/",
                    "/ˈɔ.nəst/",
                    "/ˈɑ.nəst/",
                    "/ˈɑ.pəst/"
                ],
                "answer": "/ˈɑ.nəst/",
                "optionsAreIPA": true,
                "audioText": "honest"
            }
        ]
    },
    {
        "id": 3,
        "title": "Sound Category",
        "questions": [
            {
                "instruction": "What kind of sound is this?",
                "prompt": "p",
                "promptIsIPA": true,
                "options": [
                    "Voiceless bilabial plosive",
                    "Voiceless postalveolar affricate",
                    "Voiced postalveolar affricate",
                    "Voiced alveolar fricative"
                ],
                "answer": "Voiceless bilabial plosive",
                "optionsAreIPA": false,
                "audioText": "pat"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "θ",
                "promptIsIPA": true,
                "options": [
                    "Voiceless labiodental fricative",
                    "Voiceless dental fricative",
                    "Voiceless postalveolar affricate",
                    "Voiceless bilabial plosive"
                ],
                "answer": "Voiceless dental fricative",
                "optionsAreIPA": false,
                "audioText": "think"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "ʃ",
                "promptIsIPA": true,
                "options": [
                    "Voiced bilabial plosive",
                    "Voiceless postalveolar fricative",
                    "Closing diphthong (open-mid back to close front)",
                    "Close back rounded"
                ],
                "answer": "Voiceless postalveolar fricative",
                "optionsAreIPA": false,
                "audioText": "she"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "ŋ",
                "promptIsIPA": true,
                "options": [
                    "Voiced velar nasal",
                    "Open back unrounded",
                    "Voiceless postalveolar fricative",
                    "Voiced velar plosive"
                ],
                "answer": "Voiced velar nasal",
                "optionsAreIPA": false,
                "audioText": "sing"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "tʃ",
                "promptIsIPA": true,
                "options": [
                    "Voiceless bilabial plosive",
                    "Near-close near-front unrounded",
                    "Voiceless postalveolar affricate",
                    "Voiceless glottal fricative"
                ],
                "answer": "Voiceless postalveolar affricate",
                "optionsAreIPA": false,
                "audioText": "chip"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "dʒ",
                "promptIsIPA": true,
                "options": [
                    "Voiced postalveolar affricate",
                    "Open-mid back unrounded",
                    "Voiced alveolar fricative",
                    "Closing diphthong (open to close front)"
                ],
                "answer": "Voiced postalveolar affricate",
                "optionsAreIPA": false,
                "audioText": "jam"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "l",
                "promptIsIPA": true,
                "options": [
                    "Near-close near-back rounded",
                    "Voiced alveolar lateral approximant",
                    "Voiceless alveolar fricative",
                    "Closing diphthong (open to close front)"
                ],
                "answer": "Voiced alveolar lateral approximant",
                "optionsAreIPA": false,
                "audioText": "light"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "ɹ",
                "promptIsIPA": true,
                "options": [
                    "Voiced alveolar approximant",
                    "Unstressed r-colored central vowel",
                    "Voiced postalveolar fricative",
                    "Voiced labial-velar approximant"
                ],
                "answer": "Voiced alveolar approximant",
                "optionsAreIPA": false,
                "audioText": "red"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "æ",
                "promptIsIPA": true,
                "options": [
                    "Closing diphthong (mid front to close front)",
                    "Near-open front unrounded",
                    "Closing diphthong (open-mid back to close front)",
                    "Near-close near-front unrounded"
                ],
                "answer": "Near-open front unrounded",
                "optionsAreIPA": false,
                "audioText": "cat"
            },
            {
                "instruction": "What kind of sound is this?",
                "prompt": "oʊ",
                "promptIsIPA": true,
                "options": [
                    "Closing diphthong (mid front to close front)",
                    "Voiced dental fricative",
                    "Closing diphthong (mid back to close back)",
                    "Voiceless postalveolar fricative"
                ],
                "answer": "Closing diphthong (mid back to close back)",
                "optionsAreIPA": false,
                "audioText": "go"
            }
        ]
    },
    {
        "id": 4,
        "title": "Sound → Example Word",
        "questions": [
            {
                "instruction": "Which word contains this sound?",
                "prompt": "f",
                "promptIsIPA": true,
                "options": [
                    "fan",
                    "light",
                    "now",
                    "letter"
                ],
                "answer": "fan",
                "optionsAreIPA": false,
                "audioText": "fan"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "v",
                "promptIsIPA": true,
                "options": [
                    "fan",
                    "van",
                    "dog",
                    "bird"
                ],
                "answer": "van",
                "optionsAreIPA": false,
                "audioText": "van"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "z",
                "promptIsIPA": true,
                "options": [
                    "cat",
                    "saw",
                    "zoo",
                    "light"
                ],
                "answer": "zoo",
                "optionsAreIPA": false,
                "audioText": "zoo"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "h",
                "promptIsIPA": true,
                "options": [
                    "pat",
                    "dog",
                    "say",
                    "hat"
                ],
                "answer": "hat",
                "optionsAreIPA": false,
                "audioText": "hat"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "j",
                "promptIsIPA": true,
                "options": [
                    "no",
                    "yes",
                    "about",
                    "go"
                ],
                "answer": "yes",
                "optionsAreIPA": false,
                "audioText": "yes"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "w",
                "promptIsIPA": true,
                "options": [
                    "about",
                    "zoo",
                    "win",
                    "letter"
                ],
                "answer": "win",
                "optionsAreIPA": false,
                "audioText": "win"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "ɪ",
                "promptIsIPA": true,
                "options": [
                    "pat",
                    "think",
                    "bird",
                    "sit"
                ],
                "answer": "sit",
                "optionsAreIPA": false,
                "audioText": "sit"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "ʌ",
                "promptIsIPA": true,
                "options": [
                    "fan",
                    "hat",
                    "win",
                    "cup"
                ],
                "answer": "cup",
                "optionsAreIPA": false,
                "audioText": "cup"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "ɔ",
                "promptIsIPA": true,
                "options": [
                    "saw",
                    "hat",
                    "too",
                    "uh-oh"
                ],
                "answer": "saw",
                "optionsAreIPA": false,
                "audioText": "saw"
            },
            {
                "instruction": "Which word contains this sound?",
                "prompt": "aɪ",
                "promptIsIPA": true,
                "options": [
                    "see",
                    "this",
                    "my",
                    "cup"
                ],
                "answer": "my",
                "optionsAreIPA": false,
                "audioText": "my"
            }
        ]
    },
    {
        "id": 5,
        "title": "Stress Placement",
        "questions": [
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "banana",
                "promptIsIPA": false,
                "subPrompt": "/bə.ˈnæ.nə/",
                "options": [
                    "3rd syllable",
                    "4th syllable",
                    "1st syllable",
                    "2nd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "banana"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "computer",
                "promptIsIPA": false,
                "subPrompt": "/kəm.ˈpju.tɚ/",
                "options": [
                    "1st syllable",
                    "4th syllable",
                    "2nd syllable",
                    "3rd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "computer"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "umbrella",
                "promptIsIPA": false,
                "subPrompt": "/əm.ˈbɹɛ.lə/",
                "options": [
                    "2nd syllable",
                    "1st syllable",
                    "4th syllable",
                    "3rd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "umbrella"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "tomato",
                "promptIsIPA": false,
                "subPrompt": "/tə.ˈmeɪ.ˌtoʊ/",
                "options": [
                    "2nd syllable",
                    "4th syllable",
                    "1st syllable",
                    "3rd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "tomato"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "guitar",
                "promptIsIPA": false,
                "subPrompt": "/ɡɪ.ˈtɑɹ/",
                "options": [
                    "1st syllable",
                    "3rd syllable",
                    "2nd syllable",
                    "4th syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "guitar"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "september",
                "promptIsIPA": false,
                "subPrompt": "/sɛp.ˈtɛm.bɚ/",
                "options": [
                    "3rd syllable",
                    "4th syllable",
                    "1st syllable",
                    "2nd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "september"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "understand",
                "promptIsIPA": false,
                "subPrompt": "/ˌʌn.dɚ.ˈstænd/",
                "options": [
                    "4th syllable",
                    "3rd syllable",
                    "2nd syllable",
                    "1st syllable"
                ],
                "answer": "3rd syllable",
                "optionsAreIPA": false,
                "audioText": "understand"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "photograph",
                "promptIsIPA": false,
                "subPrompt": "/ˈfoʊ.tə.ˌɡɹæf/",
                "options": [
                    "3rd syllable",
                    "2nd syllable",
                    "1st syllable",
                    "4th syllable"
                ],
                "answer": "1st syllable",
                "optionsAreIPA": false,
                "audioText": "photograph"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "elephant",
                "promptIsIPA": false,
                "subPrompt": "/ˈɛ.lə.fənt/",
                "options": [
                    "1st syllable",
                    "3rd syllable",
                    "2nd syllable",
                    "4th syllable"
                ],
                "answer": "1st syllable",
                "optionsAreIPA": false,
                "audioText": "elephant"
            },
            {
                "instruction": "Which syllable has the primary stress in this word?",
                "prompt": "giraffe",
                "promptIsIPA": false,
                "subPrompt": "/dʒɚ.ˈæf/",
                "options": [
                    "2nd syllable",
                    "1st syllable",
                    "4th syllable",
                    "3rd syllable"
                ],
                "answer": "2nd syllable",
                "optionsAreIPA": false,
                "audioText": "giraffe"
            }
        ]
    },
    {
        "id": 6,
        "title": "Syllable Count",
        "questions": [
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "cat",
                "promptIsIPA": false,
                "subPrompt": "/ˈkæt/",
                "options": [
                    "2 syllables",
                    "3 syllables",
                    "1 syllable",
                    "4 syllables"
                ],
                "answer": "1 syllable",
                "optionsAreIPA": false,
                "audioText": "cat"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "apple",
                "promptIsIPA": false,
                "subPrompt": "/ˈæ.pəl/",
                "options": [
                    "2 syllables",
                    "4 syllables",
                    "3 syllables",
                    "1 syllable"
                ],
                "answer": "2 syllables",
                "optionsAreIPA": false,
                "audioText": "apple"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "banana",
                "promptIsIPA": false,
                "subPrompt": "/bə.ˈnæ.nə/",
                "options": [
                    "5 syllables",
                    "3 syllables",
                    "2 syllables",
                    "4 syllables"
                ],
                "answer": "3 syllables",
                "optionsAreIPA": false,
                "audioText": "banana"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "umbrella",
                "promptIsIPA": false,
                "subPrompt": "/əm.ˈbɹɛ.lə/",
                "options": [
                    "4 syllables",
                    "5 syllables",
                    "3 syllables",
                    "2 syllables"
                ],
                "answer": "3 syllables",
                "optionsAreIPA": false,
                "audioText": "umbrella"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "computer",
                "promptIsIPA": false,
                "subPrompt": "/kəm.ˈpju.tɚ/",
                "options": [
                    "5 syllables",
                    "4 syllables",
                    "3 syllables",
                    "2 syllables"
                ],
                "answer": "3 syllables",
                "optionsAreIPA": false,
                "audioText": "computer"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "television",
                "promptIsIPA": false,
                "subPrompt": "/ˈtɛ.lə.ˌvɪ.ʒən/",
                "options": [
                    "6 syllables",
                    "4 syllables",
                    "5 syllables",
                    "3 syllables"
                ],
                "answer": "4 syllables",
                "optionsAreIPA": false,
                "audioText": "television"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "international",
                "promptIsIPA": false,
                "subPrompt": "/ˌɪn.tɚ.ˈnæ.ʃə.nəl/",
                "options": [
                    "6 syllables",
                    "4 syllables",
                    "5 syllables",
                    "7 syllables"
                ],
                "answer": "5 syllables",
                "optionsAreIPA": false,
                "audioText": "international"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "dog",
                "promptIsIPA": false,
                "subPrompt": "/ˈdɔɡ/",
                "options": [
                    "1 syllable",
                    "4 syllables",
                    "3 syllables",
                    "2 syllables"
                ],
                "answer": "1 syllable",
                "optionsAreIPA": false,
                "audioText": "dog"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "wonderful",
                "promptIsIPA": false,
                "subPrompt": "/ˈwʌn.dɚ.fəl/",
                "options": [
                    "5 syllables",
                    "3 syllables",
                    "2 syllables",
                    "4 syllables"
                ],
                "answer": "3 syllables",
                "optionsAreIPA": false,
                "audioText": "wonderful"
            },
            {
                "instruction": "How many syllables does this word have?",
                "prompt": "photograph",
                "promptIsIPA": false,
                "subPrompt": "/ˈfoʊ.tə.ˌɡɹæf/",
                "options": [
                    "5 syllables",
                    "2 syllables",
                    "3 syllables",
                    "4 syllables"
                ],
                "answer": "3 syllables",
                "optionsAreIPA": false,
                "audioText": "photograph"
            }
        ]
    },
    {
        "id": 7,
        "title": "Narrow Transcription (GA)",
        "questions": [
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "butter",
                "promptIsIPA": false,
                "options": [
                    "[ˈbʌ.ɾɚ]",
                    "/ˈbʌ.tɚ/",
                    "[ˈdʌ.ɾɚ]",
                    "[ˈbɑ.ɾɚ]"
                ],
                "answer": "[ˈbʌ.ɾɚ]",
                "optionsAreIPA": true,
                "audioText": "butter"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "city",
                "promptIsIPA": false,
                "options": [
                    "[ˈsi.ɾi]",
                    "[ˈzɪ.ɾi]",
                    "/ˈsɪ.ti/",
                    "[ˈsɪ.ɾi]"
                ],
                "answer": "[ˈsɪ.ɾi]",
                "optionsAreIPA": true,
                "audioText": "city"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "water",
                "promptIsIPA": false,
                "options": [
                    "[ˈwɔ.ɾɚ]",
                    "[ˈwɔ.ɾɛ]",
                    "[ˈwoʊ.ɾɚ]",
                    "/ˈwɔ.tɚ/"
                ],
                "answer": "[ˈwɔ.ɾɚ]",
                "optionsAreIPA": true,
                "audioText": "water"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "better",
                "promptIsIPA": false,
                "options": [
                    "[ˈdɛ.ɾɚ]",
                    "[ˈbɪ.ɾɚ]",
                    "[ˈbɛ.ɾɚ]",
                    "/ˈbɛ.tɚ/"
                ],
                "answer": "[ˈbɛ.ɾɚ]",
                "optionsAreIPA": true,
                "audioText": "better"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "little",
                "promptIsIPA": false,
                "options": [
                    "/ˈlɪ.təl/",
                    "[ˈlɪ.ɾəl]",
                    "[ˈli.ɾəl]",
                    "[ˈlɪ.ɾəɹ]"
                ],
                "answer": "[ˈlɪ.ɾəl]",
                "optionsAreIPA": true,
                "audioText": "little"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "potato",
                "promptIsIPA": false,
                "options": [
                    "[pə.ˈteɪ.ˌkoʊ]",
                    "[pə.ˈtʰeɪ.ˌtoʊ]",
                    "/pə.ˈteɪ.ˌtoʊ/",
                    "[pə.ˈtaɪ.ˌtoʊ]"
                ],
                "answer": "[pə.ˈtʰeɪ.ˌtoʊ]",
                "optionsAreIPA": true,
                "audioText": "potato"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "table",
                "promptIsIPA": false,
                "options": [
                    "/ˈteɪ.bəl/",
                    "[ˈtaɪ.bəl]",
                    "[ˈteɪ.bəɹ]",
                    "[ˈtʰeɪ.bəl]"
                ],
                "answer": "[ˈtʰeɪ.bəl]",
                "optionsAreIPA": true,
                "audioText": "table"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "party",
                "promptIsIPA": false,
                "options": [
                    "[ˈpʰɑɹ.ti]",
                    "[ˈpɔɹ.ti]",
                    "/ˈpɑɹ.ti/",
                    "[ˈpɑɹ.ki]"
                ],
                "answer": "[ˈpʰɑɹ.ti]",
                "optionsAreIPA": true,
                "audioText": "party"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "daughter",
                "promptIsIPA": false,
                "options": [
                    "[ˈɡɔ.ɾɚ]",
                    "/ˈdɔ.tɚ/",
                    "[ˈdoʊ.ɾɚ]",
                    "[ˈdɔ.ɾɚ]"
                ],
                "answer": "[ˈdɔ.ɾɚ]",
                "optionsAreIPA": true,
                "audioText": "daughter"
            },
            {
                "instruction": "Choose the correct NARROW (General American) transcription for:",
                "prompt": "total",
                "promptIsIPA": false,
                "options": [
                    "[ˈtʰoʊ.ɾəl]",
                    "[ˈtaʊ.ɾəl]",
                    "[ˈtoʊ.ɾəɹ]",
                    "/ˈtoʊ.təl/"
                ],
                "answer": "[ˈtʰoʊ.ɾəl]",
                "optionsAreIPA": true,
                "audioText": "total"
            }
        ]
    },
    {
        "id": 8,
        "title": "British RP Transcription",
        "questions": [
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "car",
                "promptIsIPA": false,
                "options": [
                    "/ˈkɑɹ/",
                    "/ˈkɑː/",
                    "/ˈɡɑː/",
                    "/ˈbɑː/"
                ],
                "answer": "/ˈkɑː/",
                "optionsAreIPA": true,
                "audioText": "car"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "bird",
                "promptIsIPA": false,
                "options": [
                    "/ˈbɜːd/",
                    "/ˈbɝd/",
                    "/ˈbɜːɡ/",
                    "/ˈfɜːd/"
                ],
                "answer": "/ˈbɜːd/",
                "optionsAreIPA": true,
                "audioText": "bird"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "over",
                "promptIsIPA": false,
                "options": [
                    "/ˈəʊ.sə/",
                    "/ˈəʊ.və/",
                    "/ˈəʉ.və/",
                    "/ˈoʊ.vɚ/"
                ],
                "answer": "/ˈəʊ.və/",
                "optionsAreIPA": true,
                "audioText": "over"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "fire",
                "promptIsIPA": false,
                "options": [
                    "/ˈvaɪ.ə/",
                    "/ˈfaɪ.ə/",
                    "/ˈfɔɪ.ə/",
                    "/ˈfaɪ.ɚ/"
                ],
                "answer": "/ˈfaɪ.ə/",
                "optionsAreIPA": true,
                "audioText": "fire"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "hour",
                "promptIsIPA": false,
                "options": [
                    "/ˈaʊ.ɚ/",
                    "/ˈaʊ.ə/",
                    "/ˈeɪ.ə/",
                    "/ˈaʊ.əp/"
                ],
                "answer": "/ˈaʊ.ə/",
                "optionsAreIPA": true,
                "audioText": "hour"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "park",
                "promptIsIPA": false,
                "options": [
                    "/ˈpɑɹk/",
                    "/ˈbɑːk/",
                    "/ˈpɑːk/",
                    "/ˈpɑːb/"
                ],
                "answer": "/ˈpɑːk/",
                "optionsAreIPA": true,
                "audioText": "park"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "more",
                "promptIsIPA": false,
                "options": [
                    "/ˈmɔː/",
                    "/ˈɹɔː/",
                    "/ˈnɔː/",
                    "/ˈmɔɹ/"
                ],
                "answer": "/ˈmɔː/",
                "optionsAreIPA": true,
                "audioText": "more"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "first",
                "promptIsIPA": false,
                "options": [
                    "/ˈfɜːst/",
                    "/ˈfɜːsk/",
                    "/ˈzɜːst/",
                    "/ˈfɝst/"
                ],
                "answer": "/ˈfɜːst/",
                "optionsAreIPA": true,
                "audioText": "first"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "turn",
                "promptIsIPA": false,
                "options": [
                    "/ˈtɜːl/",
                    "/ˈtɝn/",
                    "/ˈtɜːn/",
                    "/ˈdɜːn/"
                ],
                "answer": "/ˈtɜːn/",
                "optionsAreIPA": true,
                "audioText": "turn"
            },
            {
                "instruction": "Choose the correct British (RP) transcription for:",
                "prompt": "hard",
                "promptIsIPA": false,
                "options": [
                    "/ˈhɑːd/",
                    "/ˈhɑːɡ/",
                    "/ˈhɑɹd/",
                    "/ˈhɑːv/"
                ],
                "answer": "/ˈhɑːd/",
                "optionsAreIPA": true,
                "audioText": "hard"
            }
        ]
    },
    {
        "id": 9,
        "title": "Same Vowel Sound",
        "questions": [
            {
                "instruction": "Which word has the SAME vowel sound as \"not\"?",
                "prompt": "not",
                "promptIsIPA": false,
                "subPrompt": "/ˈnɑt/",
                "options": [
                    "cup",
                    "top",
                    "sleep",
                    "blue"
                ],
                "answer": "top",
                "optionsAreIPA": false,
                "audioText": "top"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"call\"?",
                "prompt": "call",
                "promptIsIPA": false,
                "subPrompt": "/ˈkɔl/",
                "options": [
                    "no",
                    "sun",
                    "small",
                    "too"
                ],
                "answer": "small",
                "optionsAreIPA": false,
                "audioText": "small"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"feel\"?",
                "prompt": "feel",
                "promptIsIPA": false,
                "subPrompt": "/ˈfil/",
                "options": [
                    "tell",
                    "eat",
                    "man",
                    "rain"
                ],
                "answer": "eat",
                "optionsAreIPA": false,
                "audioText": "eat"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"room\"?",
                "prompt": "room",
                "promptIsIPA": false,
                "subPrompt": "/ˈɹum/",
                "options": [
                    "hot",
                    "now",
                    "food",
                    "walk"
                ],
                "answer": "food",
                "optionsAreIPA": false,
                "audioText": "food"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"good\"?",
                "prompt": "good",
                "promptIsIPA": false,
                "subPrompt": "/ˈɡʊd/",
                "options": [
                    "hat",
                    "luck",
                    "look",
                    "red"
                ],
                "answer": "look",
                "optionsAreIPA": false,
                "audioText": "look"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"now\"?",
                "prompt": "now",
                "promptIsIPA": false,
                "subPrompt": "/ˈnaʊ/",
                "options": [
                    "like",
                    "not",
                    "cow",
                    "need"
                ],
                "answer": "cow",
                "optionsAreIPA": false,
                "audioText": "cow"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"love\"?",
                "prompt": "love",
                "promptIsIPA": false,
                "subPrompt": "/ˈlʌv/",
                "options": [
                    "sun",
                    "with",
                    "good",
                    "join"
                ],
                "answer": "sun",
                "optionsAreIPA": false,
                "audioText": "sun"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"five\"?",
                "prompt": "five",
                "promptIsIPA": false,
                "subPrompt": "/ˈfaɪv/",
                "options": [
                    "fun",
                    "face",
                    "red",
                    "light"
                ],
                "answer": "light",
                "optionsAreIPA": false,
                "audioText": "light"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"boat\"?",
                "prompt": "boat",
                "promptIsIPA": false,
                "subPrompt": "/ˈboʊt/",
                "options": [
                    "play",
                    "cup",
                    "go",
                    "good"
                ],
                "answer": "go",
                "optionsAreIPA": false,
                "audioText": "go"
            },
            {
                "instruction": "Which word has the SAME vowel sound as \"coin\"?",
                "prompt": "coin",
                "promptIsIPA": false,
                "subPrompt": "/ˈkɔɪn/",
                "options": [
                    "oil",
                    "rain",
                    "round",
                    "home"
                ],
                "answer": "oil",
                "optionsAreIPA": false,
                "audioText": "oil"
            }
        ]
    },
    {
        "id": 10,
        "title": "Odd One Out",
        "questions": [
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "nice",
                    "feel",
                    "night",
                    "light"
                ],
                "answer": "feel",
                "optionsAreIPA": false,
                "audioText": "feel"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "cat",
                    "feel",
                    "eat",
                    "week"
                ],
                "answer": "cat",
                "optionsAreIPA": false,
                "audioText": "cat"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "moon",
                    "need",
                    "room",
                    "food"
                ],
                "answer": "need",
                "optionsAreIPA": false,
                "audioText": "need"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "pin",
                    "fish",
                    "big",
                    "cup"
                ],
                "answer": "cup",
                "optionsAreIPA": false,
                "audioText": "cup"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "round",
                    "down",
                    "get",
                    "out"
                ],
                "answer": "get",
                "optionsAreIPA": false,
                "audioText": "get"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "not",
                    "foot",
                    "could",
                    "book"
                ],
                "answer": "not",
                "optionsAreIPA": false,
                "audioText": "not"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "get",
                    "pen",
                    "tea",
                    "best"
                ],
                "answer": "tea",
                "optionsAreIPA": false,
                "audioText": "tea"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "flag",
                    "noise",
                    "sad",
                    "black"
                ],
                "answer": "noise",
                "optionsAreIPA": false,
                "audioText": "noise"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "hot",
                    "job",
                    "shop",
                    "wood"
                ],
                "answer": "wood",
                "optionsAreIPA": false,
                "audioText": "wood"
            },
            {
                "instruction": "Which word does NOT share the others' vowel sound?",
                "prompt": "",
                "promptIsIPA": false,
                "options": [
                    "make",
                    "name",
                    "say",
                    "food"
                ],
                "answer": "food",
                "optionsAreIPA": false,
                "audioText": "food"
            }
        ]
    }
];
