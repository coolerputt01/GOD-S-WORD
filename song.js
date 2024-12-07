//Nav icon element selector.
const homeBtn = document.querySelector('.house-icon');
const bibleBtn = document.querySelector('.bible-icon');
const addBtn = document.querySelector('.add-icon');
const blogBtn = document.querySelector('.blog-icon');
const videoChatBtn = document.querySelector('.video-chat-icon');
const loadingCircle = document.querySelector('dotlottie-player');
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
 
const renderSongs = async () => {
  const API_KEY = "8242aa6a"; // Replace with your valid API key
  const API_URL = `https://api.jamendo.com/v3.0/tracks?client_id=${API_KEY}&format=json&limit=200&search=gospel`;
  const songsDiv = document.querySelector('.song-container');
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const searchInput = document.querySelector('.search-input');

    let songs = data.results; // Store the fetched songs for filtering

    const renderSongList = (filteredSongs) => {
      songsDiv.innerHTML = ''; // Clear previous results

      filteredSongs.forEach((song) => {
        const albumImage =
          song.album_image ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS3kazAML1-UWF8YsGDHzy9sIDdjZ3zs9uEUMQMqRI9w&s';
          const albumName = song.album_name;
          const artistName = song.artist_name;
        const songAudio = song.audio;

        const songElement = document.createElement('div');
        songElement.classList.add('option-card');
        songElement.innerHTML = `
          <img src="${albumImage}" alt="${albumName}" class="album-image" />
          <div>
            <p><strong>${albumName}</strong> by ${artistName}</p>
          </div>
          <i class="fa-solid fa-play play-icon" style="cursor: pointer;"></i>
        `;

        const playIcon = songElement.querySelector('.play-icon');

        playIcon.addEventListener('click', () => {
          // Toggle audio playback
          const currentlyPlaying = document.querySelector('.fa-pause');

          // Stop currently playing audio if exists
          if (currentlyPlaying && currentlyPlaying !== playIcon) {
            currentlyPlaying.classList.remove('fa-pause');
            currentlyPlaying.classList.add('fa-play');
            currentlyPlaying.audio.pause();
            currentlyPlaying.audio.currentTime = 0;
          }

          if (!playIcon.audio) {
            playIcon.audio = new Audio(songAudio);
          }

          if (playIcon.classList.contains('fa-play')) {
            playIcon.audio.play();
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
          } else {
            playIcon.audio.pause();
            playIcon.audio.currentTime = 0;
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
          }
        });
        
        songsDiv.appendChild(songElement);
        loadingCircle.style.display = 'none';
      });
    };

    // Initial render with all songs
    renderSongList(songs);

    // Add search functionality
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredSongs = songs.filter((song) =>
        albumName.toLowerCase().includes(searchTerm)
      );
      renderSongList(filteredSongs);
    });
  } catch (error) {
    let warningTag = document.createElement('p');
    warningTag.textContent = 'An error occured when fetching songs';
    warningTag.classList.add('warning-tag');
    songsDiv.appendChild(warningTag);
    console.error('An error occurred:', error.message);
  
    
  }
};

renderSongs();