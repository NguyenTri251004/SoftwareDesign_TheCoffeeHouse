import mongoose from "mongoose";
const { Schema } = mongoose;

const CategorySchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    name: { type: String, required: true }
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;