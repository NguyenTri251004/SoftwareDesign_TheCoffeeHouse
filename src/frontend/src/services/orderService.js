const BASE_URL = "http://localhost:5001/api";

// Dữ liệu dự phòng khi API lỗi
const fallbackData = {
    orders: [
        {
            id: "001",
            branch: "HCM SIGNATURE by The Coffee House",
            status: "Đang vận chuyển",
            shippingFee: 15000,
            discount: 10000,
            totalPrice: 129000,
            items: [
                {
                    name: "Espresso Marble",
                    image: "https://product.hstatic.net/1000075078/product/1737355620_tx-espresso-marble_3942abe277644167a391b0a3bcfc52fc_large.png",
                    quantity: 1,
                    toppings: "Không topping",
                    price: 49000
                },
                {
                    name: "Cold Brew Classic",
                    image: "https://product.hstatic.net/1000075078/product/1737357505_coldbrew-classic_9d08e3ee0d154050898affcb0ebb7745_large.png",
                    quantity: 1,
                    toppings: "Thêm đường nâu",
                    price: 49000
                }
            ]
        },
        {
            id: "002",
            branch: "HCM SIGNATURE by The Coffee House",
            status: "Đã nhận hàng",
            shippingFee: 10000,
            discount: 5000,
            totalPrice: 98000,
            items: [
                {
                    name: "Arabica",
                    image: "https://product.hstatic.net/1000075078/product/1737357055_bo-arabica_b64556656a7d479bbe641ab7cff99605_large.png",
                    quantity: 1,
                    toppings: "Không topping",
                    price: 49000
                },
                {
                    name: "Đen Sữa Đá",
                    image: "https://product.hstatic.net/1000075078/product/1737357048_uong-den-sua-da_979b4b23b19f429b9dedb3491743c016_large.png",
                    quantity: 1,
                    toppings: "Thêm sữa đặc",
                    price: 49000
                }
            ]
        },
        {
            id: "003",
            branch: "HCM SIGNATURE by The Coffee House",
            status: "Trả hàng/Hoàn tiền",
            shippingFee: 0,
            discount: 0,
            totalPrice: 0,
            items: [
                {
                    name: "Sữa Đá",
                    image: "https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33_large.png",
                    quantity: 1,
                    toppings: "Không topping",
                    price: 49000
                }
            ]
        }
    ]
  };
  

const OrderAPI = {
    // Lấy danh sách voucher
    getOrders: async () => {
        try {
            const response = await fetch(`${BASE_URL}/order`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.warn("API failed: getOrders, using fallback data.");
                return fallbackData.orders; // Trả về dữ liệu dự phòng
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching orders:", error.message);
            return fallbackData.orders; // Trả về dữ liệu dự phòng nếu lỗi
        }
    },

    // Lấy đơn hàng của người dùng đã đăng nhập
    getUserOrders: async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error("Không tìm thấy token đăng nhập");
                return [];
            }

            const response = await fetch(`${BASE_URL}/order/user`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn("API failed: getUserOrders", errorData);
                
                // Trả về fallback data trong môi trường phát triển
                if (process.env.NODE_ENV === 'development') {
                    console.log("Đang sử dụng dữ liệu mẫu cho đơn hàng");
                    return fallbackData.orders;
                }
                
                return [];
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user orders:", error.message);
            
            // Trả về fallback data trong môi trường phát triển
            if (process.env.NODE_ENV === 'development') {
                console.log("Đang sử dụng dữ liệu mẫu cho đơn hàng do lỗi:", error.message);
                return fallbackData.orders;
            }
            
            return [];
        }
    },

    // Lấy chi tiết order theo ID
    getOrderById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/order?id=${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.warn("API failed: getOrderById, using fallback data.");
                return fallbackData.orders.find(v => v.id === id) || null;
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching order details:", error.message);
            return fallbackData.orders.find(v => v.id === id) || null;
        }
    },

    postOrder: async (orderData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error("Không tìm thấy token đăng nhập");
                return { 
                    success: false, 
                    message: "Vui lòng đăng nhập để đặt hàng"
                };
            }

            const response = await fetch(`${BASE_URL}/order`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("API failed: postOrder", responseData);
                return { 
                    success: false, 
                    message: responseData.message || "Đặt hàng thất bại, vui lòng thử lại sau",
                    error: responseData.error
                };
            }

            return responseData;
        } catch (error) {
            console.error("Error posting order:", error.message);
            return { 
                success: false, 
                message: "Lỗi kết nối, vui lòng thử lại sau",
                error: error.message 
            };
        }
    }
};

export default OrderAPI;
