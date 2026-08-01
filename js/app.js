// English IPA UI wiring. All phonetic transcription is done locally via js/g2p.js -
// no network calls, no API keys, and it works fully offline once the page has loaded.

let currentTab = 'transcriber';
let currentFullIPA = '';
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingInterval = null;
let audioContext = null;
let quizState = { score: 0, total: 0, currentIndex: 0, currentAnswer: null };
let currentInspectedPhoneme = null;

const DIALECT_BADGE = { 'en-US': 'GA', 'en-GB': 'RP', 'en-AU': 'AuE' };

// The only three "actors" (TTS voices) the app offers, matching the three
// accents the transcriber supports. Speech synthesis voices are looked up
// fresh every time (rather than cached by a fragile voiceURI) so this keeps
// working across browser restarts / voice-list reloads.
const VOICE_REGIONS = [
    { code: 'en-US', label: 'US English' },
    { code: 'en-GB', label: 'UK English' },
    { code: 'en-AU', label: 'Australian English' }
];
let selectedVoiceRegion = localStorage.getItem('phoneticcraft_voice_region') || 'en-US';

function normalizeLang(lang) {
    return (lang || '').replace('_', '-').toLowerCase();
}

function findVoiceForRegion(voices, code) {
    const target = normalizeLang(code);
    const region = target.split('-')[1];
    return voices.find(v => normalizeLang(v.lang) === target)
        || voices.find(v => normalizeLang(v.lang).startsWith('en') && normalizeLang(v.lang).endsWith(region))
        || voices.find(v => normalizeLang(v.lang).startsWith('en') && v.name.toLowerCase().includes(region === 'gb' ? 'uk' : region === 'au' ? 'australia' : 'us'))
        || null;
}
const SOURCE_LABEL = {
    dict: { text: '', title: 'Verified dictionary pronunciation' },
    derived: { text: '≈', title: 'Derived from a known root word + regular suffix rule' },
    estimated: { text: '≈', title: 'Estimated pronunciation (word not found in dictionary) - treat as approximate' }
};

