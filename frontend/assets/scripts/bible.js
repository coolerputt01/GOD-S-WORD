/* bible.js — dropdowns + fetch + TTS progress (with onboundary fallback) */
const bibleEndpoint = "https://bible-api.com/";

// ==================== Dropdowns ====================
async function loadBibleDropdowns() {
  const dataPath = "../assets/data/bible-data.json"; // check path
  try {
    const res = await fetch(dataPath);
    const bibleData = await res.json();

    const bookBtn = document.getElementById("book-dropdown-btn");
    const bookList = document.querySelector("#book-dropdown .dropdown-list");
    const chapterBtn = document.getElementById("chapter-dropdown-btn");
    const chapterList = document.querySelector("#chapter-dropdown .dropdown-list");
    const chapterTitle = document.getElementById("chapter-title");
    const chapterText = document.querySelector(".chapter-text");
    const loader = document.querySelector(".loading-circle");

    // build books list
    Object.keys(bibleData).forEach((book, idx) => {
      const li = document.createElement("li");
      li.textContent = book;
      li.dataset.book = book;
      li.tabIndex = 0;
      li.setAttribute("role", "option");
      li.addEventListener("click", () => selectBook(book));
      li.addEventListener("keydown", e => { if (e.key === "Enter") selectBook(book); });
      bookList.appendChild(li);

      if (idx === 0) bookBtn.textContent = book + " ▼";
    });

    function toggleList(btn, list) {
      const isHidden = list.classList.contains("hidden");
      document.querySelectorAll(".dropdown-list").forEach(l => {
        l.classList.add("hidden");
        l.previousElementSibling?.setAttribute("aria-expanded", "false");
      });
      if (isHidden) {
        list.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        list.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
      }
    }

    bookBtn.addEventListener("click", () => toggleList(bookBtn, bookList));
    chapterBtn.addEventListener("click", () => toggleList(chapterBtn, chapterList));

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        document.querySelectorAll(".dropdown-list").forEach(l => l.classList.add("hidden"));
        document.querySelectorAll(".dropdown-btn").forEach(b => b.setAttribute("aria-expanded", "false"));
      }
    });

    function selectBook(bookName) {
      bookBtn.textContent = bookName + " ▼";
      bookList.classList.add("hidden");
      bookBtn.setAttribute("aria-expanded", "false");

      // chapters
      const count = bibleData[bookName];
      chapterList.innerHTML = "";
      for (let i = 1; i <= count; i++) {
        const li = document.createElement("li");
        li.textContent = i;
        li.dataset.chapter = i;
        li.tabIndex = 0;
        li.setAttribute("role", "option");
        li.addEventListener("click", () => selectChapter(bookName, i));
        li.addEventListener("keydown", e => { if (e.key === "Enter") selectChapter(bookName, i); });
        chapterList.appendChild(li);
      }
      selectChapter(bookName, 1);
    }

    async function selectChapter(bookName, chapterNumber) {
      chapterBtn.textContent = `Chapter ${chapterNumber} ▼`;
      chapterList.classList.add("hidden");
      chapterBtn.setAttribute("aria-expanded", "false");

      chapterTitle.textContent = `${bookName} ${chapterNumber}`;
      await fetchBibleChapter(bookName, chapterNumber);
    }

    async function fetchBibleChapter(book, chapter) {
      try {
        chapterText.classList.add("loading");
        chapterText.innerHTML = `
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        `;
        if (loader) loader.style.display = "block";

        const response = await fetch(bibleEndpoint + encodeURIComponent(book) + "+" + chapter);
        const data = await response.json();

        chapterText.classList.remove("loading");
        if (loader) loader.style.display = "none";

        if (data.error) {
          chapterText.innerHTML = `<p class="error">Could not fetch ${book} ${chapter}: ${data.error}</p>`;
          return;
        }

        chapterText.innerHTML = "";
        data.verses.forEach(verse => {
          const p = document.createElement("p");
          p.innerHTML = `<sup>${verse.verse}</sup> ${verse.text}`;
          chapterText.appendChild(p);
        });

      } catch (error) {
        if (loader) loader.style.display = "none";
        chapterText.classList.remove("loading");
        chapterText.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        console.error("Error fetching chapter:", error);
      }
    }

    const firstBookItem = bookList.querySelector("li");
    if (firstBookItem) selectBook(firstBookItem.dataset.book);

  } catch (err) {
    console.error("Error loading bible data:", err);
  }
}

