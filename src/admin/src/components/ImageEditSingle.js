import { Box, Button, TextField } from '@mui/material';
import { useInput, useRecordContext } from 'react-admin';
import { useEffect, useState } from 'react';

const ImageEditSingle = ({ source = 'image', label = 'Ảnh' }) => {
    const record = useRecordContext();
    const initialImage = typeof record?.[source] === 'string' ? record[source] : '';
    const [imageSrc, setImageSrc] = useState(initialImage);

    const { field } = useInput({ source });

    useEffect(() => {
        field.onChange(imageSrc);
    }, [imageSrc]);

    const handleUrlChange = (e) => {
        const val = e.target.value;
        setImageSrc(val);
    };

    const handleFileChange = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <TextField
                label={label}
                value={imageSrc}
                onChange={handleUrlChange}
                placeholder="Dán URL hoặc chọn ảnh từ máy"
                fullWidth
            />
            <Button variant="outlined" component="label">
                Chọn từ máy
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                />
            </Button>
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="preview"
                    style={{
                        maxWidth: '120px',
                        maxHeight: '120px',
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #ccc',
                        marginTop: '8px'
                    }}
                />
            )}
        </Box>
    );
};

export default ImageEditSingle;
