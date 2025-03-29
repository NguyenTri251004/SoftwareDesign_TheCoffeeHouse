import { List, Datagrid, TextField, NumberField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, NumberInput, Create } from 'react-admin';

export const ToppingList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên topping" />
            <NumberField source="price" label="Giá" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const ToppingCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên topping" />
            <NumberInput source="price" label="Giá" />
        </SimpleForm>
    </Create>
);

export const ToppingEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <NumberInput source="price" />
        </SimpleForm>
    </Edit>
);
