import {
    List,
    Datagrid,
    TextField,
    NumberField,
    ImageField
  } from 'react-admin';
  import { AddToMenuButton } from '../components/AddToMenuButton';
  
  export const DrinkChoose = ({ shopId }) => (
    <List title="Chọn đồ uống cho chi nhánh" resource="products">
      <Datagrid>
        <TextField source="name" label="Tên đồ uống" />
        <NumberField source="price" label="Giá Size S" />
        <ImageField source="image" label="Ảnh" />
        <AddToMenuButton src={"products"} shopId={shopId} />
      </Datagrid>
    </List>
  );
  