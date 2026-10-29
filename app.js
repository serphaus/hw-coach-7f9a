// ============================================================================
// Homework Coach — Family Homework Helper (PWA)
// Works on iPhone, iPad, Android & Desktop | $0/month Gemini Free Tier + Offline Tools
// ============================================================================

const STORAGE_KEY_API = 'hw_coach_gemini_key';
const STORAGE_KEY_HISTORY = 'hw_coach_history_v1';
const STORAGE_KEY_GRADE = 'hw_coach_grade';

let currentImageBase64 = null;
let currentImageMimeType = 'image/jpeg';
let currentCoachingData = null;

// Built-in instant sample lessons (work 100% offline or before adding an API key)
const SAMPLE_LESSONS = {
  make10: {
    subject: 'Math • 1st/2nd Grade',
    topic: 'Adding 8 + 6 Using the "Make a 10" Strategy',
    parentGuide:
      'Schools today teach kids to turn 8 + 6 into 10 + 4 instead of counting on their fingers. Why? Because adding to 10 in your head is super fast! You help them split the smaller number (6) into two parts so the 8 can become a 10.',
    steps: [
      {
        title: 'Step 1: How many more does 8 need to reach 10?',
        kidPrompt: 'Look at the number 8. Imagine an egg carton with 10 spots—if 8 spots are full, how many empty spots are left to make 10?',
        explanation: '8 needs 2 more to make 10! (Because 8 + 2 = 10).'
      },
      {
        title: 'Step 2: Break apart the 6 (Number Bond)',
        kidPrompt: 'We need to borrow 2 from the number 6 to give to the 8. If we take 2 away from 6, what is left over?',
        explanation: '6 splits into 2 and 4! Give the 2 to the 8 so it turns into a friendly 10.'
      },
      {
        title: 'Step 3: Add what is left to your new 10!',
        kidPrompt: 'Now we have 10, plus the 4 left over. What is 10 + 4?',
        explanation: '10 + 4 = 14! So 8 + 6 is 14. Tip: Switch to the "Math Lab" tab below to slide actual counters across two Ten-Frames!'
      }
    ],
    finalAnswer: '8 + 6 = 14 (by splitting 6 into 2 + 4, making 8 + 2 = 10, and 10 + 4 = 14).'
  },
  wordproblem: {
    subject: 'Math • Word Problems',
    topic: 'Finding a Missing Part (Tape Diagram / Bar Model)',
    parentGuide:
      'Worksheet Problem: "Maya has 15 stickers in all. 9 of them are star stickers and the rest are heart stickers. How many are heart stickers?" Kids often see "in all" and accidentally add 15 + 9! Show them that 15 is the BIG total, so we are looking for a smaller missing part.',
    steps: [
      {
        title: 'Step 1: Find the Whole Total vs. the Parts',
        kidPrompt: 'Does Maya have MORE than 15 stickers total, or is 15 the whole bucket of stickers she owns?',
        explanation: '15 is the Whole Total! The two parts inside that bucket are Star stickers (9) and Heart stickers (?).'
      },
      {
        title: 'Step 2: Count Up or Subtract',
        kidPrompt: 'Put 9 in your head and count up until you reach 15—or write 15 minus 9. How many steps does it take to get from 9 to 15?',
        explanation: 'From 9 to 10 is 1 hop, and from 10 to 15 is 5 hops! 1 + 5 = 6 hops.'
      },
      {
        title: 'Step 3: Double-Check Together',
        kidPrompt: 'Let’s test our answer! Do 9 star stickers + 6 heart stickers equal 15 stickers in all?',
        explanation: 'Yes! 9 + 6 = 15.'
      }
    ],
    finalAnswer: '6 heart stickers (15 − 9 = 6, or 9 + 6 = 15).'
  },
  phonics: {
    subject: 'Reading & Phonics',
    topic: 'Silent "Magic E" & Vowel Teams (cape vs. cap, boat, rain)',
    parentGuide:
      'When 8-year-olds get stuck sounding out longer words, it is usually because of a "Magic E" at the end or two vowels next to each other (a Vowel Team). Remind them that these patterns make the vowel say its own alphabet name (Long Vowel) instead of its short sound.',
    steps: [
      {
        title: 'Step 1: Spot the "Magic E" at the End',
        kidPrompt: 'Look at the word "TAPE". There is a sneaky letter E at the very end! Does that E make a sound, or does it boss the letter A around?',
        explanation: 'The silent E jumps over the P and tells the A: "Say your own name!" So "tap" becomes "t-AY-p" (tape).'
      },
      {
        title: 'Step 2: Spot Two Vowels Walking Together',
        kidPrompt: 'Now look at the word "BOAT". See the O and the A standing side-by-side? Which vowel gets to talk first?',
        explanation: 'When two vowels go walking, the first one does the talking! The O says its name ("OH") and the A stays quiet: b-OH-t.'
      },
      {
        title: 'Step 3: Try Reading This Sentence Out Loud',
        kidPrompt: 'Can you read: "Jake sailed his boat in the rain"? Tap the Reading tab below if you want the app to sound out any word slowly!',
        explanation: 'Jake (Magic E → Long A), sailed (ai → Long A), boat (oa → Long O), rain (ai → Long A).'
      }
    ],
    finalAnswer: 'Key rule: Silent E at the end or a 2-vowel team (ai, ea, oa, ee) usually makes the first vowel say its own alphabet name!'
  },
  regrouping: {
    subject: 'Math • 2nd/3rd Grade',
    topic: '2-Digit Subtraction with Regrouping: 42 − 17',
    parentGuide:
      'When we were in school, we called this "borrowing." Today’s teachers call it "Regrouping" or "Unbundling a Ten" so kids understand WHY we put a 1 in front of the 2. Use the rhyme: "More on the floor? Go next door and get 10 more!"',
    steps: [
      {
        title: 'Step 1: Always Check the Ones Column First (Right Side)',
        kidPrompt: 'Look at the Ones column on the right: 2 minus 7. If you only have 2 cookies, can you give me 7 cookies?',
        explanation: 'No! There is "more on the floor" (7 is bigger than 2), so we need to go next door to the Tens place!'
      },
      {
        title: 'Step 2: Trade 1 Ten for 10 Ones',
        kidPrompt: '42 has 4 Tens and 2 Ones. If we take 1 of those Tens and break it into 10 Ones, how many Tens are left, and how many Ones do we have now?',
        explanation: 'Cross out the 4 Tens → now we have 3 Tens left. Add the 10 new Ones to our 2 Ones → now we have 12 Ones!'
      },
      {
        title: 'Step 3: Subtract the Ones, Then Subtract the Tens',
        kidPrompt: 'What is 12 minus 7 in the Ones place? And what is 3 minus 1 in the Tens place?',
        explanation: '12 − 7 = 5 Ones. And 3 − 1 = 2 Tens. Put them together!'
      }
    ],
    finalAnswer: '42 − 17 = 25 (3 Tens and 12 Ones minus 1 Ten and 7 Ones = 2 Tens and 5 Ones).'
  }
};

