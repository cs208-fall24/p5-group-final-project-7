let comments = [];

// Function to fetch and render comments
function fetchComments() {
  fetch('/student3')
    .then(response => response.json())
    .then(data => {
      comments = data.comments;  // Store the fetched comments
      renderComments();          // Render comments to the page
    });
}

// Add a new comment
function addComment(commentText) {
  fetch('/student3/add-comment', {
    method: 'POST',
    body: new URLSearchParams({ 'comment': commentText }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(response => response.text())
    .then(() => {
      fetchComments();  // Reload the comments after the new one is added
    });
}

// Render comments to the page
function renderComments() {
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = ''; // Clear existing comments

  if (comments.length === 0) {
    commentList.innerHTML = '<li>No comments yet.</li>';
  } else {
    comments.slice(0, 5).forEach(comment => {
      let li = document.createElement('li');
      li.textContent = comment.comment;
      commentList.appendChild(li);
    });
  }
}

// Handle form submission for adding a comment
document.addEventListener('DOMContentLoaded', () => {
  fetchComments(); // Fetch comments when the page loads

  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const commentInput = document.getElementById('comment-input');
      if (commentInput.value.trim()) {
        addComment(commentInput.value.trim());
        commentInput.value = ''; // Clear input field after submission
      }
    });
  }
});
