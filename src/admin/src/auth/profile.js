import { useGetIdentity, useNotify, useRefresh } from 'react-admin';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export const ProfilePage = () => {
    const { data: identity, isLoading } = useGetIdentity();
    const [editMode, setEditMode] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();

    const [profile, setProfile] = useState(identity || {});

    const handleSave = () => {
        notify('Cập nhật hồ sơ thành công!', { type: 'success' });
        setEditMode(false);
        refresh();
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
        <CardContent>
            <Typography variant="h5" gutterBottom>
                Thông tin cá nhân
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
                <TextField label="Họ tên" value={profile.fullName || ''} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} disabled={!editMode} />
                <TextField label="Email" value={profile.email || ''} disabled/>
          
                {!editMode ? (
                    <Button variant="contained" onClick={() => setEditMode(true)}>Chỉnh sửa</Button>
                ) : (
                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                )}
            </Box>
        </CardContent>
        </Card>
    );
};
