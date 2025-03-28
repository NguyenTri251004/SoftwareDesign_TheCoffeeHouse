import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import fakeDataProvider from 'ra-data-fakerest';
import { DrinkList, DrinkCreate, DrinkEdit } from './drinkManager.js';
import { AdminList, AdminCreate, AdminEdit } from "./adminManager.js";
import { ShopList, ShopCreate, ShopEdit } from './shopManager.js';
import { ToppingList, ToppingCreate, ToppingEdit } from './toppingsManager.js';

import dataProvider from '../api/dataProvider.js';
import { MyLayout } from '../auth/layout'; 
import { ProfilePage } from '../auth/profile';
import authProvider from '../auth/authProvider';
import LoginPage from '../auth/LoginPage';

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
};


//const dataProvider = fakeDataProvider(data);
//             
//<Resource name="drinks" list={DrinkList} create={DrinkCreate} edit={DrinkEdit} />
//<Resource name="toppings" list={ToppingList} create={ToppingCreate} edit={ToppingEdit} />
const SuperAdminApp = () => {
    return (
        <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout} >
            <Resource name="admin" list={AdminList} create={AdminCreate} edit={AdminEdit} />
            <Resource name="shop" list={ShopList} create={ShopCreate} edit={ShopEdit} />  
            <CustomRoutes>
                <Route path="/profile" element={<ProfilePage />} />
            </CustomRoutes>
        </Admin>
    );
};

export default SuperAdminApp;