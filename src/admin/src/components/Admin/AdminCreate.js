import { Create, SimpleForm, TextInput } from 'react-admin';

export const AdminCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" label="Admin ID" />
      <TextInput source="shopId" label="Shop ID" />
    </SimpleForm>
  </Create>
);
