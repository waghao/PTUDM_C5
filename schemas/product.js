let mongoose = require('mongoose');
let slugify = require('slugify'); // Đảm bảo bạn đã cài đặt slugify (npm install slugify)

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    imgURL: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true // Đảm bảo slug là duy nhất
    }
}, {
    timestamps: true
});

// Tạo slug tự động trước khi lưu vào cơ sở dữ liệu
productSchema.pre("save", function (next) {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model("Product", productSchema);
