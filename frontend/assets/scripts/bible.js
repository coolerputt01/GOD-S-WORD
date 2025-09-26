async function loadBibleDropdown() {
  const dataPath = "../data/bible-data.json";
  const res = await fetch(dataPath);
  const data = await res.json();
  
  const dropdown = document.querySelector("#book-dropdown");
  const btn = dropdown.querySelector(".dropdown-btn");
  const list = dropdown.querySelector(".dropdown-list");
  
  // Populate list with books
  Object.keys(data).forEach(book => {
    const li = document.createElement("li");
    li.textContent = book;
    li.addEventListener("click", () => {
      btn.textContent = book; // update button text
      list.classList.add("hidden"); // close dropdown
      // 👉 you can also trigger chapter loading here
    });
    list.appendChild(li);
  });
  
  // Toggle dropdown open/close
  btn.addEventListener("click", () => {
    list.classList.toggle("hidden");
  });
}

document.addEventListener("DOMContentLoaded", loadBibleDropdown);