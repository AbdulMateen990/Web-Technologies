const mongoose = require('mongoose');

// Define the schema for a Product
const productSchema = new mongoose.Schema({
name: {
type: String,
required: true
},
description: {
type: String,
required: true
},
price: {
type: Number,
required: true
},
category: {
type: String,
required: true
},
isFeatured: {
type: Boolean,
default: false
}
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;