function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`sec-${tabId}`).classList.remove('hidden');

    // The phoneme inspector card belongs to whichever tab was open when it was
    // opened (Transcriber word chips or the IPA Chart) - always close it on
    // any tab switch so it never lingers into a tab it wasn't opened from.
    closeInspector();

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
        btn.classList.add('text-slate-600', 'dark:text-slate-400');
    });
    const activeBtn = document.getElementById(`tab-btn-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-900', 'dark:text-white', 'shadow-sm');
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
    }

    document.querySelectorAll('[id^="mob-tab-"]').forEach(m => {
        m.classList.remove('text-sky-600', 'dark:text-sky-400');
        m.classList.add('text-slate-500', 'dark:text-slate-400');
    });
    const mobActive = document.getElementById(`mob-tab-${tabId}`);
    if (mobActive) mobActive.classList.add('text-sky-600', 'dark:text-sky-400');

    if (tabId === 'quiz' && quizState.total === 0 && quizState.currentAnswer === null) {
        initQuiz();
    }
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const icon = document.getElementById('theme-icon');
    const dark = document.documentElement.classList.contains('dark');
    icon.className = dark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon';
    localStorage.setItem('phoneticcraft_dark', dark ? '1' : '0');
}

function loadSample(text) {
    const input = document.getElementById('text-input');
    input.value = text;
    updateCharCount();
    transcribeText();
}

function clearInput() {
    document.getElementById('text-input').value = '';
    document.getElementById('ipa-result').classList.add('hidden');
    document.getElementById('ipa-placeholder').classList.remove('hidden');
    closeInspector();
    updateCharCount();
}

function updateCharCount() {
    const count = document.getElementById('text-input').value.length;
    document.getElementById('char-count').innerText = `${count} chars`;
}

function getOptions() {
    return {
        dialect: document.getElementById('dialect-select').value,
        notation: document.getElementById('notation-select').value,
        includeStress: document.getElementById('toggle-stress').checked,
        includeSyllables: document.getElementById('toggle-syllables').checked
    };
}

function transcribeText() {
    const text = document.getElementById('text-input').value.trim();
    if (!text) return;

    closeInspector();

    const opts = getOptions();
    document.getElementById('badge-dialect').innerText = DIALECT_BADGE[opts.dialect] || opts.dialect;
    document.getElementById('ipa-placeholder').classList.add('hidden');
    document.getElementById('ipa-loading').classList.remove('hidden');
    document.getElementById('ipa-result').classList.add('hidden');

    // Local engine is synchronous and fast, but we yield one frame so the
    // loading spinner actually paints for longer inputs.
    requestAnimationFrame(() => {
        let data;
        try {
            data = transcribeSentence(text, opts);
        } catch (err) {
            console.error('Transcription failed:', err);
            document.getElementById('ipa-loading').classList.add('hidden');
            document.getElementById('ipa-placeholder').classList.remove('hidden');
            return;
        }
        document.getElementById('ipa-loading').classList.add('hidden');
        renderIPAResults(data);
    });
}

function renderIPAResults(data) {
    currentFullIPA = data.fullIPA;
    document.getElementById('ipa-result').classList.remove('hidden');
    document.getElementById('ipa-formatted-text').innerText = data.fullIPA;

    const chipsContainer = document.getElementById('word-chips-container');
    chipsContainer.innerHTML = '';

    data.words.forEach(w => {
        const wordCard = document.createElement('div');
        wordCard.className = "bg-slate-100 dark:bg-slate-700/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600/60 inline-flex flex-col gap-1";

        const orthRow = document.createElement('div');
        orthRow.className = "flex items-center gap-1";

        const orthText = document.createElement('span');
        orthText.className = "text-[11px] font-medium text-slate-500 dark:text-slate-400";
        orthText.innerText = w.orthography;
        orthRow.appendChild(orthText);

        const label = SOURCE_LABEL[w.source];
        if (label && label.text) {
            const badge = document.createElement('span');
            badge.className = "text-[10px] font-bold text-amber-500 cursor-help";
            badge.innerText = label.text;
            badge.title = label.title;
            orthRow.appendChild(badge);
        }

        const phonemesRow = document.createElement('div');
        phonemesRow.className = "flex items-center gap-0.5 flex-wrap";

        w.phonemes.forEach(p => {
            const pBtn = document.createElement('button');
            pBtn.className = "ipa-text text-base font-semibold px-1.5 py-0.5 rounded hover:bg-sky-500/20 hover:text-sky-600 dark:hover:text-sky-300 transition-colors";
            pBtn.innerText = p.symbol;
            pBtn.onclick = () => inspectPhoneme(p);
            phonemesRow.appendChild(pBtn);
        });

        wordCard.appendChild(orthRow);
        wordCard.appendChild(phonemesRow);
        chipsContainer.appendChild(wordCard);
    });
}

function inspectPhoneme(p) {
    const card = document.getElementById('phoneme-inspector-card');
    document.getElementById('inspect-symbol').innerText = p.symbol;
    document.getElementById('inspect-name').innerText = p.name || `Symbol ${p.symbol}`;
    document.getElementById('inspect-type').innerText = (p.type || "sound").toUpperCase();
    document.getElementById('inspect-features').innerText = p.features || "";
    document.getElementById('inspect-examples').innerText = p.example ? `Example: "${p.example}"` : '';
    card.classList.remove('hidden');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    currentInspectedPhoneme = p;
    playPhonemeSound(p);
}

function replayInspectedSound() {
    if (currentInspectedPhoneme) playPhonemeSound(currentInspectedPhoneme);
}

function closeInspector() {
    document.getElementById('phoneme-inspector-card').classList.add('hidden');
}

function copyIPA(event) {
    const ipa = document.getElementById('ipa-formatted-text').innerText;
    if (!ipa) return;
    navigator.clipboard.writeText(ipa).then(() => {
        const btn = event.currentTarget;
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-500"></i> Copied!';
        setTimeout(() => btn.innerHTML = orig, 1800);
    });
}

function getSelectedVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return findVoiceForRegion(voices, selectedVoiceRegion);
}

// Speaks plain orthographic text (a real word/sentence) using the actor
// (accent) chosen in Settings. Never feed this raw IPA symbols - speech
// synthesis engines don't reliably read isolated IPA characters as the
// intended sound (they'll spell them out, skip them, or mispronounce them).
function speakText(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getSelectedVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = selectedVoiceRegion;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

function speakFullIPA() {
    const textToSpeak = document.getElementById('text-input').value.trim() || "phonetics";
    speakText(textToSpeak);
}

// Accepts either a phoneme object ({symbol, audio, example, ...}) or a plain
// string. For phoneme objects we speak the demonstration word (p.audio /
// p.example), not the bare IPA symbol, since TTS engines can't pronounce
// isolated IPA characters correctly.
function playPhonemeSound(phoneme) {
    const textToSpeak = (typeof phoneme === 'object' && phoneme !== null)
        ? (phoneme.audio || phoneme.example || phoneme.symbol)
        : phoneme;
    if (!('speechSynthesis' in window) || !textToSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.8;
    utterance.lang = selectedVoiceRegion;
    const voice = getSelectedVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
}

// ---------- IPA Chart (Tab 2) ----------

function populateIPAChart() {
    const tbody = document.getElementById('consonants-table-body');
    tbody.innerHTML = '';

    CONSONANTS_DATA.forEach(row => {
        const tr = document.createElement('tr');

        const mannerTd = document.createElement('td');
        mannerTd.className = "p-2 font-medium text-left text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80";
        mannerTd.innerText = row.manner;
        tr.appendChild(mannerTd);

        CONSONANT_PLACES.forEach(pKey => {
            const td = document.createElement('td');
            td.className = "p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors";

            const cellData = row.places[pKey];
            if (cellData && cellData.length > 0) {
                const flex = document.createElement('div');
                flex.className = "flex items-center justify-center gap-1";

                cellData.forEach(item => {
                    const btn = document.createElement('button');
                    btn.className = "ipa-text text-base font-bold w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:scale-110 transition-transform flex items-center justify-center";
                    btn.innerText = item.sym;
                    btn.onclick = () => inspectPhoneme(buildPhonemeObj(item.sym));
                    flex.appendChild(btn);
                });
                td.appendChild(flex);
            } else {
                td.innerHTML = '<span class="text-slate-300 dark:text-slate-700">-</span>';
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    const vowelsContainer = document.getElementById('vowels-grid');
    vowelsContainer.innerHTML = '';
    VOWELS_DATA.concat(DIPHTHONGS_DATA).forEach(v => {
        const card = document.createElement('button');
        card.className = "p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 text-left hover:scale-[1.03] transition-all flex flex-col justify-between";
        card.onclick = () => inspectPhoneme(buildPhonemeObj(v.sym));
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="ipa-text text-2xl font-bold text-violet-700 dark:text-violet-300">${v.sym}</span>
                <i class="fa-solid fa-volume-high text-xs text-violet-400"></i>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">${v.name}</span>
        `;
        vowelsContainer.appendChild(card);
    });

    const supraContainer = document.getElementById('suprasegmental-grid');
    supraContainer.innerHTML = '';
    SUPRA_DATA.forEach(s => {
        const card = document.createElement('button');
        card.className = "p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left hover:scale-[1.03] transition-all flex flex-col justify-between";
        card.onclick = () => inspectPhoneme(buildPhonemeObj(s.sym));
        card.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="ipa-text text-2xl font-bold text-amber-700 dark:text-amber-300">${s.sym}</span>
                <i class="fa-solid fa-circle-info text-xs text-amber-400"></i>
            </div>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">${s.name}</span>
        `;
        supraContainer.appendChild(card);
    });
}

function filterIPAChart() {
    const query = document.getElementById('chart-search').value.toLowerCase().trim();
    document.querySelectorAll('#consonants-table-body td button, #vowels-grid button, #suprasegmental-grid button').forEach(btn => {
        const text = btn.innerText.toLowerCase();
        const parentText = btn.parentElement.innerText.toLowerCase();
        if (!query || text.includes(query) || parentText.includes(query)) {
            btn.classList.remove('opacity-20');
        } else {
            btn.classList.add('opacity-20');
        }
    });
}

function resetChartFilter() {
    document.getElementById('chart-search').value = '';
    filterIPAChart();
}

// ---------- Speech to IPA (Tab 3) ----------

async function toggleAudioRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            startRecordingSession(stream);
        } catch (err) {
            alert("Microphone access is required for Speech-to-IPA recording.");
        }
    } else {
        stopRecordingSession();
    }
}

function startRecordingSession(stream) {
    isRecording = true;
    audioChunks = [];

    const btn = document.getElementById('btn-record');
    btn.className = "w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-500/30 recording-pulse";
    document.getElementById('icon-record').className = "fa-solid fa-stop";
    document.getElementById('visualizer-status').innerText = "Recording voice... speak now";

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        window._activeRecognition = new SpeechRecognition();
        window._activeRecognition.lang = document.getElementById('dialect-select').value || 'en-US';
        window._activeRecognition.interimResults = false;
        window._activeRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            displaySpeechIPA(transcript);
        };
        window._activeRecognition.onerror = () => displaySpeechIPA("");
        window._activeRecognition.start();
    }

    try {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.start();
    } catch (err) {
        console.warn('MediaRecorder unavailable:', err);
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);

    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let seconds = 0;
    recordingInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        document.getElementById('recording-timer').innerText = `${mins}:${secs}`;
    }, 1000);

    function drawWave() {
        if (!isRecording) return;
        requestAnimationFrame(drawWave);
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            ctx.fillStyle = `rgb(16, 185, 129)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 2;
        }
    }
    drawWave();
}

