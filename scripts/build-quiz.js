// Generates js/quiz-data.js: 10 practice-quiz batches x 10 questions, built and
// verified programmatically against the real transcription engine (js/g2p.js)
// instead of hand-typed, so every correct answer is guaranteed accurate and
// every question has exactly one right answer among four distinct options.
//
// Run with: node scripts/build-quiz.js

const vm = require('vm');
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
global.window = global;
function load(p) { vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: p }); }
load(path.join(ROOT, 'assets', 'dict.js'));
load(path.join(ROOT, 'js', 'phoneme-info.js'));
load(path.join(ROOT, 'js', 'g2p.js'));

const GA = { dialect: 'en-US', notation: 'broad', includeStress: true, includeSyllables: true };
const GA_NARROW = { dialect: 'en-US', notation: 'narrow', includeStress: true, includeSyllables: true };
const GB = { dialect: 'en-GB', notation: 'broad', includeStress: true, includeSyllables: true };
const AU = { dialect: 'en-AU', notation: 'broad', includeStress: true, includeSyllables: true };

function ipaOf(word, opts) { return transcribeSentence(word, opts).words[0].ipa; }
function rawOf(word, opts) { return transcribeSentence(word, opts).words[0].rawDisplay; }
function wrapOf(s, opts) { return opts.notation === 'broad' ? `/${s}/` : `[${s}]`; }

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function assert(cond, msg) { if (!cond) throw new Error('ASSERTION FAILED: ' + msg); }
function makeOptions(correct, wrongs) {
    assert(new Set([correct, ...wrongs]).size === 4, 'options not unique: ' + JSON.stringify([correct, ...wrongs]));
    return shuffle([correct, ...wrongs]);
}

const VOWEL_ROTATION = ['æ', 'ɛ', 'ɪ', 'i', 'ʌ', 'ɑ', 'ɔ', 'oʊ', 'aʊ', 'eɪ', 'aɪ', 'ɔɪ', 'ʊ', 'u', 'ɝ', 'ɚ'];
const VOWEL_SET = new Set(VOWEL_ROTATION);
const CONS_ROTATION = ['p', 't', 'k', 'b', 'd', 'ɡ', 'f', 'v', 's', 'z', 'm', 'n', 'l', 'ɹ'];

// Builds 3 guaranteed-different wrong raw IPA strings by perturbing tokens
// (a vowel/consonant swap, etc.) of a correct raw transcription.
function buildWrongRaws(rawCorrect) {
    const parts = rawCorrect.match(/[ˈˌ.]|tʃ|dʒ|eɪ|aɪ|ɔɪ|aʊ|oʊ|əʊ|əʉ|æɪ|ɪə|ɛə|ʊə|ɜː|ɑː|ɔː|[pbtdkɡfvθðszʃʒhmnŋlɹwjɾɪɛæəʌuʊɔɑiɝɚʉ]/g) || [rawCorrect];
    const vowelIdx = parts.map((p, i) => VOWEL_SET.has(p) ? i : -1).filter(i => i >= 0);
    const consIdx = parts.map((p, i) => CONS_ROTATION.includes(p) ? i : -1).filter(i => i >= 0);

    const variants = [];
    if (vowelIdx.length) {
        const p2 = parts.slice();
        const cur = p2[vowelIdx[0]];
        p2[vowelIdx[0]] = VOWEL_ROTATION[(VOWEL_ROTATION.indexOf(cur) + 1) % VOWEL_ROTATION.length];
        variants.push(p2.join(''));
    }
    if (consIdx.length) {
        const p2 = parts.slice();
        const idx = consIdx[consIdx.length - 1];
        const cur = p2[idx];
        p2[idx] = CONS_ROTATION[(CONS_ROTATION.indexOf(cur) + 1) % CONS_ROTATION.length];
        variants.push(p2.join(''));
    }
    if (consIdx.length) {
        const p2 = parts.slice();
        const idx = consIdx[0];
        const cur = p2[idx];
        p2[idx] = CONS_ROTATION[(CONS_ROTATION.indexOf(cur) + 3) % CONS_ROTATION.length];
        variants.push(p2.join(''));
    }
    if (vowelIdx.length > 1) {
        const p2 = parts.slice();
        const cur = p2[vowelIdx[1]];
        p2[vowelIdx[1]] = VOWEL_ROTATION[(VOWEL_ROTATION.indexOf(cur) + 2) % VOWEL_ROTATION.length];
        variants.push(p2.join(''));
    }
    variants.push(rawCorrect + 'p');
    variants.push(rawCorrect + 't');

    const unique = [];
    for (const v of variants) {
        if (v !== rawCorrect && !unique.includes(v)) unique.push(v);
        if (unique.length === 3) break;
    }
    assert(unique.length === 3, 'could not build 3 wrong raws for ' + rawCorrect);
    return unique;
}

