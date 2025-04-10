import * as React from 'react';
import Media from 'react-media';
import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';

import {
  getWeatherToday_Data,
  getCityName,
  getWeatherDayCity1_Data,
  getWeatherDayCity2_Data,
  getCityList,
  getWeatherDayCity3_Data,
  getThemeIconWeather,
} from 'store/selectors';
import {
  fetchWeatherYesterday,
  fetchWeatherToday,
  fetchWeatherTomorrow,
  fetchWeatherMonth,
  fetchWeatherElements,
  // fetchLocation,
  fetchWeatherTodayCity1,
  fetchWeatherTodayCity2,
} from 'store/operation';
import { addCityListItem, deleteCityListItem, homeCityListItem, setCityName } from 'store/actions';

// import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import { ChartWeather } from './ChartWeather';
import { Tiles } from './Tiles';
import { AirQuality } from './AirQuality';
import { WeatherMonth } from './WeatherMonth';
import { WeatherCurrentDay } from './WeatherCurrentDay';
import { WeatherMonthMobile } from './WeatherMonthMobile';
import { WeatherSunMoonMobile } from './WeatherSunMoonMobile';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'; //корзина
import GradeIcon from '@mui/icons-material/Grade'; //звезда
import HomeIcon from '@mui/icons-material/Home'; //дом
import MoreVertIcon from '@mui/icons-material/MoreVert'; //три точки
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import useDebounce from '../../hooks/use-Debounce';

