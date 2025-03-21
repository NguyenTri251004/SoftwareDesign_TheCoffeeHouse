import { List, Datagrid, TextField, BooleanField,  ArrayField, SingleFieldList,  ChipField, ImageField, Pagination } from 'react-admin';

const ShopPagination = (props) => (
    <Pagination rowsPerPageOptions={[5, 10, 25, 50]} {...props} />
);

export const ShopList = (props) => (
    <List 
        {...props} 
        perPage={5}
        pagination={<ShopPagination />}
    >
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên cửa hàng" />
            <TextField source="address.detail" label="Địa chỉ chi tiết" />
            <TextField source="address.district" label="Quận/Huyện" />
            <TextField source="address.city" label="Thành phố" />
            <TextField source="phone" label="Số điện thoại" emptyText="Không có" />
            
            <ArrayField source="images" label="Hình ảnh">
                <SingleFieldList>
                    <ImageField source="" sx={{ '& img': { maxWidth: 100, maxHeight: 100 } }} />
                </SingleFieldList>
            </ArrayField>

            <ArrayField source="products" label="Sản phẩm">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>

            <TextField source="openingHours.open" label="Giờ mở cửa" />
            <TextField source="openingHours.close" label="Giờ đóng cửa" />
            <BooleanField source="carParking" label="Có chỗ đỗ xe" />
            <BooleanField source="takeAway" label="Mang đi" />
            <BooleanField source="service" label="Dịch vụ" />
            <TextField source="description" label="Mô tả" />
        </Datagrid>
    </List>
);