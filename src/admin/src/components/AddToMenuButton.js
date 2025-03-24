import { useRecordContext } from 'react-admin';
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const AddToMenuButton = () => {
    const record = useRecordContext();
    if (!record) return null;

    const handleClick = () => {
        alert(`Đã chọn: ${record.name}`);
    };

    return (
        <Button size="small" onClick={handleClick} startIcon={<AddCircleIcon />} variant="outlined" >
            Chọn 
        </Button>
    );
};