// ============================================================================
// Initialization & Magic Link Auto-Setup
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  checkMagicLinkSetup();
  initHeaderAndSettings();
  initTabs();
  initSnapAndCoach();
  initMathLab();
  initReadingCoach();
  renderHistory();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// Simple XOR + Base64 obfuscation with Family PIN so the key isn't in plain text in the link
function encryptKeyWithPin(apiKey, pin) {
  if (!pin) return btoa(apiKey);
  let out = '';
  for (let i = 0; i < apiKey.length; i++) {
    out += String.fromCharCode(apiKey.charCodeAt(i) ^ pin.charCodeAt(i % pin.length));
  }
  return btoa(out);
}

function decryptKeyWithPin(encoded, pin) {
  try {
    const raw = atob(encoded);
    if (!pin) return raw;
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ pin.charCodeAt(i % pin.length));
    }
    return out;
  } catch (e) {
    return '';
  }
}

// Allows Dad/Grandpa to send a link like https://...#key=... so Daughter's phone configures itself automatically!
function checkMagicLinkSetup() {
  const hash = window.location.hash;
  if (!hash) return;

  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const lockedKey = params.get('locked');
  const plainKey = params.get('key');

  if (lockedKey) {
    setTimeout(() => {
      const pin = prompt('🔒 Welcome to Homework Coach! Enter your Family PIN to unlock and set up your app:');
      if (pin !== null) {
        const decrypted = decryptKeyWithPin(lockedKey, pin.trim());
        if (decrypted && decrypted.startsWith('AIza')) {
          localStorage.setItem(STORAGE_KEY_API, decrypted.trim());
          window.history.replaceState({}, document.title, window.location.pathname);
          updateApiStatusUI();
          alert('🎉 Unlocked! Homework Coach is now set up on your device. You never need to enter the PIN again!');
        } else {
          alert('❌ Incorrect Family PIN. Please tap the link again and enter the right PIN.');
        }
      }
    }, 250);
  } else if (plainKey && plainKey.trim().length > 10) {
    localStorage.setItem(STORAGE_KEY_API, plainKey.trim());
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => {
      alert('🎉 Homework Coach is automatically set up and ready! You can now snap photos or upload screenshots of any homework.');
    }, 250);
  }
}

function getApiKey() {
  return (localStorage.getItem(STORAGE_KEY_API) || '').trim();
}

function updateApiStatusUI() {
  const key = getApiKey();
  const dot = document.getElementById('apiStatusDot');
  const label = document.getElementById('apiStatusLabel');
  const input = document.getElementById('apiKeyInput');

  if (key) {
    dot.classList.add('ready');
    label.textContent = 'AI Ready';
    if (input) input.value = key;
  } else {
    dot.classList.remove('ready');
    label.textContent = 'Setup Key';
  }
}

