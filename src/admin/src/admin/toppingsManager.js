import { List, Datagrid, TextField, NumberField } from 'react-admin';
import { AddToMenuButton } from '../components/AddToMenuButton'; 

export const ToppingList = (props) => (
  <List {...props} actions={false} title="Chọn topping cho chi nhánh">
        <Datagrid>
            <TextField source="name" label="Tên topping" />
            <NumberField source="price" label="Giá" />
            <AddToMenuButton />
        </Datagrid>
    </List>
);
