import { Box, Button, TextField } from '@mui/material';
import { useInput, useRecordContext } from 'react-admin';
import { useState, useEffect } from 'react';

const ImageEditArray = () => {
    const record = useRecordContext();
    const [images, setImages] = useState(
        Array.isArray(record?.images)
            ? record.images.map((src) => ({ src }))
            : []
    );

    const handleUrlChange = (index, val) => {
        const updated = [...images];
        updated[index].src = val;
        setImages(updated);
    };

    const handleFileChange = async (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = [...images];
            updated[index].src = reader.result;
            setImages(updated);
        };
        reader.readAsDataURL(file);
    };

    const handleAddImage = () => setImages([...images, { src: '' }]);

    const handleRemove = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    const { field } = useInput({ source: 'images' });
    useEffect(() => {
        field.onChange(images.map((img) => img.src));
    }, [images]);
    
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            {images.map((img, index) => (
                <Box key={index} display="flex" flexDirection="column" gap={1}>
                    <TextField
                        label="URL hình ảnh"
                        value={img.src}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        fullWidth
                    />
                    <Button variant="outlined" component="label">
                        Chọn từ máy
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                        />
                    </Button>
                    {img.src && (
                        <img
                            src={img.src}
                            alt={`preview-${index}`}
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc'}}
                        />
                    )}
                    <Button onClick={() => handleRemove(index)} color="error">Xoá ảnh</Button>
                </Box>
            ))}
            <Button variant="outlined" onClick={handleAddImage}>+ Thêm ảnh</Button>
        </Box>
    );
};

export default ImageEditArray;
