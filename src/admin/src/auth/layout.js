import { AppBar, Layout, UserMenu, useGetIdentity, Logout } from 'react-admin';
import { Avatar, Typography, Box, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const MyUserMenu = (props) => {
    const { data: identity } = useGetIdentity();

    return (
        <UserMenu {...props}>
            <MenuItem component={Link} to="/profile">
                <Box display="flex" alignItems="center">
                    <Avatar src={identity?.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">Hồ sơ cá nhân</Typography>
                </Box>
            </MenuItem>

            <Logout />
        </UserMenu>
    );
};

const MyAppBar = (props) => <AppBar {...props} userMenu={<MyUserMenu />} />;
export const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} />;
