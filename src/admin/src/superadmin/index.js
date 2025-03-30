import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

import { DrinkList, DrinkCreate, DrinkEdit } from "./drinkManager.js";
import { AdminList, AdminCreate, AdminEdit } from "./adminManager.js";
import { ShopList, ShopCreate, ShopEdit } from "./shopManager.js";
import { CategoryList, CategoryCreate, CategoryEdit } from "./categoryManager.js";
import { ToppingList, ToppingCreate, ToppingEdit } from "./toppingsManager.js";
import { DiscountList, DiscountCreate, DiscountEdit } from "./discountManager.js";
import dataProvider from '../api/dataProvider.js';
import { MyLayout } from '../auth/layout'; 
import { ProfilePage } from '../auth/profile';
import authProvider from '../auth/authProvider';

const SuperAdminApp = () => {
    return (
        <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout} >
            <Resource name="admin" list={AdminList} create={AdminCreate} edit={AdminEdit} />
            <Resource name="shop" list={ShopList} create={ShopCreate} edit={ShopEdit} />  
            <Resource name="category" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} />  
            <Resource name="product" list={DrinkList} create={DrinkCreate} edit={DrinkEdit} />
            <Resource name="topping" list={ToppingList} create={ToppingCreate} edit={ToppingEdit} />
            <Resource name="discount" list={DiscountList} create={DiscountCreate} edit={DiscountEdit} />
            <CustomRoutes>
                <Route path="/profile" element={<ProfilePage />} />
            </CustomRoutes>
        </Admin>
    );
};

export default SuperAdminApp;