function stopRecordingSession() {
    isRecording = false;
    clearInterval(recordingInterval);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stream.getTracks().forEach(t => t.stop());
        mediaRecorder.stop();
    }
    if (window._activeRecognition) {
        try { window._activeRecognition.stop(); } catch (e) { /* already stopped */ }
    }

    const btn = document.getElementById('btn-record');
    btn.className = "w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30";
    document.getElementById('icon-record').className = "fa-solid fa-microphone";
    document.getElementById('visualizer-status').innerText = "Processing voice to IPA...";
    document.getElementById('recording-timer').innerText = "00:00";

    if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
        displaySpeechIPA("");
    }
}

function handleAudioFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    document.getElementById('visualizer-status').innerText = `Loaded file: ${file.name}. Browsers cannot run speech-recognition on uploaded audio files without a server - please use the microphone recorder above instead, or type the words you hear into the Transcriber tab.`;
}

function displaySpeechIPA(recognizedText) {
    document.getElementById('visualizer-status').innerText = "Click record to start voice audio capture";
    document.getElementById('speech-result-container').classList.remove('hidden');

    if (!recognizedText) {
        document.getElementById('speech-recognized-text').innerText = "Could not recognize speech. Please try again in a quiet environment.";
        document.getElementById('speech-ipa-text').innerText = '';
        return;
    }

    document.getElementById('speech-recognized-text').innerText = recognizedText;
    const opts = getOptions();
    const data = transcribeSentence(recognizedText, opts);
    document.getElementById('speech-ipa-text').innerText = data.fullIPA;
}

