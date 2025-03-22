import { List, Datagrid, TextField, NumberField, ImageField } from 'react-admin';
import { AddToMenuButton } from '../components/AddToMenuButton'; 

export const DrinkList = (props) => (
    <List {...props} title="Chọn đồ uống cho chi nhánh">
        <Datagrid>
            <TextField source="name" label="Tên đồ uống" />
            <NumberField source="price" label="Giá cơ bản (Size S)" />
            <ImageField source="image" label="Ảnh" />
            <AddToMenuButton />
        </Datagrid>
    </List>
);
