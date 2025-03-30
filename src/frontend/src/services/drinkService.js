import { menuItems } from "pages/menu/menuData";

const fakeExtraDrinkData = {
  sizes: [
    { name: "Nhỏ", price: 0 },
    { name: "Vừa", price: 10000 },
    { name: "Lớn", price: 16000 },
  ],
  toppings: [
    { name: "Thạch Sương Sáo", price: 10000 },
    { name: "Thạch Cà Phê", price: 10000 },
    { name: "Shot Expresso", price: 10000 },
    { name: "Trân Châu Trắng", price: 10000 },
    { name: "Kem Phô Mai Macchiato", price: 10000 },
    { name: "Thạch Kim Quất", price: 10000 },
    { name: "Foam Phô Mai", price: 10000 },
    { name: "Sốt Caramel", price: 10000 },
    { name: "Hạt Sen", price: 10000 },
    { name: "Đào Miếng", price: 10000 },
  ],
};

// Hàm lấy toàn bộ products từ tất cả submenu
const getAllDrinks = () => {
  let drinks = [];
  for (const cat of menuItems) {
    if (cat.subMenu) {
      for (const sub of cat.subMenu) {
        if (sub.products && sub.products.length > 0) {
          drinks = drinks.concat(sub.products);
        }
      }
    }
  }
  return drinks;
};

// Hàm chọn ngẫu nhiên n phần tử từ array
const getRandomItems = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const DrinkAPI = {
  getDrinkById: async (id) => {
    await new Promise((res) => setTimeout(res, 200));

    const allDrinks = getAllDrinks();
    const foundDrink = allDrinks.find((p) => p.id === id);

    if (!foundDrink) throw new Error("Drink not found");

    // Sản phẩm liên quan: random 4 món khác (trừ chính nó)
    const relatedDrinks = getRandomItems(
      allDrinks.filter((p) => p.id !== id),
      4
    );

    return {
      drink: {
        ...foundDrink,
        description: "Mô tả chi tiết cho " + foundDrink.name,
        sizes: fakeExtraDrinkData.sizes,
        toppings: fakeExtraDrinkData.toppings,
        relatedDrinks,
      },
    };
  },
};

export default DrinkAPI;