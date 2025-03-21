import { 
    List, 
    Datagrid, 
    TextField, 
    ArrayField, 
    SingleFieldList, 
    ImageField, 
    Pagination, 
    Create, 
    Edit, 
    SimpleForm, 
    TextInput, 
    BooleanInput, 
    ArrayInput, 
    SimpleFormIterator,
    EditButton,
    DeleteButton,
    required
} from 'react-admin';

const ShopPagination = (props) => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50]} {...props} />
);

export const ShopList = (props) => (
    <List {...props} perPage={5} pagination={<ShopPagination />}>
        <Datagrid>
            <TextField source="name" label="Tên cửa hàng" />
            <TextField source="address.detail" label="Địa chỉ chi tiết" />
            <TextField source="phone" label="Số điện thoại" />
            <ArrayField source="images" label="Hình ảnh">
                <SingleFieldList>
                    <ImageField source="" sx={{ '& img': { maxWidth: 100, maxHeight: 100 } }} />
                </SingleFieldList>
            </ArrayField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const ShopCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên cửa hàng" validate={required()} />
            <TextInput source="address.detail" label="Địa chỉ chi tiết" validate={required()} />
            <TextInput source="address.district" label="Quận/Huyện" validate={required()} />
            <TextInput source="address.city" label="Thành phố" validate={required()} />
            <TextInput source="phone" label="Số điện thoại" />
            <ArrayInput source="images" label="Hình ảnh">
                <SimpleFormIterator>
                    <TextInput label="URL hình ảnh" />
                </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="products" label="Sản phẩm">
                <SimpleFormIterator>
                    <TextInput label="Tên sản phẩm" source="name" />
                </SimpleFormIterator>
            </ArrayInput>
            <TextInput source="openingHours.open" label="Giờ mở cửa" validate={required()} />
            <TextInput source="openingHours.close" label="Giờ đóng cửa" validate={required()} />
            <BooleanInput source="carParking" label="Có chỗ đỗ xe" />
            <BooleanInput source="takeAway" label="Mang đi" />
            <BooleanInput source="service" label="Dịch vụ" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Create>
);

export const ShopEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Tên cửa hàng" validate={required()} />
            <TextInput source="address.detail" label="Địa chỉ chi tiết" validate={required()} />
            <TextInput source="address.district" label="Quận/Huyện" validate={required()} />
            <TextInput source="address.city" label="Thành phố" validate={required()} />
            <TextInput source="phone" label="Số điện thoại" />
            <ArrayInput source="images" label="Hình ảnh">
                <SimpleFormIterator>
                    <TextInput label="URL hình ảnh" />
                </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="products" label="Sản phẩm">
                <SimpleFormIterator>
                    <TextInput label="Tên sản phẩm" source="name" />
                </SimpleFormIterator>
            </ArrayInput>
            <TextInput source="openingHours.open" label="Giờ mở cửa" validate={required()} />
            <TextInput source="openingHours.close" label="Giờ đóng cửa" validate={required()} />
            <BooleanInput source="carParking" label="Có chỗ đỗ xe" />
            <BooleanInput source="takeAway" label="Mang đi" />
            <BooleanInput source="service" label="Dịch vụ" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Edit>
);