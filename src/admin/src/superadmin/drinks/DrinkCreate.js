import { Create, SimpleForm, TextInput, NumberInput, ImageInput, ImageField, ArrayInput, SimpleFormIterator } from 'react-admin';

export const DrinkCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" label="Tên đồ uống" />
      <TextInput source="description" label="Mô tả" multiline />
      <NumberInput source="price" label="Giá cơ bản (Size S)" />
      <TextInput source="category" label="ID Danh mục (tạm text)" />

      <ImageInput source="image" label="Ảnh" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>

      <ArrayInput source="sizes" label="Kích cỡ & giá thêm">
        <SimpleFormIterator>
          <TextInput source="size" label="Size (S/M/L)" />
          <NumberInput source="extraPrice" label="Giá thêm" />
        </SimpleFormIterator>
      </ArrayInput>

      <NumberInput source="stock" label="Số lượng tồn kho" />
    </SimpleForm>
  </Create>
);