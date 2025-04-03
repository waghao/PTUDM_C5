let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required:true
    },description:{
        type:String,
        default:""
    }
},{
    timestamps:true
})
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }
});

// Tự động tạo slug trước khi lưu
CategorySchema.pre("save", function(next) {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model("Category", CategorySchema);