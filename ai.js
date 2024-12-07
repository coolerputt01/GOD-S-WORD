"use strict";

import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";


let actionTab = document.querySelector('.action-tab');
let input = document.querySelector("#chat-input");
let chatBox = document.querySelector(".chatbox");
let chatSender = document.querySelector('.chat-sender');
let sendButton = document.querySelector("#send-button");
let defaultScreen = document.querySelector('.default-screen');

let history = [];




const API_KEY = "AIzaSyCueB27BO0-FM1LKThPyhHhKlp8P66ZgU4";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `Your name is Chatbot and you are a friendly Christian ai chatbot. You are available for only Christian relatd topics either from the Bible or pertaining Christian life. You are there to help them on their spritual journey.`,
});
const chat = model.startChat({
  history: history,
});




const getResponse = async () => {

  defaultScreen.style.display = 'none';

  let aiDivWrap = document.createElement('div');
  aiDivWrap.classList.add('ai-divwrap');

  let aiDp = document.createElement('div');
  aiDp.classList.add('ai-dp');

  let aiDiv = document.createElement('div');
  aiDiv.classList.add('ai-message')

  let usrDiv = document.createElement('div');
  usrDiv.classList.add('usr-message')

  const prompt = input.value.trim(); // would typically be an input value

  if (prompt == '') {
    chatSender.style.border = '0.06rem solid red';

    setTimeout(() => {
      chatSender.style.border = 'none';
    }, 2000);

  } else {

    let loader = document.createElement('div');
    loader.classList.add('loader');
    usrDiv.textContent = input.value;

    aiDiv.appendChild(loader)
    aiDiv.style.background = 'transparent';

    aiDivWrap.appendChild(aiDp);
    aiDivWrap.appendChild(aiDiv);

    chatBox.appendChild(usrDiv);
    chatBox.appendChild(aiDivWrap);


    history.push({
      role: "user", // The role is 'user' to denote this is the user's message
      parts: [{ text: prompt }], // Store the prompt text inside the parts array
    });

    // send prompt to ai
    const result = await chat.sendMessageStream(prompt);


    for await (const chunk of result.stream) {
      let chunkText = chunk.text();

      // remove loader
      loader.remove();

      let aiText = document.createElement('div');
      aiText.classList.add('ai-response')
      aiText.innerText = chunkText;

      usrDiv.textContent = input.value;

      aiDiv.appendChild(aiText)


      aiDivWrap.appendChild(aiDp);
      aiDivWrap.appendChild(aiDiv);

      chatBox.appendChild(usrDiv);
      chatBox.appendChild(aiDivWrap);

    }
   
   
    input.value = ''; // clear the input after a message is sent
  }
};

sendButton.addEventListener("click", getResponse);



// Function to check if user is at the bottom
const isUserAtBottom = () => {
  return chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50;
}

// Function to scroll to bottom
const scrollToBottom = () => {
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth' // Enable smooth scrolling
  });
  scrollButton.style.display = 'none'; // Hide the button once scrolled
}

// Detect new messages
const newMessageAdded = () => {
  if (!isUserAtBottom()) {
     scrollToBottom()// Show the button if user is not at the bottom
  }
}

//  to bottom when button is clicked


// Listen for new messages being added to the chat container
const observer = new MutationObserver(() => {
  newMessageAdded();
});
observer.observe(chatBox, { childList: true });

// Auto-scroll to the bottom if user is already at the bottom when a message is added
chatBox.addEventListener('scroll', () => {
  if (isUserAtBottom()) {
    scrollButton.style.display = 'none'; // Hide the button if user manually scrolls to the bottom
  }
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
  