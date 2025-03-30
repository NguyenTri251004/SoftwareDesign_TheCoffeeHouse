import { useEffect, useState } from 'react';
import { useNotify, useRefresh } from 'react-admin';
import { Card, CardContent, Typography, TextField, Button, Box, Avatar, Grid } from '@mui/material';
import authProvider from './authProvider';

export const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authProvider.getProfile();
                setProfile(data);
            } catch (err) {
                notify('Không thể tải hồ sơ người dùng', { type: 'error' });
            }
        };
        fetchProfile();
    }, [refresh, notify]);

    const handleSave = () => {
        notify('Cập nhật hồ sơ thành công!', { type: 'success' });
        setEditMode(false);
        refresh();
    };

    if (!profile) return <div>Đang tải...</div>;

    return (
        <Box sx={{ p: 4 }}>
            <Card sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Thông tin cá nhân
                </Typography>

                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={3} display="flex" justifyContent="center">
                        <Avatar src={profile.avatar} sx={{ width: 120, height: 120 }} />
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Tên người dùng"
                                value={profile.fullName || ''}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                disabled={!editMode}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={profile.email || ''}
                                disabled
                                fullWidth
                            />
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    onClick={editMode ? handleSave : () => setEditMode(true)}
                                >
                                    {editMode ? 'Lưu' : 'Chỉnh sửa'}
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};
