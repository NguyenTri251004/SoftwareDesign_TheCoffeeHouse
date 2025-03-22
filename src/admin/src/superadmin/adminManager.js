import { Create, SimpleForm, TextInput, List, Datagrid, TextField, EditButton, DeleteButton, Edit } from 'react-admin';

export const AdminCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" label="Admin ID" />
      <TextInput source="shopId" label="Shop ID" />
    </SimpleForm>
  </Create>
);

export const AdminEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" label="Admin ID" disabled />
      <TextInput source="shopId" label="Shop ID" />
    </SimpleForm>
  </Edit>
);

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