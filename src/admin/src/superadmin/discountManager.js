import { List, Datagrid, TextField, NumberField, BooleanField, DateField, DeleteButton, Edit, ReferenceInput, SelectInput,
    Create, SimpleForm, TextInput, NumberInput, BooleanInput, DateTimeInput, useGetList } from 'react-admin';
import { useMemo } from 'react';  

export const DiscountList = (props) => (
    <List {...props} title="Danh sách mã giảm giá">
        <Datagrid rowClick="edit" bulkActionButtons={false}>
            <TextField source="code" label="Mã giảm giá" />
            <TextField source="description" label="Mô tả" />
            <BooleanField source="isPercentage" label="Theo %" />
            <NumberField source="discountAmount" label="Giá trị giảm" />
            <BooleanField source="freeShip" label="Free Ship" />
            <NumberField source="minOrderValue" label="Đơn tối thiểu" />
            <NumberField source="maxUsage" label="Giới hạn dùng" />
            <NumberField source="usedCount" label="Đã dùng" />
            <BooleanField source="isActive" label="Kích hoạt" />
            <DateField source="expiryDate" label="Hết hạn" showTime />
        
        </Datagrid>
    </List>
);
  
export const DiscountCreate = (props) => {
    const { data: shops = [], isLoading } = useGetList('shop');
  
    const shopChoices = useMemo(() => [
        { id: null, name: 'Toàn hệ thống' },
        ...shops
    ], [shops]);
  
    return (
        <Create {...props} title="Tạo mã giảm giá mới"
            transform={(data) => ({
                ...data,
                shopId: data.shopId === 'null' ? null : data.shopId
            })}
        >
            <SimpleForm>
                <SelectInput source="shopId" label="Chọn chi nhánh áp dụng" choices={shopChoices}
                    optionText="name" optionValue="id" isLoading={isLoading} />
                <TextInput source="code" label="Mã giảm giá" />
                <BooleanInput source="isPercentage" label="Giảm theo %" />
                <NumberInput source="discountAmount" label="Giá trị giảm" />
                <BooleanInput source="freeShip" label="Free Ship" />
                <NumberInput source="minOrderValue" label="Đơn tối thiểu để áp dụng" />
                <DateTimeInput source="expiryDate" label="Ngày hết hạn" />
                <NumberInput source="maxUsage" label="Số lần tối đa" />
                <BooleanInput source="isActive" label="Kích hoạt" defaultValue={true} />
            </SimpleForm>
        </Create>
    );
};
  
export const DiscountEdit = (props) => {
    const { data: shops = [], isLoading } = useGetList('shop');

    const shopChoices = useMemo(() => [
        { id: '', name: 'Toàn hệ thống' },
        ...shops
    ], [shops]);

    return (
        <Edit
            {...props}
            title="Cập nhật mã giảm giá"
            transform={(data) => ({
                ...data,
                shopId: data.shopId === '' ? null : data.shopId
            })}
        >
            <SimpleForm>
                <SelectInput
                    source="shopId"
                    label="Chọn chi nhánh áp dụng"
                    choices={shopChoices}
                    optionText="name"
                    optionValue="id"
                    isLoading={isLoading}
                />
                <TextInput source="code" label="Mã giảm giá" />
                <BooleanInput source="isPercentage" label="Giảm theo %" />
                <NumberInput source="discountAmount" label="Giá trị giảm" />
                <BooleanInput source="freeShip" label="Free Ship" />
                <NumberInput source="minOrderValue" label="Đơn tối thiểu để áp dụng" />
                <DateTimeInput source="expiryDate" label="Ngày hết hạn" />
                <NumberInput source="maxUsage" label="Số lần tối đa" />
                <NumberInput source="usedCount" label="Đã dùng" />
                <BooleanInput source="isActive" label="Kích hoạt" />
            </SimpleForm>
        </Edit>
    );
};