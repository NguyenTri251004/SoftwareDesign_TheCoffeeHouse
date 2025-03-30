import {
    List,
    Datagrid,
    TextField,
    NumberField,
    ImageField
  } from 'react-admin';
  import { AddToMenuButton } from '../components/AddToMenuButton';
  
  export const ToppingChoose = ({ shopId }) => (
    <List title="Chọn toppings cho chi nhánh" resource="topping">
      <Datagrid>
        <TextField source="name" label="Tên toppings" />
        <NumberField source="price" label="Giá" />
        <AddToMenuButton src={"toppings"} shopId={shopId} />
      </Datagrid>
    </List>
  );
  