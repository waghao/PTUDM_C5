let mongoose = require('mongoose');
let slugify = require('slugify'); // Đảm bảo bạn đã cài đặt slugify (npm install slugify)

let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Tạo slug tự động trước khi lưu vào cơ sở dữ liệu
categorySchema.pre("save", function(next) {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model("Category", categorySchema);
