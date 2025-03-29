import { useDataProvider, Create, Edit, SimpleForm, TextInput, SelectInput, List, Datagrid, TextField, ReferenceField, EditButton, DeleteButton, required } from 'react-admin';
import { useEffect, useState } from 'react';

export const CategoryCreate = (props) => {
    const dataProvider = useDataProvider();
    const [parentChoices, setParentChoices] = useState([]);

    useEffect(() => {
        dataProvider
            .customMethod('category/parent', { method: 'GET' })
            .then(({ data }) => setParentChoices(data))
            .catch(err => console.error('Lỗi khi fetch danh mục cha:', err));
    }, [dataProvider]);

    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name" label="Tên danh mục" validate={required()} />
                <SelectInput
                    source="parentId"
                    label="Danh mục cha"
                    choices={parentChoices}
                    allowEmpty
                />
            </SimpleForm>
        </Create>
    );
};

export const CategoryEdit = (props) => {
    const dataProvider = useDataProvider();
    const [parentChoices, setParentChoices] = useState([]);

    useEffect(() => {
        dataProvider
            .customMethod('category/parent', { method: 'GET' })
            .then(({ data }) => setParentChoices(data))
            .catch(err => console.error('Lỗi khi fetch danh mục cha:', err));
    }, [dataProvider]);

    return (
        <Edit {...props}>
            <SimpleForm>
                <TextInput source="name" label="Tên danh mục" validate={required()} />
                <SelectInput
                    source="parentId"
                    label="Danh mục cha"
                    choices={parentChoices}
                    allowEmpty
                />
            </SimpleForm>
        </Edit>
    );
};


export const CategoryList = (props) => (
    <List {...props} pagination={false}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên danh mục" render={(record) => (
                <span style={{ paddingLeft: `${(record.level || 0) * 20}px` }}>
                    {record.name}
                </span>
            )} />
            <ReferenceField source="parentId" reference="category" label="Danh mục cha" link={false}>
                <TextField source="name" />
            </ReferenceField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

