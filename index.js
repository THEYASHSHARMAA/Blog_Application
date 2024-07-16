import bodyParser from "body-parser";
import express from "express";
import path from 'path';
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let posts = [];
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "School",
  password: "nevergiveup",
  port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(express.static("image"));

app.get("/" ,async (req,res)=>{
  const result = await db.query("select * from blogs");
  const post = result.rows;
 

console.log(post);
   res.render("index.ejs", {
    posts: post,
   })
});

app.post("/submit" , async (req,res)=>{
  const { title, author, content } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO blogs (title,  author, content) VALUES ($1, $2, $3) RETURNING *',
      [title, author, content]
    );
    console.log('New entry added:', result.rows[0]);
    res.redirect("/");
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error submitting form');
  }
});

// edit

// app.get("/edit-post/:index" , async (req,res)=> {
//     const index = req.params.index;
//     const post = await db.query("select * from blogs where id = $1 ",[index])
//     res.render('edit.ejs', { post: post });
// // here at the top we add index in the req becasuse we send edit req with post index so that it will 
// // return that post in edit.ejs which user wants to edit 
// })

app.get("/edit-post/:id", async (req, res) => {
  const id = req.params.id;
  try {
      const result = await db.query("SELECT * FROM blogs WHERE id = $1", [id]);
      if (result.rows.length > 0) {
        // we pass result.row only when we iterate all the rpws but when we wamt sinlge row to take direct content like title then we pass result.rows[0]
        console.log(result.rows);
          const post = result.rows[0];
          console.log(post);
          res.render('edit.ejs', { post: post });
      } else {
          res.status(404).send('Post not found');
      }
  } catch (err) {
      console.error('Error fetching post:', err);
      res.status(500).send('Error fetching post');
  }
});

// update
app.post('/update-post/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author, content } = req.body;
  try {
      console.log(`Updating post ${id} with title: ${title}, author: ${author}, content: ${content}`);
      await db.query(
          "UPDATE blogs SET title = $1, author = $2, content = $3 WHERE id = $4",
          [title, author, content, id]
      );
      console.log(`Post ${id} updated successfully.`);
      res.redirect("/");
  } catch (err) {
      console.error('Error updating post:', err);
      res.status(500).send('Error updating post');
  }
});
    // res.render('index.ejs', {posts:posts});
    // it means redirt to main page 
    // here we take that index and and update the value

 
    app.get("/delete-post/:id", async (req, res) => {
      const id = req.params.id;
      try {
          await db.query("DELETE FROM blogs WHERE id = $1", [id]);
          res.redirect("/");
      } catch (err) {
          console.error('Error deleting post:', err);
          res.status(500).send('Error deleting post');
      }
    });

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
