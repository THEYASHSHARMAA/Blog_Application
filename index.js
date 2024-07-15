import bodyParser from "body-parser";
import express from "express";
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let posts = [];
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("image"));

app.get("/" , (req,res)=>{
   res.render("index.ejs")
});

app.post("/submit" , (req,res)=>{
  let newPost = {
    title: req.body["title"],
    content : req.body["content"]               
  }
  posts.push(newPost); 

  res.render("index.ejs", {posts:posts});
});

// edit

app.get("/edit-post/:index" , (req,res)=> {
    const index = req.params.index;
    const post = posts[index];
    res.render('edit.ejs', { post: post, index: index });
// here at the top we add index in the req becasuse we send edit req with post index so that it will 
// return that post in edit.ejs which user wants to edit 
})

// update
app.post('/update-post/:index', (req, res) => {
    const index = req.params.index;
    posts[index] = {
        title: req.body.title,
        content: req.body.content
    };



    res.render('index.ejs', {posts:posts});
    // it means redirt to main page 
    // here we take that index and and update the value
});

 
app.get("/delete-post/:index",(req,res)=>{
    const index = req.params.index;
    posts.splice(index, 1);  // Remove the post from the in-memory storage
    res.render('index.ejs', {posts:posts});
 })
  

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
