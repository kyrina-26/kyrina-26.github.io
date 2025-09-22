import { addImage, deleteImage, addComment, deleteComment, getImages, toggleForm, getComments, deleteCommentsForImage} from "./api.mjs";

const openBtn = document.getElementById("upload-btn");
const closeBtn = document.getElementById("close-btn");
const submitBtn = document.getElementById("submit-button");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const deleteBtn = document.getElementById("delete");
const imgEl = document.getElementById("current-image");
const authorEl = document.getElementById("display-author");
const titleEl = document.getElementById("display-title");
const usernameInput = document.getElementById("username");
const commentInput = document.getElementById("comment-input");
const commentBtn = document.getElementById("submit-comment");
const commentsArea = document.getElementById("comments-area");
const prevCommentsBtn = document.getElementById("prev-comments");
const nextCommentsBtn = document.getElementById("next-comments");
const imageArea = document.getElementById("img-display");

const gallery = getImages();
let currentIndex = 0;
let currentCommentPage = 0;

updateDisplay();

//manages comments area
function renderComments() {
  commentsArea.innerHTML = "<h3>Comments</h3>"; // reset but keep title

  if (gallery.length === 0) return;

  const imageId = gallery[currentIndex].id;
  let comments = getComments(imageId);

  // newest first
  comments.sort((a, b) => new Date(b.date) - new Date(a.date));

  // slice by page
  const start = currentCommentPage * 10;
  const paginated = comments.slice(start, start + 10);

  paginated.forEach(c => {
    const div = document.createElement("div");
    div.classList.add("comment");

    const header = document.createElement("div");
    header.classList.add("comment-header");
    const formattedDate = new Date(c.date).toLocaleString();
    header.textContent = `${c.author} – ${formattedDate}`; // format date


    const text = document.createElement("p");
    text.textContent = c.content;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn");
    deleteBtn.addEventListener("click", () => {
      deleteComment(c.id);
      renderComments();
    });

    div.appendChild(header);
    div.appendChild(text);
    div.appendChild(deleteBtn);

    commentsArea.appendChild(div);
  });

  // Pagination buttons
  prevCommentsBtn.disabled = currentCommentPage === 0;
  nextCommentsBtn.disabled = (start + 10) >= comments.length;
}

//manages what's whown on screen
function updateDisplay() {
    const gallery = getImages();

    // if gallery empty
    if (gallery.length === 0) {
        imageArea.classList.add("hidden");
        return;
    }

    imageArea.classList.remove("hidden");

    // make sure currentIndex is valid
    if (currentIndex >= gallery.length) currentIndex = gallery.length - 1;
    if (currentIndex < 0) currentIndex = 0;

    const currentImage = gallery[currentIndex];
    imgEl.src = currentImage.url;
    titleEl.textContent = currentImage.title;
    authorEl.textContent = currentImage.author;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === gallery.length - 1;
    deleteBtn.disabled = false;

    renderComments();
}


// Open popup
openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForm();
});

// Close popup via X button
closeBtn.addEventListener("click", () => {
    toggleForm();
});

// Submit image to gallery
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const author = document.getElementById("author").value;
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;

    addImage(title, author, url); 
    const images = getImages();
    const newImage = images[images.length - 1];
    gallery.push(newImage);
    currentIndex = gallery.length - 1;

    // Clear form
    document.getElementById("author").value = "";
    document.getElementById("title").value = "";
    document.getElementById("url").value = "";

    toggleForm();
    updateDisplay(); // Refresh HTML and buttons
});

//Viewing images

//load images
if (gallery.length > 0) {
    imgEl.src = gallery[currentIndex].url;           // use .url, not .src
    authorEl.textContent = gallery[currentIndex].author;
    titleEl.textContent = gallery[currentIndex].title;
    prevBtn.disabled = true;
    nextBtn.disabled = gallery.length === 1;
}

//Previous Button
prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateDisplay();
    }
});

//Next Button
nextBtn.addEventListener("click", () => {
    if (currentIndex < gallery.length - 1) {
        currentIndex++;
        updateDisplay();
    }
});


//Delete Button
deleteBtn.addEventListener("click", () => {
    if (gallery.length === 0) return;

    const imageId = gallery[currentIndex].id;

    // Delete all comments for this image
    deleteCommentsForImage(imageId);

    // Delete the image itself
    deleteImage(imageId);
    gallery.splice(currentIndex, 1);

    // Adjust currentIndex if last image removed
    if (currentIndex >= gallery.length) currentIndex = gallery.length - 1;

    updateDisplay();
});

// Add comment to image
commentBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (gallery.length === 0) return;

  const currentImage = gallery[currentIndex];
  const author = usernameInput.value.trim();
  const content = commentInput.value.trim();

  if (!author || !content) {
    alert("Please enter both a username and a comment.");
    return;
  }

  addComment(currentImage.id, author, content);

  // Clear inputs
  usernameInput.value = "";
  commentInput.value = "";

  // Refresh comments
  updateDisplay();
});


// Pagination controls
prevCommentsBtn.addEventListener("click", () => {
  if (currentCommentPage > 0) {
    currentCommentPage--;
    renderComments();
  }
});

nextCommentsBtn.addEventListener("click", () => {
  currentCommentPage++;
  renderComments();
});