// pages/menu/menuData.js
import traXanhImage from "assets/images/tra-xanh-espresso.png";
import boArabicaImage from "assets/images/bo-arabica.png";
import duongDenImage from "assets/images/duong-den-sua-da.png";
import tcfSuaDaImage from "assets/images/tch-sua-da.png";
export const menuItems = [
  {
    label: "Tất cả",
    link: "#",
    path: "/menu", // Đường dẫn cho "Tất cả"
    products: [],
  },
  {
    label: "Cà Phê",
    link: "#",
    path: "/menu/ca-phe", // Đường dẫn chung cho "Cà Phê" (có thể không cần dùng trực tiếp)
    subMenu: [
      {
        label: "Cà phê Highlight",
        link: "#",
        path: "/menu/ca-phe/highlight",
        products: [
          {
            id: "cfhl1",
            name: "Trà Xanh Espresso Marble",
            price: 49000,
            image: traXanhImage,
          },
        ],
      },
      {
        label: "Cà phê Việt Nam",
        link: "#",
        path: "/menu/ca-phe/viet-nam",
        products: [
          {
            id: "cfvn1",
            name: "Bơ Arabica",
            price: 49000,
            image: boArabicaImage,
          },
          {
            id: "cfvn2",
            name: "Đường Đen Sữa Đá",
            price: 45000,
            image: duongDenImage,
          },
          {
            id: "cfvn3",
            name: "The Coffee House Sữa Đá",
            price: 39000,
            image: tcfSuaDaImage,
          },
        ],
      },
      {
        label: "Cà phê máy",
        link: "#",
        path: "/menu/ca-phe/may",
        products: [],
      },
      {
        label: "Cold Brew",
        link: "#",
        path: "/menu/ca-phe/cold-brew",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "A-Mê",
    link: "#",
    path: "/menu/a-me",
    subMenu: [
      { label: "A-Mê", link: "#", path: "/menu/a-me/a-me", products: [] },
    ],
    products: [],
  },
  {
    label: "Trái Cây Xay 0°C",
    link: "#",
    path: "/menu/trai-cay-xay-0-do-c",
    subMenu: [
      {
        label: "Trái Cây Xay 0°C",
        link: "#",
        path: "/menu/trai-cay-xay-0-do-c/trai-cay-xay",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "Trà Trái Cây - Hitea",
    link: "#",
    path: "/menu/tra-trai-cay-hitea",
    subMenu: [
      {
        label: "Trà trái cây",
        link: "#",
        path: "/menu/tra-trai-cay-hitea/tra-trai-cay",
        products: [],
      },
      {
        label: "Hi-tea",
        link: "#",
        path: "/menu/tra-trai-cay-hitea/hi-tea",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "Trà Sữa",
    link: "#",
    path: "/menu/tra-sua",
    subMenu: [
      {
        label: "Trà Sữa",
        link: "#",
        path: "/menu/tra-sua/tra-sua",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "Trà Xanh - Chocolate",
    link: "#",
    path: "/menu/tra-xanh-chocolate",
    subMenu: [
      {
        label: "Trà Xanh Tây Bắc",
        link: "#",
        path: "/menu/tra-xanh-chocolate/tra-xanh-tay-bac",
        products: [],
      },
      {
        label: "Chocolate",
        link: "#",
        path: "/menu/tra-xanh-chocolate/chocolate",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "Thức uống đá xay",
    link: "#",
    path: "/menu/thuc-uong-da-xay",
    subMenu: [
      {
        label: "Đá xay frosty",
        link: "#",
        path: "/menu/thuc-uong-da-xay/da-xay-frosty",
        products: [],
      },
    ],
    products: [],
  },
  {
    label: "Bánh & Snack",
    link: "#",
    path: "/menu/banh-snack",
    subMenu: [
      {
        label: "Bánh mặn",
        link: "#",
        path: "/menu/banh-snack/banh-man",
        products: [],
      },
      {
        label: "Bánh ngọt",
        link: "#",
        path: "/menu/banh-snack/banh-ngot",
        products: [],
      },
      {
        label: "Bánh pastry",
        link: "#",
        path: "/menu/banh-snack/banh-pastry",
        products: [],
      },
    ],
    products: [],
  },
  // {
  //   label: "Thưởng thức tại nhà",
  //   link: "#",
  //   path: "/menu/thuong-thuc-tai-nha",
  //   subMenu: [
  //     {
  //       label: "Cà phê tại nhà",
  //       link: "#",
  //       path: "/menu/thuong-thuc-tai-nha/ca-phe-tai-nha",
  //       products: [],
  //     },
  //   ],
  //   products: [],
  // },
];
