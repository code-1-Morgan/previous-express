const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://mdoBackend421:demodemo@cluster0.dcmy4kq.mongodb.net/project0?retryWrites=true&w=majority";
const dbName = "palindrome";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {palindromeResult: result})
  })
})

app.post('/messages', (req, res) => {
  let answer
  let trueOrFalse

  if(req.body.userWord.toLowerCase() === req.body.userWord.toLowerCase().split("").reverse().join("")){
    answer = `${req.body.userWord} is a palindrome!`
    trueOrFalse = true
  }
  else{
    answer = `${req.body.userWord} is not a palindrome!`
    trueOrFalse = false
  }
  db.collection('messages').insertOne({userWord: req.body.userWord, palindromeStatus: trueOrFalse, statement: answer}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({userWord: req.body.userWord, palindromeStatus: trueOrFalse, statement: answer}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
