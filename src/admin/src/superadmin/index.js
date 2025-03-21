import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';
import { DrinkList } from './drinks/DrinkList';
import { DrinkCreate } from './drinks/DrinkCreate';
import { DrinkEdit } from './drinks/DrinkEdit';

const data = {
  drinks: [
    {
      id: 1,
      name: 'Trà Xanh Espresso Marble',
      description: 'Cho ngày thêm tươi, tỉnh, êm, mượt với Trà Xanh Espresso Marble. Đây là sự mai mối bất ngờ giữa trà xanh Tây Bắc vị mộc và cà phê Arabica Đà Lạt. Muốn ngày thêm chút highlight, nhớ tìm đến sự bất ngờ này bạn nhé!',
      price: 49000,
      category: 'Trà Xanh Tây Bắc',
      image: 'https://product.hstatic.net/1000075078/product/1737355620_tx-espresso-marble_3942abe277644167a391b0a3bcfc52fc.png',
      sizes: [
        { size: 'S', extraPrice: 0 },
        { size: 'M', extraPrice: 6000 },
        { size: 'L', extraPrice: 16000 },
      ],
      stock: 100,
    },
  ],
};

const dataProvider = fakeDataProvider(data);

const SuperAdminApp = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="drinks"
        list={DrinkList}
        create={DrinkCreate}
        edit={DrinkEdit}
      />
    </Admin>
  );
};

export default SuperAdminApp;