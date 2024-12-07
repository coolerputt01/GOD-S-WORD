//Nav icon element selector.
const homeBtn = document.querySelector('.house-icon');
const bibleBtn = document.querySelector('.bible-icon');
const addBtn = document.querySelector('.add-icon');
const blogBtn = document.querySelector('.blog-icon');
const videoChatBtn = document.querySelector('.video-chat-icon');

const songBtn = document.querySelector('.music-icon');
const loadingCircle = document.querySelector('dotlottie-player');
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
  
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAQShOEgHn6gJFhR26wCCommXPIF58ZijY",
  authDomain: "god-s-word-e8e1f.firebaseapp.com",
  projectId: "god-s-word-e8e1f",
  storageBucket: "god-s-word-e8e1f.firebasestorage.app",
  messagingSenderId: "1070577524696",
  appId: "1:1070577524696:web:bdeeebb2e430baea261cad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML elements
const imageUploadButton = document.getElementById('imageUpload');
const addBlogButton = document.querySelector('.add-blog-button');

// Maximum allowed file size (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Resize image function
function resizeImage(file, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);

    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate the scaling factor
      const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);

      // Resize the image while maintaining aspect ratio
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert the resized image to Base64
      const resizedBase64 = canvas.toDataURL(file.type);
      resolve(resizedBase64);
    };
  });
}

//See this trash method sha😮‍💨
imageUploadButton.addEventListener('change', function(event) {
  //Select the image element.
  const imagePreview = document.getElementById('imagePreview');
  //Selected file - or file selected by user.
  const file = event.target.files[0];
  //if file is selected.
  if (file) {
    //Initiate nonsense file reader.
    const reader = new FileReader();
    //Run on load.
    reader.onload = function(e) {
      //Trash sha.
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    //Convert to URL data
    reader.readAsDataURL(file);
  } else {
    //If file is not ready chop rice.
    imagePreview.style.display = 'none';
  }
});

// Upload function
async function upload() {
  const blogNameValue = document.getElementById('blogTitle').value;
  const blogDetailsValue = document.getElementById('blogDetails').value;
  const blogImage = imageUploadButton.files[0];

  if (!blogImage) {
    alert('Please upload an image.');
    return;
  }

  if (blogImage.size > MAX_FILE_SIZE) {
    alert('File is too large. Please upload an image smaller =than 2MB.');
    return;
  }

  if (!blogNameValue || !blogDetailsValue) {
    alert('Please fill in all the fields.');
    return;
  }

  try {
    loadingCircle.style.display = "block";
    // Resize image and convert to Base64
    const resizedBase64Image = await resizeImage(blogImage);

    // Prepare the data to store in Firestore
    const formData = {
      blogTitle: blogNameValue,
      blogContent: blogDetailsValue,
      imageUrl: resizedBase64Image, // Store the resized Base64 image
      timestamp: new Date().toISOString(),
    };

    // Save data to Firestore
    await addDoc(collection(db, 'blog'), formData);
    loadingCircle.style.display = "none";
    alert('Blog submitted successfully!');
    document.location.href = 'blog.html';
  } catch (error) {
    console.error('Error submitting blog:', error.code, error.message);
    alert(`Failed to submit the blog: ${error.message}`);
  }
}

// Form Submission Handler
addBlogButton.addEventListener('click', function(event) {
  event.preventDefault();
  upload();
});