import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const TilesVisibility = () => {
  const data_today = useSelector(
    state => state.storeWeatherLastDay.today.days[0]
  );

  const [visibility, setVisibility] = useState('--');
  useEffect(() => {
    const hour = moment().format('H');

    setVisibility(data_today.hours[hour].visibility); // Видимость километров
  }, [data_today.hours]);

  const [visibilityPoint, setVisibilityPoint] = useState('0');
  const [visibilityСonditions, setVisibilityСonditions] = useState('--');

  useEffect(() => {
    if (visibility <= 0.05) {
      setVisibilityPoint('0 баллов');
      setVisibilityСonditions(
        'Очень плохая видимость. Густой туман или пурга.'
      );
    } else if (visibility <= 0.2) {
      setVisibilityPoint('1 балл');
      setVisibilityСonditions(
        'Плохая видимость. Густой туман или мокрый снег.'
      );
    } else if (visibility < 0.5) {
      setVisibilityPoint('2 балла');
      setVisibilityСonditions('Плохая видимость. Туман, мокрый снег.');
    } else if (visibility < 1) {
      setVisibilityPoint('3 балла');
      setVisibilityСonditions('Дымка, густая мгла, снег.');
    } else if (visibility < 2) {
      setVisibilityPoint('4 балла');
      setVisibilityСonditions('Средняя видимость. Снег, сильный дождь.');
    } else if (visibility < 4) {
      setVisibilityPoint('5 баллов');
      setVisibilityСonditions('Дымка, мгла, дождь.');
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
      setVisibilityСonditions(
        'Свыше 50 км. Исключительная видимость. Горизонт виден четко, воздух прозрачный.'
      );
    }
  }, [visibility]);

  return (
    <div className="card__item">
      <p className="item__title">Видимость</p>
      <div className="visibility">
        <div className="visibility__image">
          <div className="image__line"></div>
          <div className="image__line"></div>
          <div className="image__line"></div>
          <div className="image__line"></div>
          <div className="image__line"></div>
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
