// PhoneticCraft English Grapheme-to-Phoneme (G2P) engine.
//
// Three-tier pipeline, tried in order for every word:
//   1. Exact dictionary lookup      (window.IPA_DICT, ~124k words derived from CMUdict)
//   2. Morphological decomposition  (strip common suffixes, look up the stem, re-attach
//                                    the suffix's own pronunciation rule)
//   3. Rule-based letter-to-sound   (heuristic fallback for names / invented / rare words)
//
// Tier 1 and 2 results are exact (verified). Tier 3 results are approximate and are
// flagged with source:"estimated" so the UI can be transparent about confidence.
//
// A dialect transform (GA -> RP / Australian) is applied afterwards on the IPA string,
// and an optional set of narrow-transcription rules (aspiration, flapping) can be layered
// on top for General American narrow notation.

const VOICELESS_CONSONANTS = new Set(['p', 't', 'k', 'f', 'θ', 's', 'ʃ', 'tʃ', 'h']);
const SIBILANTS = new Set(['s', 'z', 'ʃ', 'ʒ', 'tʃ', 'dʒ']);

// All phoneme tokens the engine can ever emit, longest first, for greedy tokenizing.
const ALL_PHONEME_TOKENS = [
    'aɪə', 'aʊə',
    'tʃ', 'dʒ', 'eɪ', 'aɪ', 'ɔɪ', 'aʊ', 'oʊ', 'əʊ', 'əʉ', 'æɪ', 'ɪə', 'ɛə', 'ʊə', 'ɜː', 'ɑː', 'ɔː',
    'p', 't', 'k', 'b', 'd', 'ɡ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'm', 'n', 'ŋ', 'l', 'ɹ', 'w', 'j', 'ɾ',
    'ɪ', 'ɛ', 'æ', 'ə', 'ʌ', 'u', 'ʊ', 'ɔ', 'ɑ', 'i', 'ɝ', 'ɚ', 'ʉ'
].sort((a, b) => b.length - a.length);

function tokenizeIPA(annotated) {
    const clean = annotated.replace(/[ˈˌ.ʰ]/g, '');
    const tokens = [];
    let i = 0;
    outer:
    while (i < clean.length) {
        for (const tok of ALL_PHONEME_TOKENS) {
            if (clean.startsWith(tok, i)) {
                tokens.push(tok);
                i += tok.length;
                continue outer;
            }
        }
        // Unknown character (shouldn't normally happen) - skip it.
        i += 1;
    }
    return tokens;
}

// ---------- Tier 1: dictionary ----------

function parseDictEntry(raw) {
    const idx = raw.indexOf(';');
    return { annotated: raw.slice(0, idx) };
}

function lookupDict(word) {
    const dict = window.IPA_DICT;
    if (dict && Object.prototype.hasOwnProperty.call(dict, word)) {
        return { annotated: parseDictEntry(dict[word]).annotated, source: 'dict' };
    }
    return null;
}

// ---------- Syllable string helpers ----------

function splitSyllables(annotated) {
    return annotated.split('.').map(s => {
        const m = s.match(/^([ˈˌ]?)(.*)$/);
        return { stress: m[1], body: m[2] };
    });
}

function joinSyllables(syllables) {
    return syllables.map(s => s.stress + s.body).join('.');
}

function lastPhoneOf(annotated) {
    const toks = tokenizeIPA(annotated);
    return toks.length ? toks[toks.length - 1] : '';
}

// ---------- Tier 2: morphological suffix stripping ----------

const SUFFIX_RULES = [
    { suf: "'s", kind: 'attach-s' },
    { suf: 'edly', kind: 'literal', syllables: [{ stress: '', body: 'ɪd' }, { stress: '', body: 'li' }] },
    { suf: 'ing', kind: 'literal', syllables: [{ stress: '', body: 'ɪŋ' }] },
    { suf: 'edness', kind: 'literal', syllables: [{ stress: '', body: 'ɪd' }, { stress: '', body: 'nəs' }] },
    { suf: 'ed', kind: 'attach-ed' },
    { suf: 'es', kind: 'attach-s' },
    { suf: 's', kind: 'attach-s' },
    { suf: 'est', kind: 'literal', syllables: [{ stress: '', body: 'ɪst' }] },
    { suf: 'er', kind: 'literal', syllables: [{ stress: '', body: 'ɚ' }] },
    { suf: 'ness', kind: 'literal', syllables: [{ stress: '', body: 'nəs' }] },
    { suf: 'ment', kind: 'literal', syllables: [{ stress: '', body: 'mənt' }] },
    { suf: 'able', kind: 'literal', syllables: [{ stress: '', body: 'ə' }, { stress: '', body: 'bəl' }] },
    { suf: 'ible', kind: 'literal', syllables: [{ stress: '', body: 'ɪ' }, { stress: '', body: 'bəl' }] },
    { suf: 'ful', kind: 'literal', syllables: [{ stress: '', body: 'fəl' }] },
    { suf: 'less', kind: 'literal', syllables: [{ stress: '', body: 'ləs' }] },
    { suf: 'ly', kind: 'literal', syllables: [{ stress: '', body: 'li' }] },
    { suf: 'y', kind: 'literal', syllables: [{ stress: '', body: 'i' }], minStem: 3 },
];

