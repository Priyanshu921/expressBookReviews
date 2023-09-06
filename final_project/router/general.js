const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bookKeys = Object.keys(books)
async function fetchBooks(isbn,title,author){
    let bookPromise = new Promise((resolve,reject)=>{
        const filteredBooks = [];
        if(!isbn&&!title&&!author){
            resolve(books)
        }   
        if(isbn){
            resolve(books[isbn])
        }
        if(title){
            for(let key of bookKeys){
                if(books[key].title.toLowerCase()===title.toLowerCase()){
                    filteredBooks.push(books[key])
                }
            }
            resolve(filteredBooks)
        }
        if(author){
            for(let key of bookKeys){
                if(books[key].author.toLowerCase()===author.toLowerCase()){
                    filteredBooks.push(books[key])
                }
            }
            resolve(filteredBooks)
        }
    })
    const data = await bookPromise;
    return data;
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const {username,password} = req.body;
  if(!username || !password){
      return res.status(400).json({error:"Please provide username and password."})
  }
  if(!isValid(username)){
    return res.status(400).json({error:"User already exists."})
  }
  users.push({username,password})
  return res.status(200).json({message: "User registered successfully."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  const books = await fetchBooks();
  console.log(books)
    if(!books){
        return res.status(200).json({error:"No Books Available."})
    }
    return res.status(200).json({data:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
    const {isbn} = req.params;
    const isbnBooks = await fetchBooks(isbn)
    if(!isbnBooks){
        return res.status(400).json({error:"Book is not available."})
    }
    return res.status(200).json({data:isbnBooks});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
    const {author} = req.params;
    const filteredBooks =await fetchBooks(null,null,author);
    if(!filteredBooks.length){
        return res.status(400).json({error:"No Books available for the Author."})
    }
    return res.status(200).json({data:filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const {title} = req.params;
  const filteredBooks =await fetchBooks(null,title,null);
    if(!filteredBooks.length){
        return res.status(400).json({error:"No Books available for this title."})
    }
    return res.status(200).json({data:filteredBooks});
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Write your code here
  const books = await fetchBooks();
  const {isbn} = req.params;
    if(!books[isbn]){
        return res.status(400).json({error:"Book is not available."})
    }
  return res.status(200).json({data: books[isbn].reviews});
});

module.exports.general = public_users;
