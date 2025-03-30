import { useFormContext, useWatch } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { VN_ADDRESS } from './vn-address';

const AddressPicker = () => {
    const { setValue } = useFormContext();
    const city = useWatch({ name: 'address.city' });
    const district = useWatch({ name: 'address.district' });

    const cities = Object.keys(VN_ADDRESS);
    const districts = city ? VN_ADDRESS[city] || [] : [];

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setValue('address.city', selectedCity, { shouldDirty: true });
        setValue('address.district', '', { shouldDirty: true });
    };

    const handleDistrictChange = (e) => {
        setValue('address.district', e.target.value, { shouldDirty: true });
    };

    return (
        <Box display="flex" gap={2} sx={{ flexWrap: 'wrap' }}>
            <TextField
                select
                label="Tỉnh/Thành phố"
                value={city || ''}
                onChange={handleCityChange}
                sx={{ minWidth: 250, flex: 1 }}
            >
                {cities.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
            </TextField>
    
            <TextField
                select
                label="Quận/Huyện"
                value={district || ''}
                onChange={handleDistrictChange}
                sx={{ minWidth: 250, flex: 1 }}
                disabled={!city}
            >
                {districts.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
            </TextField>
        </Box>
    );
    
};

export default AddressPicker;
