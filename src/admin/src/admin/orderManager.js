import { List, Datagrid, TextField, NumberField, DateField, Show, SimpleShowLayout,
    Edit, SimpleForm, SelectInput, TextInput, ShowButton, EditButton, FunctionField, useRecordContext} from 'react-admin';

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
  
export const OrderList = (props) => (
    <List {...props} title="Quản lý đơn hàng" sort={{ field: 'createdAt', order: 'DESC' }}>
        <Datagrid rowClick="show">
            <TextField source="id" label="Mã đơn" />
            <TextField source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextField source="phone" label="SĐT" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <TextField source="status" label="Trạng thái" />
            <TextField source="refundStatus" label="Hoàn tiền" />
            <DateField source="createdAt" label="Ngày tạo" showTime />
            <ShowButton />
            <EditButton />
        </Datagrid>
    </List>
);
  
export const OrderShow = (props) => (
    <Show {...props} title="Chi tiết đơn hàng">
        <SimpleShowLayout>
            <TextField source="id" label="Mã đơn hàng" />
            <TextField source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextField source="phone" label="SĐT" />
            <NumberField source="totalAmount" label="Tổng thanh toán" />
            <TextField source="status" label="Trạng thái" />
            <TextField source="refundStatus" label="Hoàn tiền" />
            <DateField source="createdAt" label="Ngày tạo" showTime />
  
            <FunctionField
                label="Chi tiết sản phẩm"
                render={record => (
                    <ul>
                        {record.items.map((item, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                <strong>Sản phẩm:</strong> {item.productName || item.productId}<br />
                                <strong>Size:</strong> {item.size}<br />
                                <strong>Số lượng:</strong> {item.quantity}<br />
                                <strong>Đơn giá:</strong> {item.unitPrice.toLocaleString()}đ<br />
                                <strong>Tổng:</strong> {item.totalPrice.toLocaleString()}đ<br />
                                {item.toppings?.length > 0 && (
                                    <span>
                                        <strong>Toppings:</strong>
                                        <ul>
                                            {item.toppings.map((top, i) => (
                                                <li key={i}>
                                                    - {top.toppingName || top.toppingId} x{top.quantity}
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
  
export const OrderEdit = (props) => (
    <Edit {...props} title="Cập nhật đơn hàng">
        <SimpleForm>
            <TextField source="id" label="Mã đơn hàng" />
            <TextField source="deliveryAddress" label="Địa chỉ giao hàng" />
            <TextField source="phone" label="SĐT" />
            <NumberField source="totalAmount" label="Tổng tiền" />
            <SelectInput source="status" label="Trạng thái" choices={statusChoices} />
            <SelectInput source="refundStatus" label="Hoàn tiền" choices={refundChoices} />
        </SimpleForm>
    </Edit>
);
  