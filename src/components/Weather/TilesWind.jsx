import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

export const TilesWind = () => {
  // const data15 = useSelector(state => state.storeWeather15);
  const data_today = useSelector(
    state => state.storeWeatherLastDay.today.days[0]
  );

  const [wind_ms, setWind_ms] = useState(0);
  const [wind_degree, setWind_degree] = useState(0);
  const [maxwind_ms, setMmaxwind_ms] = useState('--');
  const [axisX, setAxisX] = useState('52');
  const [axisY, setAxisY] = useState('144');
  const [axisX2, setAxisX2] = useState('52');
  const [axisY2, setAxisY2] = useState('144');
  const [axisX3, setAxisX3] = useState('52');
  const [axisY3, setAxisY3] = useState('144');
  const [axisX4, setAxisX4] = useState('52');
  const [axisY4, setAxisY4] = useState('144');
  const [axisX6, setAxisX6] = useState(0);
  const [axisY6, setAxisY6] = useState(0);
  const [axisX7, setAxisX7] = useState('0');
  const [axisY7, setAxisY7] = useState('0');
  const [rumb, setRumb] = useState('C');
  const [windName, setWindName] = useState([0, 'Штиль']);

  useEffect(() => {
    // const numberDay = moment().isoWeekday();
    const hour = Number(moment().format('H'));
    setWind_ms((data_today.hours[hour].windspeed / 3.6).toFixed(0)); //Скорость ветра в м/с
    setMmaxwind_ms((data_today.hours[hour].windgust / 3.6).toFixed(0)); // Порывы ветра м/с
    setWind_degree(data_today.hours[hour].winddir);
    // setWind_degree(value);
  }, [data_today.hours]);

  useEffect(() => {
    if (wind_ms > 107) setWindName([17, 'Ураган']);
    else if (wind_ms > 100) setWindName([16, 'Ураган']);
    else if (wind_ms > 90) setWindName([15, 'Ураган']);
    else if (wind_ms > 86) setWindName([14, 'Ураган']);
    else if (wind_ms > 73) setWindName([13, 'Ураган']);
    else if (wind_ms > 64) setWindName([12, 'Ураган']);
    else if (wind_ms > 56) setWindName([11, 'Жестокий шторм']);
    else if (wind_ms > 48) setWindName([10, 'Сильный шторм']);
    else if (wind_ms > 41) setWindName([9, 'Шторм']);
    else if (wind_ms > 34) setWindName([8, 'Очень крепкий ветер']);
    else if (wind_ms > 28) setWindName([7, 'Крепкий ветер']);
    else if (wind_ms > 22) setWindName([6, 'Сильный ветер']);
    else if (wind_ms > 17) setWindName([5, 'Свежий ветер']);
    else if (wind_ms > 11) setWindName([4, 'Умеренный ветер']);
    else if (wind_ms > 7) setWindName([3, 'Слабый ветер']);
    else if (wind_ms > 4) setWindName([2, 'Лёгкий ветер']);
    else if (wind_ms >= 1) setWindName([1, 'Тихий ветер']);
    else if (wind_ms < 1) setWindName([0, 'Штиль']);
  }, [wind_ms]);

  useEffect(() => {
    // if (wind_degree > 248.75) setRumb('СтЗ');else
    if (wind_degree > 337.5) setRumb('ССЗ');
    // else if (wind_degree > 326.25) setRumb('СЗтС');
    else if (wind_degree > 315) setRumb('СЗ');
    // else if (wind_degree > 303.75) setRumb('СЗтЗ');
    else if (wind_degree > 292.5) setRumb('ЗСЗ');
    // else if (wind_degree > 281.25) setRumb('ЗтС');
    else if (wind_degree > 270) setRumb('З');
    // else if (wind_degree > 258.75) setRumb('ЗтЮ');
    else if (wind_degree > 247.5) setRumb('ЗЮЗ');
    // else if (wind_degree > 236.25) setRumb('ЮЗтЗ');
    else if (wind_degree > 225) setRumb('ЮЗ');
    // else if (wind_degree > 213.75) setRumb('ЮЗтЮ');
    else if (wind_degree > 202.5) setRumb('ЮЮЗ');
    // else if (wind_degree > 191.25) setRumb('ЮтЗ');
    else if (wind_degree > 180) setRumb('Ю');
    // else if (wind_degree > 168.75) setRumb('ЮтВ');
    else if (wind_degree > 157.5) setRumb('ЮЮВ');
    // else if (wind_degree > 146.25) setRumb('ЮВтЮ');
    else if (wind_degree > 135) setRumb('ЮВ');
    // else if (wind_degree > 123.75) setRumb('ЮВтВ');
    else if (wind_degree > 112.5) setRumb('ВЮВ');
    // else if (wind_degree > 101.25) setRumb('ВтЮ');
    else if (wind_degree > 90) setRumb('В');
    // else if (wind_degree > 78.75) setRumb('ВтС');
    else if (wind_degree > 67.5) setRumb('ВСВ');
    // else if (wind_degree > 56.25) setRumb('СВтВ');
    else if (wind_degree > 45) setRumb('СВ');
    // else if (wind_degree > 33.75) setRumb('СВтС');
    else if (wind_degree > 22.5) setRumb('ССВ');
    // else if (wind_degree > 11.25) setRumb('СтВ');
    else if (wind_degree > 0) setRumb('С');
  }, [rumb, wind_degree]);

  useEffect(() => {
    let value = wind_degree * -1 + 475;
    let x, y, corner1, corner2;
    var pi = Math.PI;

    const Radius = 80; //Radius - радиус
    const centrX = 90; //centrX - координата центра по оси х
    const centrY = 90; //centrY - координата центра по оси у

    let alfa1 = value; //  от -65 до 240  // Угол поворота
    let alfa2 = value; //  от -65 до 240  // Угол поворота
    let alfa3 = value; //  от -65 до 240  // Угол поворота
    let alfa4 = value; //  от -65 до 240  // Угол поворота

    if (value > 530) {
      alfa1 = 530;
    } else if (value > 490) {
      alfa1 = value;
    } else if (value > 440) {
      alfa1 = 440;
    } else if (value > 400) {
      alfa1 = value;
    } else if (value > 350) {
      alfa1 = 350;
    } else if (value > 310) {
      alfa1 = value;
    } else if (value > 260) {
      alfa1 = 260;
    } else if (value > 220) {
      alfa1 = value;
    } else if (value > 170) {
      alfa1 = 170;
    } else if (value > 130) {
      alfa1 = value;
    } else if (value > 80) {
      alfa1 = 80;
    } else if (value > 40) {
      alfa1 = value;
    } else if (value > -10) {
      alfa1 = -10;
    }

    if (value > 510) {
      alfa2 = value;
    } else if (value > 490) {
      alfa2 = 510;
    } else if (value > 420) {
      alfa2 = value;
    } else if (value > 400) {
      alfa2 = 420;
    } else if (value > 330) {
      alfa2 = value;
    } else if (value > 310) {
      alfa2 = 330;
    } else if (value > 240) {
      alfa2 = value;
    } else if (value > 220) {
      alfa2 = 240;
    } else if (value > 150) {
      alfa2 = value;
    } else if (value > 130) {
      alfa2 = 150;
    } else if (value > 60) {
      alfa2 = value;
    } else if (value > 40) {
      alfa2 = 60;
    } else if (value > -30) {
      alfa2 = value;
    } else if (value > -100) {
      alfa2 = -30;
    }

    // // !  - - - - - - - - - - - - - - - - - -

    if (value > 530) {
      alfa3 = 530;
    } else if (value > 460) {
      alfa3 = value;
    } else if (value > 440) {
      alfa3 = 440;
    } else if (value > 370) {
      alfa3 = value;
    } else if (value > 350) {
      alfa3 = 350;
    } else if (value > 280) {
      alfa3 = value;
    } else if (value > 260) {
      alfa3 = 260;
    } else if (value > 190) {
      alfa3 = value;
    } else if (value > 170) {
      alfa3 = 170;
    } else if (value > 100) {
      alfa3 = value;
    } else if (value > 80) {
      alfa3 = 80;
    } else if (value > 10) {
      alfa3 = value;
    } else if (value > -10) {
      alfa3 = -10;
    } else if (value > -80) {
      alfa3 = value;
    } else if (value > -100) {
      alfa3 = -100;
    }

    if (value > 510) {
      alfa4 = value;
    } else if (value > 460) {
      alfa4 = 510;
    } else if (value > 420) {
      alfa4 = value;
    } else if (value > 370) {
      alfa4 = 420;
    } else if (value > 330) {
      alfa4 = value;
    } else if (value > 280) {
      alfa4 = 330;
    } else if (value > 240) {
      alfa4 = value;
    } else if (value > 190) {
      alfa4 = 240;
    } else if (value > 150) {
      alfa4 = value;
    } else if (value > 100) {
      alfa4 = 150;
    } else if (value > 60) {
      alfa4 = value;
    } else if (value > 10) {
      alfa4 = 60;
    } else if (value > -30) {
      alfa4 = value;
    } else if (value > -80) {
      alfa4 = -30;
    }

    corner1 = 2 * pi - (alfa1 / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner1) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner1) + centrY); // считаем новые координаты по оси у
    setAxisX(x);
    setAxisY(y);
    corner2 = 2 * pi - ((alfa2 - 50) / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner2) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner2) + centrY); // считаем новые координаты по оси у
    setAxisX2(x);
    setAxisY2(y);
    corner1 = 2 * pi - (alfa3 / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner1) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner1) + centrY); // считаем новые координаты по оси у
    setAxisX3(x);
    setAxisY3(y);
    corner2 = 2 * pi - ((alfa4 - 50) / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner2) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner2) + centrY); // считаем новые координаты по оси у
    setAxisX4(x);
    setAxisY4(y);
  }, [wind_degree]);

  useEffect(() => {
    let value = wind_degree + 270;
    let x, y, corner;
    var pi = Math.PI;

    let alfa = value; //  от -65 до 240  // Угол поворота

    const Radius = 15; //Radius - радиус
    const centrX = 0; //centrX - координата центра по оси х
    const centrY = 0; //centrY - координата центра по оси у

    corner = 2 * pi - ((alfa + 90) / 180) * pi; // переводим градусы в радианы с учетом периода в 2 пи
    x = parseInt(Radius * Math.cos(corner) + centrX); // считаем новые координаты точки по оси х
    y = parseInt(Radius * Math.sin(corner) + centrY); // считаем новые координаты по оси у
    setAxisX7(x * -1);
    setAxisY7(y * -1);

    setAxisX6(x * 1.5);
    setAxisY6(y * 1.5);
  }, [wind_degree]);

  return (
    <div className="card__item" id="windAnimation">
      <p className="item__title">Ветер</p>
      <div className="wind">
        <div className="wind__block-wind">
          <div
            className="block-wind__image"
            style={{ width: '110px', height: '110px' }}
          >
            <svg
              width="110"
              height="110"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M90 10 A 80 80, 0, 0, 1, 165.18 62.64 "
                fill="none"
                className="image__svg-segment"
                stroke-width="8"
                stroke-linecap="round"
                stroke-opacity="0.1"
                transform="rotate(10 90 90)"
              ></path>
              <path
                d="M90 10 A 80 80, 0, 0, 1, 165.18 62.64 "
                fill="none"
                className="image__svg-segment"
                stroke-width="8"
                stroke-linecap="round"
                stroke-opacity="0.1"
                transform="rotate(100 90 90)"
              ></path>
              <path
                d="M90 10 A 80 80, 0, 0, 1, 165.18 62.64 "
                fill="none"
                className="image__svg-segment"
                stroke-width="8"
                stroke-linecap="round"
                stroke-opacity="0.1"
                transform="rotate(190 90 90)"
              ></path>
              <path
                d="M90 10 A 80 80, 0, 0, 1, 165.18 62.64 "
                fill="none"
                className="image__svg-segment"
                stroke-width="8"
                stroke-linecap="round"
                stroke-opacity="0.1"
                transform="rotate(280 90 90)"
              ></path>
              <path
                d={`M${axisX} ${axisY}A 80 80, 0, 0, 1, ${axisX2} ${axisY2}`}
                fill="none"
                stroke="rgba(85, 177, 126, 1)"
                stroke-width="8"
                stroke-linecap="round"
              ></path>
              <path
                d={`M${axisX3} ${axisY3}A 80 80, 0, 0, 1, ${axisX4} ${axisY4}`}
                fill="none"
                stroke="rgba(85, 177, 126, 1)"
                stroke-width="8"
                stroke-linecap="round"
              ></path>
              <g>
                <path
                  d="M 86.325 40.3742 C 86.9141 37.7765 90.5908 37.7098 91.2738 40.2843 L 112.0053 118.42840000000001 C 113.7162 124.8774 108.87360000000001 131.20420000000001 102.2016 131.23680000000002 L 78.5064 131.35250000000002 C 71.94605 131.3845 67.06373 125.3014 68.51471 118.9034 L 86.325 40.3742Z"
                  fill="rgba(85, 177, 126, 1)"
                  transform={`rotate(${wind_degree + 180} 90 90)`}
                >
                  <animateMotion
                    id="windDirectionAni322"
                    dur="0.8s"
                    repeatCount="0"
                    begin="windAnimation.mouseenter"
                    end="windAnimation.mouseleave"
                    path={`M0 0L${-axisY7} ${-axisX7}`}
                  ></animateMotion>
                  <animateMotion
                    dur="1.5s"
                    begin="windDirectionAni322.end"
                    end="windAnimation.mouseleave"
                    repeatCount="indefinite"
                    path={`M${-axisY6} ${-axisX6}L${-axisY7} ${-axisX7}`}
                  ></animateMotion>
                </path>
              </g>
            </svg>
            <div className="image__char image__char--north">С</div>
            <div className="image__char image__char--south">Ю</div>
            <div className="image__char image__char--west">З</div>
            <div className="image__char image__char--ast">В</div>
          </div>

          <div className="block-wind__value-content">
            <p className="value-content__title">
              С {rumb} ({wind_degree}°)
            </p>
            <div className="value-content__number-group">
              <p className="number-group__number">{wind_ms}</p>
              <div className="number-group__unit-group">
                <p className="unit-group__unit">м/с</p>
                <p className="unit-group__unit-name">Скорость ветра</p>
              </div>
            </div>
            <div className="value-content__number-group">
              <p className="number-group__number">{maxwind_ms}</p>
              <div className="number-group__unit-group">
                <p className="unit-group__unit">м/с</p>
                <p className="unit-group__unit-name">Порывы ветра</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="item__text">
        Сила: {windName[0]} ({windName[1]})
      </p>
      <p className="item__sub-text">--</p>
    </div>
  );
};
