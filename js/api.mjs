/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

/*check local storage for images*/
if (!localStorage.getItem("images")) {
  localStorage.setItem("images", JSON.stringify({ index: 0, items: [] }));
}

/*check local storage for comments*/
if (!localStorage.getItem("comments")) {
  localStorage.setItem("comments", JSON.stringify({ index: 0, items: [] }));
}

// get images from local storage
export function getImages() {
  const images = JSON.parse(localStorage.getItem("images"));
  return images.items;
}

//get comments for each image
export function getComments(imageId) {
  const comments = JSON.parse(localStorage.getItem("comments"));
  return comments.items.filter(c => c.imageId === imageId);
}

// add an image to the gallery
export function addImage(title, author, url) {
  const images = JSON.parse(localStorage.getItem("images"));
  // set date
  const now = new Date();
  const date = now.toLocaleDateString();
  const img = { id:images.index++, author:author , title:title, url:url,date:date};
  images.items.push(img);
  localStorage.setItem("images", JSON.stringify(images));
  
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
  const images = JSON.parse(localStorage.getItem("images"));
  const index = images.items.findIndex(function (item) {
    return item.id == imageId;
  });
  if (index == -1) return null;
  const image = images.items[index];
  images.items.splice(index, 1);
  localStorage.setItem("images", JSON.stringify(images));

}

// add a comment to an image
export function addComment(imageId, author, content) {
  const comments = JSON.parse(localStorage.getItem("comments"));
// In addComment()
const now = new Date();
const date = now.toISOString(); // full timestamp including time/ gotta use this for proper ordering
    const comment = {
    id: comments.index++,
    imageId: imageId,
    author: author,
    content: content,
    date: date,
  };

  comments.items.push(comment);
  localStorage.setItem("comments", JSON.stringify(comments));

}

// delete a comment to an image
export function deleteComment(commentId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
  const index = comments.items.findIndex((c) => c.id == commentId);
  if (index === -1) return null;
  comments.items.splice(index, 1);
  localStorage.setItem("comments", JSON.stringify(comments));
}

// Delete all comments for a given imageId
export function deleteCommentsForImage(imageId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    comments.items = comments.items.filter(c => c.imageId != imageId);
    localStorage.setItem("comments", JSON.stringify(comments));
}

// Toggle view of image form
const overlay = document.getElementById("upload-overlay");
export function toggleForm() {
  overlay.classList.toggle("active");
}
