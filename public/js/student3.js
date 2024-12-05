//This doc creates the funtions for the buttons on the comments


let comments = [];

function fetchComments() {
  fetch('/student3')
    .then(response => response.json())
    .then(data => {
      comments = data.comments;  
      renderComments();          
    });
}


function addComment(commentText) {
  fetch('/student3/add-comment', {
    method: 'POST',
    body: new URLSearchParams({ 'comment': commentText }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(response => response.text())
    .then(() => {
      fetchComments(); 
    });
}


function renderComments() {
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = ''; 

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


document.addEventListener('DOMContentLoaded', () => {
  fetchComments(); 

  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const commentInput = document.getElementById('comment-input');
      if (commentInput.value.trim()) {
        addComment(commentInput.value.trim());
        commentInput.value = ''; 
      }
    });
  }
});
