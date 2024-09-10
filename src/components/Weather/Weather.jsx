import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWeather, getWeather15, getWeatherLastDay } from 'store/thunks';
import { weatherCity } from 'store/actions';
import sprite from '../../images/sprite.svg';
import s from './Weather.module.css';

import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';

export const Weather = () => {
  const data = useSelector(state => state.storeWeather);
  const data15 = useSelector(state => state.storeWeather15);
  const dataLast = useSelector(state => state.storeWeatherLastDay);
  const CITY = useSelector(state => state.storeWeatherCity.city);

  const dispatch = useDispatch();
  const iconSVG = sprite;
  const [valueCity, setValueCity] = useState('');
  // const [meLocation, setMeLocation] = useState('Минск');

  const [country, setCountry] = useState('--');
  const [city, setCity] = useState('--');
  const [timeZone, setTimeZone] = useState('--');
  const [temperature, setTemperature] = useState('--');
  const [conditionText, setConditionText] = useState('--');
  const [wind_ms, setWind_ms] = useState('--');
  const [wind_degree, setWind_degree] = useState(0);
  const [sunrise, setSunrise] = useState('--');
  const [sunsetH, setSunsetH] = useState('--');
  const [sunsetM, setSunsetM] = useState('--');
  const [pressure_mb, setPressure_mb] = useState('--');
  const [cloud, setCloud] = useState('--');
  const [vis_km, setVis_km] = useState('--');
  const [humidity, setHumidity] = useState('--');
  const [maxwind_ms, setMmaxwind_ms] = useState('--');
  const [uv, setUv] = useState('--');
  const [precip_mm, setPrecip_mm] = useState('--');
  const [moonrise, setMoonrise] = useState('--:--');
  const [moonset, setMoonset] = useState('--:--');
  const [icon, setIcon] = useState('--');
  // const [last_updated, setLast_updated] = useState('--');

  const [value, setValue] = React.useState('0');

  const date = new Date();
  const dayAndMonth = date.toLocaleDateString('ru-RU', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  var moment = require('moment');

  useEffect(() => {
    const URL_LAST_DAY = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/last6days?key=D6MDZY6JMNHMG6CBQANG3GNHD&include=days&lang=ru&unitGroup=metric`;
    const URL_WEATHER = `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${CITY}&days=14&lang=ru`;
    const URL_WEATHER15 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}?key=D6MDZY6JMNHMG6CBQANG3GNHD&lang=ru&unitGroup=metric`;
    dispatch(getWeather(URL_WEATHER));
    dispatch(getWeather15(URL_WEATHER15));
    dispatch(getWeatherLastDay(URL_LAST_DAY));
  }, [CITY, dispatch]);

  function handleSearch(e) {
    if (e.key === 'Escape') {
      setValueCity('');
    }
    if (e.key === 'Enter') {
      if (valueCity.length > 1) {
        dispatch(weatherCity(valueCity));
      }
      setValueCity('');
    }
    if (e.buttons === 0) {
      if (valueCity.length > 1) {
        dispatch(weatherCity(valueCity));
      }
      setValueCity('');
    }
  }

  function handleLocation() {
    locationWeather(valueCity);
  }
  function handleCity(e) {
    setValueCity(e.target.value);
  }

  function locationWeather() {
    function success(position) {
      dispatch(
        weatherCity(`${position.coords.latitude},${position.coords.longitude}`)
      );
    }

    function error() {
      console.log('Невозможно получить ваше местоположение');
    }

    if (!navigator.geolocation) {
      alert('Geolocation не поддерживается вашим браузером');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // const handleRadioChange = event => {
  //   setValue(event.target.value);
  // };

  useEffect(() => {
    if (data.location !== undefined) {
      setCountry(data.location.country); //Страна
      setCity(data.location.name); //Город
      setTimeZone(data.location.tz_id); //Временная зона
      setTemperature(data.current.feelslike_c); //Текущая температура в градусах цельсия
      setConditionText(data.current.condition.text); //Погодные условия, описание
      setWind_ms((data.current.wind_kph / 3.6).toFixed(2)); //Скорость ветра в м/с
      setWind_degree(data.current.wind_degree); //Направление ветра в градусах   data.current.wind_degree + 136,
      setSunrise(data.forecast.forecastday[0].astro.sunrise.slice(0, -3)); //Время рассвета
      setSunsetH(
        Number(data.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12
      ); //Время заката - часы
      setSunsetM(data.forecast.forecastday[0].astro.sunset.slice(3, -3)); //Время заката - минуты
      setIcon(
        `//cdn.weatherapi.com/weather/128x128${data.current.condition.icon.slice(
          34
        )}`
      ); //Иконка погодных условий
      setPressure_mb(data.current.pressure_mb); //Давление мм рт сб
      setCloud(data.current.cloud); // Облачность
      setVis_km(data.current.vis_km); // Видимость километров
      setHumidity(data.current.humidity); // Влажность
      setMmaxwind_ms(
        (data.forecast.forecastday[0].day.maxwind_kph / 3.6).toFixed(2)
      ); // Порывы ветра м/с
      setUv(data.current.uv); // Ультрофиолет
      setPrecip_mm(data.current.precip_mm); // Осадки мм
      const moonrise = data.forecast.forecastday[0].astro.moonrise;
      const moonset = data.forecast.forecastday[0].astro.moonset;
      // setLast_updated(data.current.last_updated);

      if (moonrise.slice(6) === 'PM') {
        setMoonrise(
          `${Number(moonrise.slice(0, 2)) + 12}:${moonrise.slice(3, 5)}`
        );
      } else setMoonrise(moonrise.slice(0, 5));

      if (moonset.slice(6) === 'PM') {
        setMoonset(
          `${Number(moonset.slice(0, 2)) + 12}:${moonset.slice(3, 5)}`
        );
      } else setMoonset(moonset.slice(0, 5));
    }
  }, [data]);

  //
  // ???
  //  -----------------------------------------------------------------
  const [dataDays, setDataDays] = useState([]);

  useEffect(() => {
    let key = 0;
    const DAY = moment().format('d');
    const data1 = [];
    let dayLast16 = 0;

    if (data15.days === undefined || dataLast.days === undefined) {
      return;
    }

    for (let i = 0; i < dataLast.days.length; i++) {
      if (8 - DAY <= i) {
        data1.push({ ...dataLast.days[i], dayEnable: false, key: key });
        key++;
      } else if (DAY === '0' && i > 0) {
        data1.push({ ...dataLast.days[i], dayEnable: false, key: key });
        key++;
      }
    }
    data15.days.map(i =>
      data1.push({ ...i, dayEnable: true, key: i.datetime })
    );
    for (let i = 0; i < dataLast.days.length; i++) {
      if (7 - DAY > i && DAY !== '0') {
        data1.push({
          datetime: moment()
            .add(15 + dayLast16, 'days')
            .format('YYYY-MM-DD'),
          tempmax: '--.-',
          icon: 'partly-cloudy-day',
          description: '----- ------- - ------- ---.',
          dayEnable: false,
          key: key,
        });
        key++;
        dayLast16++;
      }
    }
    setDataDays(data1);
  }, [data15.days, dataLast.days, dataLast.length, moment]);

  const [btnActiv, setBtnActiv] = useState('0');

  const btnRadio = e => {
    setBtnActiv(e.target.value);
    setValue(e.target.value);
    // console.log('btn click', e.target.value);
  };

  // !!!!!! Стили

  const styleWindW = {
    transform: `rotate(${wind_degree}deg)`,
  };

  const styleDayW = {
    background: `rgba(255, 255, 255, 0.15)`,
  };
  const styleDayD = {
    background: `rgba(0, 0, 0, 0.15)`,
  };

  return (
    <div>
      <div className={s.blockDay}>
        {/* !!!!! Погода на текущий день */}
        <div className={s.blockDayLeft}>
          <p>
            {timeZone}, {dayAndMonth}
          </p>
          <div>
            <img src={icon} widh="128" alt="icon" />
            <p>{temperature}°</p>
          </div>
          <p className={s.conditionText}>{conditionText}</p>
        </div>
        <div className={s.blockDayCentr}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              aria-label="location"
              size="large"
              onClick={handleLocation}
            >
              <GpsFixedIcon fontSize="inherit" />
            </IconButton>

            <TextField
              id="city"
              value={valueCity}
              label={`${country}, ${city}`}
              variant="standard"
              onInput={handleCity}
              onKeyDown={handleSearch}
            />

            <IconButton aria-label="delete" size="large">
              <SearchIcon fontSize="inherit" onClick={handleSearch} />
            </IconButton>
          </Stack>
          {/* <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={value}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Погодные условия"
              />
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Температура"
              />
              <FormControlLabel value="2" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl> */}

          <div className="btn-block">
            <button
              className={
                btnActiv === '0' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="0"
              onClick={btnRadio}
            >
              🌦
            </button>

            <button
              className={
                btnActiv === '1' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="1"
              onClick={btnRadio}
            >
              🌪
            </button>

            <button
              className={
                btnActiv === '2' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="2"
              onClick={btnRadio}
            >
              🌡
            </button>
          </div>
        </div>
        <div className={s.blockDayRight}>
          <div>
            <p title="Восход солнца" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunrise`}></use>
              </svg>
              {sunrise}
            </p>
            <p title="Закат солнца" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunset`}></use>
              </svg>
              {sunsetH}:{sunsetM}
            </p>
            <p title="Восход луны" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-moonrise`}></use>
              </svg>
              {moonrise}
            </p>
            <p title="Закат луны" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-moonset`}></use>
              </svg>
              {moonset}
            </p>
          </div>
          <div className={s.conditionBlockSmall}>
            <p title="Количество осадков" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-umbrella`}></use>
              </svg>
              {precip_mm} мм
            </p>

            <p title="Облачность" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-clouds`}></use>
              </svg>
              {cloud} %
            </p>
            <p title="Видимость" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-eye3`}></use>
              </svg>
              {vis_km} км
            </p>
            <p title="Влажность" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-raindrop1`}></use>
              </svg>
              {humidity} %
            </p>
          </div>

          <div>
            <p
              title="Скорость и направление ветра"
              className={s.conditionBlockItem}
            >
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-air-sock`}></use>
              </svg>
              {wind_ms} м/с &#160;
              <svg width="32" height="32" style={styleWindW}>
                <use href={`${iconSVG}#icon-wind-w`}></use>
              </svg>
            </p>
            <p title="Ультрофиолет" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sun`}></use>
              </svg>
              {uv}/10 UV
            </p>
            <p title="Порывы ветра" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-wind`}></use>
              </svg>
              {maxwind_ms} м/с
            </p>

            <p title="Давление" className={s.conditionBlockItem}>
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-barometer`}></use>
              </svg>
              {pressure_mb} мм
            </p>
          </div>
        </div>
      </div>
      {dataDays ? (
        <div className={s.daysBlock}>
          {dataDays.map(i => (
            <div
              key={i.key}
              className={s.dayCard}
              style={i.dayEnable ? styleDayW : styleDayD}
            >
              <p>{moment(i.datetime).format('dddd DD MMMM')}</p>
              <div>
                <img
                  src={`https://www.visualcrossing.com/img/${i.icon}.svg`}
                  alt="hh"
                  width={72}
                />
                <div>
                  <p> {i.tempmax} </p>
                </div>
              </div>

              {value === '0' && (
                <>
                  <p> {i.conditions} </p>
                  <p> {i.description} </p>
                </>
              )}
              {value === '1' && (
                <>
                  <p>Облачность {i.humidity}% </p>
                  <p>Давление {i.pressure} </p>
                  <p>UV {i.uvindex} </p>
                </>
              )}
              {value === '2' && (
                <>
                  <p>Температура ср. {i.temp} </p>
                  <p>Температура макс. {i.tempmax} </p>
                  <p>Температура мин. {i.tempmin} </p>
                </>
              )}

              <div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.spinner}>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
    </div>
  );
};
