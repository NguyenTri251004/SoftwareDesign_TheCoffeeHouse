import FlashSaleModel from "../models/flashsale.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";

const FlashSaleController = {
    getFlashSalesByShop: async (req, res) => {
        try {
            const { shopId } = req.params;

            if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
                return res.status(400).json({ success: false, message: "Thiếu hoặc sai định dạng shopId" });
            }

            const now = new Date();

            // Cập nhật trạng thái Flash Sale dựa vào thời gian
            await FlashSaleModel.updateMany(
                {
                    shopId,
                    status: "Upcoming",
                    startTime: { $lte: now },
                    endTime: { $gte: now }
                },
                { $set: { status: "Active" } }
            );

            await FlashSaleModel.updateMany(
                {
                    shopId,
                    status: { $in: ["Upcoming", "Active"] },
                    endTime: { $lt: now }
                },
                { $set: { status: "Ended" } }
            );

            // Lấy Flash Sale hiện tại
            let current = await FlashSaleModel.findOne({
                shopId,
                status: "Active",
                startTime: { $lte: now },
                endTime: { $gte: now }
            }).populate("products.productId").lean();

            if (current) {
                current.products = current.products.filter(p => p.productId); // loại bỏ product bị null
            }

            // Lấy 3 Flash Sale sắp diễn ra
            let upcoming = await FlashSaleModel.find({
                shopId,
                status: "Upcoming",
                startTime: { $gt: now }
            })
                .sort({ startTime: 1 })
                .limit(3)
                .populate("products.productId")
                .lean();

            upcoming = upcoming.map(flashSale => ({
                ...flashSale,
                products: flashSale.products.filter(p => p.productId) // loại product null
            }));

            return res.status(200).json({
                success: true,
                data: {
                    current: current || null,
                    upcoming
                }
            });
        } catch (error) {
            console.error("Lỗi getFlashSalesByShop:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lấy Flash Sale hiện tại và sắp diễn ra",
                error
            });
        }
    },   

    getListFlashSales: async (req, res) => {
        try {
            const { start = 0, end = 10, shopId } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;
    
            const query = {};
            if (shopId) query.shopId = shopId; 
    
            const [flashSales, total] = await Promise.all([
                FlashSaleModel.find(query).skip(skip).limit(limit),
                FlashSaleModel.countDocuments(query)
            ]);
    
            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
    
            return res.status(200).json({ success: true, data: flashSales });
        } catch (error) {
            console.error("Lỗi getListFlashSales:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Flash Sale", error });
        }
    },
    

    getOneFlashSale: async (req, res) => {
        try {
            const { id } = req.params;
            const flashSale = await FlashSaleModel.findById(id);
            if (!flashSale)
                return res.status(404).json({ success: false, message: "Không tìm thấy Flash Sale" });

            return res.status(200).json({ success: true, data: flashSale });
        } catch (error) {
            console.error("Lỗi ở getOneFlashSale:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Flash Sale", error });
        }
    },

    getManyFlashSales: async (req, res) => {
        try {
            const { ids } = req.body;
            const { shopId } = req.query;
    
            const query = {
                _id: { $in: ids },
                ...(shopId && { shopId }),
            };
    
            const flashSales = await FlashSaleModel.find(query);
            return res.status(200).json({ data: flashSales });
        } catch (error) {
            console.error("Lỗi getManyFlashSales:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách Flash Sale", error });
        }
    },    

    createFlashSale: async (req, res) => {
        try {
            const flashSale = new FlashSaleModel(req.body);
            await flashSale.save();

            return res.status(201).json({ data: flashSale });
        } catch (error) {
            console.error("Lỗi ở createFlashSale:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo Flash Sale", error });
        }
    },

    updateFlashSale: async (req, res) => {
        try {
            const { id } = req.params;
            const flashSale = await FlashSaleModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!flashSale) return res.status(404).json({ message: "Flash Sale không tồn tại" });

            return res.status(200).json({ data: flashSale });
        } catch (error) {
            console.error("Lỗi ở updateFlashSale:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật Flash Sale", error });
        }
    },

    deleteFlashSale: async (req, res) => {
        try {
            const { id } = req.params;
            const flashSale = await FlashSaleModel.findByIdAndDelete(id);

            if (!flashSale) return res.status(404).json({ message: "Flash Sale không tồn tại" });

            return res.status(200).json({
                success: true,
                message: "Xoá Flash Sale thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi ở deleteFlashSale:", error);
            return res.status(500).json({ message: "Lỗi khi xoá Flash Sale", error });
        }
    }
};

export default FlashSaleController;