function initHeaderAndSettings() {
  const savedGrade = localStorage.getItem(STORAGE_KEY_GRADE);
  const gradeSelect = document.getElementById('gradeSelect');
  if (savedGrade && gradeSelect) {
    gradeSelect.value = savedGrade;
  }
  gradeSelect.addEventListener('change', () => {
    localStorage.setItem(STORAGE_KEY_GRADE, gradeSelect.value);
  });

  updateApiStatusUI();

  const modal = document.getElementById('settingsModal');
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    updateApiStatusUI();
    modal.classList.add('open');
  });
  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
    const val = document.getElementById('apiKeyInput').value.trim();
    const statusMsg = document.getElementById('apiKeyStatusMsg');
    if (!val) {
      localStorage.removeItem(STORAGE_KEY_API);
      statusMsg.style.color = '#D97706';
      statusMsg.textContent = 'Key cleared. Built-in sample lessons and Math/Reading tools still work offline!';
    } else {
      localStorage.setItem(STORAGE_KEY_API, val);
      statusMsg.style.color = '#059669';
      statusMsg.textContent = '✅ Free Gemini API Key saved! Photo & screenshot homework coaching is active.';
    }
    updateApiStatusUI();
  });

  document.getElementById('copyMagicLinkBtn').addEventListener('click', () => {
    const key = getApiKey() || document.getElementById('apiKeyInput').value.trim();
    const msg = document.getElementById('magicLinkCopiedMsg');
    if (!key) {
      msg.style.display = 'block';
      msg.style.color = '#E11D48';
      msg.textContent = 'Please paste and save your Gemini API key in Box #1 first!';
      return;
    }
    localStorage.setItem(STORAGE_KEY_API, key);
    updateApiStatusUI();
    const pin = (document.getElementById('familyPinInput')?.value || '').trim();
    const baseUrl = window.location.origin + window.location.pathname;
    const magicLink = pin
      ? `${baseUrl}#locked=${encodeURIComponent(encryptKeyWithPin(key, pin))}`
      : `${baseUrl}#key=${encodeURIComponent(key)}`;
    navigator.clipboard.writeText(magicLink).then(() => {
      msg.style.display = 'block';
      msg.style.color = '#065F46';
      msg.textContent = pin
        ? `✅ PIN-Protected Magic Link copied! Send this link to your daughter and tell her the Family PIN is "${pin}".`
        : '✅ Magic Link copied! Text or email this link to your daughter—when she opens it, her app will set itself up automatically.';
    });
  });
}

// ============================================================================
// Bottom Navigation Tabs
// ============================================================================
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.tab-panel');

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      navItems.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ============================================================================
// TAB 1: Snap Photo / Upload Screenshot & Step-by-Step AI Coaching
// ============================================================================
function initSnapAndCoach() {
  const cameraInput = document.getElementById('cameraInput');
  const galleryInput = document.getElementById('galleryInput');
  const takePhotoBtn = document.getElementById('takePhotoBtn');
  const uploadGalleryBtn = document.getElementById('uploadGalleryBtn');
  const dropZone = document.getElementById('dropZone');
  const removeImgBtn = document.getElementById('removeImgBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');

  takePhotoBtn.addEventListener('click', () => cameraInput.click());
  uploadGalleryBtn.addEventListener('click', () => galleryInput.click());

  cameraInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleImageFile(e.target.files[0]);
  });
  galleryInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleImageFile(e.target.files[0]);
  });

  // Drag and Drop support on Desktop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  // Paste screenshot from clipboard (Ctrl+V / Cmd+V)
  window.addEventListener('paste', (e) => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleImageFile(file);
        break;
      }
    }
  });

  removeImgBtn.addEventListener('click', clearSelectedImage);

  // Sample Lesson Chips
  document.querySelectorAll('.sample-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-sample');
      if (SAMPLE_LESSONS[key]) {
        currentCoachingData = SAMPLE_LESSONS[key];
        renderCoachingResult(currentCoachingData);
      }
    });
  });

  // Analyze Homework Button
  analyzeBtn.addEventListener('click', () => runHomeworkAnalysis());

  // Follow-up & Similar Practice Problem buttons
  document.getElementById('sendFollowupBtn').addEventListener('click', () => {
    const followupText = document.getElementById('followupInput').value.trim();
    if (!followupText) return;
    runHomeworkAnalysis(followupText);
  });

  document.getElementById('similarProblemBtn').addEventListener('click', () => {
    const topic = currentCoachingData ? currentCoachingData.topic : '2nd grade math or reading';
    runHomeworkAnalysis(
      `Create 1 fun, brand-new practice problem for an 8-year-old on this exact same skill (${topic}) so we can make sure they understood it, with 3 step-by-step coaching hints and the final answer.`
    );
  });

  // Speak Parent Refresher Button
  document.getElementById('speakAllParentBtn').addEventListener('click', () => {
    if (currentCoachingData && currentCoachingData.parentGuide) {
      speakText(currentCoachingData.parentGuide, 1.0);
    }
  });

  // Reveal Final Answer Toggle
  document.getElementById('toggleFinalAnswerBtn').addEventListener('click', () => {
    const box = document.getElementById('resFinalAnswer');
    const btn = document.getElementById('toggleFinalAnswerBtn');
    const isRevealed = box.classList.toggle('revealed');
    btn.textContent = isRevealed ? '🙈 Hide Final Answer' : '👀 Tap to Reveal Final Answer';
  });

  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    renderHistory();
  });
}

