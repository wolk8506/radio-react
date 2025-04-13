import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Compas } from './Compas';
import { Humidity } from './Humidity';
import { Clouds } from './Clouds';
import { WindGust } from './WindGust';

import { getThemeIconWeather, getWeatherToday_Data } from 'store/selectors';
import { fetchWeatherToday } from 'store/operation';
import { fetchLocation } from 'store/operation';
import { getCityName } from 'store/selectors';

import weatherImage from 'components/Weather/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const Weather = () => {
  const themeImageWeather = useSelector(getThemeIconWeather);

  const CITY = useSelector(getCityName);
  const data = useSelector(getWeatherToday_Data);
  const dispatch = useDispatch();

  const URL_WEATHER = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json&lang=ru&unitGroup=metric`;
  // const urlImage = 'https://www.visualcrossing.com/img/';

  const [image, setImage] = useState(weatherImage('clear-day', themeImageWeather));
  const [imageAlt, setImageAlt] = useState(weatherImage('clear-day', themeImageWeather));
  const [temperature, setTemperature] = useState(0);
  const [image2, setImage2] = useState(weatherImage('clear-day', themeImageWeather));
  const [temperature2, setTemperature2] = useState(0);
  const [changeTemperature, setChangeTemperature] = useState(true);
  const [changeImage, setChangeImage] = useState(true);

  // Запрос погоды, если первый раз, то погоду определяет по IP, делеее берет локацию из store
  useEffect(() => {
    if (CITY === null) {
      dispatch(fetchLocation()); //Определение локации
    } else dispatch(fetchWeatherToday(URL_WEATHER)); //Запрос на погоду после определения локации и все последующие запросы
  }, [CITY, URL_WEATHER, dispatch]);

  useEffect(() => {
    const hour = moment().format('H');

    setTemperature(data.days[0].hours[hour].temp.toFixed(0)); //Текущая температура в градусах цельсия
    // setImage(`${urlImage}${data.days[0].hours[hour].icon}.svg`); //Иконка погодных условий
    setImage(weatherImage(data.days[0].hours[hour].icon, themeImageWeather)); //Иконка погодных условий
    setImageAlt(data.days[0].hours[hour].icon);
    // console.log(data.days[0].hours[hour].icon);
  }, [data, themeImageWeather]);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  useEffect(() => {
    // Обновление погоды каждые 15 минут
    const interval = setInterval(() => {
      // console.log('Таймер на 15 минут');
      setChangeImage(false);
      setChangeTemperature(false);
      //Запрос на погоду после определения локации и все последующие запросы
      dispatch(fetchWeatherToday(URL_WEATHER));
    }, 1800000);

    return () => clearInterval(interval);
  }, [URL_WEATHER, dispatch]);

  useEffect(() => {
    setChangeTemperature(true);
    const interval = setInterval(() => {
      setTemperature2(temperature);
    }, 500);

    return () => clearInterval(interval);
  }, [temperature]);

  useEffect(() => {
    setChangeImage(true);
    const interval = setInterval(() => {
      setImage2(image);
    }, 500);

    return () => clearInterval(interval);
  }, [image]);

  return (
    <>
      <div className="wrapper">
        <div className="weather-dashboard">
          <div className="flipper">
            <div className="gear"></div>
            <div className="gear"></div>
            <div className="top">
              <div className="text">
                <img className="img" src={image} alt={imageAlt} width={172} />
              </div>
            </div>
            {changeImage && (
              <div className="top_new">
                <div className="text_top_new">
                  <img className="img" src={image2} alt={imageAlt} width={172} />
                </div>
                <div className="bottom_new">
                  <div className="text_bottom">
                    <img className="img_bottom" src={image} alt={imageAlt} width={172} />
                  </div>
                </div>
              </div>
            )}
            <div className="bottom">
              <div className="text_bottom">
                <img className="img_bottom" src={image2} alt={imageAlt} width={172} />
              </div>
            </div>
          </div>

          <div className="flipper">
            <div className="gear"></div>
            <div className="gear"></div>
            <div className="top">
              <div className="text">{temperature}</div>
            </div>
            {changeTemperature && (
              <div className="top_new">
                <div className="text_top_new">{temperature2}</div>
                <div className="bottom_new">
                  <div className="text_bottom">{temperature}</div>
                </div>
              </div>
            )}
            <div className="bottom">
              <div className="text_bottom">{temperature2}</div>
            </div>
          </div>
          <div className="flipper">
            <div className="pribors">
              <div className="pribor1">
                <Compas></Compas>
              </div>
              <div className="pribor">
                <Humidity></Humidity>
              </div>
              <div className="pribor">
                <WindGust></WindGust>
              </div>
              <div className="pribor">
                <Clouds></Clouds>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