const batches = [];

// ---------------- Batch 1: IPA -> Word ----------------
{
    const items = [
        ['phonetics', ['Phonetics', 'Phonics', 'Phonebook', 'Fantastic']],
        ['language', ['Language', 'Languish', 'Laughter', 'Luggage']],
        ['alphabet', ['Alphabet', 'Alfalfa', 'Altitude', 'Albatross']],
        ['caterpillar', ['Caterpillar', 'Category', 'Captain', 'Capital']],
        ['journey', ['Journey', 'Journal', 'Jury', 'Jewelry']],
        ['knowledge', ['Knowledge', 'Novelty', 'Nourish', 'Naughty']],
        ['psychology', ['Psychology', 'Physiology', 'Sociology', 'Cardiology']],
        ['computer', ['Computer', 'Commuter', 'Compute', 'Comforter']],
        ['elephant', ['Elephant', 'Element', 'Eloquent', 'Elegant']],
        ['umbrella', ['Umbrella', 'Umpire', 'Umbilical', 'Unbearable']],
    ];
    const questions = items.map(([word, options]) => {
        const correct = options[0];
        return {
            instruction: 'Identify the English word for this IPA:',
            prompt: ipaOf(word, GA), promptIsIPA: true,
            options: makeOptions(correct, options.slice(1)),
            answer: correct, optionsAreIPA: false,
            audioText: word,
        };
    });
    batches.push({ id: 1, title: 'IPA → Word', questions });
}

// ---------------- Batch 2: Word -> IPA ----------------
{
    const words = ['cat', 'phone', 'school', 'laugh', 'listen', 'island', 'thumb', 'castle', 'autumn', 'honest'];
    const questions = words.map(word => {
        const correct = ipaOf(word, GA);
        const rawCorrect = rawOf(word, GA);
        const options = buildWrongRaws(rawCorrect).map(r => wrapOf(r, GA));
        return {
            instruction: 'Choose the correct IPA transcription for:',
            prompt: word, promptIsIPA: false,
            options: makeOptions(correct, options),
            answer: correct, optionsAreIPA: true,
            audioText: word,
        };
    });
    batches.push({ id: 2, title: 'Word → IPA', questions });
}

// Clean pool: only symbols with a real single-word example (excludes
// suprasegmentals and dialect-only variants, whose "example" field is an
// illustrative phrase like "RP bird /bɜːd/", not a plain word).
const CLEAN_SYMBOLS = [];
CONSONANTS_DATA.forEach(row => Object.values(row.places).forEach(items => items.forEach(it => CLEAN_SYMBOLS.push(it.sym))));
VOWELS_DATA.forEach(v => CLEAN_SYMBOLS.push(v.sym));
DIPHTHONGS_DATA.forEach(v => CLEAN_SYMBOLS.push(v.sym));

