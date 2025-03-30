import ToppingModel from "../models/topping.model.js";

const ToppingController = {
    getListToppings: async (req, res) => {
        try {
            const { start = 0, end = 10 } = req.query;
            const skip = parseInt(start);
            const limit = parseInt(end) - skip;

            const [Toppings, total] = await Promise.all([
                ToppingModel.find().skip(skip).limit(limit),
                ToppingModel.countDocuments()
            ]);

            res.set("X-Total-Count", total);
            res.set("Access-Control-Expose-Headers", "X-Total-Count");

            return res.status(200).json({ success: true, data: Toppings });
        } catch (error) {
            console.error("Lỗi getListToppings:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách Topping", error });
        }
    },

    getOneTopping: async (req, res) => {
        try {
            const { id } = req.params;
            const Topping = await ToppingModel.findById(id);
            if (!Topping) 
                return res.status(404).json({ success: false, message: "Không tìm thấy Topping" });

            return res.status(200).json({ success: true, data: Topping });
        } catch (error) {
            console.error("Lỗi ở getOneTopping:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi lấy Topping", error });
        }
    },

    getManyToppings: async (req, res) => {
        try {
            const { ids } = req.body; 
            const Toppings = await ToppingModel.find({ _id: { $in: ids } });
            
            return res.status(200).json({ data: Toppings });
        } catch (error) {
            console.error("Lỗi getManyToppings:", error);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách tất cả Topping", error });
        }
    },

    createTopping: async (req, res) => {
        try {
            const Topping = new ToppingModel(req.body);
            await Topping.save();

            return res.status(201).json({ data: Topping });
        } catch (error) {
            console.error("Lỗi ở createTopping:", error);
            return res.status(500).json({ success: false, message: "Lỗi khi tạo Topping", error });
        }
    },

    updateTopping: async (req, res) => {
        try {
            const { id } = req.params;
            const Topping = await ToppingModel.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
            });

            if (!Topping) return res.status(404).json({ message: "Topping không tồn tại" });

            return res.status(200).json({ data: Topping });
        } catch (error) {
            console.error("Lỗi ở updateTopping:", error);
            return res.status(500).json({ message: "Lỗi khi cập nhật Topping", error });
        }
    },

    deleteTopping: async (req, res) => {
        try {
            const { id } = req.params;
            const Topping = await ToppingModel.findByIdAndDelete(id);

            if (!Topping) return res.status(404).json({ message: "Topping không tồn tại" });

            return res.status(200).json({ 
                success: true,
                message: "Xoá Topping thành công",
                data: { id }
            });
        } catch (error) {
            console.error("Lỗi ở deleteTopping:", error);
            return res.status(500).json({ message: "Lỗi khi xoá Topping", error });
        }
    }
}

export default ToppingController;