import { List, Datagrid, TextField, NumberField, FunctionField, Button, ListContextProvider,
    useDataProvider, useNotify } from 'react-admin';
import MuiTextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddToMenuButton } from '../components/AddToMenuButton';

export const ToppingManager = ({ shopId }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [shopToppings, setShopToppings] = useState([]);
    const [allToppings, setAllToppings] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        dataProvider.getOne('shop', { id: shopId })
            .then((res) => setShopToppings(res.data.toppings || []))
            .catch(() => notify("Không lấy được danh sách toppings của shop", { type: 'error' }));

        dataProvider.getList('topping', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' },
            filter: {}
        })
            .then((res) => setAllToppings(res.data))
            .catch(() => notify("Không lấy được danh sách toppings", { type: 'error' }));

    }, [shopId]);

    const toppingMap = Object.fromEntries(allToppings.map(t => [t.id, t]));
    const enrichedToppings = shopToppings.map(t => ({
        ...t,
        id: t.id, 
        name: toppingMap[t.id]?.name || 'Không tìm thấy',
        price: toppingMap[t.id]?.price || 0,
    }));

    return (
        <Box p={2}>
            <Box mt={4}>
                <Button variant="contained" onClick={() => navigate('/topping-choose')}>
                    Thêm topping
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>Toppings hiện có</Typography>
    
            <ListContextProvider value={{
                data: enrichedToppings,
                total: enrichedToppings.length,
                isLoading: false,
                resource: "topping"
            }}>
                <Datagrid bulkActionButtons={false}>
                    <TextField source="name" label="Tên topping" />
                    <NumberField source="price" label="Giá" />
                    <NumberField source="stock" label="Số lượng tồn" />
                </Datagrid>
                </ListContextProvider>
    
            
        </Box>
    );
}
  
export const ToppingChoose = ({ shopId }) => {
    const [stockMap, setStockMap] = useState({});

    const handleStockChange = (id, value) => {
        setStockMap(prev => ({
            ...prev,
            [id]: Number(value)
        }));
    };

    return (
        <List title="Chọn toppings cho chi nhánh" resource="topping">
            <Datagrid bulkActionButtons={false}>
                <TextField source="name" label="Tên topping" />
                <NumberField source="price" label="Giá" />
    
                <FunctionField label="Số lượng"
                    render={record => (
                        <MuiTextField
                            size="small"
                            type="number"
                            label="Số lượng"
                            value={stockMap[record.id] ?? ''}
                            onChange={(e) => handleStockChange(record.id, e.target.value)}
                        />
                    )}
                />
    
                <FunctionField
                    render={record => (
                        <AddToMenuButton
                            src="toppings"
                            shopId={shopId}
                            getStock={(r) => stockMap[r.id] || 0}
                        />
                    )}
                />
            </Datagrid>
        </List>
    );
};