import { Admin, Resource } from 'react-admin';
import dataProvider from './dataProvider';
import { ShopList, ShopCreate, ShopEdit } from './components/ShopList/ShopList';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource 
            name="shop" 
            list={ShopList} 
            create={ShopCreate} 
            edit={ShopEdit}
        />
    </Admin>
);

export default App;