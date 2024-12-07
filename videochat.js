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
  