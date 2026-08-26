import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

import { authSelectors } from 'store';

export const SidebarMobile = () => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const location = useLocation();
  const currentPage = '/' + location.pathname.split('/')[1];
  const menuData = [
    { name: 'Главная', link: '/', route: 'public' },
    { name: 'Курс валют', link: '/currency-index', route: 'public' },
    { name: 'Погода', link: '/weather', route: 'public' },
    { name: 'Рецепты', link: '/recipes', route: 'public' },
    { name: 'Новости', link: '/news', route: 'public' },
    { name: 'Медиатека', link: '/filmLibrary', route: 'privat' },
    { name: 'Настройки', link: '/settings', route: 'public' },
    { name: 'Профиль', link: '/profile', route: 'privat' },
    { name: 'Страница входа', link: '/login', route: 'restricted' },
    { name: 'Регистрация', link: '/register', route: 'restricted' },
  ];
  const activeItem = menuData.find(item => item.link === currentPage) || menuData[0];
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);
  const [state, setState] = React.useState({ right: false });

  const handleBtnTab = e => setBtnMenuMobile(!btnMenuMobile);

  const toggleDrawer = (anchor, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          // color="primary"
          sx={{
            top: 0,
            bottom: 'auto',
            paddingTop: 'env(safe-area-inset-top, 0px)',
            background: 'rgba(18, 22, 30, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          }}
        >
          <Toolbar variant="dense">
            <IconButton edge="start" aria-label="menu" sx={{ mr: 2, color: '#fff' }} onClick={toggleDrawer('right', true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div" sx={{ color: '#fff' }}>
              {activeItem.name}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
        disableScrollLock
        sx={{
          '& .MuiDrawer-content': {
            width: 260,
            background: 'rgba(20, 24, 32, 0.65)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer('right', false)}
          onKeyDown={toggleDrawer('right', false)}
          sx={{ width: '100%', paddingTop: '12px', paddingBottom: '12px' }}
        >
          <List sx={{ padding: 0 }}>
            {menuData.map((i, index) => {
              const shouldRender =
                i.route === 'public' ||
                (isLoggedIn && i.route === 'privat') ||
                (!isLoggedIn && i.route === 'restricted');

              if (!shouldRender) return null;

              return (
                <ListItem key={index} value={index} onClick={handleBtnTab} component={Link} to={i.link} sx={{ padding: 0 }}>
                  <ListItemButton
                    className={currentPage === i.link ? 'activ' : ''}
                    sx={{
                      margin: '8px 12px',
                      borderRadius: '18px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '14px 16px',
                      color: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      '&.activ': {
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.25))',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.12)',
                      },
                    }}
                  >
                    {i.name}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