// Compresses iPhone photos/screenshots on client side so uploads are instant & low-bandwidth
function handleImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please choose a photo or screenshot image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const MAX_DIM = 1400;
      let width = img.width;
      let height = img.height;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
      currentImageBase64 = dataUrl.split(',')[1];
      currentImageMimeType = 'image/jpeg';

      const preview = document.getElementById('imagePreview');
      const wrap = document.getElementById('imagePreviewWrap');
      preview.src = dataUrl;
      wrap.classList.add('visible');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function clearSelectedImage() {
  currentImageBase64 = null;
  document.getElementById('imagePreview').src = '';
  document.getElementById('imagePreviewWrap').classList.remove('visible');
  document.getElementById('cameraInput').value = '';
  document.getElementById('galleryInput').value = '';
}

async function runHomeworkAnalysis(customFollowupPrompt = null) {
  const questionText = customFollowupPrompt || document.getElementById('questionInput').value.trim();

  if (!currentImageBase64 && !questionText) {
    alert('Please snap a photo, upload a screenshot, or type a homework question first! (Or tap one of the instant sample buttons below.)');
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    // Open setup modal with helpful prompt
    document.getElementById('settingsModal').classList.add('open');
    const msg = document.getElementById('apiKeyStatusMsg');
    msg.style.color = '#D97706';
    msg.textContent = '👆 Paste your free Google Gemini key above to analyze custom photos & questions (or try the built-in sample buttons & Math/Reading tabs with no key!).';
    return;
  }

  const analyzeBtn = document.getElementById('analyzeBtn');
  const originalBtnHtml = analyzeBtn.innerHTML;
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `<div class="spinner"></div><span>Reading Homework & Creating Coaching Steps...</span>`;

  const gradeLevel = document.getElementById('gradeSelect').value;

  const systemInstruction = `You are "Homework Coach", a warm, encouraging elementary school teaching specialist helping a mother and her 8-year-old children (${gradeLevel}).
Instead of just dumping the final answer like a generic chatbot (which creates dependency), your job is to empower the mom and guide the child step-by-step.

Always respond with ONLY valid JSON matching this exact structure:
{
  "subject": "Short subject badge (e.g., Math • 2nd Grade, Reading & Phonics, Spelling, Science)",
  "topic": "Clear title of the specific worksheet problem or concept",
  "parentGuide": "2 to 3 friendly sentences for Mom explaining HOW elementary schools teach this today (e.g. Number Bonds, Make a 10, Tape Diagrams, Phonics rules) so she feels confident explaining it.",
  "steps": [
    {
      "title": "Step 1: [Short action title]",
      "kidPrompt": "A friendly question or small step Mom can read aloud to the 8-year-old to get them started without giving away the final answer.",
      "explanation": "Plain-English hint or mini-check for Step 1."
    },
    {
      "title": "Step 2: [Short action title]",
      "kidPrompt": "The next logical step for the child to work out.",
      "explanation": "How to work through Step 2."
    },
    {
      "title": "Step 3: [Put it together]",
      "kidPrompt": "Final guiding question so the child arrives at the answer themselves.",
      "explanation": "Encouraging wrap-up of the strategy."
    }
  ],
  "finalAnswer": "The complete, clear final answer(s) for the worksheet so Mom can verify their work with 100% accuracy."
}`;

  const userPromptParts = [];
  if (currentImageBase64) {
    userPromptParts.push({
      inline_data: {
        mime_type: currentImageMimeType,
        data: currentImageBase64
      }
    });
  }

  let promptText = `Grade Level: ${gradeLevel}.\n`;
  if (customFollowupPrompt && currentCoachingData) {
    promptText += `Previous Topic: ${currentCoachingData.topic}.\nFollow-up Request: ${customFollowupPrompt}\n`;
  } else if (questionText) {
    promptText += `Parent/Student Note or Question: ${questionText}\n`;
  } else {
    promptText += `Please analyze this homework image and break it down into a 30-second parent refresher, 3 step-by-step kid hints, and the final answer check.`;
  }
  userPromptParts.push({ text: promptText });

  try {
    const resultData = await callGeminiWithFallback(apiKey, systemInstruction, userPromptParts);
    currentCoachingData = resultData;
    renderCoachingResult(resultData);
    saveToHistory(resultData);
    if (customFollowupPrompt) {
      document.getElementById('followupInput').value = '';
    }
  } catch (err) {
    alert(`Could not analyze homework: ${err.message}\n\nPlease double-check your Gemini API key in Setup.`);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = originalBtnHtml;
  }
}

async function callGeminiWithFallback(apiKey, systemInstruction, userParts) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: userParts }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody?.error?.message || `HTTP ${response.status}`;
        // If invalid API key, fail immediately
        if (response.status === 400 && msg.toLowerCase().includes('api key')) {
          throw new Error('Invalid API Key. Please check your key in Setup.');
        }
        lastError = new Error(msg);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(cleanedJson);
    } catch (err) {
      lastError = err;
      if (err.message.includes('Invalid API Key')) throw err;
    }
  }

  throw lastError || new Error('Unable to reach Gemini API.');
}

