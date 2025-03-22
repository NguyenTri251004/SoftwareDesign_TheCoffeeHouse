import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin';

export const AdminList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" label="Admin ID" />
      <TextField source="shopId" label="Shop ID" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);