function getStemCandidates(stem) {
    const candidates = [stem];
    candidates.push(stem + 'e');
    if (stem.length >= 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
        candidates.push(stem.slice(0, -1));
    }
    if (stem.endsWith('i')) {
        candidates.push(stem.slice(0, -1) + 'y');
    }
    return candidates;
}

function trySuffixStrip(word) {
    for (const rule of SUFFIX_RULES) {
        if (!word.endsWith(rule.suf) || word.length <= rule.suf.length) continue;
        const rawStem = word.slice(0, -rule.suf.length);
        if (rule.minStem && rawStem.length < rule.minStem) continue;
        for (const cand of getStemCandidates(rawStem)) {
            const base = lookupDict(cand) || trySuffixStrip(cand);
            if (!base) continue;
            const syllables = splitSyllables(base.annotated);
            if (rule.kind === 'literal') {
                rule.syllables.forEach(s => syllables.push({ stress: s.stress, body: s.body }));
            } else if (rule.kind === 'attach-s') {
                const last = lastPhoneOf(base.annotated);
                if (SIBILANTS.has(last)) {
                    syllables.push({ stress: '', body: 'ɪz' });
                } else if (VOICELESS_CONSONANTS.has(last)) {
                    syllables[syllables.length - 1].body += 's';
                } else {
                    syllables[syllables.length - 1].body += 'z';
                }
            } else if (rule.kind === 'attach-ed') {
                const last = lastPhoneOf(base.annotated);
                if (last === 't' || last === 'd') {
                    syllables.push({ stress: '', body: 'ɪd' });
                } else if (VOICELESS_CONSONANTS.has(last)) {
                    syllables[syllables.length - 1].body += 't';
                } else {
                    syllables[syllables.length - 1].body += 'd';
                }
            }
            return { annotated: joinSyllables(syllables), source: 'derived' };
        }
    }
    return null;
}

// ---------- Tier 3: rule-based letter-to-sound fallback ----------

const VOWEL_LETTERS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