function renderCoachingResult(data) {
  const card = document.getElementById('coachingResultCard');
  card.classList.add('visible');

  document.getElementById('resSubjectBadge').textContent = data.subject || 'Homework Helper';
  document.getElementById('resTopicTitle').textContent = data.topic || 'Step-by-Step Breakdown';
  document.getElementById('resParentGuide').textContent = data.parentGuide || '';

  // Render progressive step cards (Step 1 unlocked, Steps 2+ locked until tapped!)
  const stepsContainer = document.getElementById('resStepsContainer');
  stepsContainer.innerHTML = '';

  const steps = Array.isArray(data.steps) ? data.steps : [];
  steps.forEach((step, idx) => {
    const stepEl = document.createElement('div');
    const isLocked = idx > 0;
    stepEl.className = `step-card ${isLocked ? 'locked' : ''}`;

    const fullHtml = `
      <div class="step-header">
        <span class="step-num">${escapeHtml(step.title || `Step ${idx + 1}`)}</span>
        <button type="button" class="speak-btn" data-speak="${escapeAttr(step.kidPrompt + ' ' + step.explanation)}">
          🔊 Read to Kid
        </button>
      </div>
      <p style="margin:0 0 8px; font-weight:700; color:var(--text); font-size:0.98rem;">
        💬 Ask the kids: "${escapeHtml(step.kidPrompt || '')}"
      </p>
      <p style="margin:0; font-size:0.9rem; color:var(--text-muted); background:#F8FAFC; padding:8px 12px; border-radius:8px;">
        💡 <strong>Coach Tip:</strong> ${escapeHtml(step.explanation || '')}
      </p>
    `;

    if (isLocked) {
      stepEl.innerHTML = `
        <button type="button" class="reveal-step-btn">
          🔓 Tap to Unlock ${escapeHtml(step.title || `Step ${idx + 1}`)}
        </button>
      `;
      stepEl.querySelector('.reveal-step-btn').addEventListener('click', () => {
        stepEl.classList.remove('locked');
        stepEl.innerHTML = fullHtml;
        attachStepSpeakListeners(stepEl);
      });
    } else {
      stepEl.innerHTML = fullHtml;
      attachStepSpeakListeners(stepEl);
    }

    stepsContainer.appendChild(stepEl);
  });

  // Reset final answer hidden state
  const finalBox = document.getElementById('resFinalAnswer');
  const toggleBtn = document.getElementById('toggleFinalAnswerBtn');
  finalBox.classList.remove('revealed');
  finalBox.textContent = data.finalAnswer || '';
  toggleBtn.textContent = '👀 Tap to Reveal Final Answer';

  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function attachStepSpeakListeners(container) {
  container.querySelectorAll('[data-speak]').forEach((btn) => {
    btn.addEventListener('click', () => {
      speakText(btn.getAttribute('data-speak'), 0.95);
    });
  });
}

// Save & Load Recent Homework Sessions
function saveToHistory(data) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      data
    };
    const updated = [entry, ...existing].slice(0, 8);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    renderHistory();
  } catch (e) {}
}

function renderHistory() {
  const card = document.getElementById('historyCard');
  const list = document.getElementById('historyList');
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || '[]');
  } catch (e) {}

  if (!items.length) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';
  list.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'icon-btn';
    row.style.justifyContent = 'space-between';
    row.style.width = '100%';
    row.style.textAlign = 'left';
    row.innerHTML = `
      <span><strong>${escapeHtml(item.data.topic || 'Homework')}</strong> <small style="color:var(--text-muted);">(${escapeHtml(item.data.subject || '')})</small></span>
      <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(item.date)}</span>
    `;
    row.addEventListener('click', () => {
      currentCoachingData = item.data;
      renderCoachingResult(item.data);
    });
    list.appendChild(row);
  });
}

// ============================================================================
// TAB 2: Interactive Math Lab (100% Built-in / Zero AI Needed)
// ============================================================================
let tfBlue = 8;
let tfAmber = 5;
let pvHundreds = 1;
let pvTens = 3;
let pvOnes = 4;
let currentQuizAnswer = 15;
let quizStreak = 0;

