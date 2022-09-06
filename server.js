////////////// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
// after "mongodb.net/", you can create a new sub-database by writing "booklist", before the "?". found in the .env file...
const DATABASE_URL = process.env.DATABASE_URL
const DB = mongoose.connection;
const Book = require("./models/books.js")

// Database Connection
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Error & Success Messages
DB.on("error", (err) => console.log(err.message + ": is mongoose up?"))
DB.on("connected", () => console.log("Mongoose Connected"))
DB.on("disconnected", ()=> console.log("mongoose disconnected"))

////////////// MIDDLEWARE
app.use(express.urlencoded({extended:true}));

////////////// ROUTES
// Seed
const bookSeed = require("./models/bookSeed.js")
app.get("/books/seed", (req,res) =>{
    Book.deleteMany({}, (error, allBooks) =>{});
    Book.create(bookSeed, (error, data) =>{
    res.redirect("/books");
});
});
// Root
app.get("/", (req,res)=> res.send("<a href='/books'>Link</a> to the books index."));

// Index
app.get("/books", (req, res) =>{
    Book.find({}, (error, allBooks) =>{
        res.render("index.ejs", {
            books: allBooks,
        })
    })
})
// New
app.get("/books/new", (req,res) =>{
    res.render("new.ejs");
})
// Destroy
// Update
// Create
app.post("/books", (req,res)=> {
    if (req.body.completed === "on") {
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }
    Book.create(req.body, (error, createdBook) => {
        res.redirect("/books");
    });
});
// Edit
// Show
app.get("/books/:id", (req, res) =>{
    Book.findById(req.params.id, (error, foundBook) =>{
        res.render("show.ejs", {
            showBook: foundBook,
        });
    });
});

////////////// LISTENER
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("listening on port ", PORT));