const express = require('express');
const expressLayouts = require('express-ejs-layouts');

let server = express();

// Set the view engine to ejs
server.set('view engine', 'ejs');
// Set the views directory
server.set('views', 'views');
// Set the layout directory
server.set('layout', 'layout');
//For CSS file
server.use(express.static('public'));

// Use express-ejs-layouts
server.use(expressLayouts);

server.get('/', (req, res) => {
  res.render("home");
});

server.listen(4000);