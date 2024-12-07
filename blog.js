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
  document.location.href = 'bible.html';
});
blogBtn.addEventListener('click', () => {
  document.location.href = 'blog.html';
});
videoChatBtn.addEventListener('click', () => {
    document.location.href = 'videochat.html';
  });
  
// Import Firebase modules
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
  import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
  
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAQShOEgHn6gJFhR26wCCommXPIF58ZijY",
    authDomain: "god-s-word-e8e1f.firebaseapp.com",
    projectId: "god-s-word-e8e1f",
    storageBucket: "god-s-word-e8e1f.firebasestorage.app",
    messagingSenderId: "1070577524696",
    appId: "1:1070577524696:web:bdeeebb2e430baea261cad"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = getFirestore(app);
  const blogContainer = document.querySelector('.blog-container');
  const loadingAnimation= document
  .querySelector('dotlottie-player');
  // Fetch and render blogs
  const fetchAndRenderBlogs = async () => {
    blogContainer.innerHTML = ''; // Clear previous content
  
    try {
      const querySnapshot = await getDocs(collection(db, 'blog'));
      const blogs = [];
  
      querySnapshot.forEach(doc => {
        const blogData = doc.data();
        blogs.push({ id: doc.id, ...blogData });
      });
      renderBlogs(blogs); // Pass the blogs array to renderBlogs
      loadingAnimation.style.display = "none";
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
  
  // Render blogs dynamically
  const renderBlogs = (blogs) => {
    blogContainer.innerHTML = ''; // Clear previous content
  
    if (blogs.length === 0) {
      blogContainer.innerHTML = '<p>No Blogs found.</p>';
      return;
    }
  
    blogs.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.classList.add('blog-card');
  
      // If base64 data exists for the image (use imageBase64 instead of imageUrl)
      const imageSrc = blog.imageUrl;
  
      // Create a canvas element to render the image with increased resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Load the image
      const img = new Image();
      img.src = imageSrc;
  
      img.onload = () => {
        // Set the canvas dimensions to a higher resolution
        const scaleFactor = 2; // Increase the resolution by a factor of 2
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
  
        // Draw the image onto the canvas with scaling
        ctx.drawImage(img, 0, 0, img.width * scaleFactor, img.height * scaleFactor);
  
        // Convert canvas to base64 image data URL
        const highResImageSrc = canvas.toDataURL();
  
        // Add the high-resolution image to the blog card
        blogCard.innerHTML = `
          <img src="${highResImageSrc}" alt="${blog.blogName}" class="blog-img">
          <h3 class="blog-title">${blog.blogTitle}</h3>
          <p class="blog-content">${blog.blogContent}</p>
          <p class="time">${blog.timestamp.split('T')[0]}</p>
        `;
        blogContainer.appendChild(blogCard);
      };
    });
  };
  
  // Initial fetch and render
  fetchAndRenderBlogs();