const express = require("express");
const exphbs = require("express-handlebars");
const  axios = require("axios");


const cheerio = require("cheerio");
const mongoose = require("mongoose");

var db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/News', {
  useNewUrlParser: true
});


//routes


app.get("/",function(req,res){
  res.render("index",{articles:res})

})


app.get('/scrape', function (req, res) {
    
  axios.get("http://weekinweird.com/category/the-daily-weird/")
    .then(function(response){

      var $ = cheerio.load(response.data)

      $("li div").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.Headline = $(this)
          .children("h2")
          .text();
        result.Summary = $(this)
          .children("p")
          .text();
        result.URL = $(this)
        .children("a")
        .attr("href")
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });


      res.send("Scrape Complete");
    })

});

app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
  .then(function(resp){
    res.json(resp)
  })
  .catch(function(err){
    if (err) throw err
  })
});


app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!");
})