const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userExist = users.filter(user=>user.username === username);
return (!userExist.length)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const filteredUser = users.filter(user=>user.username === username);
    if(filteredUser.length && filteredUser[0].password === password){
        return true;
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({error:"Please provide username and password."})
    }
    if(!authenticatedUser(username,password)){
        return res.status(400).json({error:"Invalid username or password."})
    }
    let token = jwt.sign({data:{username,password}},'validatedUser',{expiresIn:60*60})
    req.session.validatedUser = {token,username}
    return res.status(200).json({message: "user logged in successfully."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  const username = user.data.username
  let book = books[req.params.isbn];
  let isAdded = true
  if(username in book.reviews){
    book.reviews[username] = req.body.review;
    isAdded = false
  }
  else{
    book.reviews[username] = req.body.review;
  }
  return res.status(200).json({message: `review ${isAdded?"added":"edited"} successfully.`});
});

// delete book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  const username = user.data.username
  let book = books[req.params.isbn];
  if(username in book.reviews){
    delete book.reviews[username];
    return res.status(200).json({message: `review deleted successfully.`});
}
else{
    return res.status(400).json({message: `You have not added the review yet for this book.`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
