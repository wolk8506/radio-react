import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherToday_Data } from 'store/root/selectors';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const TilesPrecip = () => {
  const data_today = useSelector(getWeatherToday_Data);

  const [precip_mm, setPrecip_mm] = useState('--');
  const [precipProb, setPrecipProb] = useState(0);
  const [snow, setSnow] = useState(0);
  const [snowdepth, setSnowdepth] = useState(0);
  const [conditionText, setConditionText] = useState('--');
  const [description, setDescription] = useState('-');

  const [precipRain, setPrecipRain] = useState(true);
  const [precipRainProb, setPrecipRainProb] = useState(true);
  const [precipSnow, setPrecipSnow] = useState(true);
  const [precipSnowdepth, setPrecipSnowdepth] = useState(true);
  const [precipRainOff, setPrecipRainOff] = useState(true);
  const [precipRainAndSnow, setPrecipRainAndSnow] = useState(true);

  useEffect(() => {
    const hour = moment().format('H');

    setPrecip_mm(data_today.days[0].hours[hour].precip); // Осадки мм
    setPrecipProb(data_today.days[0].hours[hour].precipprob); // Вероятность осадкав %
    setSnow(data_today.days[0].hours[hour].snow); // Снег мм
    setSnowdepth(data_today.days[0].hours[hour].snowdepth); // Глубина снежного покрова мм
    setConditionText(data_today.days[0].hours[hour].conditions); //Погодные условия, описание
    setDescription(data_today.description);
  }, [data_today.days, data_today.description]);

  useEffect(() => {
    if (precip_mm === 0 && precipProb === 0 && (snow > 0 || snowdepth > 0)) {
      setPrecipRainOff(false);
    } else setPrecipRainOff(true);

    if ((precip_mm > 0 || precipProb > 0) && (snow > 0 || snowdepth > 0)) {
      setPrecipRainAndSnow(false);
    } else setPrecipRainAndSnow(true);

    if (precip_mm > 0) {
      setPrecipRain(false);
      setPrecipRainProb(false);
    } else {
      setPrecipRain(true);
      setPrecipRainProb(true);
    }

    if (precipProb > 0) {
      setPrecipRainProb(false);
    } else if (precipProb === 0 && precip_mm === 0) {
      setPrecipRainProb(true);
    }

    if (snow > 0) {
      setPrecipSnow(false);
      setPrecipSnowdepth(false);
    } else {
      setPrecipSnow(true);
      setPrecipSnowdepth(true);
    }

    if (snowdepth > 0) {
      setPrecipSnowdepth(false);
    } else if (snowdepth === 0 && snow === 0) {
      setPrecipSnowdepth(true);
    }
  }, [precipProb, precip_mm, snow, snowdepth]);

  return (
    <div className="card__item" id="animated">
      <p className="item__title">Осадки</p>
      <div>
        <div className="precip-image">
          <div className="precip-image__item">
            <svg
              className={`precip-image__svg ${precipRainOff ? '' : ' is-hidden'} ${
                precipRainAndSnow ? '' : ' rain-snow'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width="130px"
              height="130px"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 130 130"
            >
              <g className={precipRain && 'is-hidden'}>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -90"
                    to="-50 150"
                    keyTimes="0;1"
                    dur="1.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(38 6) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -50"
                    to="-35 150"
                    keyTimes="0;1"
                    dur="1.3"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(35 -16) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -90"
                    to="-50 150"
                    keyTimes="0;1"
                    dur="1.45"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(13 8) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -50"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.2"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(66 -2) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -70"
                    to="-35 150"
                    keyTimes="0;1"
                    dur="1.3"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(110 5) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.1105 0.605666C16.1105 0.605666 15.3123 4.25722 13.8625 10.2234C15.1987 4.39932 16.1105 0.605666 16.1105 0.605666ZM0.398192 57.6206C6.44879 39.5258 11.2299 21.058 13.8625 10.2234C10.9872 22.7566 6.14674 44.6925 4.19853 58.4604C4.19165 58.6454 4.16617 58.8342 4.1206 59.0238C4.11996 59.0265 4.11931 59.0292 4.11867 59.0318C4.10168 59.1488 4.06876 59.2543 4.02217 59.3487C3.61699 60.4483 2.59873 61.1241 1.62057 60.889C0.637676 60.6527 0.0367752 59.5788 0.183444 58.4086C0.185668 58.3059 0.204056 58.1998 0.240647 58.0908C0.241675 58.0877 0.242703 58.0847 0.243731 58.0816C0.283075 57.9203 0.335115 57.7663 0.398192 57.6206Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -100"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(41 59) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -135"
                    to="-50 150"
                    keyTimes="0;1"
                    dur="1.6"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(56 2) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -100"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.55"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(104 4) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -90"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(90 -20) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.1105 0.605666C16.1105 0.605666 15.3123 4.25722 13.8625 10.2234C15.1987 4.39932 16.1105 0.605666 16.1105 0.605666ZM0.398192 57.6206C6.44879 39.5258 11.2299 21.058 13.8625 10.2234C10.9872 22.7566 6.14674 44.6925 4.19853 58.4604C4.19165 58.6454 4.16617 58.8342 4.1206 59.0238C4.11996 59.0265 4.11931 59.0292 4.11867 59.0318C4.10168 59.1488 4.06876 59.2543 4.02217 59.3487C3.61699 60.4483 2.59873 61.1241 1.62057 60.889C0.637676 60.6527 0.0367752 59.5788 0.183444 58.4086C0.185668 58.3059 0.204056 58.1998 0.240647 58.0908C0.241675 58.0877 0.242703 58.0847 0.243731 58.0816C0.283075 57.9203 0.335115 57.7663 0.398192 57.6206Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -50"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.3"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(55 0) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.1105 0.605666C16.1105 0.605666 15.3123 4.25722 13.8625 10.2234C15.1987 4.39932 16.1105 0.605666 16.1105 0.605666ZM0.398192 57.6206C6.44879 39.5258 11.2299 21.058 13.8625 10.2234C10.9872 22.7566 6.14674 44.6925 4.19853 58.4604C4.19165 58.6454 4.16617 58.8342 4.1206 59.0238C4.11996 59.0265 4.11931 59.0292 4.11867 59.0318C4.10168 59.1488 4.06876 59.2543 4.02217 59.3487C3.61699 60.4483 2.59873 61.1241 1.62057 60.889C0.637676 60.6527 0.0367752 59.5788 0.183444 58.4086C0.185668 58.3059 0.204056 58.1998 0.240647 58.0908C0.241675 58.0877 0.242703 58.0847 0.243731 58.0816C0.283075 57.9203 0.335115 57.7663 0.398192 57.6206Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -100"
                    to="-25 150"
                    keyTimes="0;1"
                    dur="1.4"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(15 34) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -80"
                    to="-40 150"
                    keyTimes="0;1"
                    dur="1.25"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(90 35) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -100"
                    to="-45 150"
                    keyTimes="0;1"
                    dur="1.65"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(95 30) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -80"
                    to="-40 150"
                    keyTimes="0;1"
                    dur="1.6"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(110 45) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -110"
                    to="-40 150"
                    keyTimes="0;1"
                    dur="1.6"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(103 75) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -30"
                    to="-35 150"
                    keyTimes="0;1"
                    dur="1.35"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(7 42) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -50"
                    to="-35 150"
                    keyTimes="0;1"
                    dur="1.35"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(33 9) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="15, -50"
                    to="-35 150"
                    keyTimes="0;1"
                    dur="1.35"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(20 80) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -100"
                    to="-50 150"
                    keyTimes="0;1"
                    dur="1.7"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(28 85) scale(0.8)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -165"
                    to="-60 140"
                    keyTimes="0;1"
                    dur="1.95"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(100 64) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -135"
                    to="-40 140"
                    keyTimes="0;1"
                    dur="1.75"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(76 9) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="35, -140"
                    to="-55 140"
                    keyTimes="0;1"
                    dur="1.75"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(100 64) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -140"
                    to="-50 140"
                    keyTimes="0;1"
                    dur="1.75"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(60 75) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="35, -165"
                    to="-53 140"
                    keyTimes="0;1"
                    dur="1.85"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(60 75) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="35, -165"
                    to="-46 140"
                    keyTimes="0;1"
                    dur="1.85"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(120 55) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -130"
                    to="-48 140"
                    keyTimes="0;1"
                    dur="1.65"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(80 80) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -165"
                    to="-57 140"
                    keyTimes="0;1"
                    dur="1.95"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(80 80) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -135"
                    to="-52 140"
                    keyTimes="0;1"
                    dur="1.8"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(100 90) scale(0.7)" filter="url(#filter0_f_1999_49446)">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="25, -165"
                    to="-50 140"
                    keyTimes="0;1"
                    dur="1.9"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(90 5) scale(0.7)" filter="">
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.5812 0.14131C11.5812 0.14131 11.0929 2.50356 10.1524 6.35147C10.993 2.58884 11.5812 0.14131 11.5812 0.14131ZM0.771251 36.7624C5.2453 25.2258 8.44443 13.3391 10.1524 6.35147C8.34334 14.4487 5.36539 28.6364 4.56524 37.6286C4.57331 37.7507 4.56353 37.8739 4.53419 37.9959C4.53385 37.9974 4.5335 37.9988 4.53315 38.0003C4.52599 38.0773 4.50203 38.1452 4.46356 38.2046C4.15458 38.9022 3.21086 39.2689 2.23302 39.0338C1.2498 38.7975 0.573818 38.0349 0.623798 37.2688C0.617843 37.201 0.62735 37.1322 0.654335 37.063C0.654978 37.0614 0.655621 37.0597 0.656264 37.0581C0.681919 36.9534 0.720772 36.8546 0.771251 36.7624Z"
                      fill="#6E90E9"
                    ></path>
                  </g>
                </g>
              </g>

              <g className={precipRainProb && 'is-hidden'}>
                <path
                  transform="translate(44,110)"
                  d="M 0 10 Q 4 4, 8 6 T 16 6 T 24 6 T 32 6 T 40 6 T 48 6 T 56 6 T 64 6 T 72 6 T80 6 T 88 6 T 96 6 T 104 6 T 112 6 T 120 6 T 128 6 T 136 6 T 144 6 T 152 10 V 11 H 0 V 0"
                  fill="#6E90E9"
                ></path>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="16 0"
                  keyTimes="0;1"
                  dur="1.8s"
                  repeatCount="indefinite"
                  begin="animated.mouseenter"
                  end="animated.mouseleave"
                ></animateTransform>
              </g>
              <g className={precipRainProb && 'is-hidden'}>
                <path
                  d="M 146 146 m -40 -0 a 70 70 0 0 1 -70 70 "
                  transform="rotate(45, 146 146)"
                  fill="#6E90E9"
                  stroke="#6E90E9"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>

              <defs>
                <filter
                  xmlns="http://www.w3.org/2000/svg"
                  id="filter0_f_1999_49446"
                  x="0"
                  y="0"
                  width="132.489"
                  height="162.171"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_1999_49446"></feGaussianBlur>
                </filter>
              </defs>
            </svg>
            <p className="item__title">
              {precip_mm}
              <span>мм</span>
            </p>
          </div>
          <div className="precip-image__item">
            <svg
              className={`precip-image__svg ${precipSnowdepth && 'is-hidden'}  ${!precipRainAndSnow && ' rain-snow'}`}
              xmlns="http://www.w3.org/2000/svg"
              width="130px"
              height="130px"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 130 130"
            >
              <g className={precipSnow && 'is-hidden'}>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -100"
                    to="-15 130"
                    keyTimes="0;1"
                    dur="8.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(15 38) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -100"
                    to="-15 130"
                    keyTimes="0;1"
                    dur="8.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-32 16) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -80"
                    to="-0 130"
                    keyTimes="0;1"
                    dur="9.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(15 -40) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -110"
                    to="-20 130"
                    keyTimes="0;1"
                    dur="10"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(35 42) scale(0.7)" filter="url(#filter0_f_1999_49605)">
                    <circle cx="82.9346" cy="84.5327" r="1.71875" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -80"
                    to="10 130"
                    keyTimes="0;1"
                    dur="11"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(30 -6) scale(0.7)" filter="url(#filter0_f_1999_49605)">
                    <circle cx="82.9346" cy="84.5327" r="1.71875" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -80"
                    to="10 130"
                    keyTimes="0;1"
                    dur="10"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-20 -15) scale(0.7)" filter="url(#filter0_f_1999_49605)">
                    <circle cx="82.9346" cy="84.5327" r="1.71875" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -40"
                    to="-15 160"
                    keyTimes="0;1"
                    dur="12"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(15 -82) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -60"
                    to="-15 160"
                    keyTimes="0;1"
                    dur="14"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-32 -104) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -60"
                    to="-0 160"
                    keyTimes="0;1"
                    dur="12"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(15 -120) scale(0.8)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -50"
                    to="-20 160"
                    keyTimes="0;1"
                    dur="11.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(35 -102) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -60"
                    to="-0 170"
                    keyTimes="0;1"
                    dur="11"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(30 -86) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -30"
                    to="10 170"
                    keyTimes="0;1"
                    dur="13.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-20 -95) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -40"
                    to="5 160"
                    keyTimes="0;1"
                    dur="10.5"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-10 -45) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -30"
                    to="5 170"
                    keyTimes="0;1"
                    dur="13"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(-25 -120) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="-10, -60"
                    to="5 170"
                    keyTimes="0;1"
                    dur="15"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(50 -80) scale(0.7)">
                    <circle cx="82.9346" cy="84.5327" r="2.53" fill="white"></circle>
                  </g>
                </g>
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="10, -40"
                    to="-0 160"
                    keyTimes="0;1"
                    dur="14"
                    repeatCount="indefinite"
                    begin="animated.mouseenter"
                    end="animated.mouseleave"
                  ></animateTransform>
                  <g transform="translate(45 -90) scale(0.8)" filter="url(#filter0_f_1999_49605)">
                    <circle cx="82.9346" cy="84.5327" r="1.71875" fill="white"></circle>
                  </g>
                </g>
              </g>

              <g>
                <path
                  d="M 146 146 m -40 -0 a 70 70 0 0 1 -70 70 "
                  transform="rotate(45, 146 146)"
                  fill="#fff"
                  stroke="#fff"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
              <defs>
                <filter
                  xmlns="http://www.w3.org/2000/svg"
                  id="filter0_f_1999_49605"
                  x="35.3164"
                  y="58.0034"
                  width="88.9971"
                  height="68.998"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_1999_49605"></feGaussianBlur>
                </filter>
              </defs>
            </svg>
            <p className="item__title">
              {snow}
              <span>мм</span>
            </p>
          </div>
        </div>
      </div>

      <p className="item__text">{conditionText}</p>
      <p className="item__sub-text">{description}</p>
    </div>
  );
};
