        // Get book name and chapter count from the URL
        const params = new URLSearchParams(window.location.search);
        const bookName = params.get("book");
        const totalChapters = parseInt(params.get("chapters"), 10);

        // Render chapters
        const chaptersList = document.querySelector(".main-container");
        for (let i = 1; i <= totalChapters; i++) {
          const div = document.createElement("div");
          div.classList.add('options-small');
          const link = document.createElement("a");
          link.classList.add('text-decor')
          link.textContent = `Chapter ${i}`;
          link.href = `verses.html?book=${bookName}&chapter=${i}`;
          div.appendChild(link);
          chaptersList.appendChild(div);
        }
  //Back
  const backBtn = document.querySelector('.back-icon');
  
  backBtn.addEventListener('click', () => {
    document.location.href = "bible.html";
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
  