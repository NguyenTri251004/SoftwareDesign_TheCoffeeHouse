const BASE_URL = "http://localhost:5001/api";

// Dữ liệu dự phòng khi API lỗi
const fallbackData = {
    vouchers: [
      {
        id: 1,
        title: "Giảm 10% Đơn từ 2 Món",
        icon: "https://minio.thecoffeehouse.com/image/admin/1698765322_cp-pick-up.jpg",
        expiresIn: "5 ngày",
        code: "NHANHGON",
        description: `
  Giảm 10% cho đơn hàng từ 2 món – Áp dụng cho hình thức mua mang đi (Pick up) khi đặt hàng qua App/Web The Coffee House trên toàn hệ thống (trừ các cửa hàng BA Đen -Tây Ninh, SIGNATURE by The Coffee House, Quận 7).
  - Hạn dùng cho sản phẩm nước, bánh, không áp dụng cho topping.
  - Không áp dụng chung với các khuyến mãi khác.
  - Chỉ áp dụng 1 lần/ tài khoản.
        `,
        termsLink: "https://thecoffeehouse.com/pages/dieu-khoan-su-dung"
      },
      {
        id: 2,
        title: "Giảm 30K Đơn từ 99K",
        icon: "https://minio.thecoffeehouse.com/image/admin/1698765397_coupon-30k.jpg",
        expiresIn: "5 ngày",
        code: "GIAM30K",
        description: `
  Giảm 30.000đ cho đơn hàng từ 99.000đ – Áp dụng cho mọi hình thức đặt hàng qua App/Web The Coffee House.
  - Áp dụng cho nước, bánh, topping,...
  - Không áp dụng chung với các khuyến mãi khác.
  - Chỉ áp dụng 1 lần/ tài khoản.
        `,
        termsLink: "https://thecoffeehouse.com/pages/dieu-khoan-su-dung"
      },
      {
        id: 3,
        title: "Giảm 30% + Freeship Đơn Từ 5 Ly",
        icon: "https://minio.thecoffeehouse.com/image/admin/1709222265_deli-copy-7.jpg",
        expiresIn: "5 ngày",
        code: "GIAM30FREESHIP",
        description: `
  Giảm 30% (tối đa 60.000đ) và miễn phí giao hàng cho đơn từ 5 ly trở lên.
  - Áp dụng cho thức uống, bánh, topping.
  - Không áp dụng chung với khuyến mãi khác.
  - Chỉ áp dụng 1 lần/ tài khoản.
        `,
        termsLink: "https://thecoffeehouse.com/pages/dieu-khoan-su-dung"
      },
      {
        id: 4,
        title: "Giảm 20K cho đơn từ 60K",
        icon: "https://minio.thecoffeehouse.com/image/admin/1698765382_coupon-20k.jpg",
        expiresIn: "5 ngày",
        code: "GIAM20K",
        description: `
  Giảm 20.000đ cho đơn hàng từ 60.000đ – Áp dụng cho mọi hình thức đặt hàng qua App/Web The Coffee House.
  - Áp dụng cho nước, bánh, topping,...
  - Không áp dụng chung với các khuyến mãi khác.
  - Chỉ áp dụng 1 lần/ tài khoản.
        `,
        termsLink: "https://thecoffeehouse.com/pages/dieu-khoan-su-dung"
      },
      {
        id: 5,
        title: "Giảm 50% phí giao hàng",
        icon: "https://minio.thecoffeehouse.com/image/admin/1735634161_coupon.jpg",
        expiresIn: "5 ngày",
        code: "FREESHIP50",
        description: `
  Giảm 50% phí giao hàng cho mọi đơn hàng – Áp dụng khi đặt qua App/Web The Coffee House.
  - Không áp dụng chung với các khuyến mãi khác.
  - Chỉ áp dụng 1 lần/ tài khoản.
        `,
        termsLink: "https://thecoffeehouse.com/pages/dieu-khoan-su-dung"
      }
    ]
  };
  

const VoucherAPI = {
    // Lấy danh sách voucher
    getVouchers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/voucher`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.warn("API failed: getVouchers, using fallback data.");
                return fallbackData.vouchers; // Trả về dữ liệu dự phòng
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching vouchers:", error.message);
            return fallbackData.vouchers; // Trả về dữ liệu dự phòng nếu lỗi
        }
    },

    // Lấy chi tiết voucher theo ID
    getVoucherById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/voucher?id=${id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.warn("API failed: getVoucherById, using fallback data.");
                return fallbackData.vouchers.find(v => v.id === id) || null;
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching voucher details:", error.message);
            return fallbackData.vouchers.find(v => v.id === id) || null;
        }
    }
};

export default VoucherAPI;
