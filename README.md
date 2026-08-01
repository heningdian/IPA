# English IPA

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
  `assets/`.
- **Fonts**: fully self-hosted, no Google Fonts (or any other) CDN call.
  IPA text uses **Noto Sans**, chosen specifically because it has verified
  Unicode coverage for every symbol this app produces (IPA Extensions,
  Spacing Modifier Letters, and the Greek letters IPA borrows like θ/ɸ/β).
  The original prototype specified "Charis SIL" from Google Fonts, but that
  family was never actually hosted there, so it silently fell back to
  whatever incomplete font the visitor's OS substituted - on systems without
  a full-coverage fallback font this rendered IPA symbols as tofu boxes
  (missing-glyph squares). UI text uses self-hosted **Inter**.

## Project layout

```
index.html              App shell / markup
js/phoneme-info.js      Static IPA symbol metadata (chart + inspector)
js/g2p.js               The G2P engine (dictionary + rules + dialects)
js/app.js               UI wiring (tabs, quiz, audio, settings)
assets/dict.js          ~124k word pronunciation dictionary (generated)
assets/tailwind.css     Compiled Tailwind build (generated, see below)
assets/fontawesome.min.css / webfonts/   Self-hosted icon font
assets/fonts.css / fonts/                Self-hosted Noto Sans + Inter webfonts (generated)
tailwind.config.js, src/input.css        Tailwind CLI build inputs
scripts/build-fonts.py                   Generates assets/fonts.css + assets/fonts/ from @fontsource packages
vercel.json                              Tells Vercel this is a plain static site (no framework/build step)
.github/workflows/deploy-pages.yml       GitHub Pages deploy workflow
```

## Rebuilding the CSS/font bundles

```
npm install
npm run build:css
npm run build:fonts
```

## Running locally

Just open `index.html` in a browser, or serve it statically:

```
npm run serve
```

(No build step is required to run the app - `assets/tailwind.css` and
`assets/dict.js` are already committed as generated output.)

## Deployment

This is a plain static site - every generated file (`assets/tailwind.css`,
`assets/dict.js`, the self-hosted fonts) is committed to the repo, so a host
just needs to serve the files as-is. No server runtime, no build step, no
environment variables.

### GitHub Pages (current)

Handled by `.github/workflows/deploy-pages.yml`: every push to `main`
deploys the repo root to Pages automatically. Live at
https://heningdian.github.io/IPA/.

### Vercel

`vercel.json` is already set up for a zero-build static deploy (it tells
Vercel not to auto-detect a framework or run `npm install`/build, since
nothing needs building at deploy time - `package.json`'s scripts are only
for regenerating the CSS/font bundles during development).

**Dashboard (no CLI needed):**
1. [vercel.com/new](https://vercel.com/new) → Import Git Repository → pick
   `heningdian/IPA`.
2. Leave every build setting as detected (Framework Preset: *Other*, Build
   Command/Install Command: empty, Output Directory: `.`) - `vercel.json`
   sets these automatically.
3. Deploy. You'll get a `*.vercel.app` URL; a custom domain can be attached
   afterwards under Project Settings → Domains.

**CLI:**
```
npm i -g vercel
vercel        # first run links the project and deploys a preview
vercel --prod # promotes to the production domain
```

Both GitHub Pages and Vercel can run side by side off the same `main`
branch - deploying to Vercel doesn't require removing the Pages workflow.
