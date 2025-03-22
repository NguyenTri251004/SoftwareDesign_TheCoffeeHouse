import { Edit, SimpleForm, TextInput } from 'react-admin';

export const AdminEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" label="Admin ID" disabled />
      <TextInput source="shopId" label="Shop ID" />
    </SimpleForm>
  </Edit>
);