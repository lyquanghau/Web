const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    slug: {
        type: String,
        slug: 'title',
        unique: true
    },
    delete: {
        type: Boolean,
        default: false
    },
    status: String,
    deletedAt: Date,
    position: Number
}, {
    timestamps: true

});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;