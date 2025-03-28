import { useRecordContext } from 'react-admin';
import { Box, Typography } from '@mui/material';

const ImageListPreview = () => {
    const record = useRecordContext();

    if (!record || !record.images || !record.images.length) {
        return <Typography variant="body2">Không có hình ảnh</Typography>;
    }

    return (
        <Box display="flex" gap={1} flexWrap="wrap">
            {record.images.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`image-${index}`}
                    style={{
                        maxWidth: 100,
                        maxHeight: 100,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: '1px solid #ccc',
                    }}
                />
            ))}
        </Box>
    );
};

export default ImageListPreview;