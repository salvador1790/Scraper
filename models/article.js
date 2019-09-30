const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    Headline: {
        type: String,
        required: true
    },
    Summary: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    }
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;