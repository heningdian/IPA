# PhoneticCraft

An offline, dependency-free English IPA (International Phonetic Alphabet)
transcriber and phonetics learning toolkit.

Live at: https://heningdian.github.io/IPA/

## Why this exists

The original prototype called a third-party generative AI API (with no
working key configured) to do text-to-IPA transcription. Since that call
always failed, every transcription silently fell back to a per-character
regex guess, producing wrong/garbled IPA for almost any input. This rebuild
replaces that with a real, deterministic English grapheme-to-phoneme (G2P)
engine that runs entirely in the browser - no API key, no network call, no
rate limits, and no single point of failure.

## How transcription works (`js/g2p.js`)

For every word, three tiers are tried in order:

1. **Dictionary lookup** - `assets/dict.js` bundles ~124,000 English words
   derived from the CMU Pronouncing Dictionary (public domain, Carnegie
   Mellon University), converted to IPA with syllable boundaries and stress
   marks computed at build time (see `build_dict.py`-style pipeline).
2. **Morphological decomposition** - if the exact word isn't found (e.g. an
   inflected form), common suffixes (`-ing`, `-ed`, `-s`, `-ly`, `-ness`,
   `-able`, ...) are stripped, the stem is looked up in the dictionary, and
   the suffix's own pronunciation (with correct voicing assimilation) is
   reattached.
3. **Rule-based letter-to-sound fallback** - for words in neither the
   dictionary nor derivable from it (proper nouns, invented words), an
   ordered set of English spelling-to-sound rules produces a best-effort
   estimate. These results are flagged `source: "estimated"` and shown with
   a `≈` badge in the UI so users know it's an approximation rather than a
   verified pronunciation.

A dialect transform layer approximates British RP and Australian English
from the General American base (non-rhotic vowel mergers, `oʊ`→`əʊ`, etc.),
and an optional "narrow" notation mode adds aspiration and flap-t rules for
General American.

## No external services

- **Transcription**: 100% local, synchronous, no network required.
- **Text-to-speech / phoneme audio**: uses the browser's built-in
  [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
  (`speechSynthesis`) - no API key.
- **Speech-to-IPA**: uses the browser's built-in `SpeechRecognition` to get
  a text transcript, then runs it through the same local G2P engine.
- **Styling**: Tailwind CSS is compiled locally into `assets/tailwind.css`
  (no CDN runtime JIT compiler), and FontAwesome icons are self-hosted in
  `assets/`. Only the optional Google Fonts webfont link is external; the
  app falls back to system fonts (DejaVu Sans, etc., which still render IPA
  correctly) if it's unreachable.

## Project layout

```
index.html              App shell / markup
js/phoneme-info.js      Static IPA symbol metadata (chart + inspector)
js/g2p.js               The G2P engine (dictionary + rules + dialects)
js/app.js               UI wiring (tabs, quiz, audio, settings)
assets/dict.js          ~124k word pronunciation dictionary (generated)
assets/tailwind.css     Compiled Tailwind build (generated, see below)
assets/fontawesome.min.css / webfonts/   Self-hosted icon font
tailwind.config.js, src/input.css        Tailwind CLI build inputs
```

## Rebuilding the CSS bundle

```
npm install
npm run build:css
```

## Running locally

Just open `index.html` in a browser, or serve it statically:

```
npm run serve
```

(No build step is required to run the app - `assets/tailwind.css` and
`assets/dict.js` are already committed as generated output.)
