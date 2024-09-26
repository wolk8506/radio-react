import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getWeather15,
  getWeatherLastDay,
  getWeatherElements,
  getLocation,
} from 'store/thunks';
import { weatherCity } from 'store/actions';
import sprite from '../../images/sprite.svg';
import { ChartWeather } from './ChartWeather';
import moment from 'moment';

import SearchIcon from '@mui/icons-material/Search';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Tiles } from './Tiles';

// const { REACT_APP_WEATHER_API_KEY_2 } = process.env;

moment().locale('ru');

export const Weather = () => {
  const dispatch = useDispatch();
  const dataEvents = useSelector(state => state.storeWeatherElements);
  const data15 = useSelector(state => state.storeWeather15);
  const dataLast = useSelector(state => state.storeWeatherLastDay);
  const CITY = useSelector(state => state.storeData.city);
  const urlImage = 'https://www.visualcrossing.com/img/';
  const BASE_URL =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

  const iconSVG = sprite;
  const [valueCity, setValueCity] = useState('');
  const [country, setCountry] = useState('--');
  const [city, setCity] = useState('--');
  const [timeZone, setTimeZone] = useState('--');
  const [temperature, setTemperature] = useState('--');
  const [conditionText, setConditionText] = useState('--');
  const [wind_ms, setWind_ms] = useState('--');
  const [wind_degree, setWind_degree] = useState(0);
  const [sunrise, setSunrise] = useState('--');
  const [sunset, setSunset] = useState('--');
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
  const [dataDays, setDataDays] = useState([]);
  const [btnActiv, setBtnActiv] = useState('0');
  const [moonPhase, setMoonPhase] = useState('0');
  const [dew, setDew] = useState(0);

  const btnRadio = e => setBtnActiv(e.target.value);

  useEffect(() => {
    const REACT_APP_WEATHER_API_KEY_2 = 'D6MDZY6JMNHMG6CBQANG3GNHD';
    const URL_LAST_DAY = `${BASE_URL}${CITY}/last6days?key=${REACT_APP_WEATHER_API_KEY_2}&include=days&lang=ru&unitGroup=metric`;
    const URL_WEATHER15 = `${BASE_URL}${CITY}?key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&unitGroup=metric`;
    const URL_WEATHER_ELEMENTS = `${BASE_URL}${CITY}?key=${REACT_APP_WEATHER_API_KEY_2}&lang=ru&unitGroup=metric&include=days&elements=datetime,moonphase,sunrise,sunset,moonrise,moonset`;

    dispatch(getWeatherElements(URL_WEATHER_ELEMENTS));
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
    dispatch(getLocation());
  }

  function handleCity(e) {
    setValueCity(e.target.value);
  }

  useEffect(() => {
    const hour = moment().format('H');

    setTimeZone(data15.timezone); //Временная зона
    setCountry(data15.resolvedAddress.split(', ')[1]); //Страна
    setCity(data15.address); //Город
    setConditionText(data15.days[0].hours[hour].conditions); //Погодные условия, описание
    setTemperature(data15.days[0].hours[hour].temp); //Текущая температура в градусах цельсия
    setIcon(`${urlImage}${data15.days[0].hours[hour].icon}.svg`); //Иконка погодных условий
    setUv(data15.days[0].hours[hour].uvindex); // Ультрофиолет
    setPressure_mb(data15.days[0].hours[hour].pressure); //Давление мм рт сб
    setVis_km(data15.days[0].hours[hour].visibility); // Видимость километров
    setHumidity(data15.days[0].hours[hour].humidity); // Влажность
    setPrecip_mm(data15.days[0].hours[hour].precip); // Осадки мм
    setWind_degree(data15.days[0].hours[hour].winddir); //Направление ветра в градусах   data.current.wind_degree + 136,
    setWind_ms((data15.days[0].hours[hour].windspeed / 3.6).toFixed(2)); //Скорость ветра в м/с
    setCloud(data15.days[0].hours[hour].cloudcover); // Облачность
    setMmaxwind_ms((data15.days[0].hours[hour].windgust / 3.6).toFixed(2)); // Порывы ветра м/с
    setDew(data15.days[0].hours[hour].dew);
  }, [data15]);

  useEffect(() => {
    setMoonrise(dataEvents.days[0].moonrise);
    setMoonset(dataEvents.days[0].moonset);
    setMoonPhase(dataEvents.days[0].moonphase); //Фаза луны
    setSunrise(dataEvents.days[0].sunrise); //Время рассвета
    setSunset(dataEvents.days[0].sunset); //Время заката
  }, [dataEvents]);

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
  }, [data15.days, dataLast.days, dataLast.length]);

  // !!!!!! Стили

  const styleWindW = {
    transform: `rotate(${wind_degree}deg)`,
  };

  return (
    <div className="weather">
      <div className="weather__day">
        <div className="blockDayLeft">
          <p>
            {timeZone}, {moment().format('dddd DD MMMM')}
          </p>
          <div>
            <img src={icon} widh="128" alt="icon" />
            <p>{temperature}°</p>
          </div>
          <p className="conditionText">{conditionText}</p>
        </div>
        <div className="blockDayCentr">
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              aria-label="location"
              size="large"
              onClick={handleLocation}
            >
              <GpsFixedIcon className="btn-ico" fontSize="inherit" />
            </IconButton>

            <TextField
              id="city"
              value={valueCity}
              label={`${country}, ${city}`}
              variant="standard"
              onInput={handleCity}
              onKeyDown={handleSearch}
              color="warning"
            />

            <IconButton aria-label="delete" size="large">
              <SearchIcon
                className="btn-ico"
                fontSize="inherit"
                onClick={handleSearch}
              />
            </IconButton>
          </Stack>

          <div className="btn-block">
            <button
              className={
                btnActiv === '0' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="0"
              onClick={btnRadio}
            >
              🌡
            </button>
            <button
              className={
                btnActiv === '1' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="1"
              onClick={btnRadio}
            >
              🌦
            </button>

            <button
              className={
                btnActiv === '2' ? 'btn-radio toggle_on' : 'btn-radio toggle'
              }
              type="button"
              value="2"
              onClick={btnRadio}
            >
              🌪
            </button>
          </div>
        </div>

        <div className="blockDayRight">
          <div>
            <p title="Восход солнца" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunrise`}></use>
              </svg>
              {sunrise}
            </p>
            <p title="Закат солнца" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sunset`}></use>
              </svg>
              {sunset}
            </p>
            <p title="Восход луны" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-moonrise`}></use>
              </svg>
              {moonrise}
            </p>
            <p title="Закат луны" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-moonset`}></use>
              </svg>
              {moonset}
            </p>
          </div>
          <div className="conditionBlockSmall">
            <p title="Количество осадков" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-umbrella`}></use>
              </svg>
              {precip_mm} мм
            </p>

            <p title="Облачность" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-clouds`}></use>
              </svg>
              {cloud} %
            </p>
            <p title="Видимость" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-eye3`}></use>
              </svg>
              {vis_km} км
            </p>
            <p title="Влажность" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-raindrop1`}></use>
              </svg>
              {humidity} %
            </p>
          </div>

          <div>
            <p
              title="Скорость и направление ветра"
              className="conditionBlockItem"
            >
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-air-sock`}></use>
              </svg>
              {wind_ms} м/с &#160;
              <svg width="32" height="32" style={styleWindW}>
                <use href={`${iconSVG}#icon-wind-w`}></use>
              </svg>
            </p>
            <p title="Ультрофиолет" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-sun`}></use>
              </svg>
              {uv}/10 UV
            </p>
            <p title="Порывы ветра" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-wind`}></use>
              </svg>
              {maxwind_ms} м/с
            </p>

            <p title="Давление" className="conditionBlockItem">
              <svg width="32" height="32">
                <use href={`${iconSVG}#icon-barometer`}></use>
              </svg>
              {pressure_mb} мм
            </p>
          </div>
        </div>
      </div>

      <ChartWeather value={btnActiv}></ChartWeather>
      {dataDays ? (
        <div className="daysBlock">
          {dataDays.map(i => (
            <div
              key={i.key}
              className={
                i.dayEnable ? 'dayCard dayCard--off' : 'dayCard dayCard--on'
              }
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

              {btnActiv === '0' && (
                <>
                  <h4>Температура</h4>
                  <p>средняя {i.temp} </p>
                  <p>максимальная {i.tempmax} </p>
                  <p>минимальная {i.tempmin} </p>
                </>
              )}

              {btnActiv === '1' && (
                <>
                  <p> {i.conditions} </p>
                  <p> {i.description} </p>
                </>
              )}
              {btnActiv === '2' && (
                <>
                  <p>Облачность {i.humidity}% </p>
                  <p>Давление {i.pressure} </p>
                  <p>UV {i.uvindex} </p>
                </>
              )}

              <div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="spinner">
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      <Tiles
        moonPhase={moonPhase}
        sunrise={sunrise}
        sunset={sunset}
        moonrise={moonrise}
        moonset={moonset}
        humidity={humidity}
        dew={dew}
      ></Tiles>
    </div>
  );
};
