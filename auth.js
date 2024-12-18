//Necessary HTML Object elements.
const nameInput = document.querySelector('.name');
const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const signUpFormSubmitButton = document.querySelector('.auth-button');
const eyeToggler = document.querySelector('.eye');
const bibleImage = document.getElementById('bible-img');
//Function to handle password toggle.
function togglePassword() {
  let inputType = passwordInput.getAttribute('type') === "password" ? "text" : "password";
  passwordInput.setAttribute('type',inputType);
 eyeToggler.classList.toggle('fa-eye');
  eyeToggler.classList.toggle('fa-eye-slash');
  
}
//JS responsiveness.
if(window.innerWidth > 768){
  bibleImage.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzHoDyVMUGwgr2DNbOPtx9cw5pAJbjI6FXYIxkq-u5_Q&s';
}
eyeToggler.addEventListener('click',togglePassword);

        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
      
      // function import
      import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
      import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
      import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
      const auth = getAuth(app);
      const db = getFirestore(app);
      
      // Function to register user
      const registerUser = async (name,email, password) => {
  try {
    const loadingCircle = document.querySelector('dotlottie-player');
    loadingCircle.style.display = "block"
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
    });

    window.location.href = "home.html";
  } catch (error) {
    document.querySelector('.warning-text').style.display = 'block';
    console.error("Error during registration:", error.message);
  }
};
      
      // Example usage
      
      signUpFormSubmitButton.addEventListener('click', function(event) {
        event.preventDefault();
        if(nameInput.value|| emailInput.value|| passwordInput.value){
        registerUser(nameInput.value.trim(),emailInput.value.trim(), passwordInput.value.trim());
        }else{
        document.querySelector('.warning-text').style.display = 'block';
      }
      });