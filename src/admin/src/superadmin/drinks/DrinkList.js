import { List, Datagrid, TextField, NumberField, ImageField, EditButton, DeleteButton } from 'react-admin';

export const DrinkList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Tên đồ uống" />
      <TextField source="description" label="Mô tả" />
      <NumberField source="price" label="Giá cơ bản (Size S)" />
      <ImageField source="image" label="Ảnh" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);