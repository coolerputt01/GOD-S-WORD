const randomBibleApi = "https://bible-api.com/data/web/random";
const verseHTML = document.querySelector('.verse-text');
const loader = document.querySelector('.loader');

async function getRandomBible() {
  try {
    // Show loading state
    loader.style.display = "block";
    verseHTML.style.opacity = "0.5";
    const response = await fetch(randomBibleApi);
    const data = await response.json();
    
    verseHTML.innerHTML = `"${data.random_verse.text}" <span>– ${data.random_verse.book} ${data.random_verse.chapter}:${data.random_verse.verse}</span>`;
  } catch (e) {
    verseHTML.textContent = "❌ Failed to load verse. Please try again.";
  } finally {
    loader.style.display = "none";
    verseHTML.style.opacity = "1";
  }
}

// Load once at startup
getRandomBible();

// Reload verse on button click
verseBtn.addEventListener('click', getRandomBible);