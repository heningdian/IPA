// Static reference metadata for every IPA symbol the app can produce.
// Used by: the interactive IPA chart (Tab 2) and the phoneme inspector card (Tab 1).

const CONSONANTS_DATA = [
    {
        manner: "Plosive",
        places: {
            Bilabial: [{ sym: "p", name: "Voiceless bilabial plosive", ex: "pat" }, { sym: "b", name: "Voiced bilabial plosive", ex: "bat" }],
            Alveolar: [{ sym: "t", name: "Voiceless alveolar plosive", ex: "top" }, { sym: "d", name: "Voiced alveolar plosive", ex: "dog" }],
            Velar: [{ sym: "k", name: "Voiceless velar plosive", ex: "cat" }, { sym: "ɡ", name: "Voiced velar plosive", ex: "go" }],
            Glottal: [{ sym: "ʔ", name: "Glottal stop", ex: "uh-oh" }]
        }
    },
    {
        manner: "Nasal",
        places: {
            Bilabial: [{ sym: "m", name: "Voiced bilabial nasal", ex: "man" }],
            Alveolar: [{ sym: "n", name: "Voiced alveolar nasal", ex: "no" }],
            Velar: [{ sym: "ŋ", name: "Voiced velar nasal", ex: "sing" }]
        }
    },
    {
        manner: "Fricative",
        places: {
            Labiodental: [{ sym: "f", name: "Voiceless labiodental fricative", ex: "fan" }, { sym: "v", name: "Voiced labiodental fricative", ex: "van" }],
            Dental: [{ sym: "θ", name: "Voiceless dental fricative", ex: "think" }, { sym: "ð", name: "Voiced dental fricative", ex: "this" }],
            Alveolar: [{ sym: "s", name: "Voiceless alveolar fricative", ex: "see" }, { sym: "z", name: "Voiced alveolar fricative", ex: "zoo" }],
            Postalveolar: [{ sym: "ʃ", name: "Voiceless postalveolar fricative", ex: "she" }, { sym: "ʒ", name: "Voiced postalveolar fricative", ex: "measure" }],
            Glottal: [{ sym: "h", name: "Voiceless glottal fricative", ex: "hat" }]
        }
    },
    {
        manner: "Affricate",
        places: {
            Postalveolar: [{ sym: "tʃ", name: "Voiceless postalveolar affricate", ex: "chip" }, { sym: "dʒ", name: "Voiced postalveolar affricate", ex: "jam" }]
        }
    },
    {
        manner: "Approximant",
        places: {
            Alveolar: [{ sym: "ɹ", name: "Voiced alveolar approximant", ex: "red" }],
            Palatal: [{ sym: "j", name: "Voiced palatal approximant", ex: "yes" }],
            Velar: [{ sym: "w", name: "Voiced labial-velar approximant", ex: "win" }]
        }
    },
    {
        manner: "Lateral",
        places: {
            Alveolar: [{ sym: "l", name: "Voiced alveolar lateral approximant", ex: "light" }]
        }
    }
];

const CONSONANT_PLACES = ["Bilabial", "Labiodental", "Dental", "Alveolar", "Postalveolar", "Retroflex", "Palatal", "Velar", "Uvular", "Glottal"];

// Monophthongs
const VOWELS_DATA = [
    { sym: "i", name: "Close front unrounded", ex: "see", type: "vowel" },
    { sym: "ɪ", name: "Near-close near-front unrounded", ex: "sit", type: "vowel" },
    { sym: "ɛ", name: "Open-mid front unrounded", ex: "bed", type: "vowel" },
    { sym: "æ", name: "Near-open front unrounded", ex: "cat", type: "vowel" },
    { sym: "ə", name: "Schwa / Mid central", ex: "about", type: "vowel" },
    { sym: "ʌ", name: "Open-mid back unrounded", ex: "cup", type: "vowel" },
    { sym: "u", name: "Close back rounded", ex: "too", type: "vowel" },
    { sym: "ʊ", name: "Near-close near-back rounded", ex: "book", type: "vowel" },
    { sym: "ɔ", name: "Open-mid back rounded", ex: "saw", type: "vowel" },
    { sym: "ɑ", name: "Open back unrounded", ex: "father", type: "vowel" },
    { sym: "ɝ", name: "Stressed r-colored central vowel", ex: "bird", type: "vowel" },
    { sym: "ɚ", name: "Unstressed r-colored central vowel", ex: "letter", type: "vowel" }
];

