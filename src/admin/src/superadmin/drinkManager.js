import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ImageInput,
  ImageField,
  ArrayInput,
  SimpleFormIterator,
  Edit
} from 'react-admin';

export const DrinkList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Tên đồ uống" />
      <TextField source="description" label="Mô tả" />
      <NumberField source="price" label="Giá cơ bản (Size S)" />
      <ImageField source="image" label="Ảnh" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

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
    </SimpleForm>
  </Create>
);

export const DrinkEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" multiline />
      <NumberInput source="price" />
      <TextInput source="category" />

      <ImageInput source="image" label="Ảnh" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>

      <ArrayInput source="sizes">
        <SimpleFormIterator>
          <TextInput source="size" />
          <NumberInput source="extraPrice" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
