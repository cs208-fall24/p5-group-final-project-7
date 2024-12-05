import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')



db.serialize(() => {   
  db.run(`CREATE TABLE student1comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL)`);
  
  db.run(`CREATE TABLE student2Comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL)`) 
});


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
  const local = {comments: []}
    db.each('SELECT id, message FROM student1comments', function (err, row) {
      if (err) {
        console.error(err)
      } else {
        local.comments.push({id: row.id, message: row.message})
      }
    }, function (err, numrows) {
      if(!err){
        res.render('student1/index', local)
      } else {
        console.log(err)
      }
    });

});

app.get('/student1/comments', function (req, res) {
  console.log('GET called')
  const local = {comments: []}
    db.each('SELECT id, message FROM student1comments', function (err, row) {
      if (err) {
        console.error(err)
      } else {
        local.comments.push({id: row.id, message: row.message})
      }
    }, function (err, numrows) {
      if(!err){
        res.render('student1/comments', local)
      } else {
        console.log(err)
      }
    });

});

app.post('/student1/add', function (req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO student1comments (message) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect("/student1/comments")
})

app.post('/student1/delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM student1comments WHERE id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect("/student1/comments")
})

app.post('/student1/update-comment', function (req, res) {
  const commentId = req.body.commentId;
  const updatedComment = req.body.updatedComment;

  db.run("UPDATE student1comments SET message = ? WHERE id = ?", [updatedComment, commentId], function (err) {
    if (err) {
      console.error("Error updating comment: ", err);
      return res.status(500).send("Error updating comment");
    }
    
    res.redirect('/student1/comments');
  });
});

// Get comments from database and render index with results
app.get('/student2', function (req, res) {
  console.log('GET called')
  const local = { comments: [] }
        db.each('SELECT id, message FROM student2Comments', function (err, row) {
            if (err) {
                console.log(err)
            } else {
                local.comments.push({ id: row.id, message: row.message })
            }
        }, function (err, numrows) {
            if (!err) {
                res.render('student2/index', local)
            } else {
                console.log(err)
            }
        })
})

// Get comments from database and render comments with results
app.get('/student2/comments', function (req, res) {
  console.log('GET called')
  const local = { comments: [] }
        db.each('SELECT id, message FROM student2Comments', function (err, row) {
            if (err) {
                console.log(err)
            } else {
                local.comments.push({ id: row.id, message: row.message })
            }
        }, function (err, numrows) {
            if (!err) {
                res.render('student2/comments', local)
            } else {
                console.log(err)
            }
        })
})

// Post comments to the database
app.post('/student2/comments', function (req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO student2Comments (message) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect("/student2/comments")
})

// Delete comments from the database
app.post('/student2/comments/delete', function (req, res) {
  console.log('removing comment')
  const stmt = db.prepare('DELETE FROM student2Comments WHERE id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  res.redirect("/student2/comments")
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
