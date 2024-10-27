import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherToday_Data } from 'store/selectors';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const TilesVisibility = () => {
  const data_today = useSelector(getWeatherToday_Data);

  const [visibility, setVisibility] = useState('--');
  useEffect(() => {
    const hour = moment().format('H');

    setVisibility(data_today.days[0].hours[hour].visibility); // Видимость километров
  }, [data_today]);

  const [visibilityPoint, setVisibilityPoint] = useState('0');
  const [visibilityСonditions, setVisibilityСonditions] = useState('--');
  const [background_1, setBackground_1] = useState('rgb(31, 149, 74)'); //rgb(31, 149, 74)
  const [background_2, setBackground_2] = useState('rgb(55, 166, 96)');
  const [background_3, setBackground_3] = useState('rgb(85, 177, 126)');
  const [background_4, setBackground_4] = useState('rgb(96, 189, 130)');
  const [background_5, setBackground_5] = useState('rgb(160, 216, 185)');
  const color = 'rgb(255 255 255 / 10%)';

  useEffect(() => {
    if (visibility <= 0.05) {
      setVisibilityPoint('0 баллов');
      setVisibilityСonditions('Очень плохая видимость. Густой туман или пурга.');
      setBackground_1(color);
      setBackground_2(color);
      setBackground_3(color);
      setBackground_4(color);
      setBackground_5(color);
    } else if (visibility <= 0.2) {
      setVisibilityPoint('1 балл');
      setVisibilityСonditions('Плохая видимость. Густой туман или мокрый снег.');
      setBackground_1(color);
      setBackground_2(color);
      setBackground_3(color);
      setBackground_4(color);
    } else if (visibility < 0.5) {
      setVisibilityPoint('2 балла');
      setVisibilityСonditions('Плохая видимость. Туман, мокрый снег.');
      setBackground_1(color);
      setBackground_2(color);
      setBackground_3(color);
    } else if (visibility < 1) {
      setVisibilityPoint('3 балла');
      setVisibilityСonditions('Дымка, густая мгла, снег.');
      setBackground_1(color);
      setBackground_2(color);
      setBackground_3(color);
    } else if (visibility < 2) {
      setVisibilityPoint('4 балла');
      setVisibilityСonditions('Средняя видимость. Снег, сильный дождь.');
      setBackground_1(color);
      setBackground_2(color);
    } else if (visibility < 4) {
      setVisibilityPoint('5 баллов');
      setVisibilityСonditions('Дымка, мгла, дождь.');
      setBackground_1(color);
    } else if (visibility < 10) {
      setVisibilityPoint('6 баллов');
      setVisibilityСonditions('Легкая дымка, мгла, слабый дождь.');
    } else if (visibility < 20) {
      setVisibilityPoint('7 баллов');
      setVisibilityСonditions('Хорошая видимость. Виден горизонт.');
    } else if (visibility < 50) {
      setVisibilityPoint('8 баллов');
      setVisibilityСonditions('Очень хорошая видимость. Горизонт виден резко.');
    } else if (visibility >= 8) {
      setVisibilityPoint('9 баллов');
      setVisibilityСonditions('Свыше 50 км. Исключительная видимость. Горизонт виден четко, воздух прозрачный.');
    }
  }, [visibility]);

  return (
    <div className="card__item">
      <p className="item__title">Видимость</p>
      <div className="visibility">
        <div className="visibility__image">
          <div className="image__line" style={{ background: background_5 }}></div>
          <div className="image__line" style={{ background: background_4 }}></div>
          <div className="image__line" style={{ background: background_3 }}></div>
          <div className="image__line" style={{ background: background_2 }}></div>
          <div className="image__line" style={{ background: background_1 }}></div>
        </div>
        <div className="visibility__block-value">
          <p className="block-value__value">{visibility}</p>
          <p className="block-value__caption">км</p>
        </div>
      </div>
      <p className="item__text">{visibilityPoint}</p>
      <p className="item__sub-text">{visibilityСonditions}</p>
    </div>
  );
};
