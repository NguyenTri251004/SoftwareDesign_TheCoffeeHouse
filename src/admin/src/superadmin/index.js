import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import fakeDataProvider from 'ra-data-fakerest';
import { DrinkList, DrinkCreate, DrinkEdit } from './drinkManager.js';
import { AdminList, AdminCreate, AdminEdit } from "./adminManager.js";
import { ShopList, ShopCreate, ShopEdit } from './shopManager.js';
import { ToppingList, ToppingCreate, ToppingEdit } from './toppingsManager.js';

import { MyLayout } from '../auth/layout'; 
import { ProfilePage } from '../auth/profile';
import authProvider from '../auth/authProvider';

const data = {
    drinks: [
        {
            id: 1,
            name: 'Trà Xanh Espresso Marble',
            description:
                'Sự kết hợp giữa trà xanh Tây Bắc và cà phê Arabica Đà Lạt, đem lại trải nghiệm độc đáo và tươi mới.',
            price: 49000,
            category: 'Trà Xanh Tây Bắc',
            image:
                'https://product.hstatic.net/1000075078/product/1737355620_tx-espresso-marble_3942abe277644167a391b0a3bcfc52fc.png',
            sizes: [
            { size: 'S', extraPrice: 0 },
            { size: 'M', extraPrice: 6000 },
            { size: 'L', extraPrice: 16000 },
            ],
        },
    {
      id: 2,
      name: 'Matcha Yuzu',
      description:
        'Matcha Nhật Bản đậm vị kết hợp Yuzu tươi mát, chua dịu, tạo nên hương vị thanh mát và tươi mới.',
      price: 55000,
      category: 'Trà xanh',
      image:
        'https://minio.thecoffeehouse.com/image/admin/1741341448_matcha-kyoto-yuzu_400x400.png',
      sizes: [
        { size: 'S', extraPrice: 0 },
        { size: 'M', extraPrice: 5000 },
        { size: 'L', extraPrice: 10000 },
      ],
    },
    {
      id: 3,
      name: 'A-Mê Mơ',
      description:
        'Mê say với Americano từ 100% Arabica kết hợp cùng Mơ chua ngọt, tươi mới mỗi ngày. *Khuấy đều để thưởng thức trọn vị',
      price: 45000,
      category: 'A-Mơ',
      image:
        'https://minio.thecoffeehouse.com/image/admin/1737355001_ame-mo_400x400.png',
      sizes: [
        { size: 'S', extraPrice: 0 },
        { size: 'M', extraPrice: 4000 },
        { size: 'L', extraPrice: 8000 },
      ],
    },
  ],

  toppings: [
    {
      id: 1,
      name: 'Trân châu đen',
      price: 5000,
    },
    {
      id: 2,
      name: 'Thạch dừa',
      price: 6000,
    },
    {
      id: 3,
      name: 'Pudding trứng',
      price: 7000,
    },
  ],

  shop: [
    {
      address: {
        detail: "TTTM Crescent Mall, 101 Tôn Dật Tiên, Phường Tân Phú",
        district: "Quận 7",
        city: "Hồ Chí Minh"
      },
      openingHours: { open: "07:00", close: "22:00" },
      _id: "67da424781cca2b131c915e0",
      name: "HCM SIGNATURE by The Coffee House",
      phone: "",
      images: [
        "https://file.hstatic.net/1000075078/file/sig_outside_04bf4cce30d4436d9a957a4609fa2dc1.jpg",
        "https://file.hstatic.net/1000075078/file/sig-03_c74a0629d8b44ac580a3e9cf51fadb0a.png"
      ],
      products: [],
      carParking: true,
      takeAway: true,
      service: true,
      description:
        "SIGNATURE by The Coffee House là phiên bản đặc biệt cho những cuộc hẹn tròn đầy giữa nhịp sống bận rộn.",
      __v: 0,
      id: "67da424781cca2b131c915e0"
    },
    {
      address: {
        detail: "86 Nguyễn Văn Trỗi, Phường 8",
        district: "Phú Nhuận",
        city: "Hồ Chí Minh"
      },
      openingHours: { open: "06:30", close: "22:00" },
      _id: "shop2",
      name: "The Coffee House - Nguyễn Văn Trỗi",
      phone: "0123456789",
      images: [],
      products: [],
      carParking: false,
      takeAway: true,
      service: false,
      description:
        "Không gian hiện đại, gần trung tâm, phù hợp cho học tập và làm việc.",
      __v: 0,
      id: "shop2"
    }
  ],

  admin: [
    {
      id: "1",
      username: "nguyenvana",
      email: "vana@gmail.com",
      avatar: "https://i.pravatar.cc/150?u=admin1",
      shopId: "67da424781cca2b131c915e0"
    },
    {
      id: "2",
      username: "lethingoc",
      email: "ngocle@gmail.com",
      avatar: "https://i.pravatar.cc/150?u=admin3",
      shopId: "shop2"
    }
  ]
  
};


const dataProvider = fakeDataProvider(data);

const SuperAdminApp = () => {
    return (
        <Admin dataProvider={dataProvider} authProvider={authProvider}  layout={MyLayout} >
            <Resource name="admin" list={AdminList} create={AdminCreate} edit={AdminEdit} />
            <Resource name="shop" list={ShopList} create={ShopCreate} edit={ShopEdit} />              
            <Resource name="drinks" list={DrinkList} create={DrinkCreate} edit={DrinkEdit} />
            <Resource name="toppings" list={ToppingList} create={ToppingCreate} edit={ToppingEdit} />
            <CustomRoutes>
                <Route path="/profile" element={<ProfilePage />} />
            </CustomRoutes>
        </Admin>
    );
};

export default SuperAdminApp;