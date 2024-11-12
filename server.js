const express = require('express');
const multer = require('multer'); // For handling file uploads
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve images from uploads directory

mongoose.connect('mongodb://localhost:27017/magazine', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Define article schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: String, default: 'Anonymous' },
    category: { type: String, default: 'General' },
    image: String,
    date: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
// Route to get all articles for the global news feed
app.get('/articles', (req, res) => {
    Article.find()
        .then(articles => res.json(articles)) // Send the articles as JSON
        .catch(err => res.status(400).send('Error fetching articles'));
});

app.post('/submit', upload.single('image'), (req, res) => {
    const { title, content, author, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Store the path of uploaded image

    // Create a new Article object with the form data
    const newArticle = new Article({
        title,
        content,
        author,
        category,
        image
    });

    newArticle.save()
        .then(() => {
            // Redirect to article.html after saving the article
            res.redirect('/article.html'); // Assuming you want to redirect to the article page
        })
        .catch(err => {
            console.error(err);
            res.status(400).send('Error saving article');
        });
});





// Static file serving (for CSS, JS, and HTML files)
app.use(express.static('public'));

app.listen(3000, () => console.log('Server started on port 3000'));
