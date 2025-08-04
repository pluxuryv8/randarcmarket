import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Радар', path: '/radar' },
  { label: 'Инвентарь', path: '/inventory' },
  { label: 'Профиль', path: '/profile' },
];

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#0d0d0d',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Логотип слева */}
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            Randar Market
          </Typography>

          {/* Меню справа */}
          {isMobile ? (
            <>
              <IconButton onClick={() => setOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { backgroundColor: '#121212', width: 240 } }}
              >
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        sx={{
                          color: '#fff',
                          '&.active .MuiListItemText-root': {
                            color: 'error.main',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Box>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    color: '#fff',
                    ml: 2,
                    '&.active': {
                      color: 'error.main',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;