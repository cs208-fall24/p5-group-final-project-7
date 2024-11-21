import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.serialize(() => {   
  db.run(`CREATE TABLE student1comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL)`);
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
        res.render('student1/comments', local)
      } else {
        console.log(err)
      }
    });

});

app.post('/student1/comments', function (req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO student1Comments (message) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
  res.redirect("/student1/comments")
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
