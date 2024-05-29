const express = require('express');
const expressLayouts = require('express-ejs-layouts');

let server = express();

// Set the view engine to ejs
server.set('view engine', 'ejs');
// Set the views directory
server.set('views', 'views');
// Use express-ejs-layouts
server.use(expressLayouts);
// Set the layout directory
server.set('layout', 'layout');
//For CSS file
server.use(express.static('public'));



server.get('/', (req, res) => {
  res.render("home");
});
server.get('/about', (req, res) => {
  res.render("about");
});
server.get('/login', (req, res) => {
  res.render("./auth/login");
});
server.get('/blog', (req, res) => {
  res.render('blog', { blogPosts: [] });
});
server.listen(4000);