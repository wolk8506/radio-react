import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWeather, getWeather15, getWeatherLastDay } from 'store/thunks';
import { weatherCity } from 'store/actions';
import sprite from '../../images/sprite.svg';
// import s from './Weather.module.css';

import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';

export const Arduino = () => {
  // const data = useSelector(state => state.storeWeather);
  // const data15 = useSelector(state => state.storeWeather15);
  // const dataLast = useSelector(state => state.storeWeatherLastDay);
  // const CITY = useSelector(state => state.storeWeatherCity.city);

  // const dispatch = useDispatch();
  // const iconSVG = sprite;
  // const [valueCity, setValueCity] = useState('');
  // // const [meLocation, setMeLocation] = useState('Минск');

  // const [country, setCountry] = useState('--');
  // const [city, setCity] = useState('--');
  // const [timeZone, setTimeZone] = useState('--');
  // const [temperature, setTemperature] = useState('--');
  // const [conditionText, setConditionText] = useState('--');
  // const [wind_ms, setWind_ms] = useState('--');
  // const [wind_degree, setWind_degree] = useState(0);
  // const [sunrise, setSunrise] = useState('--');
  // const [sunsetH, setSunsetH] = useState('--');
  // const [sunsetM, setSunsetM] = useState('--');
  // const [pressure_mb, setPressure_mb] = useState('--');
  // const [cloud, setCloud] = useState('--');
  // const [vis_km, setVis_km] = useState('--');
  // const [humidity, setHumidity] = useState('--');
  // const [maxwind_ms, setMmaxwind_ms] = useState('--');
  // const [uv, setUv] = useState('--');
  // const [precip_mm, setPrecip_mm] = useState('--');
  // const [moonrise, setMoonrise] = useState('--:--');
  // const [moonset, setMoonset] = useState('--:--');
  // const [icon, setIcon] = useState('--');
  // const [last_updated, setLast_updated] = useState('--');

  // const [value, setValue] = React.useState('0');

  // const date = new Date();
  // const dayAndMonth = date.toLocaleDateString('ru-RU', {
  //   month: 'long',
  //   day: 'numeric',
  //   weekday: 'long',
  // });
  // var moment = require('moment');
  async function fetchMovies() {
    const response = await fetch('http://192.168.1.209');
    // ждем выполнения запроса
    console.log(response);
  }
  useEffect(() => {
    fetchMovies();
    //   async
    //  const response = await  fetch('http://192.168.1.209')
    //     .then(response => {
    //       console.log(response);
    //       // return response.json();
    //     })
    //     .then(data => {
    //       console.log(data);
    //     });
  }, []);

  // function handleSearch(e) {
  //   if (e.key === 'Escape') {
  //     setValueCity('');
  //   }
  //   if (e.key === 'Enter') {
  //     if (valueCity.length > 1) {
  //       dispatch(weatherCity(valueCity));
  //     }
  //     setValueCity('');
  //   }
  //   if (e.buttons === 0) {
  //     if (valueCity.length > 1) {
  //       dispatch(weatherCity(valueCity));
  //     }
  //     setValueCity('');
  //   }
  // }

  // function handleLocation() {
  //   locationWeather(valueCity);
  // }
  // function handleCity(e) {
  //   setValueCity(e.target.value);
  // }

  // function locationWeather() {
  //   function success(position) {
  //     dispatch(
  //       weatherCity(`${position.coords.latitude},${position.coords.longitude}`)
  //     );
  //   }

  //   function error() {
  //     console.log('Невозможно получить ваше местоположение');
  //   }

  //   if (!navigator.geolocation) {
  //     alert('Geolocation не поддерживается вашим браузером');
  //   } else {
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   }
  // }

  // // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // const handleRadioChange = event => {
  //   setValue(event.target.value);
  // };

  // useEffect(() => {
  //   if (data.location !== undefined) {
  //     setCountry(data.location.country); //Страна
  //     setCity(data.location.name); //Город
  //     setTimeZone(data.location.tz_id); //Временная зона
  //     setTemperature(data.current.feelslike_c); //Текущая температура в градусах цельсия
  //     setConditionText(data.current.condition.text); //Погодные условия, описание
  //     setWind_ms((data.current.wind_kph / 3.6).toFixed(2)); //Скорость ветра в м/с
  //     setWind_degree(data.current.wind_degree); //Направление ветра в градусах   data.current.wind_degree + 136,
  //     setSunrise(data.forecast.forecastday[0].astro.sunrise.slice(0, -3)); //Время рассвета
  //     setSunsetH(
  //       Number(data.forecast.forecastday[0].astro.sunset.slice(0, 2)) + 12
  //     ); //Время заката - часы
  //     setSunsetM(data.forecast.forecastday[0].astro.sunset.slice(3, -3)); //Время заката - минуты
  //     setIcon(
  //       `//cdn.weatherapi.com/weather/128x128${data.current.condition.icon.slice(
  //         34
  //       )}`
  //     ); //Иконка погодных условий
  //     setPressure_mb(data.current.pressure_mb); //Давление мм рт сб
  //     setCloud(data.current.cloud); // Облачность
  //     setVis_km(data.current.vis_km); // Видимость километров
  //     setHumidity(data.current.humidity); // Влажность
  //     setMmaxwind_ms(
  //       (data.forecast.forecastday[0].day.maxwind_kph / 3.6).toFixed(2)
  //     ); // Порывы ветра м/с
  //     setUv(data.current.uv); // Ультрофиолет
  //     setPrecip_mm(data.current.precip_mm); // Осадки мм
  //     const moonrise = data.forecast.forecastday[0].astro.moonrise;
  //     const moonset = data.forecast.forecastday[0].astro.moonset;
  //     setLast_updated(data.current.last_updated);

  //     if (moonrise.slice(6) === 'PM') {
  //       setMoonrise(
  //         `${Number(moonrise.slice(0, 2)) + 12}:${moonrise.slice(3, 5)}`
  //       );
  //     } else setMoonrise(moonrise.slice(0, 5));

  //     if (moonset.slice(6) === 'PM') {
  //       setMoonset(
  //         `${Number(moonset.slice(0, 2)) + 12}:${moonset.slice(3, 5)}`
  //       );
  //     } else setMoonset(moonset.slice(0, 5));
  //   }
  // }, [data]);

  // //
  // // ???
  // //  -----------------------------------------------------------------
  // const [dataDays, setDataDays] = useState([]);

  // useEffect(() => {
  //   let key = 0;
  //   const DAY = moment().format('d');
  //   const data1 = [];
  //   let dayLast16 = 0;

  //   if (data15.days === undefined || dataLast.days === undefined) {
  //     return;
  //   }

  //   for (let i = 0; i < dataLast.days.length; i++) {
  //     if (8 - DAY <= i) {
  //       data1.push({ ...dataLast.days[i], dayEnable: false, key: key });
  //       key++;
  //     } else if (DAY === '0' && i > 0) {
  //       data1.push({ ...dataLast.days[i], dayEnable: false, key: key });
  //       key++;
  //     }
  //   }
  //   data15.days.map(i =>
  //     data1.push({ ...i, dayEnable: true, key: i.datetime })
  //   );
  //   for (let i = 0; i < dataLast.days.length; i++) {
  //     if (7 - DAY > i && DAY !== '0') {
  //       data1.push({
  //         datetime: moment()
  //           .add(15 + dayLast16, 'days')
  //           .format('YYYY-MM-DD'),
  //         tempmax: '--.-',
  //         icon: 'partly-cloudy-day',
  //         description: '----- ------- - ------- ---.',
  //         dayEnable: false,
  //         key: key,
  //       });
  //       key++;
  //       dayLast16++;
  //     }
  //   }
  //   setDataDays(data1);
  // }, [data15.days, dataLast.days, dataLast.length, moment]);

  // // !!!!!! Стили

  // const styleWindW = {
  //   transform: `rotate(${wind_degree}deg)`,
  // };

  // const styleDayW = {
  //   background: `rgba(255, 255, 255, 0.3)`,
  // };
  // const styleDayD = {
  //   background: `rgba(0, 0, 0, 0.15)`,
  // };

  return <h2>Arduino</h2>;
};
