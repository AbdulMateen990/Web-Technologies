const express = require('express');
let ejsLayouts = require("express-ejs-layouts");
const session = require('express-session');
const passport = require('./passport');
const path = require('path');
const User = require('./models/User');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dotenv = require('dotenv');
dotenv.config();
const Blog = require('./models/blog');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false,cookie:{ maxAge: 24 * 60 * 60 * 1000 }}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Unable to connect");
  });

  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });


const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
};

app.post('/register', upload.single('profilePicture'), async (req, res) => {
  // console.log(req.body);
  const { email, password, confirmPassword } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  if (password !== confirmPassword) {
      return res.redirect('/register');
  }

  try {
      const user = new User({ email, password, profilePicture });
      console.log(user)
      await user.save();
      res.redirect('/login');
  } catch (error) {
      res.redirect('/register');
  }
});

app.post('/compose',checkAuthenticated,upload.single('image'), async (req, res) => {
  // if (!req.user) {
  //     return res.redirect('/login');
  // }
  
  const { title,content } = req.body;
  // console.log(title,content);
  // console.log(postTitle,postBody,req.body);
  if (!title || !content) {
      return res.status(400).send('Title and content are required');
  }

  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
});

  try {
      await blog.save();
      res.redirect('/profile');
  } catch (err) {
      res.send(err);
  }
});

app.get('/profile', async (req, res) => {
  if (!req.user) {
      return res.redirect('/login');
  }
  try {
    const posts = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    // console.log(posts);
      // console.log(req.user._id);
      // console.log(posts);
      res.render('profile', { posts, user: req.user, isAuthenticated: !!req.user });
  } catch (err) {
      res.send(err);
  }
});

// Route to display the edit form for a blog post
app.get('/update/:id', async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    res.render('compose', { post: post, isAuthenticated: req.isAuthenticated(), user: req.user });
  } catch (e) {
    res.status(500).send();
  }
});

// Route to update a blog post
app.post('/posts/update/:id', async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) {
      return res.status(404).send();
    }
    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    res.redirect(`/profile`);
  } catch (e) {
    console.error(e);
  }
});

// Route to delete a blog post
app.post('/posts/delete/:id', async (req, res) => {
  try {
    const post = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    res.redirect('/profile');
  } catch (e) {
    res.status(500).send();
  }
});

// Route for displaying a post and its comments
app.get('/comments/:id', async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id).populate('comments');
      // console.log(blog);
      res.render('post', { post: blog , isAuthenticated: req.isAuthenticated()});
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
});

// Route for adding a new comment to a post
app.post('/comments/:id',checkAuthenticated, async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id);
      blog.comments.push({ text: req.body.content, username: req.user.email }); 
      await blog.save();
      req.body.content = '';
      res.redirect(`/comments/${req.params.id}`);
  } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/login');
});

app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.aggregate([
      { $sample: { size: 15 } },
      {
        $lookup: {
          from: 'users', 
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      { $project: { title: 1, content: 1, image: 1, 'author.email': 1, 'author.profilePicture': 1, comments: 1 } } // Include the comments data
    ]);
    res.render('index', { blogs: blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while fetching the blogs');
  }
});
app.get('/compose', async (req, res) => {
  try {
    res.render('compose', { post: null, isAuthenticated: req.isAuthenticated(), user: req.user });
  } catch (e) {
    res.status(500).send();
  }
});
  app.get('/login', (req, res) => {
    res.render('./auth/login');
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/register');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            if (info && info.message === 'Incorrect password') {
                req.flash('error', 'Incorrect password');
                return res.redirect('/login');
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

  app.get('/register', (req, res) => {
    res.render('./auth/register');
  });

  


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