// ---------- Practice Quiz (Tab 4) ----------

const QUIZ_QUESTIONS = [
    { ipa: "/ˈfoʊ.ˈnɛ.tɪks/", options: ["Phonetics", "Phonics", "Phonebook", "Fantastic"], answer: "Phonetics" },
    { ipa: "/ˈlæŋ.ɡwɪdʒ/", options: ["Language", "Languish", "Laughter", "Luggage"], answer: "Language" },
    { ipa: "/ˈæl.fə.bɛt/", options: ["Alphabet", "Alfalfa", "Altitude", "Albatross"], answer: "Alphabet" },
    { ipa: "/ˈkæ.tɚ.pɪ.lɚ/", options: ["Caterpillar", "Category", "Captain", "Capital"], answer: "Caterpillar" },
    { ipa: "/ˈdʒɝ.ni/", options: ["Journey", "Journal", "Jury", "Jewelry"], answer: "Journey" },
    { ipa: "/ˈnɔ.lɪdʒ/", options: ["Knowledge", "Novelty", "Nourish", "Naughty"], answer: "Knowledge" },
    { ipa: "/saɪ.ˈkɑ.lə.dʒi/", options: ["Psychology", "Physiology", "Sociology", "Cardiology"], answer: "Psychology" }
];

function initQuiz() {
    quizState = { score: 0, total: 0, currentIndex: 0, currentAnswer: null };
    document.getElementById('quiz-score').innerText = "0 / 0";
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = QUIZ_QUESTIONS[quizState.currentIndex % QUIZ_QUESTIONS.length];
    document.getElementById('quiz-ipa-prompt').innerText = q.ipa;
    quizState.currentAnswer = q.answer;

    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';

    const shuffled = [...q.options];
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:border-sky-300 dark:hover:border-sky-700 text-slate-800 dark:text-slate-100 font-semibold text-center transition-all";
        btn.innerText = opt;
        btn.onclick = () => handleQuizAnswer(opt, btn);
        container.appendChild(btn);
    });
}

