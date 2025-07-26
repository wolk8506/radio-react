import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import moment from 'moment';

export const TilesSun = () => {
  // const data_today = useSelector(weatherSelectors.getWeatherToday_Data);

  const data_today = useSelector(weatherSelectors.getWeatherWeek_Data);

  const [sunrise, setSunrise] = useState('--:--');
  const [sunset, setSunset] = useState('--:--');

  useEffect(() => {
    setSunrise(data_today.days[1].sunrise); //Время рассвета
    setSunset(data_today.days[1].sunset); //Время заката
  }, [data_today.days]);

  const dateA = moment.utc(sunset, 'HH:mm:ss');
  const dateB = moment.utc(sunrise, 'HH:mm:ss');

  const sunriseTime = sunrise.slice(0, -3);
  const sunsetTime = sunset.slice(0, -3);

  // ?  --  start --  Sun

  const [sunX, setSunX] = useState(0);
  const [sunY, setSunY] = useState(0);
  const [minuteDay, setMinuteDay] = useState(0);
  const [hourDay, setHourDay] = useState(0);
  const [color_1, setColor_1] = useState('#acacac');

  const colorSun = {
    fill: color_1,
  };

  useEffect(() => {
    // * Время солнечного дня
    const secondDay = moment.utc(dateA.diff(dateB)).seconds();
    const minuteDay = moment.utc(dateA.diff(dateB)).minute();
    const hourDay = moment.utc(dateA.diff(dateB)).hour();
    const timeDay = secondDay + minuteDay * 60 + hourDay * 3600;
    setMinuteDay(minuteDay);
    setHourDay(hourDay);

    // * Определение начала дня в секундах

    const secondRice = moment.utc(sunrise, 'HH:mm:ss').seconds();
    const minuteRice = moment.utc(sunrise, 'HH:mm:ss').minute();
    const hourRice = moment.utc(sunrise, 'HH:mm:ss').hour();
    const timeRise = secondRice + minuteRice * 60 + hourRice * 3600;

    // *  Текущее время
    const second2 = moment().seconds();
    const minute2 = moment().minute();
    const hour2 = moment().hour();
    const timeCurrent = second2 + minute2 * 60 + hour2 * 3600;

    let sdvig;
    if (timeCurrent >= timeRise + timeDay) {
      const timeGraf = 86400 - (timeDay + timeRise);
      sdvig = 240 - (86400 - timeCurrent) / (timeGraf / 60);
      setColor_1('#acacac');
    } else if (timeRise <= timeCurrent) {
      const timeGraf = timeDay - (timeCurrent - timeRise);
      sdvig = 180 - timeGraf / (timeDay / 180);
      setColor_1('#ff0000');
    } else if (timeCurrent < timeRise) {
      const timeGraf = timeRise - (timeRise - timeCurrent);
      sdvig = timeGraf / (timeRise / 60) - 60;
      setColor_1('#acacac');
    }

    let corner, y3;
    var pi = Math.PI;
    const alfa = sdvig; //*  от 0 до 180 длительность дня // " '-60' - '0'" от 00:00 до рассвета // 180 - 240 от заката до 23:59
    const Radius = 54; //Radius - радиус
    const centrY = 0; //centrY - координата центра по оси у

    corner = 1 * pi - (alfa / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    y3 = Radius * Math.sin(corner) + centrY;
    setSunX(alfa * 0.72 - 65); // считаем новые координаты по оси x
    setSunY(50 - y3); // считаем новые координаты по оси у
  }, [dateA, dateB, sunrise]);

  // ?  --  end   --  Sun

  return (
    <div className="card__item">
      <p className="item__title">Солнце</p>
      <div className="sun">
        <svg width="258" height="129" viewBox="0 0 258 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_3881_557)" transform="translate(188 60)">
            <path
              d="M63 61.3773C63 61.3773 60 59.8773 42.5 44.3881C33 34.3773 26.6179 28.3307 4.73328 4"
              className="sun-img"
              strokeOpacity="0.1"
              strokeWidth="8"
              strokeLinecap="round"
            ></path>
          </g>
          <g filter="url(#filter0_i_3881_557)" transform="translate(0 60)">
            <path
              d="M4 62.0002C4 62.0002 15.5 58.5001 31.3913 45.0109C38.1924 39.2378 52.0654 21.3662 66.5 4.6228"
              className="sun-img"
              strokeOpacity="0.1"
              strokeWidth="8"
              strokeLinecap="round"
            ></path>
          </g>
          <line x1="3" y1="67.5" x2="253" y2="67.5" className="sun-img" strokeOpacity="0.2" strokeWidth="0.84"></line>
          <path
            d="M 64 65 Q 129 -42 194 65"
            stroke="url(#paint0_linear_4430_8884)"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <g filter="url(#filter1_d_4430_8884)">
            <circle cx="63" cy="68" r="4" className="sun-img-point"></circle>
            <circle cx="63" cy="68" r="5.5" stroke="white" strokeWidth="3"></circle>
          </g>
          <g filter="url(#filter2_d_4430_8884)">
            <circle cx="196" cy="68" r="4" className="sun-img-point"></circle>
            <circle cx="196" cy="68" r="5.5" stroke="white" strokeWidth="3"></circle>
          </g>
          {sunY && (
            <g filter="url(#filter3_d_4430_8884)" transform={`translate(${sunX} ${sunY})`}>
              <rect x="116" y="2" width="26" height="26" rx="13" fill="white"></rect>
              <path
                style={colorSun}
                d="M129 7C129.276 7 129.5 7.22386 129.5 7.5V8.5C129.5 8.77614 129.276 9 129 9C128.724 9 128.5 8.77614 128.5 8.5V7.5C128.5 7.22386 128.724 7 129 7ZM133 15C133 17.2091 131.209 19 129 19C126.791 19 125 17.2091 125 15C125 12.7909 126.791 11 129 11C131.209 11 133 12.7909 133 15ZM136.5 15.5C136.776 15.5 137 15.2761 137 15C137 14.7239 136.776 14.5 136.5 14.5H135.5C135.224 14.5 135 14.7239 135 15C135 15.2761 135.224 15.5 135.5 15.5H136.5ZM129 21C129.276 21 129.5 21.2239 129.5 21.5V22.5C129.5 22.7761 129.276 23 129 23C128.724 23 128.5 22.7761 128.5 22.5V21.5C128.5 21.2239 128.724 21 129 21ZM122.5 15.5C122.776 15.5 123 15.2761 123 15C123 14.7239 122.776 14.5 122.5 14.5H121.463C121.187 14.5 120.963 14.7239 120.963 15C120.963 15.2761 121.187 15.5 121.463 15.5H122.5ZM123.146 9.14645C123.342 8.95118 123.658 8.95118 123.854 9.14645L124.854 10.1464C125.049 10.3417 125.049 10.6583 124.854 10.8536C124.658 11.0488 124.342 11.0488 124.146 10.8536L123.146 9.85355C122.951 9.65829 122.951 9.34171 123.146 9.14645ZM123.854 20.8536C123.658 21.0488 123.342 21.0488 123.146 20.8536C122.951 20.6583 122.951 20.3417 123.146 20.1464L124.146 19.1464C124.342 18.9512 124.658 18.9512 124.854 19.1464C125.049 19.3417 125.049 19.6583 124.854 19.8536L123.854 20.8536ZM134.854 9.14645C134.658 8.95118 134.342 8.95118 134.146 9.14645L133.146 10.1464C132.951 10.3417 132.951 10.6583 133.146 10.8536C133.342 11.0488 133.658 11.0488 133.854 10.8536L134.854 9.85355C135.049 9.65829 135.049 9.34171 134.854 9.14645ZM134.146 20.8536C134.342 21.0488 134.658 21.0488 134.854 20.8536C135.049 20.6583 135.049 20.3417 134.854 20.1464L133.854 19.1464C133.658 18.9512 133.342 18.9512 133.146 19.1464C132.951 19.3417 132.951 19.6583 133.146 19.8536L134.146 20.8536Z"
                fill="rgba(172, 172, 172, 1)"
              ></path>
            </g>
          )}

          <defs>
            <filter
              id="filter0_i_3881_557"
              x="0"
              y="0"
              width="68"
              height="66"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3881_557"></feBlend>
            </filter>
            <filter
              id="filter1_d_4430_8884"
              x="55"
              y="59"
              width="18"
              height="18"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend>
            </filter>
            <filter
              id="filter2_d_4430_8884"
              x="189"
              y="59"
              width="18"
              height="18"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend>
            </filter>
            <filter
              id="filter3_d_4430_8884"
              x="114"
              y="0"
              width="30"
              height="30"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4430_8883"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4430_8883" result="shape"></feBlend>
            </filter>
            <linearGradient
              id="paint0_linear_4430_8884"
              x1="167.549"
              y1="76.7188"
              x2="50.9688"
              y2="76.7188"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#552278"></stop>
              <stop offset="0.255606" stopColor="#D13438"></stop>
              <stop offset="0.824634" stopColor="#BA4D52"></stop>
              <stop offset="1" stopColor="#F87528"></stop>
            </linearGradient>
            <linearGradient
              id="paint0_linear_2195_5734"
              x1="140"
              y1="78.6025"
              x2="0.999749"
              y2="78.6025"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF6B00"></stop>
              <stop offset="0.255606" stopColor="#EFB839"></stop>
              <stop offset="0.824634" stopColor="#EFB839"></stop>
              <stop offset="1" stopColor="#EF5A39"></stop>
            </linearGradient>
          </defs>
        </svg>
        <p className="sun__title">
          {hourDay} ч {minuteDay} мин
        </p>
      </div>
      <div className="item__text-block">
        <div className="text-block__subblock-text">
          <p className="subblock-text__time">{sunriseTime}</p>
          <p className="subblock-text__title">Восход</p>
        </div>
        <div className="text-block__subblock-text">
          <p className="subblock-text__time">{sunsetTime}</p>
          <p className="subblock-text__title">Заход</p>
        </div>
      </div>
    </div>
  );
};
