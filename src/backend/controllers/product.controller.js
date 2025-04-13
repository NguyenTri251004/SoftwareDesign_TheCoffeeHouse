import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import ShopModel from "../models/shop.model.js";
import ToppingModel from "../models/topping.model.js";

const slugify = (str) => {
    return str
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
};

const ProductController = {
    getMenuByShopId: async (req, res) => {
        try {
            const { shopId } = req.params;
    
            const shop = await ShopModel.findById(shopId);
            if (!shop) return res.status(404).json({ success: false, message: "Shop không tồn tại" });
    
            const productIds = shop.products.map(p => p.id);
            const drinks = await ProductModel.find({ _id: { $in: productIds } }).populate("category");
    
            const allCategories = await CategoryModel.find().lean();
    
            const categoryMap = {}; 
            allCategories.forEach(cat => categoryMap[String(cat._id)] = { ...cat, children: [] });
    
            //  cây category
            const rootCategories = [];
            allCategories.forEach(cat => {
                if (cat.parentId) {
                    categoryMap[String(cat.parentId)]?.children.push(categoryMap[String(cat._id)]);
                } else {
                    rootCategories.push(categoryMap[String(cat._id)]);
                }
            });
    
            // gắn sản phẩm vào category 
            const productMapByCategory = {};
            drinks.forEach(drink => {
                const catId = String(drink.category._id);
                if (!productMapByCategory[catId]) productMapByCategory[catId] = [];
                productMapByCategory[catId].push({
                    id: String(drink._id),
                    name: drink.name,
                    price: drink.price,
                    image: drink.image,
                });
            });
    
            const menuItems = rootCategories.map(parent => {
                const subMenu = parent.children
                    .map(sub => ({
                        label: sub.name,
                        path: `/menu/${slugify(parent.name)}/${slugify(sub.name)}`,
                        products: productMapByCategory[String(sub._id)] || [],
                    }))
                    .filter(item => item.products.length > 0); 
    
                if (subMenu.length === 0) return null;
    
                return {
                    label: parent.name,
                    path: `/menu/${slugify(parent.name)}`,
                    subMenu,
                };
            }).filter(Boolean); 
    
            const allProducts = drinks.map(drink => ({
                id: String(drink._id),
                name: drink.name,
                price: drink.price,
                image: drink.image,
            }));
    
            const result = [
                { label: "Tất cả", path: "/menu", products: allProducts },
                ...menuItems
            ];
    
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error("Lỗi getMenuByShopId:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy menu theo shop", error });
        }
    },

    getDetailDrink: async (req, res) => {
        try {
            const { shopId, drinkId } = req.params;
      
            const shop = await ShopModel.findById(shopId);
            if (!shop) {
                return res.status(404).json({ success: false, message: "Không tìm thấy shop" });
            }
      
            const drinkInShop = shop.products.find(p => p.id.toString() === drinkId);
            if (!drinkInShop) {
                return res.status(404).json({ success: false, message: "Món này không có trong shop" });
            }
      
            const drink = await ProductModel.findById(drinkId).populate("category");
            if (!drink) {
                return res.status(404).json({ success: false, message: "Không tìm thấy đồ uống" });
            }
      
            const relatedDrinks = await ProductModel.find(
                {
                    _id: { $ne: drinkId },
                    category: drink.category._id
                },
                { name: 1, price: 1, image: 1 }
            );
      
            const toppingIds = shop.toppings.map(t => t.id);
            const fullToppings = await ToppingModel.find(
                { _id: { $in: toppingIds } },
                { name: 1, price: 1 }
            );
      
            const toppingStockMap = shop.toppings.reduce((acc, t) => {
                acc[t.id.toString()] = t.stock;
                return acc;
            }, {});
      
            const toppingsWithStock = fullToppings.map(top => ({
                _id: top._id,
                name: top.name,
                price: top.price,
                stock: toppingStockMap[top._id.toString()] || 0
            }));
      
            return res.status(200).json({
                success: true,
                data: {
                    ...drink.toObject(),
                    stock: drinkInShop.stock,
                    sizes: drink.sizes,
                    toppings: toppingsWithStock,
                    relatedDrinks,
                }
            });
        } catch (err) {
            console.error("Lỗi getDetailDrink:", err);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy chi tiết đồ uống", error: err });
        }
    },
    
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