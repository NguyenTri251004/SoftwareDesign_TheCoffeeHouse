import { Admin, Resource } from 'react-admin';
import { ShopList } from './components/ShopList/ShopList';
import  dataProvider  from './dataProvider';


const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="shop" list={ShopList} />
  </Admin>
);

export default App;