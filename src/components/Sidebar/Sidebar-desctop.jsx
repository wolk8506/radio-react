import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { authSelectors } from 'store';

import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/Person';
import { BASE_URL } from '../../config';

import { RadioMini } from '../Main/Radio-mini';

export const SidebarDesctop = ({ audio }) => {
  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);
  const avatar = useSelector(authSelectors.getAvatar);
  const baseUrlImg = BASE_URL;
  const location = useLocation();
  const currentPage = '/' + location.pathname.split('/')[1];
  const menuData = [
    { name: 'Главная', link: '/', icon: HomeIcon },
    { name: 'Курс валют', link: '/currency-index', icon: AccountBalanceIcon },
    { name: 'Погода', link: '/weather', icon: ThunderstormIcon },
    { name: 'Рецепты', link: '/recipes', icon: FastfoodIcon },
    { name: 'Новости', link: '/news', icon: NewspaperIcon },
    { name: 'Настройки', link: '/settings', icon: TuneIcon },
  ];
  const [classBtn_menu, setClassBtn_menu] = useState('');
  const [btnMenu, setBtnMenu] = useState(false);
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);

  const handleMenu = () => setBtnMenu(!btnMenu);
  const handleBtnTab = e => setBtnMenuMobile(!btnMenuMobile);

  useEffect(() => {
    setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
  }, [btnMenu]);

  return (
    <div className={`sidebar ${classBtn_menu}`}>
      <div className="menu-btn">
        <IconButton className="navigation-btn" onClick={handleMenu}>
          {btnMenu ? <MenuOpenIcon className="btn-ico" /> : <MenuIcon className="btn-ico" />}
        </IconButton>
        <List>{<RadioMini onAudio={audio} open={btnMenu}></RadioMini>}</List>

        <List>
          {menuData.map((i, index) => {
            return (
              <ListItem
                key={index}
                className={currentPage === i.link ? 'activ' : ''}
                onClick={handleBtnTab}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  component={Link}
                  to={i.link}
                  sx={[
                    { minHeight: 48, px: 2.5 },
                    btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                  ]}
                >
                  <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}>
                    {React.createElement(i.icon)}
                  </ListItemIcon>
                  <ListItemText primary={i.name} sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <List>
          <ListItem
            className={currentPage === '/profile' ? 'activ' : ''}
            onClick={handleBtnTab}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              component={Link}
              to={'/profile'}
              sx={[{ minHeight: 48, px: 2.5 }, btnMenu ? { justifyContent: 'initial' } : { justifyContent: 'center' }]}
            >
              <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, btnMenu ? { mr: 3 } : { mr: 'auto' }]}>
                {isLoggedIn ? <Avatar alt="Remy Sharp" src={baseUrlImg + avatar} /> : React.createElement(PersonIcon)}
              </ListItemIcon>
              <ListItemText primary="Профиль" sx={[btnMenu ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </div>
  );
};
