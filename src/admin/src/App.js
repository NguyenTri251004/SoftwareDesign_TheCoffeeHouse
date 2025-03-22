import { Admin, Resource } from 'react-admin';

// import dataProvider from './dataProvider';
import fakeDataProvider from 'ra-data-fakerest';
import { AdminList } from './components/Admin/AdminList';
import { AdminCreate } from './components/Admin/AdminCreate';
import { AdminEdit } from './components/Admin/AdminEdit';
import { ShopList, ShopCreate, ShopEdit } from './components/ShopList/ShopList';

const data = {
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
            "https://file.hstatic.net/1000075078/file/sig-03_c74a0629d8b44ac580a3e9cf51fadb0a.png",
            "https://file.hstatic.net/1000075078/file/sig-05_d573c2d41cfa45769e61890e2cc17be7.png",
            "https://file.hstatic.net/1000075078/file/sig-04_45f046ffbfa94c069b4d9697e8444baa.png",
            "https://file.hstatic.net/1000075078/file/sig-02_895710c1013446fa940ac2407700ba20.png"
          ],
          products: [],
          carParking: true,
          takeAway: true,
          service: true,
          description:
            "Nhà tin rằng “cuộc hẹn cà phê” luôn có cho mình những tiêu chuẩn, phiên bản khác nhau, chúng luôn biến hoá mỗi ngày. Và SIGNATURE by The Coffee House là nơi bạn tìm thấy phiên bản đặc biệt của Cuộc hẹn tròn đầy giữa những ngày hối hả.Hôm nay bạn có hẹn chưa? Mình cà phê nhé!",
          __v: 0,
          id: "67da424781cca2b131c915e0"
        }
      ],
    admin: [
        {
            id: "1",
            shopId: "1"
        },
        {
            id: "2",
            shopId: "67da424781cca2b131c915e0"
        }
    ]
} 

const dataProvider = fakeDataProvider(data);

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource 
            name="shop" 
            list={ShopList} 
            create={ShopCreate} 
            edit={ShopEdit}
        />
        <Resource
        name="admin"
        list={AdminList}
        create={AdminCreate}
        edit={AdminEdit}
      />
    </Admin>
);


export default App;