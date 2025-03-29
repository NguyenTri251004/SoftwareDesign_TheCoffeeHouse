import { List, Datagrid, TextField, NumberField, EditButton, DeleteButton, Create, SimpleForm,
    TextInput, NumberInput, ImageField, ArrayInput, SimpleFormIterator, Edit, SelectInput,
    useNotify, useDataProvider, useEditController} from 'react-admin';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ImageInputWithPreview from '../components/ImageInputWithPreview'; 
import ImageEditSingle from '../components/ImageEditSingle';


export const DrinkList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên đồ uống" />
            <TextField source="categoryName" label="Danh mục"  sortable={true} />
            <NumberField source="price" label="Giá cơ bản (Size S)" />
            <ImageField source="image" label="Ảnh" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const DrinkCreate = (props) => {
    const dataProvider = useDataProvider();
    const [childCategories, setChildCategories] = useState([]);
    const notify = useNotify();

    useEffect(() => {
        dataProvider
            .customMethod('category/children', { method: 'GET' })
            .then((res) => setChildCategories(res.data || []))
            .catch(() => notify('Lỗi khi tải danh mục', { type: 'error' }));
    }, []);

    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name" label="Tên đồ uống" />
                <TextInput source="description" label="Mô tả" multiline />
                <NumberInput source="price" label="Giá cơ bản (Size S)" />

                <SelectInput source="category" label="Danh mục" choices={childCategories}
                    optionText="name" optionValue="_id" emptyText="Chọn danh mục"
                />

                <Box display="flex" flexDirection="column" gap={2}>
                    <ImageInputWithPreview source="image" />
                </Box>

                <ArrayInput source="sizes" label="Kích cỡ & giá thêm">
                    <SimpleFormIterator>
                        <TextInput source="size" label="Size (S/M/L)" />
                        <NumberInput source="extraPrice" label="Giá thêm" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    );
};


export const DrinkEdit = (props) => {
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const controller = useEditController(props);
    const { record, isLoading } = controller;

    const [childCategories, setChildCategories] = useState([]);

    useEffect(() => {
        if (!record) return;

        const currentCategory = record.category;
        const currentCategoryId = currentCategory?._id;

        dataProvider
            .customMethod('category/children', { method: 'GET' })
            .then((res) => {
                let categories = res.data || [];

                const found = categories.find((c) => c._id === currentCategoryId);
                if (!found && currentCategory?.name) {
                    categories.push({
                        _id: currentCategoryId,
                        name: currentCategory.name,
                    });
                }
                setChildCategories(categories);
            })
            .catch(() => notify('Lỗi khi tải danh mục', { type: 'error' }));
    }, [record]);

    if (isLoading || !record) return null;

    return (
        <Edit {...props} {...controller}>
            <SimpleForm
                defaultValues={{
                    ...record,
                    category: record.category?._id || '', 
                    image: record.image ? { src: record.image } : '',
                }}
            >
                <TextInput source="name" label="Tên đồ uống" />
                <TextInput source="description" label="Mô tả" multiline />
                <NumberInput source="price" label="Giá cơ bản (Size S)" />

                <SelectInput source="category" label="Danh mục" choices={childCategories}
                    optionText="name" optionValue="_id" emptyText="Chọn danh mục"
                />

                <ImageEditSingle source="image" label="Ảnh" />

                <ArrayInput source="sizes" label="Kích cỡ & giá thêm">
                    <SimpleFormIterator>
                        <TextInput source="size" label="Size (S/M/L)" />
                        <NumberInput source="extraPrice" label="Giá thêm" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

