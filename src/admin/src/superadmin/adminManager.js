import { Create, SimpleForm, TextInput, List, Datagrid, TextField, EditButton, 
  DeleteButton, Edit, ReferenceInput, ReferenceField, SelectInput, required } from 'react-admin';

export const AdminCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="email" label="Email" validate={required()} />
        </SimpleForm>
    </Create>
);

export const AdminEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" label="Admin ID" disabled />
            <TextInput source="username" label="Tên đăng nhập" />
            <TextInput source="email" label="Email" />
            <TextInput source="avatar" label="Avatar URL" />
            <ReferenceInput source="shopId" reference="shop" label="Chi nhánh">
                <SelectInput optionText="name" optionValue="_id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const AdminList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" label="Admin ID" />
            <TextField source="username" label="Tài khoản" />
            <TextField source="email" label="Email" />

            <ReferenceField source="shopId" reference="shop" label="Chi nhánh" link={false}>
                <TextField source="name" />
            </ReferenceField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