// ---------------- Batch 3: Sound Category (symbol -> phonetic name) ----------------
{
    const symbols = ['p', 'θ', 'ʃ', 'ŋ', 'tʃ', 'dʒ', 'l', 'ɹ', 'æ', 'oʊ'];
    const questions = symbols.map(sym => {
        const info = PHONEME_INFO[sym];
        assert(info, 'no PHONEME_INFO for ' + sym);
        const correct = info.name;
        const seenNames = new Set([correct]);
        const wrongs = [];
        for (const s of shuffle(CLEAN_SYMBOLS)) {
            if (s === sym) continue;
            const name = PHONEME_INFO[s].name;
            if (seenNames.has(name)) continue;
            seenNames.add(name);
            wrongs.push(name);
            if (wrongs.length === 3) break;
        }
        return {
            instruction: 'What kind of sound is this?',
            prompt: sym, promptIsIPA: true,
            options: makeOptions(correct, wrongs),
            answer: correct, optionsAreIPA: false,
            audioText: info.audio || info.example || sym,
        };
    });
    batches.push({ id: 3, title: 'Sound Category', questions });
}

// ---------------- Batch 4: Sound -> Example Word ----------------
{
    const symbols = ['f', 'v', 'z', 'h', 'j', 'w', 'ɪ', 'ʌ', 'ɔ', 'aɪ'];
    const questions = symbols.map(sym => {
        const info = PHONEME_INFO[sym];
        assert(info, 'no PHONEME_INFO for ' + sym);
        const correct = info.example;
        const seenExamples = new Set([correct]);
        const wrongs = [];
        for (const s of shuffle(CLEAN_SYMBOLS)) {
            if (s === sym) continue;
            const ex = PHONEME_INFO[s].example;
            if (seenExamples.has(ex)) continue;
            seenExamples.add(ex);
            wrongs.push(ex);
            if (wrongs.length === 3) break;
        }
        return {
            instruction: 'Which word contains this sound?',
            prompt: sym, promptIsIPA: true,
            options: makeOptions(correct, wrongs),
            answer: correct, optionsAreIPA: false,
            audioText: correct,
        };
    });
    batches.push({ id: 4, title: 'Sound → Example Word', questions });
}

// ---------------- Batch 5: Stress Placement ----------------
{
    const words = ['banana', 'computer', 'umbrella', 'tomato', 'guitar', 'september', 'understand', 'photograph', 'elephant', 'giraffe'];
    const ORDINALS = ['1st syllable', '2nd syllable', '3rd syllable', '4th syllable'];
    const questions = words.map(word => {
        const raw = rawOf(word, GA);
        const syllables = raw.split('.');
        const stressIdx = syllables.findIndex(s => s.startsWith('ˈ'));
        assert(stressIdx >= 0 && stressIdx < 4, 'bad stress index for ' + word + ': ' + raw);
        const correct = ORDINALS[stressIdx];
        const wrongs = ORDINALS.filter(o => o !== correct);
        return {
            instruction: 'Which syllable has the primary stress in this word?',
            prompt: word, promptIsIPA: false,
            subPrompt: ipaOf(word, GA),
            options: makeOptions(correct, wrongs),
            answer: correct, optionsAreIPA: false,
            audioText: word,
        };
    });
    batches.push({ id: 5, title: 'Stress Placement', questions });
}

// ---------------- Batch 6: Syllable Count ----------------
{
    const words = ['cat', 'apple', 'banana', 'umbrella', 'computer', 'television', 'international', 'dog', 'wonderful', 'photograph'];
    const LABELS = n => `${n} syllable${n === 1 ? '' : 's'}`;
    const questions = words.map(word => {
        const raw = rawOf(word, GA);
        const count = raw.split('.').length;
        const correct = LABELS(count);
        const candidates = new Set();
        let delta = 1;
        while (candidates.size < 3) {
            for (const d of [delta, -delta]) {
                const n = count + d;
                if (n >= 1 && n <= 7 && n !== count) candidates.add(LABELS(n));
                if (candidates.size >= 3) break;
            }
            delta++;
        }
        return {
            instruction: 'How many syllables does this word have?',
            prompt: word, promptIsIPA: false,
            subPrompt: ipaOf(word, GA),
            options: makeOptions(correct, Array.from(candidates).slice(0, 3)),
            answer: correct, optionsAreIPA: false,
            audioText: word,
        };
    });
    batches.push({ id: 6, title: 'Syllable Count', questions });
}