// ==================== Helpers & UI selectors ====================
function formatTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(Math.floor(s % 60)).padStart(2, "0");
  return `${m}:${sec}`;
}

function getProgressElements() {
  // tolerant selection: supporting different HTML structures
  const timeEls = document.querySelectorAll(".time");
  const currentEl = document.querySelector(".time.current") || document.querySelector(".time-start") || (timeEls[0] || null);
  const durationEl = document.querySelector(".time.duration") || document.querySelector(".time-end") || (timeEls[1] || null);
  const fill = document.querySelector(".fill");
  return { currentEl, durationEl, fill };
}

// ==================== TTS + progress (onboundary + fallback) ====================
let utterance = null;
let isPlaying = false;
let boundarySupported = false;
let fallbackInterval = null;
let fallbackIndex = 0;
let fallbackWords = [];
let prefixCharCounts = [];
let estimatedDuration = 0; // seconds
let ttsStartTs = 0;
let boundaryDetectTimer = null;

function startFallbackByWords(text) {
  // split into words and compute prefix char counts
  fallbackWords = text.match(/\S+/g) || [];
  prefixCharCounts = [];
  let acc = 0;
  fallbackWords.forEach((w, i) => {
    acc += w.length + (i === 0 ? 0 : 1); // include a space for subsequent words
    prefixCharCounts.push(acc);
  });

  // estimate overall duration (chars per sec ~ 15 -> ~ 180 wpm)
  estimatedDuration = Math.max(1, Math.ceil(text.length / 15));
  const perWordMs = (estimatedDuration * 1000) / Math.max(1, fallbackWords.length);

  fallbackIndex = 0;
  updateProgressUI(0, estimatedDuration, prefixCharCounts[0] || 0, text.length);

  // ensure any previous fallback interval is cleared
  clearInterval(fallbackInterval);
  fallbackInterval = setInterval(() => {
    fallbackIndex++;
    const charIndex = prefixCharCounts[Math.min(fallbackIndex, prefixCharCounts.length - 1)] || text.length;
    updateProgressUI(charIndex, estimatedDuration, charIndex, text.length);
    if (fallbackIndex >= fallbackWords.length) {
      clearInterval(fallbackInterval);
    }
  }, perWordMs);
}

function stopFallback() {
  clearInterval(fallbackInterval);
  fallbackInterval = null;
  fallbackWords = [];
  prefixCharCounts = [];
  fallbackIndex = 0;
}

// Update progress UI given current char index & estimated duration
function updateProgressUI(currentCharIndex, totalSeconds, currentChar, totalChars) {
  const { currentEl, durationEl, fill } = getProgressElements();
  const percent = totalChars ? (currentChar / totalChars) * 100 : 0;
  if (fill) fill.style.width = `${Math.min(100, percent)}%`;
  if (currentEl && durationEl) {
    // elapsed seconds = percent * totalSeconds
    const elapsed = Math.floor((percent / 100) * totalSeconds);
    currentEl.textContent = formatTime(elapsed);
    durationEl.textContent = formatTime(totalSeconds);
  } else if (currentEl) {
    // fallback if only current exists
    const elapsed = Math.floor((percent / 100) * totalSeconds);
    currentEl.textContent = formatTime(elapsed);
  }
}

