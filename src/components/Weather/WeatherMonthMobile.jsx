import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors, rootSelectors } from 'store';

import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import weatherImage from 'components/Weather/weatherIcon';

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export const WeatherMonthMobile = () => {
  const themeImageWeather = useSelector(rootSelectors.getThemeIconWeather);
  const data_month = useSelector(weatherSelectors.getWeatherMonth_Data);
  // const urlImage = 'https://www.visualcrossing.com/img/';
  const [data, setData] = useState(false);
  const [dataMonth, setDataMonth] = useState(false);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    const arr = [];

    data_month.days.map(
      i =>
        i.datetime >= date &&
        arr.push({
          tempmax: i.tempmax,
          tempmin: i.tempmin,
          datetime: moment(i.datetime).format('DD'),
          day: moment(i.datetime).format('dd'),
          icon: weatherImage(i.icon, themeImageWeather),
          precip: i.precip,
        })
    );
    setData(arr);
  }, [data_month.days, themeImageWeather]);

  useEffect(() => {
    const date = moment().format('YYYY-MM-DD');
    const arr = [];

    data_month.days.map(i =>
      arr.push({
        tempmax: i.tempmax.toFixed(0),
        tempmin: i.tempmin.toFixed(0),
        datetime: moment(i.datetime).format('DD'),
        day: moment(i.datetime).format('dd'),
        icon: weatherImage(i.icon, themeImageWeather),
        activ: date === i.datetime ? 'activ' : 'no-activ',
        past: moment(i.datetime).isBefore(moment(), 'day') ? 'is-past' : '',
      })
    );
    arr.shift();
    setDataMonth(arr);
  }, [data_month.days, themeImageWeather]);

  const [layout, setLayout] = React.useState(undefined);
  return (
    <>
      {data && (
        <div className="weather10days">
          <h2 className="weather10days__title">
            <p className="title__text">10 дней</p>
            <button
              className="title__btn"
              onClick={() => {
                setLayout('fullscreen');
              }}
            >
              Ежемесячно &#62;{' '}
            </button>
          </h2>
          <div className="weather10days__days">
            <div className="days__daily-carousel">
              <div className="daily-carousel__carousel">
                <div>
                  <ul className="card-container">
                    <li className="container">
                      <button type="button" className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">Сегодня</p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[0]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[0]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[0]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[0]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[1]?.day} {data[1]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[1]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[1]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[1]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[1]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[2]?.day} {data[2]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[2]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[2]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[2]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[2]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[3]?.day} {data[3]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[3]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[3]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[3]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[3]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[4]?.day} {data[4]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[4]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[4]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[4]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[4]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[5]?.day} {data[5]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[5]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[5]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[5]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[5]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[6]?.day} {data[6]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[6]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[6]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[6]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[6]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[7]?.day} {data[7]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[7]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[7]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[7]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[7]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[8]?.day} {data[8]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[8]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[8]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[8]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[8]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li className="container">
                      <button className="day-card">
                        <span className="set-focus">
                          <div className="main-part">
                            <p className="header">
                              {data[9]?.day} {data[9]?.datetime}
                            </p>
                            <div className="icon-temp-part">
                              <div className="icon-temp-part__image">
                                <img src={data[9]?.icon} alt="" width={36} />
                              </div>
                              <div>
                                <p className="icon-temp-part__tempmax">{data[9]?.tempmax}°</p>
                                <p className="icon-temp-part__tempmin">{data[9]?.tempmin}°</p>
                                <div className="icon-temp-part__precip">
                                  <WaterDropIcon className="icon-temp-part__precip-icon" />
                                  {data[9]?.precip}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={!!layout}
        onClose={() => setLayout(undefined)}
        disableScrollLock
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(20, 24, 32, 0.97)',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative', pr: 6 }}>
          Погода на месяц
          <IconButton
            aria-label="close"
            onClick={() => setLayout(undefined)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'rgba(255,255,255,0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="modal">
            <div className="month-calendar">
              <div className="month-calendar__table-container">
                <div className="table-container__table-content">
                  <ul className="table-content__content-items">
                      {dataMonth &&
                        dataMonth.map(i => (
                          <li className={`content-item ${i.past}`} key={i.datetime}>
                            <div className={i.activ}>
                            <div className="calendar-table-day">
                              <span>{i.datetime}</span>
                              <span>{i.day}</span>
                            </div>
                            <div className="calendar-table-day-forecast">
                              <img src={i.icon} alt="" width={32} />
                              <div className="calendar-table-day-forecast__temp">
                                <span>{i.tempmax}°</span>
                                <span>{i.tempmin}°</span>
                              </div>
                            </div>
                          </div>
                        </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
