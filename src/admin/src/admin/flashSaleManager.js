import {
    List,
    Datagrid,
    TextField,
    DateField,
    Show,
    SimpleShowLayout,
    ArrayField,
    NumberField,
    Create,
    Edit,
    SimpleForm,
    DateTimeInput,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    SelectInput,
    NumberInput,
    ShowButton,
    EditButton,
    SelectField,
    TextInput
  } from 'react-admin';
  
  const statusChoices = [
    { id: 'Upcoming', name: 'Sắp diễn ra' },
    { id: 'Active', name: 'Đang diễn ra' },
    { id: 'Ended', name: 'Đã kết thúc' },
  ];
  
  export const FlashSaleList = (props) => (
    <List {...props} title="Flash Sale">
      <Datagrid rowClick="show">
        <TextField source="id" label="Mã Flash Sale" />
        <DateField source="startTime" label="Bắt đầu" showTime />
        <DateField source="endTime" label="Kết thúc" showTime />
        <SelectField source="status" label="Trạng thái" choices={statusChoices} />
        <DateField source="createdAt" label="Ngày tạo" showTime />
        <ShowButton />
        <EditButton />
      </Datagrid>
    </List>
  );
  
  export const FlashSaleShow = (props) => (
    <Show {...props} title="Chi tiết Flash Sale">
      <SimpleShowLayout>
        <TextField source="id" label="Mã Flash Sale" />
        <DateField source="startTime" label="Bắt đầu" showTime />
        <DateField source="endTime" label="Kết thúc" showTime />
        <SelectField source="status" label="Trạng thái" choices={statusChoices} />
        <DateField source="createdAt" label="Ngày tạo" showTime />
  
        <ArrayField source="products" label="Sản phẩm khuyến mãi">
          <Datagrid>
            <TextField source="productId" label="Mã sản phẩm" />
            <NumberField source="discountPercentage" label="% Giảm giá" />
            <NumberField source="stock" label="Tồn kho" />
            <NumberField source="maxQuantityPerCustomer" label="Giới hạn / KH" />
          </Datagrid>
        </ArrayField>
      </SimpleShowLayout>
    </Show>
  );
  
  export const FlashSaleEdit = (props) => (
    <Edit {...props} title="Cập nhật Flash Sale">
      <SimpleForm>
        <DateTimeInput source="startTime" label="Thời gian bắt đầu" />
        <DateTimeInput source="endTime" label="Thời gian kết thúc" />
        <SelectInput source="status" label="Trạng thái" choices={statusChoices} />
        <ArrayInput source="products" label="Sản phẩm Flash Sale">
          <SimpleFormIterator>
            <TextInput source="productId" label="Mã sản phẩm" />
            <NumberInput source="discountPercentage" label="% Giảm giá" />
            <NumberInput source="stock" label="Tồn kho" />
            <NumberInput source="maxQuantityPerCustomer" label="Tối đa mỗi KH" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
  
  export const FlashSaleCreate = (props) => (
    <Create {...props} title="Tạo Flash Sale mới">
      <SimpleForm>
        <DateTimeInput source="startTime" label="Thời gian bắt đầu" />
        <DateTimeInput source="endTime" label="Thời gian kết thúc" />
        <SelectInput source="status" label="Trạng thái" choices={statusChoices} defaultValue="Upcoming" />
        <ArrayInput source="products" label="Sản phẩm Flash Sale">
          <SimpleFormIterator>
            <TextInput source="productId" label="Mã sản phẩm" />
            <NumberInput source="discountPercentage" label="% Giảm giá" />
            <NumberInput source="stock" label="Tồn kho" />
            <NumberInput source="maxQuantityPerCustomer" label="Tối đa mỗi KH" />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
  