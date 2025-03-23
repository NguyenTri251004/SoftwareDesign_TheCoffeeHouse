import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const login = useLogin();
    const notify = useNotify();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ username: email, password }); 
        } catch (error) {
            notify('Đăng nhập thất bại', { type: 'error' });
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4, width: 360 }}>
                <Typography variant="h5" gutterBottom>Đăng nhập</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Đăng nhập
                    </Button>
                </form>

                <Button
                    onClick={() => navigate('/forgot-password')}
                    fullWidth
                    sx={{ mt: 1, textTransform: 'none' }}
                >
                    Quên mật khẩu?
                </Button>
            </Paper>
        </Box>
    );
};

export default LoginPage;