function speak() {
  const chapterTextEl = document.querySelector(".chapter-text");
  if (!chapterTextEl) return alert("Chapter text element missing.");
  const text = chapterTextEl.innerText.trim();
  if (!text) return alert("No chapter text loaded.");

  const playBtn = document.querySelector(".play");
  const { currentEl, durationEl, fill } = getProgressElements();

  if (!('speechSynthesis' in window)) {
    alert("SpeechSynthesis is not supported in this browser.");
    return;
  }

  // If currently speaking & not paused -> toggle pause
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    isPlaying = false;
    if (playBtn) playBtn.textContent = "▶️";
    // pause fallback
    stopFallback();
    return;
  }

  // If paused -> resume
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    isPlaying = true;
    if (playBtn) playBtn.textContent = "⏸️";
    // resume fallback: restart from current position if we have words left
    if (fallbackWords.length) {
      const textSoFar = chapterTextEl.innerText.trim();
      // recalc fallbackIndex from char already shown in UI (best-effort)
      // find current percent from fill width
      const fillEl = document.querySelector(".fill");
      let percent = 0;
      if (fillEl && fillEl.style.width) {
        percent = parseFloat(fillEl.style.width);
      }
      const approxChar = Math.round((percent / 100) * textSoFar.length);
      // compute next fallbackIndex
      fallbackIndex = prefixCharCounts.findIndex(c => c > approxChar);
      if (fallbackIndex < 0) fallbackIndex = 0;
      // start fallback again from fallbackIndex
      startFallbackByWords(text);
    }
    return;
  }

  // Start new utterance
  utterance = new SpeechSynthesisUtterance(text);
  // optional: tweak rate if desired
  // utterance.rate = 1.0;

  // Prepare UI estimate
  estimatedDuration = Math.max(1, Math.ceil(text.length / 15)); // ~15 chars/sec
  if (durationEl) durationEl.textContent = formatTime(estimatedDuration);
  if (currentEl) currentEl.textContent = formatTime(0);
  if (fill) fill.style.width = "0%";

  // Preload voices if available; if not available yet, wait for onvoiceschanged
  let voices = speechSynthesis.getVoices();
  function chooseVoiceAndSpeak() {
    // choose male-ish voice if possible
    voices = speechSynthesis.getVoices();
    let maleVoice = voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes("male") || n.includes("david") || n.includes("alex") || n.includes("daniel");
    });
    if (!maleVoice) {
      // fallback: pick any voice matching language (if you want, set utterance.lang = 'en-US')
      maleVoice = voices.find(v => v.lang && v.lang.startsWith("en")) || voices[0];
    }
    if (maleVoice) utterance.voice = maleVoice;

    // Reset boundary detection flag/timers
    boundarySupported = false;
    clearTimeout(boundaryDetectTimer);

    // onboundary handler: many engines provide charIndex even if event.name is absent
    utterance.onboundary = (ev) => {
      // ev.charIndex is most reliable cross-browser (if provided)
      if (typeof ev.charIndex === "number") {
        boundarySupported = true;
        // update UI based on this charIndex
        updateProgressUI(ev.charIndex, estimatedDuration, ev.charIndex, text.length);
      }
    };

    // onstart: start a timer that will decide fallback if we didn't see boundaries
    utterance.onstart = () => {
      ttsStartTs = Date.now();
      boundaryDetectTimer = setTimeout(() => {
        if (!boundarySupported) {
          // boundary didn't arrive — use fallback
          console.log("No boundary events detected: switching to word-based fallback.");
          startFallbackByWords(text);
        }
      }, 600); // give boundary events a short window to appear
    };

    utterance.onend = () => {
      // ensure cleanup
      clearTimeout(boundaryDetectTimer);
      stopFallback();
      // show finished state (100% briefly)
      if (fill) fill.style.width = "100%";
      if (currentEl && durationEl) currentEl.textContent = durationEl.textContent;
      // reset after a short delay
      setTimeout(() => {
        if (fill) fill.style.width = "0%";
        if (currentEl) currentEl.textContent = formatTime(0);
        isPlaying = false;
        if (document.querySelector(".play")) document.querySelector(".play").textContent = "▶️";
      }, 600);
    };

    // safety: onerror
    utterance.onerror = (err) => {
      console.error("TTS error:", err);
      clearTimeout(boundaryDetectTimer);
      stopFallback();
      isPlaying = false;
      if (document.querySelector(".play")) document.querySelector(".play").textContent = "▶️";
    };

    // speak
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    isPlaying = true;
    if (document.querySelector(".play")) document.querySelector(".play").textContent = "⏸️";
  }

  if (!voices || !voices.length) {
    // voices may load asynchronously on some browsers
    speechSynthesis.onvoiceschanged = () => {
      chooseVoiceAndSpeak();
    };
    // also try to call it right away (some browsers already have voices)
    setTimeout(() => {
      voices = speechSynthesis.getVoices();
      if (voices && voices.length) chooseVoiceAndSpeak();
    }, 200);
  } else {
    chooseVoiceAndSpeak();
  }
}

// attach play button
document.addEventListener("DOMContentLoaded", () => {
  loadBibleDropdowns();
  const playBtn = document.querySelector(".play");
  if (playBtn) playBtn.addEventListener("click", speak);
});