function ruleBasedPhones(word) {
    const n = word.length;
    const phones = []; // {p, v}
    let i = 0;

    const match = (str) => word.startsWith(str, i);
    const atStart = () => i === 0;
    const atEnd = (len) => i + len === n;
    const hasEarlierVowel = () => {
        for (let k = 0; k < i; k++) if (VOWEL_LETTERS.has(word[k])) return true;
        return false;
    };
    const hasLaterVowel = (from) => {
        for (let k = from; k < n; k++) if (VOWEL_LETTERS.has(word[k])) return true;
        return false;
    };

    while (i < n) {
        // --- multi-letter special endings ---
        if (match('tion') && atEnd(4)) { phones.push({ p: 'ʃ', v: false }, { p: 'ə', v: true }, { p: 'n', v: false }); i += 4; continue; }
        if (match('sion') && atEnd(4)) { phones.push({ p: 'ʃ', v: false }, { p: 'ə', v: true }, { p: 'n', v: false }); i += 4; continue; }
        if (match('cian') && atEnd(4)) { phones.push({ p: 'ʃ', v: false }, { p: 'ə', v: true }, { p: 'n', v: false }); i += 4; continue; }
        if (match('ture') && atEnd(4)) { phones.push({ p: 'tʃ', v: false }, { p: 'ɚ', v: true }); i += 4; continue; }
        if (match('sure') && atEnd(4)) { phones.push({ p: 'ʒ', v: false }, { p: 'ɚ', v: true }); i += 4; continue; }
        if (match('eigh')) { phones.push({ p: 'eɪ', v: true }); i += 4; continue; }
        if (match('augh')) { phones.push({ p: 'ɔ', v: true }); i += 4; continue; }
        if (match('ough')) { phones.push({ p: 'oʊ', v: true }); i += 4; continue; }
        if (match('igh')) { phones.push({ p: 'aɪ', v: true }); i += 3; continue; }
        if (match('tch')) { phones.push({ p: 'tʃ', v: false }); i += 3; continue; }
        if (match('dge')) { phones.push({ p: 'dʒ', v: false }); i += 3; continue; }

        // --- two-letter digraphs ---
        if (match('ck')) { phones.push({ p: 'k', v: false }); i += 2; continue; }
        if (match('ng')) { phones.push({ p: 'ŋ', v: false }); i += 2; continue; }
        if (match('nk')) { phones.push({ p: 'ŋ', v: false }, { p: 'k', v: false }); i += 2; continue; }
        if (match('qu')) { phones.push({ p: 'k', v: false }, { p: 'w', v: false }); i += 2; continue; }
        if (match('ph')) { phones.push({ p: 'f', v: false }); i += 2; continue; }
        if (match('gh')) { if (atStart()) { phones.push({ p: 'ɡ', v: false }); } i += 2; continue; }
        if (match('kn') && atStart()) { phones.push({ p: 'n', v: false }); i += 2; continue; }
        if (match('wr') && atStart()) { phones.push({ p: 'ɹ', v: false }); i += 2; continue; }
        if (match('wh') && atStart()) { phones.push({ p: 'w', v: false }); i += 2; continue; }
        if (match('gn') && atEnd(2)) { phones.push({ p: 'n', v: false }); i += 2; continue; }
        if (match('mb') && atEnd(2)) { phones.push({ p: 'm', v: false }); i += 2; continue; }
        if (match('ch')) { phones.push({ p: 'tʃ', v: false }); i += 2; continue; }
        if (match('sh')) { phones.push({ p: 'ʃ', v: false }); i += 2; continue; }
        if (match('th')) { phones.push({ p: 'θ', v: false }); i += 2; continue; }
        if (match('ar')) { phones.push({ p: 'ɑ', v: true }, { p: 'ɹ', v: false }); i += 2; continue; }
        if (match('or')) { phones.push({ p: 'ɔ', v: true }, { p: 'ɹ', v: false }); i += 2; continue; }
        if (match('er') || match('ir') || match('ur')) { phones.push({ p: 'ɚ', v: true }); i += 2; continue; }
        if (match('ai') || match('ay')) { phones.push({ p: 'eɪ', v: true }); i += 2; continue; }
        if (match('ea')) { phones.push({ p: 'i', v: true }); i += 2; continue; }
        if (match('ee')) { phones.push({ p: 'i', v: true }); i += 2; continue; }
        if (match('oa') || match('oe')) { phones.push({ p: 'oʊ', v: true }); i += 2; continue; }
        if (match('oo')) { phones.push({ p: 'u', v: true }); i += 2; continue; }
        if (match('ou')) { phones.push({ p: 'aʊ', v: true }); i += 2; continue; }
        if (match('ow')) { phones.push({ p: atEnd(2) ? 'oʊ' : 'aʊ', v: true }); i += 2; continue; }
        if (match('oi') || match('oy')) { phones.push({ p: 'ɔɪ', v: true }); i += 2; continue; }
        if (match('au') || match('aw')) { phones.push({ p: 'ɔ', v: true }); i += 2; continue; }
        if (match('ew')) { phones.push({ p: 'u', v: true }); i += 2; continue; }
        if (match('ey')) { phones.push({ p: atEnd(2) ? 'eɪ' : 'ɛ', v: true }); i += 2; continue; }
        if (match('ue')) { phones.push({ p: 'u', v: true }); i += 2; continue; }
        if (match('ie')) { phones.push({ p: atEnd(2) ? 'i' : 'ɪ', v: true }); i += 2; continue; }

        // --- single letters ---
        const c = word[i];
        if (c === 'a') { phones.push({ p: 'æ', v: true }); i += 1; continue; }
        if (c === 'e') {
            if (atEnd(1) && hasEarlierVowel()) { i += 1; continue; } // silent final e
            phones.push({ p: 'ɛ', v: true }); i += 1; continue;
        }
        if (c === 'i') { phones.push({ p: 'ɪ', v: true }); i += 1; continue; }
        if (c === 'o') { phones.push({ p: 'ɑ', v: true }); i += 1; continue; }
        if (c === 'u') { phones.push({ p: 'ʌ', v: true }); i += 1; continue; }
        if (c === 'y') {
            if (atStart() && hasLaterVowel(i + 1)) { phones.push({ p: 'j', v: false }); i += 1; continue; }
            phones.push({ p: atEnd(1) ? 'i' : 'ɪ', v: true }); i += 1; continue;
        }
        if (c === 'c') {
            const next = word[i + 1];
            phones.push({ p: (next === 'e' || next === 'i' || next === 'y') ? 's' : 'k', v: false });
            i += 1; continue;
        }
        if (c === 'g') {
            const next = word[i + 1];
            phones.push({ p: (next === 'e' || next === 'i' || next === 'y') ? 'dʒ' : 'ɡ', v: false });
            i += 1; continue;
        }
        if (c === 'j') { phones.push({ p: 'dʒ', v: false }); i += 1; continue; }
        if (c === 'x') { phones.push({ p: 'k', v: false }, { p: 's', v: false }); i += 1; continue; }
        if (c === 'q') { phones.push({ p: 'k', v: false }); i += 1; continue; }
        if (c === "'") { i += 1; continue; }
        if ('bdfhklmnptvwz'.includes(c)) { phones.push({ p: c, v: false }); i += 1; continue; }
        if (c === 's') { phones.push({ p: 's', v: false }); i += 1; continue; }
        if (c === 'r') { phones.push({ p: 'ɹ', v: false }); i += 1; continue; }
        // Unknown character (digits, symbols): skip.
        i += 1;
    }
    return phones;
}

