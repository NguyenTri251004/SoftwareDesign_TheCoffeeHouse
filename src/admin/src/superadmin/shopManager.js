import { List, Datagrid, TextField, Pagination, Create, Edit, SimpleForm, TextInput, BooleanInput, ArrayInput, 
    SimpleFormIterator, EditButton, DeleteButton, required } from 'react-admin';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import ImageInputWithPreview from '../components/ImageInputWithPreview'; 
import ImageEditArray from '../components/ImageEditArray';
import TimePickerInput from '../components/TimePickerInput';
import AddressPicker from '../components/AddressPicker';

const ShopPagination = (props) => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50]} {...props} />
);

const ImageInputArray = () => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'images',
    });

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {fields.map((field, index) => (
                <Box key={field.id}>
                    <ImageInputWithPreview source={`images.${index}`} />
                    <Button onClick={() => remove(index)} color="error"> Xoá ảnh </Button>
                </Box>
            ))}
            <Button variant="outlined" onClick={() => append({ src: '' })}> + Thêm ảnh </Button>
        </Box>
    );
};

export const ShopList = (props) => (
    <List {...props} perPage={5} pagination={<ShopPagination />}>
        <Datagrid rowClick="show">
            <TextField source="name" label="Tên cửa hàng" />
            <TextField source="address.detail" label="Địa chỉ chi tiết" />
            <TextField source="address.district" label="Quận/Huyện" />
            <TextField source="address.city" label="Tỉnh/Thành phố" />
            <TextField source="phone" label="Số điện thoại" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);


export const ShopCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên cửa hàng" validate={required()} />
            <AddressPicker />
            <TextInput source="address.detail" label="Địa chỉ chi tiết" validate={required()} /> 
            <TextInput source="phone" label="Số điện thoại" />
            <ImageInputArray />
            <TimePickerInput source="openingHours.open" label="Giờ mở cửa" />
            <TimePickerInput source="openingHours.close" label="Giờ đóng cửa" />
            <BooleanInput source="carParking" label="Có chỗ đỗ xe" />
            <BooleanInput source="takeAway" label="Mang đi" />
            <BooleanInput source="service" label="Phục vụ tại quán" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Create>
);

export const ShopEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên cửa hàng" validate={required()} />
            <AddressPicker />
            <TextInput source="address.detail" label="Địa chỉ chi tiết" validate={required()} />
            <TextInput source="phone" label="Số điện thoại" />
            <ImageEditArray />
            <ArrayInput source="products" label="Sản phẩm">
                <SimpleFormIterator>
                    <TextInput label="Tên sản phẩm" source="name" />
                </SimpleFormIterator>
            </ArrayInput>
            <TimePickerInput source="openingHours.open" label="Giờ mở cửa" />
            <TimePickerInput source="openingHours.close" label="Giờ đóng cửa" />
            <BooleanInput source="carParking" label="Có chỗ đỗ xe" />
            <BooleanInput source="takeAway" label="Mang đi" />
            <BooleanInput source="service" label="Phục vụ tại quán" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Edit>
);