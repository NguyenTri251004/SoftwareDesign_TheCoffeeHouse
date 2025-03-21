import { Edit, SimpleForm, TextInput, NumberInput, ImageInput, ImageField, ArrayInput, SimpleFormIterator } from 'react-admin';

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

      <NumberInput source="stock" />
    </SimpleForm>
  </Edit>
);