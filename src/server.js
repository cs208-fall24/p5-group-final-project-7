import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})



// Create the 'student3_comments' table for storing comments 
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS student3_comments (id INTEGER PRIMARY KEY, comment TEXT)");
});


app.get('/student3', function (req, res) {
  console.log('GET /student3 called');

  db.all("SELECT * FROM student3_comments", [], function (err, rows) {
    if (err) {
      console.error('Error retrieving comments:', err);
      return res.status(500).send("Error retrieving comments");
    }

    res.render('student3', { comments: rows });
  });
});

///  adding a new comment 
app.post('/student3/add-comment', function (req, res) {
  const newComment = req.body.comment;
  
  db.run("INSERT INTO student3_comments (comment) VALUES (?)", [newComment], function (err) {
    if (err) {
      console.error("Error adding comment: ", err);
      return res.status(500).send("Error adding comment");
    }
    
    res.redirect('/student3');
  });
});

// Delete a comment 
app.post('/student3/delete-comment', function (req, res) {
  const commentId = req.body.commentId;

  db.run("DELETE FROM student3_comments WHERE id = ?", [commentId], function (err) {
    if (err) {
      console.error("Error deleting comment: ", err);
      return res.status(500).send("Error deleting comment");
    }
    
    res.redirect('/student3');
  });
});

// Update a comment 
app.post('/student3/update-comment', function (req, res) {
  const commentId = req.body.commentId;
  const updatedComment = req.body.updatedComment;

  db.run("UPDATE student3_comments SET comment = ? WHERE id = ?", [updatedComment, commentId], function (err) {
    if (err) {
      console.error("Error updating comment: ", err);
      return res.status(500).send("Error updating comment");
    }
    
    res.redirect('/student3');
  });
});

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
