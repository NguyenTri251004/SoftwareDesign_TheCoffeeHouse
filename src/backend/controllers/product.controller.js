import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

const ProductController = {
    getListProducts: async (req, res) => {
        try {
            const { start = 0, end = 10 } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const [Products, total] = await Promise.all([
                ProductModel.find().skip(skip).limit(limit).populate("category"),
                ProductModel.countDocuments()
            ]);
            
            const data = await Promise.all(Products.map(async (product) => {
                let fullCategoryName = "";
                const category = product.category;
    
                if (category) {
                    fullCategoryName = category.name;
                    if (category.parentId) {
                        const parent = await CategoryModel.findById(category.parentId);
                        if (parent) {
                            fullCategoryName = `${parent.name} / ${category.name}`;
                        }
                    }
                }
                
                return {
                    ...product.toObject(),
                    categoryName: fullCategoryName
                };
            }));

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.error("Lỗi getListProducts:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách Product", error });
        }
    },

    getOneProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const Product = await ProductModel.findById(id);
            if (!Product) 
                return res.status(404).json({ success: false, message: "Không tìm thấy Product" });

            return res.status(200).json({
                success: true,
                data: Product
            });
        } catch (error) {
            console.error("Lỗi ở getOneProduct:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Product", error });
        }
    },

    getManyProducts: async (req, res) => {
        try {
            const { ids } = req.body; 
            const Products = await ProductModel.find({ _id: { $in: ids } });
            
            return res.status(200).json({ data: Products });
        } catch (error) {
            console.error("Lỗi getManyProducts:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách tất cả Product", error });
        }
    },

    createProduct: async (req, res) => {
        try {
            const Product = new ProductModel(req.body);
            await Product.save();

            return res.status(201).json({ data: Product });
        } catch (error) {
            console.error("Lỗi ở createProduct:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo Product", error });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const Product = await ProductModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!Product) return res.status(404).json({ message: "Product không tồn tại" });

            return res.status(200).json({ data: Product });
        } catch (error) {
            console.error("Lỗi ở updateProduct:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật Product", error });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const Product = await ProductModel.findByIdAndDelete(id);

            if (!Product) return res.status(404).json({ message: "Product không tồn tại" });

            return res.status(200).json({ 
                success: true,
                message: "Xoá Product thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi ở deleteProduct:", error);
            return res.status(500).json({ message: "Lỗi khi xoá Product", error });
        }
    },

}

export default ProductController;