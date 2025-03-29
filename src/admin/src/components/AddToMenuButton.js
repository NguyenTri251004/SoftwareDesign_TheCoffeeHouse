import { useRecordContext, useNotify, useDataProvider } from 'react-admin';
import { Button } from '@mui/material';

export const AddToMenuButton = ({ src, shopId }) => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const handleAdd = async () => {
    try {
      await dataProvider.customMethod(`shop/${shopId}/${src}`, {
        method: 'POST',
        body: {
          productId: record.id,
          stock: 0,
        },
      });

      notify('Đã thêm vào menu chi nhánh', { type: 'success' });
    } catch (err) {
      notify('Thêm thất bại', { type: 'error' });
    }
  };

  return <Button onClick={handleAdd}>+ Thêm</Button>;
};
