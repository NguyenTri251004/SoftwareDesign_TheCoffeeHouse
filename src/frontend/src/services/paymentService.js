// /Users/thanhthuy/Documents/SoftwareDesign_TheCoffeeHouse/src/frontend/src/services/paymentService.js
const BASE_URL = "http://localhost:5001/api/payment";

const PaymentAPI = {
  // Tạo thanh toán MoMo
  createMomoPayment: async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("Không tìm thấy token đăng nhập");
        return { 
          success: false, 
          message: "Vui lòng đăng nhập để thanh toán"
        };
      }

      const response = await fetch(`${BASE_URL}/create-momo-payment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });

      // Kiểm tra Content-Type của response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (!response.ok) {
          console.error("API failed: createMomoPayment", responseData);
          return { 
            success: false, 
            message: responseData.message || "Tạo thanh toán MoMo thất bại, vui lòng thử lại sau",
            error: responseData.error
          };
        }

        return responseData;
      } else {
        // Nếu không phải JSON, lấy text response để debug
        const textResponse = await response.text();
        console.error("Received non-JSON response:", textResponse.substring(0, 200) + "...");
        
        return {
          success: false, 
          message: "Máy chủ trả về định dạng không hợp lệ. Vui lòng liên hệ quản trị viên.",
          error: "Invalid response format"
        };
      }
    } catch (error) {
      console.error("Error creating MoMo payment:", error.message);
      return { 
        success: false, 
        message: "Lỗi kết nối, vui lòng thử lại sau",
        error: error.message 
      };
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("Không tìm thấy token đăng nhập");
        return { 
          success: false, 
          message: "Vui lòng đăng nhập để kiểm tra thanh toán"
        };
      }

      const response = await fetch(`${BASE_URL}/check-payment-status/${paymentId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      // Kiểm tra Content-Type của response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (!response.ok) {
          console.error("API failed: checkPaymentStatus", responseData);
          return { 
            success: false, 
            message: responseData.message || "Kiểm tra thanh toán thất bại",
            error: responseData.error
          };
        }

        return responseData;
      } else {
        // Nếu không phải JSON, lấy text response để debug
        const textResponse = await response.text();
        console.error("Received non-JSON response:", textResponse.substring(0, 200) + "...");
        
        return {
          success: false, 
          message: "Máy chủ trả về định dạng không hợp lệ. Vui lòng liên hệ quản trị viên.",
          error: "Invalid response format"
        };
      }
    } catch (error) {
      console.error("Error checking payment status:", error.message);
      return { 
        success: false, 
        message: "Lỗi kết nối, vui lòng thử lại sau",
        error: error.message 
      };
    }
  },

  // Xử lý kết quả thanh toán demo
  processDemoPayment: async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("Không tìm thấy token đăng nhập");
        return { 
          success: false, 
          message: "Vui lòng đăng nhập để xử lý thanh toán"
        };
      }

      const response = await fetch(`${BASE_URL}/process-demo-payment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });

      // Kiểm tra Content-Type của response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (!response.ok) {
          console.error("API failed: processDemoPayment", responseData);
          return { 
            success: false, 
            message: responseData.message || "Xử lý thanh toán thất bại",
            error: responseData.error
          };
        }

        return responseData;
      } else {
        // Nếu không phải JSON, lấy text response để debug
        const textResponse = await response.text();
        console.error("Received non-JSON response:", textResponse.substring(0, 200) + "...");
        
        return {
          success: false, 
          message: "Máy chủ trả về định dạng không hợp lệ. Vui lòng liên hệ quản trị viên.",
          error: "Invalid response format"
        };
      }
    } catch (error) {
      console.error("Error processing demo payment:", error.message);
      return { 
        success: false, 
        message: "Lỗi kết nối, vui lòng thử lại sau",
        error: error.message 
      };
    }
  }
};

export default PaymentAPI;