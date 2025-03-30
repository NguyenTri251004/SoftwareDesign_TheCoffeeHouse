import { List, Datagrid, TextField, NumberField, FunctionField, Button, ListContextProvider, ImageField,
  useDataProvider, useNotify, useListContext } from 'react-admin';
import MuiTextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddToMenuButton } from '../components/AddToMenuButton';

export const ProductManager = ({ shopId }) => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const [shopProducts, setShopProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        dataProvider.getOne('shop', { id: shopId })
            .then((res) => setShopProducts(res.data.products || []))
            .catch(() => notify("Không lấy được danh sách products của shop", { type: 'error' }));

        dataProvider.getList('product', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' },
            filter: {}
        })
            .then((res) => setAllProducts(res.data))
            .catch(() => notify("Không lấy được danh sách products", { type: 'error' }));

  }, [shopId]);

    const productMap = Object.fromEntries(allProducts.map(t => [t.id, t]));
    const enrichedProducts = shopProducts.map(t => ({
        ...t,
        id: t.id, 
        name: productMap[t.id]?.name || 'Không tìm thấy',
        price: productMap[t.id]?.price || 0,
        image: productMap[t.id]?.image || "",
        categoryName: productMap[t.id]?.categoryName || "",
    }));
    const sortedProducts = [...enrichedProducts].sort((a, b) =>
        a.categoryName?.localeCompare(b.categoryName)
    );
    
    return (
        <Box p={2}>
            <Box mt={4}>
                <Button variant="contained" onClick={() => navigate('/product-choose')}>
                    Thêm sản phẩm
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>Sản phẩm hiện có</Typography>
  
            <ListContextProvider value={{
                data: sortedProducts,
                total: sortedProducts.length,
                isLoading: false,
                resource: "product"
            }}>
                <Datagrid bulkActionButtons={false}>
                    <ImageField source="image" label="Ảnh"/>
                    <TextField source="name" label="Tên product" />
                    <TextField source="categoryName" label="Danh mục" />
                    <NumberField source="price" label="Giá" />
                    <NumberField source="stock" label="Số lượng tồn" />
                    
                </Datagrid>
                </ListContextProvider>
  
            
        </Box>
    );
}

export const ProductChoose = ({ shopId }) => {
    const [stockMap, setStockMap] = useState({});

    const handleStockChange = (id, value) => {
        setStockMap(prev => ({
            ...prev,
            [id]: Number(value)
        }));
    };

    return (
        <List title="Chọn products cho chi nhánh" resource="product" pagination={false}>
            <SortedProductGrid shopId={shopId} stockMap={stockMap} handleStockChange={handleStockChange} />
        </List>
    );
};

const SortedProductGrid = ({ shopId, stockMap, handleStockChange }) => {
    const { data, isLoading } = useListContext();

    if (isLoading) return null;

    const sorted = [...data].sort((a, b) =>
        (a.categoryName || '').localeCompare(b.categoryName || '')
    );

    return (
        <Datagrid bulkActionButtons={false} data={sorted}>
            <ImageField source="image" label="Ảnh" />
            <TextField source="name" label="Tên product" />
            <TextField source="categoryName" label="Danh mục" />
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
                        src="products"
                        shopId={shopId}
                        getStock={(r) => stockMap[r.id] || 0}
                    />
                )}
            />
        </Datagrid>
    );
};