import weatherImage from 'components/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const Weather = () => {
  const themeImageWeather = useSelector(getThemeIconWeather);
  const dispatch = useDispatch();
  const data_today = useSelector(getWeatherToday_Data);
  const city_data = useSelector(getCityName);
  const cityList = useSelector(getCityList);

  const data_today_city1 = useSelector(getWeatherDayCity1_Data);
  const data_today_city2 = useSelector(getWeatherDayCity2_Data);
  const data_today_city3 = useSelector(getWeatherDayCity3_Data);

  // const urlImage = 'https://www.visualcrossing.com/img/';

  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
  const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
  const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';
  const REACT_APP_WEATHER_API_KEY_4 = 'ZFDDCEUX8YARVXWEHNHDQP74C';

  const [ferstFetch, setFerstFetch] = useState(true);

  const [CITY, setCITY] = useState(city_data);
  const [searchCity, setSearchCity] = useState('');
  useEffect(() => {
    const cityFilter = cityList.filter(({ home }) => home === true);

    if (searchCity.length !== 0) {
      setCITY(searchCity);
    } else if (cityFilter.length !== 0) {
      setCITY({ city: cityFilter[0].city, home: cityFilter[0].city });
    } else setCITY({ city: city_data, home: false });
  }, [cityList, city_data, searchCity]);

  const handleShowCity = e => {
    const cityFilter = cityList.filter(({ id }) => id === e);
    setSearchCity({ city: cityFilter[0].city, home: cityFilter[0].home });
    dispatch(setCityName(cityFilter[0].city));
  };

  const [cityListUpdate, setcityListUpdate] = useState(cityList);

  useEffect(() => {
    const arr = [];
    if (cityList[0]?.city !== undefined) {
      const a = {
        id: cityList[0]?.id,
        city: cityList[0]?.city,
        favorite: cityList[0]?.favorite,
        home: cityList[0]?.home,
        icon: weatherImage(data_today_city1.days[0].icon, themeImageWeather),

        temperature: data_today_city1.days[0].tempmax.toFixed(0),
      };
      arr.push(a);
    }
    if (cityList[1]?.city !== undefined) {
      const a = {
        id: cityList[1]?.id,
        city: cityList[1]?.city,
        favorite: cityList[1]?.favorite,
        home: cityList[1]?.home,
        icon: weatherImage(data_today_city2.days[0].icon, themeImageWeather),
        temperature: data_today_city2.days[0].tempmax.toFixed(0),
      };
      arr.push(a);
    }
    if (cityList[2]?.city !== undefined) {
      const a = {
        id: cityList[2]?.id,
        city: cityList[2]?.city,
        favorite: cityList[2]?.favorite,
        home: cityList[2]?.home,
        icon: weatherImage(data_today_city3.days[0].icon, themeImageWeather),
        temperature: data_today_city3.days[0].tempmax.toFixed(0),
      };
      arr.push(a);
    }
    setcityListUpdate(arr);
  }, [cityList, data_today_city1.days, data_today_city2.days, data_today_city3.days, themeImageWeather]);

  useEffect(() => {
    setcityListUpdate(cityList);
  }, [cityList]);

  useEffect(() => {
    if (ferstFetch) {
      const city_1 = cityList[0]?.city;
      const city_2 = cityList[1]?.city;
      const city_3 = cityList[2]?.city;

      if (city_1 !== undefined) {
        const BASE_URL_TODAY = `${BASE_URL}${city_1}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_4}&contentType=json&lang=ru&unitGroup=metric&include=days&elements=tempmax,icon`;
        dispatch(fetchWeatherTodayCity1(BASE_URL_TODAY));
        console.log('Запрос - 1');
      }

      if (city_2 !== undefined) {
        const BASE_URL_TODAY = `${BASE_URL}${city_2}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_4}&contentType=json&lang=ru&unitGroup=metric&include=days&elements=tempmax,icon`;
        dispatch(fetchWeatherTodayCity2(BASE_URL_TODAY));
        console.log('Запрос - 2');
      }

      if (city_3 !== undefined) {
        const BASE_URL_TODAY = `${BASE_URL}${city_3}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_4}&contentType=json&lang=ru&unitGroup=metric&include=days&elements=tempmax,icon`;
        dispatch(fetchWeatherTodayCity2(BASE_URL_TODAY));
        console.log('Запрос - 3');
      }
    }
    setFerstFetch(false);
  }, [CITY, cityList, dispatch, ferstFetch]);

  useEffect(() => {
    if (CITY.city !== undefined) {
      const BASE_URL_YESTERDAY = `${BASE_URL}${CITY.city}/yesterday?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_1}&contentType=json&lang=ru&unitGroup=metric`;
      const BASE_URL_TODAY = `${BASE_URL}${CITY.city}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_3}&contentType=json&lang=ru&unitGroup=metric`;
      const BASE_URL_TOMORROW = `${BASE_URL}${CITY.city}/tomorrow?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_3}&contentType=json&lang=ru&unitGroup=metric`;
      const URL_WEATHER_ELEMENTS = `${BASE_URL}${CITY.city}?key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&unitGroup=metric&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;

      dispatch(fetchWeatherYesterday(BASE_URL_YESTERDAY));
      dispatch(fetchWeatherToday(BASE_URL_TODAY));
      dispatch(fetchWeatherTomorrow(BASE_URL_TOMORROW));
      dispatch(fetchWeatherElements(URL_WEATHER_ELEMENTS));
    }
  }, [CITY, dispatch]);

  useEffect(() => {
    let API_KEY_WEATHER_30 = 'D6MDZY6JMNHMG6CBQANG3GNHD';

    const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
    const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
    const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';
    const REACT_APP_WEATHER_API_KEY_4 = 'ZFDDCEUX8YARVXWEHNHDQP74C';
    const REACT_APP_WEATHER_API_KEY_5 = 'VYYWDJ2KMZJECA8DACHPRUVU3';
    const hour = moment().format('H');

    if (hour > 20) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_5;
    else if (hour > 16) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_3;
    else if (hour > 12) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_4;
    else if (hour > 10) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_2;
    else if (hour > 8) API_KEY_WEATHER_30 = REACT_APP_WEATHER_API_KEY_1;

    const numberDay = moment().isoWeekday();
    const dateStart = moment()
      .add(0 - numberDay, 'days')
      .format('YYYY-MM-DD');
    const dateEnd = moment()
      .add(28 - numberDay, 'days')
      .format('YYYY-MM-DD');
    const DATE = `${dateStart}/${dateEnd}`;

    const URL_WEATHER = `${BASE_URL}${CITY.city}/${DATE}?key=${API_KEY_WEATHER_30}&lang=ru&unitGroup=metric&include=days&elements=tempmax,tempmin,pressure,icon,humidity,uvindex,datetime`;
    if (CITY.city !== undefined) {
      dispatch(fetchWeatherMonth(URL_WEATHER));
    }
  }, [CITY, dispatch]);

  // !!!!!!!!!!------------------------------------------------------------------------
  function searchCharacters(search) {
    return fetch(`https://data-api.oxilor.com/rest/search-regions?lng=ru&searchTerm=${search}`, {
      headers: {
        Authorization: 'Bearer 7rzbXDCf-D7EB6bPdf3oa23Pj90cD_',
      },
    })
      .then(r => r.json())
      .then(r => r)
      .catch(error => {
        console.error(error);
        return [];
      });
  }

  // Состояние и сеттер состояния для поискового запроса
  const [searchTerm, setSearchTerm] = useState('');
  // Состояние и сеттер состояния для результатов поиска
  const [results, setResults] = useState([]);
  // Состояние для статуса поиска (есть ли ожидающий запрос API)
  const [isSearching, setIsSearching] = useState(false);

  // Теперь мы вызываем наш хук, передавая текущее значение searchTerm.
  // Хук вернет только последне значение (которое мы передали) ...
  // ... если прошло более 500ms с последнего вызова.
  // Иначе он вернет предыдущее значение searchTerm.
  // Цель в том, чтобы вызвать АПИ только после того, как пользователь перестанет
  // печатать и в итоге мы не будем вызвать АПИ слишком часто.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Здесь происходит вызов АПИ
  // Мы используем useEffect, так как это асинхронное действие
  useEffect(
    () => {
      // Убедиться что у нас есть значение (пользователь ввел что-то)
      if (debouncedSearchTerm) {
        // Выставить состояние isSearching
        setIsSearching(true);
        // Сделать запрос к АПИ
        searchCharacters(debouncedSearchTerm).then(results => {
          // Выставить состояние в false, так-как запрос завершен
          setIsSearching(false);
          // Выставит состояние с результатом
          setResults([
            ...results.map(i => {
              const isKyr = function (str) {
                if (str === undefined) return false;
                return /[а-я]/i.test(str);
              };
              const name = i.name;
              let name2 = i.parentRegions.map(i => isKyr(i.name) && ` ${i.name}`);
              name2 = name2.filter(n => {
                return n !== false;
              });
              if (name2.length === 4) name2.shift();
              name2.pop();
              return `${name}, ${name2.slice()} `;
            }),
          ]);
        });
      } else {
        setResults([]);
      }
    },
    // Это массив зависимостей useEffect
    // Хук useEffect сработает только если отложенное значение изменится ...
    // ... и спасибо нашему хуку, что оно изменится только тогда ...
    // когда значение searchTerm не менялось на протяжении 500ms.
    [debouncedSearchTerm]
  );

  const handleClose = e => {
    if (e.currentTarget.textContent.length > 0) {
      const valueCity = e.currentTarget.textContent;
      dispatch(setCityName(valueCity));
      setSearchCity({ city: valueCity, home: false });
    }
  };

  // --------------------------------------------------------
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const maxEl = cityList.length;

  const handleCity = () => {
    if (maxEl < 3)
      dispatch(
        addCityListItem({
          city: data_today.address,
          favorite: true,
          home: false,
          icon: weatherImage(data_today.days[0].icon, themeImageWeather),
          temperature: data_today.days[0].tempmax.toFixed(0),
        })
      );
    else console.log('Превышено кол-во городов');
  };

  // ----------------333333----------------------------------------
  const [anchorEl_1, setAnchorEl_1] = React.useState(null);
  const open_1 = Boolean(anchorEl_1);
  const handleClick_1 = event => {
    setAnchorEl_1(event.currentTarget);
  };
  // ----------
  const [anchorEl_2, setAnchorEl_2] = React.useState(null);
  const open_2 = Boolean(anchorEl_2);
  const handleClick_2 = event => {
    setAnchorEl_2(event.currentTarget);
  };
  // -----------
  const [anchorEl_3, setAnchorEl_3] = React.useState(null);
  const open_3 = Boolean(anchorEl_3);
  const handleClick_3 = event => {
    setAnchorEl_3(event.currentTarget);
  };

  function handleLocation() {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(r => setSearchCity({ city: `${r.city}, ${r.country_name}`, home: false }))
      .then(r => r)
      .catch(error => {
        console.error(error);
        return [];
      });
  }

  return (
    <div className="weather">
      <div className="weather__search-block">
        <div className="weather__search">
          <IconButton onClick={handleLocation}>
            <GpsFixedIcon fontSize="inherit" />
          </IconButton>
          <Autocomplete
            // disablePortal
            loading={isSearching}
            options={results}
            sx={{ width: 300 }}
            onClose={handleClose}
            renderInput={params => (
              <TextField
                {...params}
                label="Поиск местоположения"
                onChange={e => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  },
                }}
              />
            )}
          />

          {cityListUpdate[0] !== undefined && (
            <div
              className="search__card-city"
              onClick={() => {
                handleShowCity(cityListUpdate[0].id);
              }}
            >
              <div className="card-city">
                {cityListUpdate[0].home && (
                  <IconButton aria-label="delete" size="small">
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[0]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[0]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[0]?.temperature}°</p>
                <div>
                  <IconButton
                    aria-label="more"
                    id="long-button_1"
                    aria-controls={open_1 ? 'long-menu_1' : undefined}
                    aria-expanded={open_1 ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick_1}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu_1"
                    MenuListProps={{
                      'aria-labelledby_1': 'long-button_1',
                    }}
                    anchorEl={anchorEl_1}
                    open={open_1}
                    onClose={() => setAnchorEl_1(null)}
                    slotProps={{
                      paper: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_1(null);
                        dispatch(homeCityListItem({ id: cityListUpdate[0].id, home: !cityListUpdate[0].home }));
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_1(null);
                        dispatch(deleteCityListItem(cityListUpdate[0].id));
                      }}
                      disableRipple
                    >
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          )}

          {cityListUpdate[1] !== undefined && (
            <div
              className="search__card-city"
              onClick={() => {
                handleShowCity(cityListUpdate[1].id);
              }}
            >
              <div className="card-city">
                {cityListUpdate[1].home && (
                  <IconButton aria-label="delete" size="small">
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[1]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[1]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[1]?.temperature}°</p>
                <div>
                  <IconButton
                    aria-label="more"
                    id="long-button_2"
                    aria-controls={open_2 ? 'long-menu_2' : undefined}
                    aria-expanded={open_2 ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick_2}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu_2"
                    MenuListProps={{
                      'aria-labelledby_2': 'long-button_2',
                    }}
                    anchorEl={anchorEl_2}
                    open={open_2}
                    onClose={() => setAnchorEl_1(null)}
                    slotProps={{
                      paper: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_2(null);
                        dispatch(homeCityListItem({ id: cityListUpdate[1].id, home: !cityListUpdate[1].home }));
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_2(null);
                        dispatch(deleteCityListItem(cityListUpdate[1].id));
                      }}
                      disableRipple
                    >
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          )}

          {cityListUpdate[2] !== undefined && (
            <div
              className="search__card-city"
              onClick={() => {
                handleShowCity(cityListUpdate[2].id);
              }}
            >
              <div className="card-city">
                {cityListUpdate[2].home && (
                  <IconButton aria-label="delete" size="small">
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[2]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[2]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[2]?.temperature}°</p>
                <div>
                  <IconButton
                    aria-label="more"
                    id="long-button_3"
                    aria-controls={open_3 ? 'long-menu_3' : undefined}
                    aria-expanded={open_3 ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick_3}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu_3"
                    MenuListProps={{
                      'aria-labelledby_3': 'long-button_3',
                    }}
                    anchorEl={anchorEl_3}
                    open={open_3}
                    onClose={() => setAnchorEl_1(null)}
                    slotProps={{
                      paper: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_3(null);
                        dispatch(homeCityListItem({ id: cityListUpdate[2].id, home: !cityListUpdate[2].home }));
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_3(null);
                        dispatch(deleteCityListItem(cityListUpdate[2].id));
                      }}
                      disableRipple
                    >
                      <DeleteIcon />
                      Удалить
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="weather__title">
        {CITY?.home && <HomeIcon className="title__ico" />}

        <h1>{data_today.address}</h1>
        <div>
          <IconButton
            aria-label="more"
            id="long-button1"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu1"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleCity();
              }}
              disableRipple
              disabled={maxEl === 3}
            >
              <GradeIcon />
              Избранное
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="weathet__block-day">
        <WeatherCurrentDay></WeatherCurrentDay>
        <AirQuality></AirQuality>
      </div>

      <Media
        queries={{
          small: '(max-width: 599px)',
          medium: '(min-width: 600px)',
          // medium: '(min-width: 600px) and (max-width: 1199px)',
          // large: '(min-width: 1200px)',
        }}
      >
        {matches => (
          <Fragment>
            {matches.small && (
              <>
                <WeatherMonthMobile></WeatherMonthMobile>
                <WeatherSunMoonMobile></WeatherSunMoonMobile>
              </>
            )}
            {matches.medium && (
              <>
                <ChartWeather></ChartWeather>
                <WeatherMonth></WeatherMonth>
                <Tiles></Tiles>
              </>
            )}
            {/* {matches.large && <div></div>} */}
          </Fragment>
        )}
      </Media>
    </div>
  );
};