function initMathLab() {
  // Sub-tab switcher
  const subBtns = document.querySelectorAll('[data-mathtool]');
  subBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      subBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tool = btn.getAttribute('data-mathtool');
      document.getElementById('math-tenframes').style.display = tool === 'tenframes' ? 'block' : 'none';
      document.getElementById('math-placevalue').style.display = tool === 'placevalue' ? 'block' : 'none';
      document.getElementById('math-quiz').style.display = tool === 'quiz' ? 'block' : 'none';
    });
  });

  // 1. Ten-Frames & Number Bonds
  document.getElementById('tfBlueMinus').addEventListener('click', () => {
    if (tfBlue > 0) { tfBlue--; renderTenFrames(); }
  });
  document.getElementById('tfBluePlus').addEventListener('click', () => {
    if (tfBlue + tfAmber < 20) { tfBlue++; renderTenFrames(); }
  });
  document.getElementById('tfAmberMinus').addEventListener('click', () => {
    if (tfAmber > 0) { tfAmber--; renderTenFrames(); }
  });
  document.getElementById('tfAmberPlus').addEventListener('click', () => {
    if (tfBlue + tfAmber < 20) { tfAmber++; renderTenFrames(); }
  });

  document.getElementById('makeTenBtn').addEventListener('click', () => {
    if (tfBlue < 10 && tfAmber > 0) {
      const needed = Math.min(10 - tfBlue, tfAmber);
      tfBlue += needed;
      tfAmber -= needed;
      renderTenFrames();
    }
  });

  document.getElementById('resetTfBtn').addEventListener('click', () => {
    tfBlue = 8;
    tfAmber = 5;
    renderTenFrames();
  });

  renderTenFrames();

  // 2. Place Value Base-10 Blocks
  document.querySelectorAll('[data-pv]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-pv');
      if (action === 'h-plus' && pvHundreds < 9) pvHundreds++;
      if (action === 'h-minus' && pvHundreds > 0) pvHundreds--;
      if (action === 't-plus' && pvTens < 19) pvTens++;
      if (action === 't-minus' && pvTens > 0) pvTens--;
      if (action === 'o-plus' && pvOnes < 19) pvOnes++;
      if (action === 'o-minus' && pvOnes > 0) pvOnes--;
      renderPlaceValue();
    });
  });

  document.getElementById('bundleOnesBtn').addEventListener('click', () => {
    if (pvOnes >= 10) {
      pvOnes -= 10;
      pvTens += 1;
      renderPlaceValue();
    } else {
      alert('Add at least 10 Ones cubes first so you can bundle 10 Ones into 1 Ten rod!');
    }
  });

  document.getElementById('unbundleTenBtn').addEventListener('click', () => {
    if (pvTens >= 1) {
      pvTens -= 1;
      pvOnes += 10;
      renderPlaceValue();
    } else {
      alert('Add at least 1 Ten rod first so you can break it into 10 Ones!');
    }
  });

  renderPlaceValue();

  // 3. Offline Math Practice Game
  document.getElementById('quizTypeSelect').addEventListener('change', generateQuizQuestion);
  document.getElementById('newQuizQuestionBtn').addEventListener('click', generateQuizQuestion);
  document.getElementById('checkQuizBtn').addEventListener('click', checkQuizAnswer);
  document.getElementById('quizAnswerInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkQuizAnswer();
  });
  generateQuizQuestion();
}

function renderTenFrames() {
  document.getElementById('tfBlueCount').textContent = tfBlue;
  document.getElementById('tfAmberCount').textContent = tfAmber;

  const total = tfBlue + tfAmber;
  const frame1El = document.getElementById('tenFrame1');
  const frame2El = document.getElementById('tenFrame2');
  frame1El.innerHTML = '';
  frame2El.innerHTML = '';

  const colors = [];
  for (let i = 0; i < tfBlue; i++) colors.push('blue');
  for (let i = 0; i < tfAmber; i++) colors.push('amber');

  for (let i = 0; i < 20; i++) {
    const cell = document.createElement('div');
    cell.className = 'frame-cell';
    if (colors[i]) {
      const dot = document.createElement('div');
      dot.className = `counter-dot ${colors[i]}`;
      cell.appendChild(dot);
    }
    cell.addEventListener('click', () => {
      if (i < tfBlue) {
        tfBlue--;
      } else if (i < total) {
        tfAmber--;
      } else if (total < 20) {
        tfAmber++;
      }
      renderTenFrames();
    });

    if (i < 10) frame1El.appendChild(cell);
    else frame2El.appendChild(cell);
  }

  const f1Count = Math.min(10, total);
  const f2Count = Math.max(0, total - 10);
  document.getElementById('frame1Status').textContent = `${f1Count} / 10`;
  document.getElementById('frame2Status').textContent = `${f2Count} / 10`;

  // Update Number Bond
  document.getElementById('bondWholeVal').textContent = total;
  document.getElementById('bondPartAVal').textContent = tfBlue;
  document.getElementById('bondPartBVal').textContent = tfAmber;
  document.getElementById('bondEquationText').textContent =
    `${tfBlue} + ${tfAmber} = ${total}   |   ${total} − ${tfBlue} = ${tfAmber}   |   ${total} − ${tfAmber} = ${tfBlue}`;
}

function renderPlaceValue() {
  document.getElementById('pvHCount').textContent = pvHundreds;
  document.getElementById('pvTCount').textContent = pvTens;
  document.getElementById('pvOCount').textContent = pvOnes;

  const hVal = pvHundreds * 100;
  const tVal = pvTens * 10;
  const oVal = pvOnes;
  const total = hVal + tVal + oVal;

  document.getElementById('pvTotalNumber').textContent = total;
  let note = `Expanded Form: ${hVal} + ${tVal} + ${oVal} = ${total}`;
  if (pvOnes >= 10) {
    note += ` (💡 You have ${pvOnes} Ones—tap "Bundle 10 Ones" below!)`;
  }
  document.getElementById('pvExpandedForm').textContent = note;

  const hArea = document.getElementById('pvHundredsArea');
  const tArea = document.getElementById('pvTensArea');
  const oArea = document.getElementById('pvOnesArea');
  hArea.innerHTML = '';
  tArea.innerHTML = '';
  oArea.innerHTML = '';

  for (let i = 0; i < pvHundreds; i++) {
    const b = document.createElement('div');
    b.className = 'block-hundred';
    hArea.appendChild(b);
  }
  for (let i = 0; i < pvTens; i++) {
    const b = document.createElement('div');
    b.className = 'block-ten';
    tArea.appendChild(b);
  }
  for (let i = 0; i < pvOnes; i++) {
    const b = document.createElement('div');
    b.className = 'block-one';
    oArea.appendChild(b);
  }
}

