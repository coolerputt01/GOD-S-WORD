AOS.init();
//Essential HTML element object.
const cancelButton = document.querySelectorAll('.cancel-icon');
const cardVerse = document.querySelector('.card-verse');
const loader = document.querySelector('dotlottie-player')
//Card delete Logic.
const clickedIcons = new Set();

cancelButton.forEach(icon => {
  icon.addEventListener('click', () => {
    const bibleCard = icon.closest('.bible-card');
    bibleCard.style.display = 'none';

    // Add the clicked icon to the Set
    clickedIcons.add(icon);

    // Check if both icons have been clicked
    if (clickedIcons.size === cancelButton.length) {
      AOS.init({
        disable: true
      })
      // You can trigger additional actions here
    }
  });
});
//Nav icon element selector.
const homeBtn = document.querySelector('.house-icon');
const bibleBtn = document.querySelector('.bible-icon');
const addBtn = document.querySelector('.add-icon');
const blogBtn = document.querySelector('.blog-icon');
const videoChatBtn = document.querySelector('.video-chat-icon');
const songBtn = document.querySelector('.music-icon');
//Redirect Logic.
const aiIcon = document.querySelector('.ai-icon');
aiIcon.addEventListener('click', function(){
  document.location.href = "ai.html"
});
songBtn.addEventListener('click',() => {
  document.location.href = 'song.html'
});
bibleBtn.addEventListener('click', () => {
  document.location.href = 'bible.html';
});
homeBtn.addEventListener('click', () => {
  document.location.href = 'home.html';
});

addBtn.addEventListener('click', () => {
  document.location.href = 'addblog.html';
});
blogBtn.addEventListener('click', () => {
  document.location.href = 'blog.html';
});
videoChatBtn.addEventListener('click', () => {
    document.location.href = 'videochat.html';
  });
loader.style.display = 'block';
//Random bible verse.
//Fetch Random Bible Verse and chapter.
const bibleChapter = document.querySelector('.biblec');
async function fetchRandomVerse() {
  const verseReferenceElement = document.querySelector('.bible-context');

  try {
    // Fetch random Bible verse
    const response = await fetch("https://labs.bible.org/api/?passage=random&type=json");
    const data = await response.json();
    
    // Extract verse details
    const verse = data[0]; // API returns an array with one item
    cardVerse.textContent = `"${verse.text}"`;
    verseReferenceElement.textContent = `${verse.bookname} ${verse.chapter}:${verse.verse}`;
    bibleChapter.textContent = `${verse.bookname} ${verse.chapter}:${verse.verse}`;
    loader.style.display = 'none';
  } catch (error) {
    console.error("Error fetching verse:", error);
    cardVerse.textContent = "Unable to load verse. Please try again later.";
    cardVerse.style.textAlign = "center";
    verseReferenceElement.textContent = "";
  }
}
if(window.innerWidth > 768){
  AOS.init({
    disable:true
  });
}
// Fetch verse on page load
fetchRandomVerse();
