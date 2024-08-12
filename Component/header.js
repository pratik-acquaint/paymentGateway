import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import { useRouter } from 'next/navigation';

const Header = () => {
    const { push } = useRouter();

    const handleClick = () => {
        localStorage.setItem('token', null);
        push('/')
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} mb={2}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <PaidIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Payment Gateway
                        </Typography>
                        <Button color="inherit" onClick={() => handleClick()}>Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Header;