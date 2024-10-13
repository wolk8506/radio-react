import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import sprite from '../../images/sprite.svg';
// import s from './WeatherDashboard.module.css';
import { Compas } from './Compas';
import { Humidity } from './Humidity';
import { Clouds } from './Clouds';
import { WindGust } from './WindGust';

import { getLocation, getWeatherToday } from 'store/thunks';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const Weather = () => {
  const CITY = useSelector(state => state.storeData.city);
  const data = useSelector(state => state.storeWeatherLastDay.today);
  const dispatch = useDispatch();

  // https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json

  const URL_WEATHER = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}/today?include=fcst%2Cobs%2Chistfcst%2Cstats%2Chours%2Cdays&key=GP4GVCRSPM49PLYL6GG3XCCND&contentType=json&lang=ru&unitGroup=metric`;
  // const iconSVG = sprite;
  const urlImage = 'https://www.visualcrossing.com/img/';

  const [image, setImage] = useState(`${urlImage}clear-day.svg`);
  const [temperature, setTemperature] = useState(0);
  const [image2, setImage2] = useState(`${urlImage}clear-day.svg`);
  const [temperature2, setTemperature2] = useState(0);
  const [changeTemperature, setChangeTemperature] = useState(true);
  const [changeImage, setChangeImage] = useState(true);

  // Запрос погоды, если первый раз, то погоду определяет по IP, делеее берет локацию из store
  useEffect(() => {
    if (CITY === null) {
      dispatch(getLocation()); //Определение локации
    } else dispatch(getWeatherToday(URL_WEATHER)); //Запрос на погоду после определения локации и все последующие запросы
  }, [CITY, URL_WEATHER, dispatch]);

  useEffect(() => {
    // console.log(data.days[0]);
    // if (data.currentConditions !== undefined) {
    setTemperature(data.days[0].temp.toFixed(0)); //Текущая температура в градусах цельсия
    setImage(`${urlImage}${data.days[0].icon}.svg`); //Иконка погодных условий
    // }
  }, [data]);
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  useEffect(() => {
    // Обновление погоды каждые 15 минут
    const interval = setInterval(() => {
      console.log('Таймер на 15 минут');
      setChangeImage(false);
      setChangeTemperature(false);
      //Запрос на погоду после определения локации и все последующие запросы
      dispatch(getWeatherToday(URL_WEATHER));
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
                <img className="img" src={image} alt="hh" width={172} />
              </div>
            </div>
            {changeImage && (
              <div className="top_new">
                <div className="text_top_new">
                  <img className="img" src={image2} alt="hh" width={172} />
                </div>
                <div className="bottom_new">
                  <div className="text_bottom">
                    <img
                      className="img_bottom"
                      src={image}
                      alt="hh"
                      width={172}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="bottom">
              <div className="text_bottom">
                <img className="img_bottom" src={image2} alt="hh" width={172} />
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
