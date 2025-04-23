// /Users/thanhthuy/Documents/SoftwareDesign_TheCoffeeHouse/src/backend/controllers/payment.controller.js
import crypto from 'crypto';
import OrderModel from "../models/order.model.js";
import PaymentModel from "../models/payment.model.js";
import dotenv from 'dotenv';

dotenv.config();

// Thông tin cấu hình MoMo - Trong sản phẩm thực tế nên đưa vào biến môi trường (.env)
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "MOMO_PARTNER_CODE";
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "MOMO_ACCESS_KEY";
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY || "MOMO_SECRET_KEY";
const MOMO_ENDPOINT = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const IS_DEMO_MODE = process.env.IS_DEMO_MODE === 'true' || true; // Sử dụng chế độ demo

const PaymentController = {
  createMomoPayment: async (req, res) => {
    try {
      const { orderId, amount, orderInfo } = req.body;
      const userId = req.userId; // Lấy từ middleware xác thực

      if (!orderId || !amount || !userId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin thanh toán"
        });
      }

      // Kiểm tra đơn hàng tồn tại và thuộc về user hiện tại
      const order = await OrderModel.findOne({ _id: orderId, userId });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng"
        });
      }

      // Tạo requestId ngẫu nhiên
      const requestId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      const momoOrderId = `${Date.now()}_${orderId}`;
      const redirectUrl = `${FRONTEND_URL}/payment-result`;
      const ipnUrl = `${BACKEND_URL}/api/payment/momo-ipn`;
      
      // Nếu đang ở chế độ demo, không gọi API MoMo thực tế
      if (IS_DEMO_MODE) {
        console.log("Đang chạy ở chế độ demo cho MoMo");
        
        // Lưu thông tin thanh toán vào database
        const payment = await PaymentModel.create({
          orderId: orderId,
          userId: userId,
          amount: amount,
          provider: 'momo',
          transactionId: requestId,
          momoOrderId: momoOrderId,
          payUrl: `${FRONTEND_URL}/demo-payment?orderId=${momoOrderId}&amount=${amount}&extraData=${Buffer.from(JSON.stringify({ orderId, userId })).toString('base64')}`,
          status: 'pending',
          createdAt: new Date()
        });

        // Cập nhật phương thức thanh toán cho đơn hàng
        await OrderModel.findByIdAndUpdate(orderId, { paymentMethod: 'momo' });

        return res.status(200).json({
          success: true,
          message: "Tạo thanh toán MoMo demo thành công",
          paymentUrl: `${FRONTEND_URL}/demo-payment?orderId=${momoOrderId}&amount=${amount}&extraData=${Buffer.from(JSON.stringify({ orderId, userId })).toString('base64')}`,
          paymentId: payment._id
        });
      }
      
      // Nếu không phải chế độ demo, tiếp tục với API MoMo thực tế
      const rawData = {
        partnerCode: MOMO_PARTNER_CODE,
        accessKey: MOMO_ACCESS_KEY,
        requestId: requestId,
        amount: amount,
        orderId: momoOrderId,
        orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: Buffer.from(JSON.stringify({ orderId, userId })).toString('base64'),
        requestType: "captureWallet",
        lang: "vi"
      };

      // Tạo chữ ký
      const signature = crypto.createHmac('sha256', MOMO_SECRET_KEY)
        .update(Object.keys(rawData)
          .map(key => `${key}=${rawData[key]}`)
          .join('&'))
        .digest('hex');

      // Thêm chữ ký vào data
      const requestBody = { ...rawData, signature };

      // Gọi API MoMo
      const response = await fetch(MOMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const momoResponse = await response.json();

      if (momoResponse.resultCode === 0) {
        // Lưu thông tin thanh toán vào database
        const payment = await PaymentModel.create({
          orderId: orderId,
          userId: userId,
          amount: amount,
          provider: 'momo',
          transactionId: requestId,
          momoOrderId: rawData.orderId,
          payUrl: momoResponse.payUrl,
          status: 'pending',
          createdAt: new Date()
        });

        // Cập nhật phương thức thanh toán cho đơn hàng
        await OrderModel.findByIdAndUpdate(orderId, { paymentMethod: 'momo' });

        return res.status(200).json({
          success: true,
          message: "Tạo thanh toán MoMo thành công",
          paymentUrl: momoResponse.payUrl,
          paymentId: payment._id
        });
      } else {
        return res.status(400).json({
          success: false,
          message: momoResponse.message || "Tạo thanh toán MoMo thất bại",
          errorCode: momoResponse.resultCode
        });
      }
    } catch (error) {
      console.error("Lỗi tạo thanh toán MoMo:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo thanh toán MoMo",
        error: error.message
      });
    }
  },

  // Endpoint xử lý callback từ MoMo (IPN)
  momoIpnCallback: async (req, res) => {
    try {
      const { 
        partnerCode, orderId, requestId, amount, orderInfo, 
        orderType, transId, resultCode, message, payType,
        responseTime, extraData, signature 
      } = req.body;

      console.log("MoMo IPN Callback received:", req.body);

      // Xác thực chữ ký từ MoMo
      const rawSignature = `partnerCode=${partnerCode}&accessKey=${MOMO_ACCESS_KEY}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&transId=${transId}&message=${message}&responseTime=${responseTime}&resultCode=${resultCode}&payType=${payType}&extraData=${extraData}`;
      
      const computedSignature = crypto.createHmac('sha256', MOMO_SECRET_KEY)
        .update(rawSignature)
        .digest('hex');

      if (signature !== computedSignature) {
        console.error("Invalid signature from MoMo");
        return res.status(400).json({ message: "Invalid signature" });
      }

      // Lấy thông tin từ extraData
      const decodedExtraData = JSON.parse(Buffer.from(extraData, 'base64').toString());
      const { orderId: originalOrderId } = decodedExtraData;

      // Cập nhật trạng thái thanh toán trong database
      if (resultCode === 0) {
        // Thanh toán thành công
        await PaymentModel.findOneAndUpdate(
          { momoOrderId: orderId },
          { 
            status: 'completed',
            transactionId: transId,
            updatedAt: new Date(),
            responseDetails: JSON.stringify(req.body)
          }
        );

        // Cập nhật trạng thái đơn hàng
        await OrderModel.findByIdAndUpdate(
          originalOrderId,
          { 
            status: 'Confirmed',
            isPaid: true,
            paidAt: new Date()
          }
        );
      } else {
        // Thanh toán thất bại
        await PaymentModel.findOneAndUpdate(
          { momoOrderId: orderId },
          { 
            status: 'failed',
            errorMessage: message,
            updatedAt: new Date(),
            responseDetails: JSON.stringify(req.body)
          }
        );
      }

      // Phản hồi về MoMo
      return res.status(200).json({ message: "Processed" });
    } catch (error) {
      console.error("Lỗi xử lý IPN từ MoMo:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Endpoint kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const userId = req.userId;

      const payment = await PaymentModel.findOne({ 
        _id: paymentId,
        userId 
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin thanh toán"
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          status: payment.status,
          orderId: payment.orderId,
          amount: payment.amount,
          provider: payment.provider,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        }
      });
    } catch (error) {
      console.error("Lỗi kiểm tra trạng thái thanh toán:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi kiểm tra trạng thái thanh toán",
        error: error.message
      });
    }
  },

  // Endpoint xử lý kết quả thanh toán demo
  processDemoPayment: async (req, res) => {
    try {
      const { orderId, resultCode } = req.body;
      const userId = req.userId;
      
      // Kiểm tra thông tin thanh toán
      const payment = await PaymentModel.findOne({ 
        momoOrderId: orderId,
        userId
      });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin thanh toán"
        });
      }
      
      // Lấy ID đơn hàng gốc
      const originalOrderId = payment.orderId;
      
      // Cập nhật trạng thái thanh toán dựa vào resultCode
      if (resultCode === '0') {
        // Thanh toán thành công
        await PaymentModel.findByIdAndUpdate(
          payment._id,
          { 
            status: 'completed',
            transactionId: `demo_${Date.now()}`,
            updatedAt: new Date(),
            responseDetails: JSON.stringify({
              resultCode,
              message: 'Giao dịch thành công',
              orderId
            })
          }
        );
        
        // Cập nhật trạng thái đơn hàng
        await OrderModel.findByIdAndUpdate(
          originalOrderId,
          { 
            status: 'Confirmed',
            isPaid: true,
            paidAt: new Date()
          }
        );
        
        return res.status(200).json({
          success: true,
          message: "Thanh toán thành công",
          data: {
            orderId: originalOrderId,
            status: 'completed'
          }
        });
      } else {
        // Thanh toán thất bại
        await PaymentModel.findByIdAndUpdate(
          payment._id,
          { 
            status: 'failed',
            errorMessage: 'Thanh toán thất bại hoặc bị hủy',
            updatedAt: new Date(),
            responseDetails: JSON.stringify({
              resultCode,
              message: 'Giao dịch thất bại',
              orderId
            })
          }
        );
        
        return res.status(200).json({
          success: true,
          message: "Thanh toán thất bại",
          data: {
            orderId: originalOrderId,
            status: 'failed'
          }
        });
      }
    } catch (error) {
      console.error("Lỗi xử lý thanh toán demo:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xử lý thanh toán",
        error: error.message
      });
    }
  },
};

export default PaymentController;