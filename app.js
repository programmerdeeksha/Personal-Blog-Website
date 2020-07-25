const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "This is a daily journal web application which you all can use to write and maintain your daily diary or any stuff like that."
const aboutContent = "Simply just type '/compose' in your address bar after the url and you will be directed to brand new page where you can compose your stuff with title and you will be redirected to the home page. To view your stuff, just type the title of your post and you will be redirected to that particular post.";
const contactContent = "If you face any problem using the application just mail me up at: 'pandeydeeksha32@gmail.com'";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-deeksha:mongodb16@cluster0.e2aeg.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});
app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
