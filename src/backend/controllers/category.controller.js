import CategoryModel from "../models/category.model.js";

const CategoryController = {
    getListCategories: async (req, res) => {
        try {
            const allCategories = await CategoryModel.find().lean();
    
            const buildTree = (categories, parentId = null, level = 0) => {
                return categories
                    .filter(cat => {
                        if (parentId === null) return !cat.parentId;
                        return String(cat.parentId) === String(parentId);
                    })
                    .map(cat => ({
                        ...cat,
                        level,
                        children: buildTree(categories, cat._id, level + 1)
                    }));
            };

            const flattenTree = (nodes) => {
                let result = [];
                for (const node of nodes) {
                    const { children, ...rest } = node;
                    result.push(rest);
                    if (children && children.length > 0) {
                        result = result.concat(flattenTree(children));
                    }
                }
                return result;
            };            
    
            const tree = buildTree(allCategories);
            const categoryTree = flattenTree(tree);
    
            res.set("X-Total-Count", allCategories.length);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
    
            return res.status(200).json({ success: true, data: categoryTree });
        } catch (error) {
            console.error("Lỗi getListCategories:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách Category dạng cây",
                error,
            });
        }
    },    

    getOneCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const Category = await CategoryModel.findById(id);
            if (!Category) 
                return res.status(404).json({ success: false, message: "Không tìm thấy Category" });

            return res.status(200).json({ success: true, data: Category });
        } catch (error) {
            console.error("Lỗi ở getOneCategory:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Category", error });
        }
    },

    getManyCategories: async (req, res) => {
        try {
            const { ids } = req.body; 
            const Categories = await CategoryModel.find({ _id: { $in: ids } });
            
            return res.status(200).json({ data: Categories });
        } catch (error) {
            console.error("Lỗi getManyCategories:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách tất cả Category", error });
        }
    },

    getListParentCategories: async (req, res) => {
        try {
            const Categories = await CategoryModel.find({ parentId: { $in: null } });
            
            return res.status(200).json({ data: Categories });
        } catch (error) {
            console.error("Lỗi getListParentCategorys:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách Category cha", error });
        }
    },

    getListChildCategories: async (req, res) => {
        try {
            const Categories = await CategoryModel.find({ parentId: { $ne: null } });
            
            return res.status(200).json({ data: Categories });
        } catch (error) {
            console.error("Lỗi getListChildCategories:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách danh mục con", error });
        }
    },        

    createCategory: async (req, res) => {
        try {
            const Category = new CategoryModel(req.body);
            await Category.save();

            return res.status(201).json({ data: Category });
        } catch (error) {
            console.error("Lỗi ở createCategory:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo Category", error });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const Category = await CategoryModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!Category) return res.status(404).json({ message: "Category không tồn tại" });

            return res.status(200).json({ data: Category });
        } catch (error) {
            console.error("Lỗi ở updateCategory:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật Category", error });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const Category = await CategoryModel.findByIdAndDelete(id);

            if (!Category) return res.status(404).json({ message: "Category không tồn tại" });

            return res.status(200).json({ 
                success: true,
                message: "Xoá Category thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi ở deleteCategory:", error);
            return res.status(500).json({ message: "Lỗi khi xoá Category", error });
        }
    },
}

export default CategoryController;