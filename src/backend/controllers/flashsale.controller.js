import FlashSaleModel from "../models/flashsale.model.js";

const FlashSaleController = {
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
