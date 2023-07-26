//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
let port = process.env.PORT || 3000;

const homeStartingContent = "Believe in yourself and your abilities, and know that you have the power to create the life you want. Take risks, embrace challenges, and never give up on your dreams. Your determination and perseverance will lead you to success. So stay focused, work hard, and keep moving forward. Remember, the only limits you have are the ones you set for yourself.";
const aboutContent = "This is Blog Application made by Akshat Kumar Sharma. This web application is made using different technologies like Node.js, HTML, CSS, JavaScript, MongoDB, EJS Templating, Express, jQuery, and Bootstrap.";
const contactContent = "Please contact me on my email address.";

const app = express();
mongoose.connect("mongodb+srv://akshatsharma851:test123@cluster0.47ckhe1.mongodb.net/todolistDB", {useNewUrlParser: true});
const blogSchema = {
  title: String,
  body: String
};

const Blog = mongoose.model("Blog", blogSchema);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

async function getBlogs(){
  const blogs = await Blog.find({});
  return blogs;
  }

app.get("/", function(req, res){
  getBlogs().then(function(blog){

      res.render("home", {
        startingContent: homeStartingContent,
        blogs: blog
        });

  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  let title = req.body.postTitle;
  let content = req.body.postBody;
  const post = new Blog ({
    title: title,
    body: content
  });

  post.save();

  res.redirect("/");

});


app.get("/posts/:postId", function(req, res){
  const requestedPostId  = _.lowerCase(req.params.postId);
  
  async function findBlogs(){
    const blogs = await Blog.findOne({title: req.params.postId}).exec();
    return blogs;
    }

  //   findBlogs().then(function(blogs){
  //     res.render("post", {

  //       title: blogs.title,
   
  //       content: blogs.content
   
  //     });
  //   });


  findBlogs().then(function(post){
    //console.log(post.title);
    const storedTitle = _.lowerCase(post._id);
    res.render("post", {
      title: post.title,
      content: post.body
    // if (requestedPostId === requestedTitle) {
      
      });
    
  });

});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
