import * as React from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';

import { weatherSelectors, weatherOperations, weatherActions, rootSelectors, authSelectors } from 'store';
import { toast } from 'react-toastify';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// import { ChartWeather } from './ChartWeather';
import { Tiles } from './Tiles';
// import { AirQuality } from './AirQuality';
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

import { useDebounce } from '../../hooks';

import weatherImage, { wmoToIconKey } from 'components/Weather/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';
import WeatherMap from './WeatherMap';
import { TitleSection } from './TitleSection';

moment.locale('ru');

export const Weather = () => {
  const themeImageWeather = useSelector(rootSelectors.getThemeIconWeather);
  const dispatch = useDispatch();
  const data_today = useSelector(weatherSelectors.getWeatherToday_Data);
  const city_data = useSelector(weatherSelectors.getCityName);
  const cityList = useSelector(weatherSelectors.getCityList);

  const citiesWeather = useSelector(weatherSelectors.getCitiesWeather);

  const isLoggedIn = useSelector(authSelectors.getIsLoggedIn);

  const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  // const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
  const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
  // const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';

  const [CITY, setCITY] = useState(city_data);
  const [searchCity, setSearchCity] = useState('');

  const isMobile = useMediaQuery('(max-width: 599px)');
  const isTablet = useMediaQuery('(min-width: 600px)');

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
    dispatch(weatherActions.setCityName(cityFilter[0].city));
  };

  const [cityListUpdate, setcityListUpdate] = useState(cityList);

  useEffect(() => {
    const arr = cityList.map(c => {
      const w = citiesWeather[c.id];
      return {
        id: c.id,
        city: c.city,
        favorite: c.favorite,
        home: c.home,
        icon: w ? weatherImage(wmoToIconKey(w.code, w.isDay), themeImageWeather) : null,
        temperature: w ? w.temperature : '',
      };
    });
    setcityListUpdate(arr);
  }, [cityList, citiesWeather, themeImageWeather]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(weatherOperations.fetchUserCities());
    } else {
      dispatch(weatherActions.setCityList([]));
    }
  }, [isLoggedIn, dispatch]);

  // Погода для плашек избранных городов — через Open-Meteo (без ключа, без лимита)
  useEffect(() => {
    if (isLoggedIn && cityList.length > 0) {
      dispatch(weatherOperations.fetchCitiesWeather(cityList));
    }
  }, [cityList, isLoggedIn, dispatch]);

  useEffect(() => {
    if (CITY === null) {
      dispatch(weatherOperations.fetchLocation()); //Определение локации
    } else if (CITY.city !== undefined && CITY !== null) {
      const cityQuery = encodeURIComponent(CITY.city);
      const BASE_URL_TODAY = `${BASE_URL}${cityQuery}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours&key=${REACT_APP_WEATHER_API_KEY_2}&contentType=json&lang=ru&unitGroup=metric`;
      const URL_WEATHER_ELEMENTS = `${BASE_URL}${cityQuery}?key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&unitGroup=metric&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;

      dispatch(weatherOperations.fetchWeatherToday(BASE_URL_TODAY));
      dispatch(weatherOperations.fetchWeatherElements(URL_WEATHER_ELEMENTS));
    }
  }, [CITY, dispatch]);

  useEffect(() => {
    let API_KEY_WEATHER_30 = 'D6MDZY6JMNHMG6CBQANG3GNHD';

    const REACT_APP_WEATHER_API_KEY_1 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
    const REACT_APP_WEATHER_API_KEY_2 = 'ALDXRSSMA67DYTJF696P4X2T8';
    const REACT_APP_WEATHER_API_KEY_3 = 'GP4GVCRSPM49PLYL6GG3XCCND';
    const REACT_APP_WEATHER_API_KEY_4 = 'VYYWDJ2KMZJECA8DACHPRUVU3';
    const REACT_APP_WEATHER_API_KEY_5 = 'ZFDDCEUX8YARVXWEHNHDQP74C';
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
    const START_DATE_WEEK = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const END_DATE_WEEK = moment().add(5, 'days').format('YYYY-MM-DD');

    if (CITY === null) {
      dispatch(weatherOperations.fetchLocation()); //Определение локации
    } else {
      const cityQuery = encodeURIComponent(CITY.city);
      const URL_WEATHER = `${BASE_URL}${cityQuery}/${DATE}?key=${API_KEY_WEATHER_30}&lang=ru&unitGroup=metric&include=days&elements=tempmax,tempmin,pressure,icon,humidity,uvindex,datetime`;
      const URL_WEATHER_WEEK = `${BASE_URL}${cityQuery}/${START_DATE_WEEK}/${END_DATE_WEEK}?key=${API_KEY_WEATHER_30}&lang=ru&unitGroup=metric&include=hours`;

      // const URL_WEATHER_WEEK = `${BASE_URL}${CITY.city}/${START_DATE_WEEK}/${END_DATE_WEEK}?&key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&include=days`

      if (CITY.city !== undefined) {
        dispatch(weatherOperations.fetchWeatherMonth(URL_WEATHER));
        dispatch(weatherOperations.fetchWeatherWeek(URL_WEATHER_WEEK));
      }
    }
  }, [CITY, dispatch]);

  // !!!!!!!!!!------------------------------------------------------------------------
  // Поиск городов — Open-Meteo Geocoding (без ключа, CORS)
  function searchCharacters(search) {
    return fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        search
      )}&count=10&language=ru&format=json`,
      { mode: 'cors' }
    )
      .then(r => r.json())
      .then(r => r.results || [])
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
          setResults(
            results.map(i => {
              const parts = [i.name];
              if (i.admin1 && i.admin1 !== i.name) parts.push(i.admin1);
              if (i.country) parts.push(i.country);
              return parts.join(', ');
            })
          );
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
      dispatch(weatherActions.setCityName(valueCity));
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

  const normalizeCity = city => (city || '').split(',')[0].trim().toLowerCase();

  const handleCity = async () => {
    if (!isLoggedIn) return;

    const city = data_today.address;
    if (cityList.some(c => normalizeCity(c.city) === normalizeCity(city))) {
      toast.info('Этот город уже в избранном');
      return;
    }
    if (cityList.length >= 3) {
      toast.info('Достигнут лимит городов (максимум 3)');
      return;
    }

    try {
      await dispatch(
        weatherOperations.addUserCity({
          city,
          favorite: true,
          home: false,
          lat: data_today.latitude,
          lon: data_today.longitude,
        })
      ).unwrap();
    } catch (error) {
      const message = error?.message || (typeof error === 'string' ? error : 'Не удалось сохранить город');
      toast.error(message);
    }
  };

  // ----------------333333----------------------------------------
  const [anchorEl_1, setAnchorEl_1] = React.useState(null);
  const open_1 = Boolean(anchorEl_1);
  const handleClick_1 = event => {
    event.stopPropagation();
    setAnchorEl_1(event.currentTarget);
  };
  // ----------
  const [anchorEl_2, setAnchorEl_2] = React.useState(null);
  const open_2 = Boolean(anchorEl_2);
  const handleClick_2 = event => {
    event.stopPropagation();
    setAnchorEl_2(event.currentTarget);
  };
  // -----------
  const [anchorEl_3, setAnchorEl_3] = React.useState(null);
  const open_3 = Boolean(anchorEl_3);
  const handleClick_3 = event => {
    event.stopPropagation();
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

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // console.log('data_today', data_today);
    const today = Array.isArray(data_today) ? data_today[0] : data_today;
    const hour = moment().format('H');
    setWeather({
      latitude: today.latitude,
      longitude: today.longitude,
      address: today.address,
      temp: today.days[0].hours[hour].temp,
      condition: today.days[0].hours[hour].conditions,
      icon: today.days[0].hours[hour].icon,
      winddir: today.days[0].hours[hour].winddir,
      windspeed: today.days[0].hours[hour].windspeed,
    });
    // });
  }, [data_today]);

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
            inputValue={searchTerm}
            onInputChange={(event, value) => setSearchTerm(value)}
            onChange={(event, value) => {
              if (value) {
                dispatch(weatherActions.setCityName(value));
                setSearchCity({ city: value, home: false });
                setSearchTerm('');
              }
            }}
            onClose={handleClose}
            renderInput={params => (
              <TextField
                {...params}
                label="Поиск местоположения"
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
                  <IconButton aria-label="delete" size="small" onClick={e => e.stopPropagation()}>
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[0]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[0]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[0]?.temperature}°</p>
                <div onClick={e => e.stopPropagation()}>
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
                        dispatch(
                          weatherOperations.setHomeUserCity({
                            city: cityListUpdate[0].city,
                            home: !cityListUpdate[0].home,
                          })
                        );
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_1(null);
                        dispatch(weatherOperations.removeUserCity(cityListUpdate[0].city));
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
                  <IconButton aria-label="delete" size="small" onClick={e => e.stopPropagation()}>
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[1]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[1]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[1]?.temperature}°</p>
                <div onClick={e => e.stopPropagation()}>
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
                    onClose={() => setAnchorEl_2(null)}
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
                        dispatch(
                          weatherOperations.setHomeUserCity({
                            city: cityListUpdate[1].city,
                            home: !cityListUpdate[1].home,
                          })
                        );
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_2(null);
                        dispatch(weatherOperations.removeUserCity(cityListUpdate[1].city));
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
                  <IconButton aria-label="delete" size="small" onClick={e => e.stopPropagation()}>
                    <HomeIcon fontSize="inherit" />
                  </IconButton>
                )}
                <p>{cityListUpdate[2]?.city.split(',')[0]}</p>
                <img className="card-city__image" src={cityListUpdate[2]?.icon} widh="17" alt="icon" />
                <p>{cityListUpdate[2]?.temperature}°</p>
                <div onClick={e => e.stopPropagation()}>
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
                    onClose={() => setAnchorEl_3(null)}
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
                        dispatch(
                          weatherOperations.setHomeUserCity({
                            city: cityListUpdate[2].city,
                            home: !cityListUpdate[2].home,
                          })
                        );
                      }}
                      disableRipple
                    >
                      <HomeIcon />
                      Дом
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl_3(null);
                        dispatch(weatherOperations.removeUserCity(cityListUpdate[2].city));
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
              disabled={maxEl === 3 || !isLoggedIn}
            >
              <GradeIcon />
              Избранное
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="weathet__block-day">
        <WeatherCurrentDay></WeatherCurrentDay>

        <div>
          {/* {console.log(weather)} */}
          {weather && (
            <WeatherMap
              latitude={weather.latitude}
              longitude={weather.longitude}
              temp={weather.temp}
              condition={weather.condition}
              icon={weather.icon}
              address={weather.address}
              winddir={weather.winddir}
              windspeed={weather.windspeed}
            />
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <WeatherMonthMobile></WeatherMonthMobile>
          <WeatherSunMoonMobile></WeatherSunMoonMobile>
        </>
      )}
      {isTablet && (
        <>
          {/* <ChartWeather></ChartWeather> */}
          {/* <AirQuality></AirQuality> */}
          <TitleSection />

          <WeatherMonth></WeatherMonth>
          <Tiles></Tiles>
        </>
      )}
    </div>
  );
};
