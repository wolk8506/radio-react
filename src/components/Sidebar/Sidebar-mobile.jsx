import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const SidebarMobile = () => {
  const location = useLocation();
  const currentPage = '/' + location.pathname.split('/')[1];
  const menuData = [
    { name: 'Главная', link: '/' },
    { name: 'Курс валют', link: '/currency-index' },
    { name: 'Погода', link: '/weather' },
    { name: 'Рецепты', link: '/recipes' },
    { name: 'Новости', link: '/news' },
    { name: 'Настройки', link: '/settings' },
    { name: 'Профиль', link: '/profile' },
  ];
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
        <AppBar position="fixed" color="primary" sx={{ top: 0, bottom: 'auto' }}>
          <Toolbar variant="dense">
            <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer('right', true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              {menuData[menuData.findIndex(item => item.link === currentPage)].name}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
        <Box role="presentation" onClick={toggleDrawer('right', false)} onKeyDown={toggleDrawer('right', false)}>
          <List>
            {menuData.map((i, index) => {
              return (
                <ListItem key={index} value={index} onClick={handleBtnTab} component={Link} to={i.link}>
                  <ListItemButton className={currentPage === i.link ? 'activ' : ''}>{i.name}</ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
