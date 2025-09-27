const bibleEndpoint = "https://bible-api.com/";

// bible.js — custom dropdowns for book + chapter
async function loadBibleDropdowns() {
  const dataPath = "../assets/data/bible-data.json"; // ensure this path is correct
  try {
    const res = await fetch(dataPath);
    const bibleData = await res.json(); // object: { "Genesis": 50, ... }

    const bookBtn = document.getElementById("book-dropdown-btn");
    const bookList = document.querySelector("#book-dropdown .dropdown-list");
    const chapterBtn = document.getElementById("chapter-dropdown-btn");
    const chapterList = document.querySelector("#chapter-dropdown .dropdown-list");
    const chapterTitle = document.getElementById("chapter-title");
    const chapterText = document.querySelector(".chapter-text");

    // build books list
    Object.keys(bibleData).forEach((book, idx) => {
      const li = document.createElement("li");
      li.textContent = book;
      li.tabIndex = 0;
      li.setAttribute("role", "option");
      li.dataset.book = book;
      li.addEventListener("click", () => selectBook(book));
      li.addEventListener("keydown", (e) => { if (e.key === "Enter") selectBook(book); });
      bookList.appendChild(li);
      if (idx === 0) { 
        bookBtn.textContent = book + " ▼"; // set first as default
      }
    });

    function openCloseList(btn, list) {
      const isHidden = list.classList.contains("hidden");
      document.querySelectorAll(".dropdown-list").forEach(l => {
        if (l !== list) { l.classList.add("hidden"); l.previousElementSibling?.setAttribute("aria-expanded","false"); }
      });
      if (isHidden) {
        list.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
        list.focus();
      } else {
        list.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
      }
    }

    // toggle handlers
    bookBtn.addEventListener("click", () => openCloseList(bookBtn, bookList));
    chapterBtn.addEventListener("click", () => openCloseList(chapterBtn, chapterList));

    // click outside => close
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".custom-dropdown")) {
        document.querySelectorAll(".dropdown-list").forEach(l => l.classList.add("hidden"));
        document.querySelectorAll(".dropdown-btn").forEach(b => b.setAttribute("aria-expanded","false"));
      }
    });

    // select book -> populate chapters
    function selectBook(bookName) {
      bookBtn.textContent = bookName + " ▼";
      bookList.classList.add("hidden");
      bookBtn.setAttribute("aria-expanded", "false");

      // prepare chapters
      const count = bibleData[bookName];
      chapterList.innerHTML = "";
      for (let i = 1; i <= count; i++) {
        const li = document.createElement("li");
        li.textContent = i;
        li.tabIndex = 0;
        li.setAttribute("role", "option");
        li.dataset.chapter = i;
        li.addEventListener("click", () => selectChapter(bookName, i));
        li.addEventListener("keydown", (e) => { if (e.key === "Enter") selectChapter(bookName, i); });
        chapterList.appendChild(li);
      }

      // auto-select first chapter
      selectChapter(bookName, 1);
    }

    // select chapter -> update UI
    async function selectChapter(bookName, chapterNumber) {
      chapterBtn.textContent = `Chapter ${chapterNumber} ▼`;
      chapterList.classList.add("hidden");
      chapterBtn.setAttribute("aria-expanded", "false");

      chapterTitle.textContent = `${bookName} ${chapterNumber}`;

      await fetchBibleChapter(bookName, chapterNumber);
    }

    // fetch verses
    async function fetchBibleChapter(book, chapter) {
      try {
        const response = await fetch(bibleEndpoint + encodeURIComponent(book) + "+" + chapter);
        const data = await response.json();

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
        chapterText.innerHTML = `<p class="error">An error occurred when fetching Bible: ${error.message}</p>`;
        console.error("An error occurred when fetching Bible: ", error.message);
      }
    }

    // initialize first book
    const firstBookItem = bookList.querySelector("li");
    if (firstBookItem) selectBook(firstBookItem.dataset.book);

  } catch (err) {
    console.error("Error loading bible data:", err);
  }
}

function speak() {
  // Get the chapter text
  const chapterText = document.querySelector(".chapter-text");
  const text = chapterText.innerText.trim();
  
  if (!text) {
    alert("No chapter text loaded to read.");
    return;
  }
  
  // Create utterance
  let utterance = new SpeechSynthesisUtterance(text);
  
  // Get voices (some browsers need voiceschanged event)
  let voices = window.speechSynthesis.getVoices();
  
  // Try to pick a male-sounding voice
  let maleVoice = voices.find(voice =>
    voice.name.toLowerCase().includes("male") ||
    voice.name.toLowerCase().includes("david") || // Windows
    voice.name.toLowerCase().includes("alex") || // macOS
    voice.name.toLowerCase().includes("daniel") // Common
  );
  
  if (maleVoice) {
    utterance.voice = maleVoice;
  }
  
  // Speak it
  speechSynthesis.cancel(); // stop any current speech
  speechSynthesis.speak(utterance);
}

// Button click => speak
document.querySelector(".play").addEventListener("click", () => {
  speak();
});

// Some browsers only load voices after this event
window.speechSynthesis.onvoiceschanged = () => {
  console.log("Voices loaded:", window.speechSynthesis.getVoices());
};

document.addEventListener("DOMContentLoaded", loadBibleDropdowns);