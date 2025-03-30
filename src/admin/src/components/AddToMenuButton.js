import { useRecordContext, useNotify, useDataProvider } from 'react-admin';
import { Button } from '@mui/material';

export const AddToMenuButton = ({ src, shopId, getStock }) => {
    const record = useRecordContext();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const handleAdd = async () => {
        try {
            const key = src === 'toppings' ? 'toppingId' : 'productId';
            const stock = getStock ? getStock(record) : 0;

            await dataProvider.customMethod(`shop/${shopId}/${src}`, {
                method: 'POST',
                body: {
                    [key]: record.id,
                    stock,
                },
            });

            notify('Đã thêm vào menu chi nhánh', { type: 'success' });
        } catch (err) {
            notify('Thêm thất bại', { type: 'error' });
        }
    };

    return <Button onClick={handleAdd}>+ Thêm</Button>;
};
