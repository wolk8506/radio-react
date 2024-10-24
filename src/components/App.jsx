import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Media from 'react-media';
import { useTheme } from 'hooks/use-theme';
import { useBackground } from 'hooks/use-background';

import { RadioMini } from './Main/Radio-mini';
import { Main } from './Main/Main';
import { CurrencyIndex } from './Currency/Currency-index';
import { Weather } from './Weather/Weather';
import { info } from './info';

import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import InfoIcon from '@mui/icons-material/Info';
import { Info } from './Info/Info';
import IconButton from '@mui/material/IconButton';
// import equalizer from '../images/equalizer.webp';
// import equalizer_off from '../images/equalizer-off.png';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
// import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MailIcon from '@mui/icons-material/Mail';

export const App = () => {
  const PLAYER_PLAY = useSelector(state => state.storeData.playerPlay);
  const PLAYER_STATION = useSelector(state => state.storeData.playerStation);
  const [audio, setAudio] = useState();
  const [btnTab, setBtnTab] = useState(0);
  // const [btnMenu, setBtnMenu] = useState(false);
  const [btnMenuMobile, setBtnMenuMobile] = useState(true);
  const [classListMenuMobile, setClassListMenuMobile] = useState('mobile-menu__list');
  // const [classBtn_0, setClassBtn_0] = useState('navigation-btn toggle');
  // const [classBtn_1, setClassBtn_1] = useState('navigation-btn toggle');
  // const [classBtn_2, setClassBtn_2] = useState('navigation-btn toggle');
  // const [classBtn_3, setClassBtn_3] = useState('navigation-btn toggle');
  // const [classBtn_menu, setClassBtn_menu] = useState('');
  // const [content_menuOpen, setContent_menuOpen] = useState('');
  const radioStationName = [
    'Rock 181',
    'SOUNDPARK DEEP',
    'Радио Energy',
    'KissFM_HD',
    'Europa Plus',
    'Радио 7',
    'Русский Рок',
    'Record Rock',
    'Rock Radio',
    'Радио Максимум',
    'DFM',
    'Kiss FM Deep',
  ];

  const drawerWidth = 240;

  const openedMixin = theme => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = theme => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  // const AppBar = styled(MuiAppBar, {
  //   shouldForwardProp: prop => prop !== 'open',
  // })(({ theme }) => ({
  //   zIndex: theme.zIndex.drawer + 1,
  //   transition: theme.transitions.create(['width', 'margin'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  //   }),
  //   variants: [
  //     {
  //       props: ({ open }) => open,
  //       style: {
  //         marginLeft: drawerWidth,
  //         width: `calc(100% - ${drawerWidth}px)`,
  //         transition: theme.transitions.create(['width', 'margin'], {
  //           easing: theme.transitions.easing.sharp,
  //           duration: theme.transitions.duration.enteringScreen,
  //         }),
  //       },
  //     },
  //   ],
  // }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }));

  useEffect(() => {
    // Update the document title using the browser API
    PLAYER_PLAY ? (document.title = `Radio`) : (document.title = `${radioStationName[PLAYER_STATION]}`);
  });

  const handleBtnTab = e => {
    setBtnTab(e.currentTarget.value);
    setBtnMenuMobile(!btnMenuMobile);
    console.log(e.currentTarget.value);
  };

  // const handleMenu = () => {
  //   setBtnMenu(!btnMenu);
  //   console.log('menu');
  // };

  const handleMenuMobile = () => {
    setBtnMenuMobile(!btnMenuMobile);
    console.log('handleMenuMobile');
  };

  useEffect(() => {
    setClassListMenuMobile(`${btnMenuMobile ? 'mobile-menu__list--on mobile-menu__list' : 'mobile-menu__list'}`);
  }, [btnMenuMobile]);

  // useEffect(() => {
  //   setClassBtn_menu(`${btnMenu ? 'menu_on' : ''}`);
  //   setContent_menuOpen(`${btnMenu ? 'content--menuOpen' : ''}`);
  // }, [btnMenu]);

  useEffect(() => setAudio(new Audio()), []);

  // useEffect(() => {
  //   setClassBtn_0(btnTab === 0 ? 'activ' : '');
  //   setClassBtn_1(btnTab === 1 ? 'activ' : '');
  //   setClassBtn_2(btnTab === 2 ? 'activ' : '');
  //   setClassBtn_3(btnTab === 3 ? 'activ' : '');
  // }, [btnTab]);

  // * Theme -----------------------------------
  // eslint-disable-next-line no-unused-vars
  const { theme, setTheme } = useTheme();

  const THEME = useSelector(state => state.storeData.theme);

  useEffect(() => {
    setTheme(THEME);
  }, [THEME, setTheme]);
  // ----------------
  // eslint-disable-next-line no-unused-vars
  const { themeBackground, setThemeBackground } = useBackground();

  const THEME_BACKGROUND = useSelector(state => state.storeData.themeBackground);

  useEffect(() => {
    setThemeBackground(THEME_BACKGROUND);
  }, [THEME_BACKGROUND, setThemeBackground, themeBackground]);

  // *  ----------------------------------------

  //  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <div className="app">
      <Media
        queries={{
          small: '(max-width: 599px)',
          medium: '(min-width: 600px) and (max-width: 1199px)',
          large: '(min-width: 1200px)',
        }}
      >
        {matches => (
          <Fragment>
            {matches.small && (
              <div className="mobile-menu">
                <div className="mobile-menu__title">
                  <button type="button" onClick={handleMenuMobile}>
                    <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
                  </button>
                </div>
                <div className={classListMenuMobile}>
                  <button type="button" value="0" onClick={handleBtnTab}>
                    <HomeIcon className="btn-ico" />
                    Главная
                  </button>
                  <button type="button" value="1" onClick={handleBtnTab}>
                    <AccountBalanceIcon className="btn-ico" />
                    Курс валют
                  </button>
                  <button type="button" value="2" onClick={handleBtnTab}>
                    <ThunderstormIcon className="btn-ico" />
                    Погода
                  </button>
                  <button type="button" value="3" onClick={handleBtnTab}>
                    <InfoIcon className="btn-ico" />
                    Инфо
                  </button>
                </div>
              </div>
            )}
            {matches.medium && (
              <Box sx={{ display: 'flex' }}>
                <Drawer variant="permanent" open={open}>
                  <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                  </DrawerHeader>
                  <Divider />
                  <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <MailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Player"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                  <Divider />
                  <List>
                    <ListItem key="qwee1" value="0" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Главная"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee2" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Курс валют"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee3" disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <ThunderstormIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Погода"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee4" value="3" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <InfoIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Инфо"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Drawer>
              </Box>
              // <div className={`sidebar ${classBtn_menu}`}>
              //   <div className="menu-btn">
              //     <IconButton className="navigation-btn" onClick={handleMenu}>
              //       <DensityMediumIcon className="btn-ico"></DensityMediumIcon>
              //     </IconButton>

              //     <RadioMini className="navigation-btn" onAudio={audio}></RadioMini>

              //     <IconButton className={`navigation-btn ${classBtn_0}`} type="button" value="0" onClick={handleBtnTab}>
              //       <HomeIcon className="btn-ico" />
              //     </IconButton>

              //     <IconButton className={`navigation-btn ${classBtn_1}`} type="button" value="1" onClick={handleBtnTab}>
              //       <AccountBalanceIcon className="btn-ico" />
              //     </IconButton>

              //     <IconButton className={`navigation-btn ${classBtn_2}`} type="button" value="2" onClick={handleBtnTab}>
              //       <ThunderstormIcon className="btn-ico" />
              //     </IconButton>

              //     <IconButton className={`navigation-btn ${classBtn_3}`} type="button" value="3" onClick={handleBtnTab}>
              //       <InfoIcon className="btn-ico" />
              //     </IconButton>
              //   </div>
              //   <div className="menu-open">
              //     <div>
              //       <p className="menu-open-text">Меню</p>

              //       <p className="menu-open-text">{radioStationName[PLAYER_STATION]}</p>
              //       <p className={`menu-open-text ${classBtn_0}`}>Главная</p>
              //       <p className={`menu-open-text ${classBtn_1}`}>Курс валют</p>
              //       <p className={`menu-open-text ${classBtn_2}`}>Погода</p>
              //       <p className={`menu-open-text ${classBtn_3}`}>Инфо</p>
              //     </div>
              //   </div>
              // </div>
            )}
            {matches.large && (
              <Box sx={{ display: 'flex' }}>
                <Drawer variant="permanent" open={open}>
                  <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                      {open ? <ArrowBackIosIcon /> : <DensityMediumIcon />}
                    </IconButton>
                  </DrawerHeader>
                  <Divider />
                  <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <RadioMini onAudio={audio}></RadioMini>
                          {/* <MailIcon /> */}
                        </ListItemIcon>
                        <ListItemText
                          primary={radioStationName[PLAYER_STATION]}
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                  <Divider />
                  <List>
                    <ListItem key="qwee0" value="0" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Главная"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee1" value="1" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <AccountBalanceIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Курс валют"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee3" value="2" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <ThunderstormIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Погода"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem key="qwee4" value="3" onClick={handleBtnTab} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 48,
                            px: 2.5,
                          },
                          open
                            ? {
                                justifyContent: 'initial',
                              }
                            : {
                                justifyContent: 'center',
                              },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            {
                              minWidth: 0,
                              justifyContent: 'center',
                            },
                            open
                              ? {
                                  mr: 3,
                                }
                              : {
                                  mr: 'auto',
                                },
                          ]}
                        >
                          <InfoIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Инфо"
                          sx={[
                            open
                              ? {
                                  opacity: 1,
                                }
                              : {
                                  opacity: 0,
                                },
                          ]}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Drawer>
              </Box>
            )}
          </Fragment>
        )}
      </Media>

      <div className="content">
        {btnTab === 0 && <Main onAudio={audio}></Main>}
        {btnTab === 1 && <CurrencyIndex></CurrencyIndex>}
        {btnTab === 2 && <Weather></Weather>}
        {btnTab === 3 && <Info></Info>}
      </div>
    </div>
  );
};

console.log(info, 'font-family:monospace;color:#1976d2;font-size:12px;');