const LEGAL_ONSETS = new Set();
[
    ['p'], ['t'], ['k'], ['b'], ['d'], ['ɡ'], ['f'], ['v'], ['θ'], ['ð'], ['s'], ['z'], ['ʃ'], ['ʒ'],
    ['h'], ['m'], ['n'], ['l'], ['ɹ'], ['w'], ['j'], ['tʃ'], ['dʒ'],
    ['p', 'l'], ['b', 'l'], ['k', 'l'], ['ɡ', 'l'], ['f', 'l'], ['s', 'l'],
    ['p', 'ɹ'], ['b', 'ɹ'], ['t', 'ɹ'], ['d', 'ɹ'], ['k', 'ɹ'], ['ɡ', 'ɹ'], ['f', 'ɹ'], ['θ', 'ɹ'], ['ʃ', 'ɹ'],
    ['t', 'w'], ['d', 'w'], ['k', 'w'], ['ɡ', 'w'], ['s', 'w'],
    ['p', 'j'], ['b', 'j'], ['t', 'j'], ['d', 'j'], ['k', 'j'], ['ɡ', 'j'], ['f', 'j'], ['v', 'j'], ['θ', 'j'],
    ['s', 'j'], ['z', 'j'], ['ʃ', 'j'], ['m', 'j'], ['n', 'j'], ['l', 'j'], ['h', 'j'],
    ['s', 'p'], ['s', 't'], ['s', 'k'], ['s', 'm'], ['s', 'n'], ['s', 'f'],
    ['s', 'p', 'l'], ['s', 'p', 'ɹ'], ['s', 't', 'ɹ'], ['s', 'k', 'ɹ'], ['s', 'k', 'w'],
].forEach(arr => LEGAL_ONSETS.add(arr.join('|')));

function splitOnset(cluster) {
    for (const len of [3, 2, 1]) {
        if (cluster.length >= len) {
            const cand = cluster.slice(cluster.length - len);
            if (LEGAL_ONSETS.has(cand.join('|'))) {
                return { coda: cluster.slice(0, cluster.length - len), onset: cand };
            }
        }
    }
    return { coda: cluster, onset: [] };
}

function syllabifyPhones(phones) {
    const vowelIdx = [];
    phones.forEach((p, idx) => { if (p.v) vowelIdx.push(idx); });
    if (!vowelIdx.length) {
        return [{ onset: phones.map(p => p.p), nucleus: '', coda: [], stress: 0 }];
    }
    const syllables = [];
    let prevEnd = 0;
    vowelIdx.forEach((vi, k) => {
        let onset;
        if (k === 0) {
            onset = phones.slice(0, vi).map(p => p.p);
        } else {
            const cluster = phones.slice(prevEnd, vi).map(p => p.p);
            const { coda, onset: on } = splitOnset(cluster);
            syllables[syllables.length - 1].coda = coda;
            onset = on;
        }
        syllables.push({ onset, nucleus: phones[vi].p, coda: [], stress: 0 });
        prevEnd = vi + 1;
    });
    syllables[syllables.length - 1].coda = phones.slice(prevEnd).map(p => p.p);
    return syllables;
}

