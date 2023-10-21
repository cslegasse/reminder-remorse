import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Accessibility from '@mui/icons-material/Accessibility';
import {
    UserButton,
} from "@clerk/clerk-react";
export default function PageHeader() {
    return (
        <Box
            sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                elevation={0}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Accessibility />
                    </IconButton>
                    <Typography variant="h6" component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Reminder Remorse
                    </Typography>
                    <UserButton />
                </Toolbar>
            </AppBar>
        </Box>
    );
}