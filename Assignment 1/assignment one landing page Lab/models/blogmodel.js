const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Blog schema
const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 300
  },
  comments: [{
    username: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Middleware to set the updatedAt field to the current date before saving
BlogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Blog model
module.exports = mongoose.model('Blog', BlogSchema);