function generateQuizQuestion() {
  const type = document.getElementById('quizTypeSelect').value;
  const qText = document.getElementById('quizQuestionText');
  const hint = document.getElementById('quizHintText');
  const input = document.getElementById('quizAnswerInput');
  input.value = '';

  if (type === 'add') {
    const a = Math.floor(Math.random() * 14) + 5;
    const b = Math.floor(Math.random() * 9) + 3;
    currentQuizAnswer = a + b;
    qText.textContent = `${a} + ${b} = ?`;
    hint.textContent = `💡 Coach Hint: Try starting at ${a} and making the next ten first!`;
  } else if (type === 'sub') {
    const a = Math.floor(Math.random() * 18) + 11;
    const b = Math.floor(Math.random() * 9) + 3;
    currentQuizAnswer = a - b;
    qText.textContent = `${a} − ${b} = ?`;
    hint.textContent = `💡 Coach Hint: How many hops does it take to count up from ${b} to ${a}?`;
  } else if (type === 'missing') {
    const part = Math.floor(Math.random() * 9) + 4;
    const missing = Math.floor(Math.random() * 8) + 3;
    const total = part + missing;
    currentQuizAnswer = missing;
    qText.textContent = `${part} + [ ? ] = ${total}`;
    hint.textContent = `💡 Coach Hint: ${total} is the Whole! Count up from ${part} to ${total}.`;
  } else {
    const names = ['Leo', 'Mia', 'Sam', 'Zoe'];
    const items = ['stickers', 'marbles', 'crayons', 'strawberries'];
    const name = names[Math.floor(Math.random() * names.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const a = Math.floor(Math.random() * 9) + 6;
    const b = Math.floor(Math.random() * 7) + 4;
    currentQuizAnswer = a + b;
    qText.textContent = `${name} found ${a} ${item} in the morning and ${b} more ${item} after school. How many ${item} in all?`;
    hint.textContent = `💡 Coach Hint: We are combining two parts (${a} and ${b}) to find the total!`;
  }
}

function checkQuizAnswer() {
  const val = parseInt(document.getElementById('quizAnswerInput').value, 10);
  const hint = document.getElementById('quizHintText');
  if (isNaN(val)) return;

  if (val === currentQuizAnswer) {
    quizStreak++;
    document.getElementById('quizStreakBadge').textContent = `⭐ Streak: ${quizStreak}`;
    hint.style.color = '#059669';
    hint.innerHTML = `🎉 <strong>Awesome job! ${currentQuizAnswer} is correct!</strong> Loading next question...`;
    setTimeout(() => {
      hint.style.color = 'var(--text-muted)';
      generateQuizQuestion();
    }, 1400);
  } else {
    quizStreak = 0;
    document.getElementById('quizStreakBadge').textContent = `⭐ Streak: 0`;
    hint.style.color = '#E11D48';
    hint.innerHTML = `Not quite ${val}—try counting one more time! You've got this!`;
  }
}

// ============================================================================
// TAB 3: Reading, Phonics & Sight Words Coach
// ============================================================================
const SIGHT_WORDS_DB = {
  grade1: [
    { word: 'after', sentence: 'We can play outside after we finish our homework.' },
    { word: 'again', sentence: 'Can you read that funny story again?' },
    { word: 'could', sentence: 'She wished she could fly like a superhero.' },
    { word: 'every', sentence: 'He brushes his teeth every morning.' },
    { word: 'know', sentence: 'Do you know how many tens are in forty?' },
    { word: 'once', sentence: 'Once upon a time, there was a friendly dragon.' },
    { word: 'where', sentence: 'Where did you put your blue backpack?' }
  ],
  grade2: [
    { word: 'because', sentence: 'We wore our rain boots because the grass was wet.' },
    { word: 'before', sentence: 'Wash your hands before you eat dinner.' },
    { word: 'different', sentence: 'Every snowflake has a different shape.' },
    { word: 'enough', sentence: 'Do we have enough apples for everyone?' },
    { word: 'friend', sentence: 'My best friend sits next to me in second grade.' },
    { word: 'thought', sentence: 'I thought the math puzzle was really fun!' },
    { word: 'write', sentence: 'Please write your name at the top of the page.' },
    { word: 'would', sentence: 'Would you like to build a fort with blankets?' }
  ],
  grade3: [
    { word: 'believe', sentence: 'I believe you can solve this step by step!' },
    { word: 'favorite', sentence: 'What is your favorite animal at the zoo?' },
    { word: 'Important', sentence: 'Listening carefully is an important skill.' },
    { word: 'laugh', sentence: 'The silly puppy made all the children laugh.' },
    { word: 'question', sentence: 'Always raise your hand if you have a question.' },
    { word: 'together', sentence: 'Let us sound out this big word together.' }
  ]
};

let currentSightWordIndex = 0;
let isSightWordHidden = false;

function initReadingCoach() {
  const phonicsInput = document.getElementById('phonicsInput');
  phonicsInput.addEventListener('input', renderPhonicsPills);
  renderPhonicsPills();

  document.getElementById('speakNormalBtn').addEventListener('click', () => {
    speakText(phonicsInput.value, 0.95);
  });
  document.getElementById('speakSlowBtn').addEventListener('click', () => {
    speakText(phonicsInput.value, 0.6);
  });

  // Sight Words
  const gradeSel = document.getElementById('sightGradeSelect');
  gradeSel.addEventListener('change', () => {
    currentSightWordIndex = 0;
    isSightWordHidden = false;
    renderSightWordCard();
  });

  document.getElementById('hearSightWordBtn').addEventListener('click', () => {
    const item = getCurrentSightWord();
    speakText(`${item.word}. ${item.sentence}. The word is ${item.word}.`, 0.82);
  });

  document.getElementById('hideSightWordBtn').addEventListener('click', () => {
    isSightWordHidden = !isSightWordHidden;
    renderSightWordCard();
  });

  document.getElementById('nextSightWordBtn').addEventListener('click', () => {
    const list = SIGHT_WORDS_DB[gradeSel.value] || SIGHT_WORDS_DB.grade2;
    currentSightWordIndex = (currentSightWordIndex + 1) % list.length;
    isSightWordHidden = false;
    document.getElementById('spellingFeedback').textContent = '';
    document.getElementById('spellingAttemptInput').value = '';
    renderSightWordCard();
  });

  document.getElementById('checkSpellingBtn').addEventListener('click', checkSightSpelling);
  document.getElementById('spellingAttemptInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkSightSpelling();
  });

  renderSightWordCard();
}

function renderPhonicsPills() {
  const text = document.getElementById('phonicsInput').value.trim();
  const container = document.getElementById('phonicsWordPills');
  container.innerHTML = '';

  if (!text) return;

  const words = text.split(/\s+/);
  words.forEach((rawWord) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'word-pill';
    pill.innerHTML = highlightPhonicsPatterns(rawWord);
    pill.addEventListener('click', () => {
      pill.classList.add('speaking');
      const clean = rawWord.replace(/[^a-zA-Z']/g, '');
      speakText(clean || rawWord, 0.65);
      setTimeout(() => pill.classList.remove('speaking'), 900);
    });
    container.appendChild(pill);
  });
}

function highlightPhonicsPatterns(word) {
  const safe = escapeHtml(word);
  return safe
    .replace(/(sh|ch|th|wh|ph|ck)/gi, '<span class="phonics-highlight-digraph">$1</span>')
    .replace(/(ea|oa|ai|ee|oo|ou|ow|ay)/gi, '<span class="phonics-highlight-vowel">$1</span>');
}

function getCurrentSightWord() {
  const grade = document.getElementById('sightGradeSelect').value;
  const list = SIGHT_WORDS_DB[grade] || SIGHT_WORDS_DB.grade2;
  return list[currentSightWordIndex % list.length];
}

function renderSightWordCard() {
  const item = getCurrentSightWord();
  const wordEl = document.getElementById('sightWordCardText');
  const sentEl = document.getElementById('sightWordSentence');
  const hideBtn = document.getElementById('hideSightWordBtn');
  const testBox = document.getElementById('spellingTestBox');

  if (isSightWordHidden) {
    wordEl.textContent = '❓ ❓ ❓';
    const maskedSentence = item.sentence.replace(new RegExp(item.word, 'gi'), '_____');
    sentEl.textContent = `"${maskedSentence}"`;
    hideBtn.textContent = '👀 Show Word';
    testBox.style.display = 'flex';
  } else {
    wordEl.textContent = item.word.toLowerCase();
    sentEl.textContent = `"${item.sentence}"`;
    hideBtn.textContent = '🙈 Hide Word for Spelling Test';
    testBox.style.display = 'none';
  }
}

function checkSightSpelling() {
  const item = getCurrentSightWord();
  const attempt = document.getElementById('spellingAttemptInput').value.trim().toLowerCase();
  const feedback = document.getElementById('spellingFeedback');

  if (!attempt) return;
  if (attempt === item.word.toLowerCase()) {
    feedback.style.color = '#059669';
    feedback.textContent = `🌟 Nailed it! "${item.word.toLowerCase()}" is spelled ${item.word.toUpperCase().split('').join(' - ')}!`;
    isSightWordHidden = false;
    renderSightWordCard();
    speakText(`Great job! ${item.word}`, 0.95);
  } else {
    feedback.style.color = '#E11D48';
    feedback.textContent = `Almost! Listen to the sounds again: it starts with "${item.word.slice(0, 2).toLowerCase()}..."`;
  }
}

// ============================================================================
// Speech Synthesis & Helpers
// ============================================================================
function speakText(text, rate = 0.95) {
  if (!('speechSynthesis' in window)) {
    alert('Read-aloud voice is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = 1.05;
  window.speechSynthesis.speak(utter);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}
