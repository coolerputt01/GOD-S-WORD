        // Get book and chapter from the URL
        const params = new URLSearchParams(window.location.search);
        const bookName = params.get("book");
        const chapter = params.get("chapter");
        const loadingCircle = document.querySelector('dotlottie-player');
        // API URL
        const apiUrl = `https://bible-api.com/${bookName} ${chapter}`;

        // Fetch and display verses
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const versesList = document.getElementById("verses-list");
             // Clear loading text
            loadingCircle.style.display = 'block';
            data.verses.forEach(verse => {
              const div = document.createElement("div");
              div.classList.add('verse-card');
              div.textContent = `${verse.verse}: ${verse.text}`;
              versesList.appendChild(div);
              loadingCircle.style.display = 'none';
            });
          })
          .catch(error => {
            console.error("Error fetching verses:", error);
            document.getElementById("verses-list").textContent = "Unable to load verses.";
          });
  const backBtn = document.querySelector('.back-icon');
  
  backBtn.addEventListener('click', () => {
    document.location.href = "bible.html";
  })
  //Nav icon element selector.
  const homeBtn = document.querySelector('.house-icon');
  const bibleBtn = document.querySelector('.bible-icon');
  const addBtn = document.querySelector('.add-icon');
  const blogBtn = document.querySelector('.blog-icon');
  const videoChatBtn = document.querySelector('.video-chat-icon');
  
  const songBtn = document.querySelector('.music-icon');
  //Redirect Logic.
  const aiIcon = document.querySelector('.ai-icon');
  aiIcon.addEventListener('click', function() {
    document.location.href = "ai.html"
  });
  songBtn.addEventListener('click', () => {
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
  