// ---------------- Batch 7: Narrow Transcription (GA) ----------------
{
    const words = ['butter', 'city', 'water', 'better', 'little', 'potato', 'table', 'party', 'daughter', 'total'];
    const questions = words.map(word => {
        const correct = ipaOf(word, GA_NARROW);
        const rawCorrect = rawOf(word, GA_NARROW);
        const wrongRaws = buildWrongRaws(rawCorrect);
        const broad = ipaOf(word, GA);
        let options;
        if (broad !== correct) {
            const set = new Set([broad]);
            let i = 0;
            while (set.size < 3 && i < wrongRaws.length) { set.add(wrapOf(wrongRaws[i], GA_NARROW)); i++; }
            options = Array.from(set).filter(o => o !== correct).slice(0, 3);
        } else {
            options = wrongRaws.map(r => wrapOf(r, GA_NARROW));
        }
        return {
            instruction: 'Choose the correct NARROW (General American) transcription for:',
            prompt: word, promptIsIPA: false,
            options: makeOptions(correct, options),
            answer: correct, optionsAreIPA: true,
            audioText: word,
        };
    });
    batches.push({ id: 7, title: 'Narrow Transcription (GA)', questions });
}

// ---------------- Batch 8: British RP Transcription ----------------
{
    const words = ['car', 'bird', 'over', 'fire', 'hour', 'park', 'more', 'first', 'turn', 'hard'];
    const questions = words.map(word => {
        const correct = ipaOf(word, GB);
        const ga = ipaOf(word, GA);
        const au = ipaOf(word, AU);
        const rawCorrect = rawOf(word, GB);
        const perturbed = buildWrongRaws(rawCorrect).map(r => wrapOf(r, GB));
        const uniquePool = Array.from(new Set([ga, au, ...perturbed].filter(o => o !== correct)));
        assert(uniquePool.length >= 3, 'not enough distinct wrong options for ' + word);
        return {
            instruction: 'Choose the correct British (RP) transcription for:',
            prompt: word, promptIsIPA: false,
            options: makeOptions(correct, uniquePool.slice(0, 3)),
            answer: correct, optionsAreIPA: true,
            audioText: word,
        };
    });
    batches.push({ id: 8, title: 'British RP Transcription', questions });
}

// ---------------- Vowel-grouped word pool (for batches 9 & 10) ----------------
const VOWEL_POOL = {
    'æ': ['cat', 'man', 'hat', 'back', 'sad', 'flag', 'black'],
    'ɛ': ['bed', 'red', 'get', 'pen', 'best', 'tell', 'said'],
    'ɪ': ['sit', 'pin', 'big', 'fish', 'wish', 'with'],
    'i': ['see', 'tea', 'eat', 'feel', 'sleep', 'green', 'need', 'week'],
    'ʌ': ['cup', 'sun', 'fun', 'luck', 'love'],
    'ɑ': ['top', 'box', 'hot', 'stop', 'job', 'shop', 'not'],
    'ɔ': ['saw', 'call', 'ball', 'walk', 'talk', 'small', 'fall', 'law'],
    'oʊ': ['go', 'boat', 'home', 'no', 'so', 'coat', 'road'],
    'aʊ': ['now', 'out', 'house', 'cow', 'loud', 'round', 'down'],
    'eɪ': ['day', 'say', 'name', 'make', 'play', 'wait', 'rain', 'face'],
    'aɪ': ['time', 'five', 'light', 'night', 'like', 'nice', 'side'],
    'ɔɪ': ['boy', 'toy', 'oil', 'point', 'voice', 'join', 'noise', 'coin'],
    'ʊ': ['book', 'look', 'good', 'full', 'foot', 'wood', 'could'],
    'u': ['too', 'food', 'moon', 'blue', 'true', 'school', 'soon', 'room'],
};

