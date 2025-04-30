import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherElements_Data } from 'store/root/selectors';

import moment from 'moment';

export const TilesMoon = () => {
  const dataElements = useSelector(getWeatherElements_Data);

  const [moonrise, setMoonrise] = useState('--:--');
  const [moonriseTomorrow, setMoonriseTomorrow] = useState('--:--');
  const [moonset, setMoonset] = useState('--:--');

  useEffect(() => {
    setMoonrise(dataElements.days[0].moonrise);
    setMoonriseTomorrow(dataElements.days[1].moonrise);
    setMoonset(dataElements.days[0].moonset);
  }, [dataElements]);

  let moonriseTime = '00:00';
  if (moonrise !== undefined) {
    moonriseTime = moonrise?.slice(0, -3);
  }

  let moonsetTime = moonriseTomorrow;
  if (moonset !== undefined) {
    moonsetTime = moonset?.slice(0, -3);
  }

  //

  // ?  --  start --  Moon

  const [moonX, setMoonX] = useState(0);
  const [moonY, setMoonY] = useState(0);
  const [minuteNight, setMinuteNight] = useState('--');
  const [hourNight, setHourNight] = useState('--');
  const [color_2, setColor_2] = useState('#acacac');

  const colorMoon = {
    fill: color_2,
  };

  useEffect(() => {
    // * Время солнечного дня

    let timeMoon = 0;

    // * Определение начала дня в секундах

    const secondRice = moment.utc(moonrise, 'HH:mm:ss').seconds();
    const minuteRice = moment.utc(moonrise, 'HH:mm:ss').minute();
    const hourRice = moment.utc(moonrise, 'HH:mm:ss').hour();
    const timeRise = secondRice + minuteRice * 60 + hourRice * 3600;

    const secondSet = moment.utc(moonset, 'HH:mm:ss').seconds();
    const minuteSet = moment.utc(moonset, 'HH:mm:ss').minute();
    const hourSet = moment.utc(moonset, 'HH:mm:ss').hour();
    const timeSet = secondSet + minuteSet * 60 + hourSet * 3600;

    if (timeRise > timeSet) {
      const a = 86400 - timeRise + timeSet;
      timeMoon = a;
      setMinuteNight(Math.floor((a % 3600) / 60));
      setHourNight(Math.floor(a / 3600));
    } else if (timeRise < timeSet) {
      const a = timeSet - timeRise;
      timeMoon = a;
      setMinuteNight(Math.floor((a % 3600) / 60));
      setHourNight(Math.floor(a / 3600));
    }

    // *  Текущее время
    const second2 = moment().seconds();
    const minute2 = moment().minute();
    const hour2 = moment().hour();
    const timeCurrent = second2 + minute2 * 60 + hour2 * 3600;

    let sdvig;
    if (timeCurrent >= timeRise + timeMoon) {
      const timeGraf = 86400 - (timeMoon + timeRise);
      sdvig = 240 - (86400 - timeCurrent) / (timeGraf / 60);
      setColor_2('#acacac');
    } else if (timeRise <= timeCurrent) {
      const timeGraf = timeMoon - (timeCurrent - timeRise);
      sdvig = 180 - timeGraf / (timeMoon / 180);
      setColor_2('rgb(239, 184, 57)');
    } else if (timeCurrent < timeRise) {
      const timeGraf = timeRise - (timeRise - timeCurrent);
      sdvig = timeGraf / (timeRise / 60) - 60;
      setColor_2('#acacac');
    }

    let corner, y3;
    var pi = Math.PI;
    const alfa = sdvig; //*  от 0 до 180 длительность дня // " '-60' - '0'" от 00:00 до рассвета // 180 - 240 от заката до 23:59
    const Radius = 54; //Radius - радиус
    const centrY = 0; //centrY - координата центра по оси у

    corner = 1 * pi - (alfa / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    y3 = Radius * Math.sin(corner) + centrY;
    setMoonX(alfa * 0.72 - 65); // считаем новые координаты по оси x
    setMoonY(50 - y3); // считаем новые координаты по оси у
  }, [moonrise, moonset]);

  // ?  --  end   --  Moon

  return (
    <div className="card__item">
      <p className="item__title">Луна</p>
      <div className="moon">
        <svg width="258" height="129" viewBox="0 0 258 129" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_3881_557)" transform="translate(188 60)">
            <path
              d="M63 61.3773C63 61.3773 60 59.8773 42.5 44.3881C33 34.3773 26.6179 28.3307 4.73328 4"
              className="moon-img"
              strokeOpacity="0.1"
              strokeWidth="8"
              strokeLinecap="round"
            ></path>
          </g>
          <g filter="url(#filter0_i_3881_557)" transform="translate(0 60)">
            <path
              d="M4 62.0002C4 62.0002 15.5 58.5001 31.3913 45.0109C38.1924 39.2378 52.0654 21.3662 66.5 4.6228"
              className="moon-img"
              strokeOpacity="0.1"
              strokeWidth="8"
              strokeLinecap="round"
            ></path>
          </g>
          <line x1="3" y1="67.5" x2="253" y2="67.5" className="moon-img" strokeOpacity="0.2" strokeWidth="0.84"></line>
          <path
            d="M 64 65 Q 129 -42 194 65"
            stroke="url(#paint0_linear_2195_5734)"
            strokeWidth="8"
            strokeLinecap="round"
          ></path>
          <g filter="url(#filter1_d_4430_8884)">
            <circle cx="63" cy="68" r="4" className="moon-img-point"></circle>
            <circle cx="63" cy="68" r="5.5" stroke="white" strokeWidth="3"></circle>
          </g>
          <g filter="url(#filter2_d_4430_8884)">
            <circle cx="196" cy="68" r="4" className="moon-img-point"></circle>
            <circle cx="196" cy="68" r="5.5" stroke="white" strokeWidth="3"></circle>
          </g>
          {moonY && (
            <g filter="url(#filter3_d_4430_8884)" transform={`translate(${moonX} ${moonY})`}>
              <rect x="116" y="2" width="26" height="26" rx="13" fill="white"></rect>
              <path
                style={colorMoon}
                d="M135.359 18.9969C133.155 22.8143 128.274 24.1222 124.457 21.9183C123.417 21.3181 122.542 20.5061 121.875 19.5382C121.653 19.2146 121.797 18.7677 122.167 18.6353C125.173 17.5592 126.783 16.3123 127.718 14.5287C128.701 12.651 128.955 10.5942 128.267 7.77487C128.172 7.38501 128.48 7.01382 128.881 7.03531C130.123 7.10197 131.337 7.45887 132.438 8.09439C136.255 10.2983 137.563 15.1796 135.359 18.9969Z"
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
        <p className="moon__title">
          {hourNight} ч {minuteNight} мин
        </p>
      </div>
      <div className="item__text-block">
        <div className="text-block__subblock-text">
          <p className="subblock-text__time">{moonriseTime}</p>
          <p className="subblock-text__title">Восход</p>
        </div>
        <div className="text-block__subblock-text">
          <p className="subblock-text__time">{moonsetTime}</p>
          <p className="subblock-text__title">Заход</p>
        </div>
      </div>
    </div>
  );
};