function handleQuizAnswer(selected, btn) {
    document.querySelectorAll('#quiz-options-container button').forEach(b => b.disabled = true);
    quizState.total++;

    if (selected === quizState.currentAnswer) {
        quizState.score++;
        btn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
    } else {
        btn.classList.add('bg-rose-500', 'text-white', 'border-rose-600');
        document.querySelectorAll('#quiz-options-container button').forEach(b => {
            if (b.innerText === quizState.currentAnswer) b.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
        });
    }

    document.getElementById('quiz-score').innerText = `${quizState.score} / ${quizState.total}`;
}

function nextQuizQuestion() {
    quizState.currentIndex++;
    renderQuizQuestion();
}

function playQuizPromptSound() {
    speakText(quizState.currentAnswer);
}

// ---------- Settings ----------

// Exactly 3 "actors" (US/UK/AU), each mapped to the best matching voice this
// browser/OS actually provides. If the browser has no dedicated voice for a
// region, the option is still offered (utterance.lang alone still steers a
// lot of engines) but labeled so it's clear no dedicated voice was found.
function populateVoiceOptions() {
    const select = document.getElementById('setting-voice');
    if (!('speechSynthesis' in window)) {
        select.innerHTML = '<option value="">Speech synthesis not supported in this browser</option>';
        return;
    }
    const voices = window.speechSynthesis.getVoices();
    select.innerHTML = '';
    VOICE_REGIONS.forEach(region => {
        const match = findVoiceForRegion(voices, region.code);
        const opt = document.createElement('option');
        opt.value = region.code;
        opt.innerText = match ? `${region.label} (${match.name})` : `${region.label} (browser default)`;
        select.appendChild(opt);
    });
    select.value = selectedVoiceRegion;
}

function openSettingsModal() {
    populateVoiceOptions();
    document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function saveSettings() {
    selectedVoiceRegion = document.getElementById('setting-voice').value || 'en-US';
    localStorage.setItem('phoneticcraft_voice_region', selectedVoiceRegion);
    closeSettingsModal();
}

// ---------- FAQ (collapsible) ----------

function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    answer.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// ---------- Init ----------

window.onload = function () {
    if (localStorage.getItem('phoneticcraft_dark') === '1') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').className = 'fa-solid fa-sun text-amber-400';
    }
    populateIPAChart();
    document.getElementById('text-input').value = "The quick brown fox jumps over the lazy dog.";
    document.getElementById('text-input').addEventListener('input', updateCharCount);
    updateCharCount();
    transcribeText();

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = populateVoiceOptions;
    }
};
