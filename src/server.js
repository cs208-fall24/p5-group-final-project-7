import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student2Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL)`)  

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

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