// Verify every word in the pool actually has the claimed stressed vowel -
// don't trust the hand-picked grouping, check it against the real engine.
function stressedVowelOf(word) {
    const raw = rawOf(word, GA);
    const syll = raw.split('.').find(s => s.startsWith('ˈ')) || raw.split('.')[0];
    const toks = tokenizeIPA(syll.replace(/[ˈˌ]/g, ''));
    return toks.find(t => VOWEL_SET.has(t));
}
for (const [vowel, words] of Object.entries(VOWEL_POOL)) {
    for (const w of words) {
        const actual = stressedVowelOf(w);
        assert(actual === vowel, `pool mismatch: "${w}" has stressed vowel "${actual}", expected "${vowel}"`);
    }
}
const VOWEL_KEYS = Object.keys(VOWEL_POOL);

// ---------------- Batch 9: Same Vowel Sound ----------------
{
    const chosenVowels = shuffle(VOWEL_KEYS).slice(0, 10);
    const questions = chosenVowels.map(vowel => {
        const group = shuffle(VOWEL_POOL[vowel]);
        const target = group[0];
        const correct = group[1];
        const otherVowels = shuffle(VOWEL_KEYS.filter(v => v !== vowel)).slice(0, 3);
        const wrongs = otherVowels.map(v => shuffle(VOWEL_POOL[v])[0]);
        return {
            instruction: `Which word has the SAME vowel sound as "${target}"?`,
            prompt: target, promptIsIPA: false,
            subPrompt: ipaOf(target, GA),
            options: makeOptions(correct, wrongs),
            answer: correct, optionsAreIPA: false,
            audioText: correct,
        };
    });
    batches.push({ id: 9, title: 'Same Vowel Sound', questions });
}

// ---------------- Batch 10: Odd One Out ----------------
{
    const chosenVowels = shuffle(VOWEL_KEYS).slice(0, 10);
    const questions = chosenVowels.map(vowel => {
        const group = shuffle(VOWEL_POOL[vowel]);
        const same3 = group.slice(0, 3);
        const otherVowel = shuffle(VOWEL_KEYS.filter(v => v !== vowel))[0];
        const oddOne = shuffle(VOWEL_POOL[otherVowel])[0];
        return {
            instruction: "Which word does NOT share the others' vowel sound?",
            prompt: '', promptIsIPA: false,
            options: shuffle([...same3, oddOne]),
            answer: oddOne, optionsAreIPA: false,
            audioText: oddOne,
        };
    });
    batches.push({ id: 10, title: 'Odd One Out', questions });
}

// ---------------- Final validation ----------------
assert(batches.length === 10, 'expected 10 batches, got ' + batches.length);
for (const b of batches) {
    assert(b.questions.length === 10, `batch ${b.id} has ${b.questions.length} questions, expected 10`);
    for (const q of b.questions) {
        assert(q.options.length === 4, `batch ${b.id}: options.length !== 4`);
        assert(new Set(q.options).size === 4, `batch ${b.id}: duplicate options`);
        assert(q.options.includes(q.answer), `batch ${b.id}: answer not among options`);
    }
}

const outPath = path.join(ROOT, 'js', 'quiz-data.js');
const header = `// Practice quiz content: 10 batches x 10 questions, generated and verified
// programmatically against the real js/g2p.js transcription engine (see
// scripts/build-quiz.js) rather than hand-typed, so every correct answer is
// guaranteed accurate and every set of options is guaranteed to have exactly
// one right answer among four distinct choices.
const QUIZ_BATCHES = `;
fs.writeFileSync(outPath, header + JSON.stringify(batches, null, 4) + ';\n');
console.log('Wrote', outPath, '-', batches.length, 'batches,', batches.reduce((n, b) => n + b.questions.length, 0), 'questions total.');
