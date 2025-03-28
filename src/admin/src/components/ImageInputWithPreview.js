import { ImageInput, ImageField } from 'react-admin';
import { useWatch, useController } from 'react-hook-form';
import { TextField, Box } from '@mui/material';
import { useState, useEffect } from 'react';

const ImageInputWithPreview = ({ source, label }) => {
    const { field } = useController({ name: source });
    const value = useWatch({ name: source });
    const [urlInput, setUrlInput] = useState('');

    const handleUrlChange = (e) => {
        const val = e.target.value;
        setUrlInput(val);
    
        if (val.startsWith('http') || val.startsWith('data:image')) {
            field.onChange({ src: val });
        }        
    };
    
    const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    useEffect(() => {
        const processImage = async () => {
            if (value?.rawFile instanceof File && !value.src) {
                const base64 = await convertToBase64(value.rawFile);
                field.onChange({ ...value, src: base64 }); 
            }
        };
        processImage();
    }, [value]);
        
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <TextField label={label} value={urlInput} onChange={handleUrlChange}
                placeholder="Dán URL hình ảnh hoặc để trống nếu đã chọn"
            />
            <ImageInput source={source} accept="image/*" label="Chọn từ máy" multiple={false}>
                <ImageField source="src" title="title" />
            </ImageInput>
            {urlInput && (
                <img
                    src={urlInput}
                    alt="preview"
                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                />
            )}
        </Box>
    );
};

export default ImageInputWithPreview;