function renderSyllables(syllables) {
    return syllables.map(s => {
        const text = s.onset.join('') + s.nucleus + s.coda.join('');
        return (s.stress === 1 ? 'ˈ' : s.stress === 2 ? 'ˌ' : '') + text;
    }).join('.');
}

function applyStressHeuristic(word, syllables) {
    if (syllables.length <= 1) { if (syllables.length === 1) syllables[0].stress = 1; return; }
    let idx = 0; // default: first syllable
    if (/(tion|sion|cian|tial|cial)$/.test(word) || /(ic|ics|ical)$/.test(word)) {
        idx = Math.max(0, syllables.length - 2);
    } else if (/(ity|ety)$/.test(word)) {
        idx = Math.max(0, syllables.length - 3);
    }
    syllables[idx].stress = 1;
}

function ruleBasedG2P(word) {
    const phones = ruleBasedPhones(word);
    const syllables = syllabifyPhones(phones);
    applyStressHeuristic(word, syllables);
    return { annotated: renderSyllables(syllables), source: 'estimated' };
}

// ---------- Public: word-level transcription ----------

function transcribeWordRaw(word) {
    return lookupDict(word) || trySuffixStrip(word) || ruleBasedG2P(word);
}

// ---------- Dialect transforms ----------

function applyDialectTransform(annotated, dialect) {
    if (dialect === 'en-US') return annotated;
    let s = annotated;
    s = s.replace(/aɪɹ/g, 'aɪə');
    s = s.replace(/aʊɹ/g, 'aʊə');
    s = s.replace(/ɑɹ/g, 'ɑː');
    s = s.replace(/ɔɹ/g, 'ɔː');
    s = s.replace(/ɪɹ/g, 'ɪə');
    s = s.replace(/ɛɹ/g, 'ɛə');
    s = s.replace(/ʊɹ/g, 'ʊə');
    s = s.replace(/ɝ/g, 'ɜː');
    s = s.replace(/ɚ/g, 'ə');
    s = s.replace(/oʊ/g, 'əʊ');
    s = s.replace(/ɹ(?=[.ˈˌ]|$)/g, '');
    if (dialect === 'en-AU') {
        s = s.replace(/əʊ/g, 'əʉ');
        s = s.replace(/eɪ/g, 'æɪ');
        s = s.replace(/u/g, 'ʉ');
    }
    return s;
}

function applyNarrowRules(annotated) {
    let s = annotated;
    s = s.replace(/ˈ([ptk])/g, 'ˈ$1ʰ');
    s = s.replace(/([iɪeɛæʌuʊɔɑəɝɚ])\.t(?=[iɪeɛæʌuʊɔɑəɝɚ])/g, '$1.ɾ');
    return s;
}

function assembleDisplay(annotated, includeStress, includeSyllables) {
    let s = annotated;
    if (!includeStress) s = s.replace(/[ˈˌ]/g, '');
    if (!includeSyllables) s = s.replace(/\./g, '');
    return s;
}

function wrapNotation(s, notation) {
    return notation === 'broad' ? `/${s}/` : `[${s}]`;
}

function buildPhonemeObj(symbol) {
    const info = PHONEME_INFO[symbol] || { name: `Sound /${symbol}/`, type: 'consonant', features: '', example: '', audio: '' };
    return { symbol, name: info.name, type: info.type, features: info.features, example: info.example, audio: info.audio || info.example };
}

// ---------- Public: sentence-level transcription ----------

function transcribeSentence(text, opts) {
    const { dialect, notation, includeStress, includeSyllables } = opts;
    const matches = text.match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];

    const words = matches.map(orig => {
        const clean = orig.toLowerCase();
        const base = transcribeWordRaw(clean);
        let annotated = applyDialectTransform(base.annotated, dialect);
        if (dialect === 'en-US' && notation === 'narrow') {
            annotated = applyNarrowRules(annotated);
        }
        const display = assembleDisplay(annotated, includeStress, includeSyllables);
        const phonemes = tokenizeIPA(annotated).map(buildPhonemeObj);
        return {
            orthography: orig,
            ipa: wrapNotation(display, notation),
            rawDisplay: display,
            phonemes,
            source: base.source
        };
    });

    const fullIPA = wrapNotation(words.map(w => w.rawDisplay).join(' '), notation);
    return { fullIPA, words };
}
