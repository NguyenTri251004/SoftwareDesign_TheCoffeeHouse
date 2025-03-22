import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import fakeDataProvider from 'ra-data-fakerest';
import { DrinkList } from './drinkManager';
import { ToppingList } from './toppingsManager';
import { OrderList, OrderShow, OrderEdit } from './orderManager';
import { FlashSaleList, FlashSaleShow, FlashSaleCreate, FlashSaleEdit } from './flashSaleManager';

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
  orders: [
    {
      id: 'order001',
      userId: 'user01',
      shopId: 'shop1',
      items: [
        {
          productId: 'drink1',
          productName: 'Trà Xanh Espresso Marble',
          size: 'M',
          toppings: [
            { toppingId: 'topping1', toppingName: 'Trân châu đen', quantity: 2 },
            { toppingId: 'topping2', toppingName: 'Thạch dừa', quantity: 1 }
          ],
          quantity: 2,
          unitPrice: 50000,
          totalPrice: 110000
        }
      ],
      voucher: null,
      totalAmount: 110000,
      point: 11,
      status: 'Pending',
      paymentId: 'payment1',
      deliveryAddress: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '0909123456',
      refundStatus: 'None',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  flashsales: [
    {
      id: 'fs1',
      shopId: 'shop1',
      startTime: new Date(new Date().getTime() - 60 * 60 * 1000), 
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000),  
      status: 'Active',
      products: [
        {
          productId: 'drink1',
          discountPercentage: 30,
          stock: 100,
          maxQuantityPerCustomer: 3
        },
        {
          productId: 'drink2',
          discountPercentage: 10,
          stock: 50,
          maxQuantityPerCustomer: 5
        }
      ],
      createdAt: new Date()
    },
    {
      id: 'fs2',
      shopId: 'shop2',
      startTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 giờ sau
      endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000),   // 4 giờ sau
      status: 'Upcoming',
      products: [
        {
          productId: 'drink3',
          discountPercentage: 20,
          stock: 70,
          maxQuantityPerCustomer: 2
        }
      ],
      createdAt: new Date()
    }
  ],
  
};

const dataProvider = fakeDataProvider(data);

const AdminApp = () => {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}  layout={MyLayout} >
        <Resource name="orders" list={OrderList} show={OrderShow} edit={OrderEdit} />
        <Resource name="drinks" list={DrinkList} />
        <Resource name="toppings" list={ToppingList} />
        <Resource name="flashsales" list={FlashSaleList} show={FlashSaleShow} create={FlashSaleCreate} edit={FlashSaleEdit}/>
    
        <CustomRoutes>
            <Route path="/profile" element={<ProfilePage />} />
        </CustomRoutes>
    </Admin>
  );
};

export default AdminApp;
