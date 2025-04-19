import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    SelectField,
    Show,
    SimpleShowLayout,
    Edit,
    SimpleForm,
    SelectInput,
    TextInput,
    ShowButton,
    EditButton,
    FunctionField,
    ReferenceField,
    useRecordContext
} from 'react-admin';

const statusChoices = [
    { id: 'Pending', name: 'Chờ xác nhận' },
    { id: 'Confirmed', name: 'Đã xác nhận' },
    { id: 'Preparing', name: 'Đang chuẩn bị' },
    { id: 'Delivered', name: 'Đã giao' },
    { id: 'Cancelled', name: 'Đã hủy' },
];

const refundChoices = [
    { id: 'None', name: 'Không hoàn' },
    { id: 'Partial', name: 'Hoàn một phần' },
    { id: 'Full', name: 'Hoàn toàn bộ' },
];

// LIST
export const OrderList = (props) => {
    const rawShopId = localStorage.getItem("shopId");
    const shopId = rawShopId && rawShopId !== "null" ? rawShopId : "67e832a5d0be3d6ab71556a1";

    return (
    <List {...props} title="Quản lý đơn hàng" filter={{ shopId }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="Mã đơn" />
            <ReferenceField source="shopId" reference="shop" label="Cửa hàng" link={false}>
                <TextField source="name" />
            </ReferenceField>
            <TextField source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextField source="phone" label="SĐT" />
            <NumberField source="finalAmount" label="Thành tiền" />
            <SelectField source="status" label="Trạng thái"  choices={statusChoices} />
            <SelectField source="refundStatus" label="Hoàn tiền"  choices={refundChoices} />
            <DateField source="createdAt" label="Ngày tạo" showTime />
            <ShowButton />
            <EditButton />
        </Datagrid>
    </List>
    );
};

// SHOW
export const OrderShow = (props) => (
    <Show {...props} title="Chi tiết đơn hàng">
        <SimpleShowLayout>
            <TextField source="id" label="Mã đơn hàng" />
            <ReferenceField source="shopId" reference="shop" label="Cửa hàng" link={false}>
                <TextField source="name" />
            </ReferenceField>
            <TextField source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextField source="phone" label="SĐT" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <NumberField source="shippingFee" label="Phí ship" />
            <NumberField source="discount" label="Giảm giá" />
            <NumberField source="finalAmount" label="Thành tiền" />
            <TextField source="status" label="Trạng thái" />
            <TextField source="refundStatus" label="Hoàn tiền" />
            <DateField source="createdAt" label="Ngày tạo" showTime />

            <FunctionField
                label="Sản phẩm"
                render={record => (
                    <ul>
                        {record.products.map((item, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <strong>Sản phẩm:</strong>{' '}
                                <ReferenceField
                                    source="productId"
                                    record={item}
                                    reference="product"
                                    link={false}
                                    label=""
                                >
                                    <TextField source="name" />
                                </ReferenceField>
                                <br />
                                <strong>Size:</strong> {item.size}<br />
                                <strong>Số lượng:</strong> {item.amount}<br />
                                <strong>Đơn giá:</strong> {item.unitPrice.toLocaleString()}đ<br />
                                <strong>Tổng:</strong> {item.totalPrice.toLocaleString()}đ<br />
                                {item.topping?.length > 0 && (
                                    <span>
                                        <strong>Toppings:</strong>
                                        <ul>
                                            {item.topping.map((topId, i) => (
                                                <li key={i}>
                                                    <ReferenceField
                                                        source="toppingId"
                                                        record={topId}
                                                        reference="topping"
                                                        link={false}
                                                        label=""
                                                    >
                                                        <TextField source="name" />
                                                    </ReferenceField>
                                                </li>
                                            ))}
                                        </ul>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            />
        </SimpleShowLayout>
    </Show>
);

// EDIT
export const OrderEdit = (props) => (
    <Edit {...props} title="Cập nhật đơn hàng">
        <SimpleForm>
            <TextField source="id" label="Mã đơn hàng" />
            <TextInput source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextInput source="phone" label="SĐT" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <NumberField source="shippingFee" label="Phí ship" />
            <NumberField source="discount" label="Giảm giá" />
            <NumberField source="finalAmount" label="Thành tiền" />
            <SelectInput source="status" label="Trạng thái" choices={statusChoices} />
            <SelectInput source="refundStatus" label="Hoàn tiền" choices={refundChoices} />
        </SimpleForm>
    </Edit>
);
