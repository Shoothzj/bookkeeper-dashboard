import * as React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AppBar, Drawer } from '@mui/material';
import HomePage from './HomePage';
import LedgerPage from './bookkeeper/LedgerPage';

const drawerWidth = 240;

function App() {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Bookkeeper dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left">
        <Toolbar />
        <Divider />
        <List>
          <ListItem key="Home Page" disablePadding>
            <ListItemButton
              onClick={async () => {
                navigate('/');
              }}>
              <ListItemText primary="Home Page" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bookkeeper/ledgers/:ledger" element={<LedgerPage />} />
          </Routes>
        </div>
      </Box>
    </Box>
  );
}

export default App;
