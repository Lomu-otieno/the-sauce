const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    image: String, // Image path for uploaded image
    category: String, // Category of the article
    tags: [String],  // Tags for filtering
    date: { type: Date, default: Date.now },
    location: String  // Can be used for location-specific news
});

module.exports = mongoose.model('Article', articleSchema);
