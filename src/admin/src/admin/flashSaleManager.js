import { Show, SimpleShowLayout, ArrayField, NumberField, Create, Edit, SimpleForm, DateTimeInput, ArrayInput, SimpleFormIterator, 
    ReferenceInput, SelectInput, NumberInput, List, Datagrid, TextField, DateField, EditButton, SelectField, ReferenceField } from 'react-admin';
import { Typography, Divider } from '@mui/material';

const statusChoices = [
    { id: 'Upcoming', name: 'Sắp diễn ra' },
    { id: 'Active', name: 'Đang diễn ra' },
    { id: 'Ended', name: 'Đã kết thúc' },
];

export const FlashSaleList = (props) => {
    const rawShopId = localStorage.getItem("shopId");
    const shopId = rawShopId && rawShopId !== "null" ? rawShopId : null;

    return (
        <List {...props} title="Flash Sale" filter={{ shopId }} >
            <Datagrid rowClick="show" bulkActionButtons={false}>
                <DateField source="startTime" label="Thời gian bắt đầu" showTime locales="vi-VN"
                    options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
                />
                <DateField source="endTime" label="Thời gian kết thúc" showTime locales="vi-VN"
                    options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
                />
                <SelectField source="status" label="Trạng thái" choices={statusChoices} />
                <DateField source="createdAt" label="Ngày tạo" showTime locales="vi-VN"
                    options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
                />
        
                <EditButton />
            </Datagrid>
        </List>
    );
};


export const FlashSaleShow = (props) => (
    <Show {...props} title="Chi tiết Flash Sale">
        <SimpleShowLayout
            sx={{
                '& .RaLabeled-label': { fontSize: '1rem', },
                '& .RaLabeled-value': { fontSize: '1.05rem', fontWeight: 500, },
            }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Thông tin Flash Sale</Typography>
            <TextField source="id" label="Mã Flash Sale" />
            <DateField source="startTime" label="Thời gian bắt đầu" showTime locales="vi-VN"
                options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
            />
            <DateField source="endTime" label="Thời gian kết thúc" showTime locales="vi-VN"
                options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
            />
  
            <SelectField source="status" label="Trạng thái" choices={statusChoices} />
            <DateField source="createdAt" label="Ngày tạo" showTime locales="vi-VN"
                options={{ timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
            />
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 1 }}>Danh sách sản phẩm khuyến mãi</Typography>
            <ArrayField source="products">
                <Datagrid bulkActionButtons={false}>
                    <ReferenceField source="productId" reference="product" label="Tên sản phẩm" link={false}>

                        <TextField source="name" />
                    </ReferenceField>
                    <NumberField source="discountPercentage" label="% Giảm giá" />
                    <NumberField source="stock" label="Tồn kho" />
                    <NumberField source="maxQuantityPerCustomer" label="Giới hạn / KH" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);

export const FlashSaleEdit = (props) => {
    const rawShopId = localStorage.getItem("shopId");
    const shopId = rawShopId && rawShopId !== "null" ? rawShopId : null;
  
    return (
        <Edit {...props} title="Cập nhật Flash Sale">
            <SimpleForm>
                <DateTimeInput source="startTime" label="Thời gian bắt đầu" />
                <DateTimeInput source="endTime" label="Thời gian kết thúc" />
                <SelectInput source="status" label="Trạng thái" choices={statusChoices} />
          
                <ArrayInput source="products" label="Sản phẩm Flash Sale">
                    <SimpleFormIterator>
                        <ReferenceInput source="productId" reference="product" label="Chọn sản phẩm" filter={{ shopId }} >
                            <SelectInput optionText="name" optionValue="id" />
                        </ReferenceInput>
                        <NumberInput source="discountPercentage" label="% Giảm giá" />
                        <NumberInput source="stock" label="Tồn kho" />
                        <NumberInput source="maxQuantityPerCustomer" label="Tối đa mỗi KH" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};
  

export const FlashSaleCreate = (props) => {
    const rawShopId = localStorage.getItem("shopId");
    const shopId = rawShopId && rawShopId !== "null" ? rawShopId : null;

    return (
        <Create
            {...props}
            title="Tạo Flash Sale mới"
            transform={(data) => {
                const transformed = { ...data, shopId };
                return transformed;
            }}
        >
            <SimpleForm>
                <DateTimeInput source="startTime" label="Thời gian bắt đầu" />
                <DateTimeInput source="endTime" label="Thời gian kết thúc" />
                <SelectInput source="status" label="Trạng thái" choices={statusChoices} defaultValue="Upcoming" />
                <ArrayInput source="products" label="Sản phẩm Flash Sale">
                    <SimpleFormIterator>
                        <ReferenceInput source="productId" reference="product" label="Chọn sản phẩm" filter={{ shopId }} >
                            <SelectInput optionText="name" optionValue="id" />
                        </ReferenceInput>
                        <NumberInput source="discountPercentage" label="% Giảm giá" />
                        <NumberInput source="stock" label="Tồn kho" />
                        <NumberInput source="maxQuantityPerCustomer" label="Tối đa mỗi KH" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Create>
    );
};