// Diphthongs
const DIPHTHONGS_DATA = [
    { sym: "eɪ", name: "Closing diphthong (mid front to close front)", ex: "say", type: "vowel" },
    { sym: "aɪ", name: "Closing diphthong (open to close front)", ex: "my", type: "vowel" },
    { sym: "ɔɪ", name: "Closing diphthong (open-mid back to close front)", ex: "boy", type: "vowel" },
    { sym: "aʊ", name: "Closing diphthong (open to close back)", ex: "now", type: "vowel" },
    { sym: "oʊ", name: "Closing diphthong (mid back to close back)", ex: "go", type: "vowel" }
];

// Suprasegmentals & Diacritics.
// `ex` is the illustrative display text (can contain IPA/slashes); `audio` is
// a plain orthographic word safe to hand to speech synthesis.
const SUPRA_DATA = [
    { sym: "ˈ", name: "Primary Stress", ex: "ˈpho.ne.tics", audio: "phonetics", type: "stress" },
    { sym: "ˌ", name: "Secondary Stress", ex: "ˌed.u.ˈca.tion", audio: "education", type: "stress" },
    { sym: ".", name: "Syllable Boundary", ex: "a.bout", audio: "about", type: "stress" },
    { sym: "ː", name: "Length mark (long vowel)", ex: "RP car /kɑː/", audio: "car", type: "diacritic" }
];

// Flat lookup: symbol -> {name, type, features, example, audio}. Built once at load.
// `audio` is always a plain word/short phrase that a TTS engine can actually
// pronounce - never a bare IPA symbol, which speech synthesis engines do not
// reliably read as the intended sound (they'll spell it out, skip it, or
// mispronounce it as an unrelated character).
const PHONEME_INFO = {};
(function buildPhonemeInfo() {
    CONSONANTS_DATA.forEach(row => {
        Object.keys(row.places).forEach(place => {
            row.places[place].forEach(item => {
                PHONEME_INFO[item.sym] = { name: item.name, type: "consonant", features: `${row.manner} • ${place}`, example: item.ex, audio: item.ex };
            });
        });
    });
    VOWELS_DATA.forEach(v => {
        PHONEME_INFO[v.sym] = { name: v.name, type: "vowel", features: "Monophthong", example: v.ex, audio: v.ex };
    });
    DIPHTHONGS_DATA.forEach(v => {
        PHONEME_INFO[v.sym] = { name: v.name, type: "vowel", features: "Diphthong", example: v.ex, audio: v.ex };
    });
    SUPRA_DATA.forEach(s => {
        PHONEME_INFO[s.sym] = { name: s.name, type: s.type, features: "Suprasegmental", example: s.ex, audio: s.audio };
    });
    // Dialect-only vowel variants produced by the GB/AU transforms, so the
    // inspector never shows a blank card if a user clicks a chip in those modes.
    const extra = {
        "ɜː": { name: "Open-mid central unrounded (long)", type: "vowel", features: "Monophthong (non-rhotic)", example: "RP bird /bɜːd/", audio: "bird" },
        "ɪə": { name: "Centering diphthong", type: "vowel", features: "Diphthong (non-rhotic)", example: "RP near /nɪə/", audio: "near" },
        "ɛə": { name: "Centering diphthong", type: "vowel", features: "Diphthong (non-rhotic)", example: "RP square /skwɛə/", audio: "square" },
        "ʊə": { name: "Centering diphthong", type: "vowel", features: "Diphthong (non-rhotic)", example: "RP cure /kjʊə/", audio: "cure" },
        "ɑː": { name: "Open back unrounded (long)", type: "vowel", features: "Monophthong", example: "RP car /kɑː/", audio: "car" },
        "ɔː": { name: "Open-mid back rounded (long)", type: "vowel", features: "Monophthong", example: "RP born /bɔːn/", audio: "born" },
        "əʊ": { name: "Closing diphthong (RP GOAT vowel)", type: "vowel", features: "Diphthong", example: "RP go /ɡəʊ/", audio: "go" },
        "æɪ": { name: "Closing diphthong (Australian FACE vowel)", type: "vowel", features: "Diphthong", example: "AuE say /sæɪ/", audio: "say" },
        "əʉ": { name: "Closing diphthong (Australian GOAT vowel)", type: "vowel", features: "Diphthong", example: "AuE go /ɡəʉ/", audio: "go" },
        "ʉ": { name: "Close central rounded (Australian GOOSE vowel)", type: "vowel", features: "Monophthong", example: "AuE too /tʉː/", audio: "too" },
        "ɾ": { name: "Alveolar tap (American flap)", type: "consonant", features: "Tap • Alveolar", example: "GA butter /ˈbʌɾɚ/", audio: "butter" }
    };
    Object.assign(PHONEME_INFO, extra);
})();
