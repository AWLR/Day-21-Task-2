const express = require("express");
const{ connectToDb, getDb } = require("./db");
const{ ObjectId } = require("mongodb");
// init app middleware
const app = express();

app.use(express.json());

// setup connect to mongodb

let db;

connectToDb((err) => {
    if (!err) {
        
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });

        db = getDb();

        
    }

    app.get("/books", (req, res) => {
          
        let books = [];

        db.collection("books")
        .find()
        .sort({author : 1})
        .forEach((book) => {
            books.push(book);
        })
        .then(() => {
            res.status(200).json(books);
        }).catch(()=>{
            res.status(500).json({ error: "Could not fetch the books" });
        })
    });


    console.log(err);
})

app.get('/books/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection("books")
        .findOne({_id : new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not fetch the book" });
        })
    } else {
        res.status(500).json({ error: "Could not fetch the book" });
    }
})

//post request
app.post('/books', (req, res) => {
    const book = req.body
    db.collection("books")
    .insertOne(book)
    .then(result=>
        res.status(200).json(result)
    )
    .catch(err=>{
        res.status(500).json({ error: "Could not create a document" })
    })
})

app.delete("/books/:id", (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        db.collection("books")
        .deleteOne({_id : new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({ error: "Could not fetch the book" });
        })
        }
        else {
        res.status(500).json({ error: "Could not fetch the book" });
    }
})