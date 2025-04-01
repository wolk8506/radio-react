import soup_01 from '../img/soup_01.jpg';

import cake_00 from '../img/load.gif';

export const data_soup = [
  {
    id: '1',
    name: 'Сырный суп',
    img: soup_01,
    ingredients: [
      { i_name: 'Бульон', i_weight: '1 л.' },
      { i_name: 'Картофель', i_weight: '2 шт.' },
      { i_name: 'Лук репчатый', i_weight: '150 г.' },
      { i_name: 'Морковь', i_weight: '150 г.' },
      { i_name: 'Грибы', i_weight: '200 г.' },
      { i_name: 'Сыр плавленый', i_weight: '2 шт.' },
      { i_name: 'Сливки', i_weight: '100мл.' },
      { i_name: 'Сыр твердый', i_weight: '100 г.' },
      { i_name: 'Кетчуп', i_weight: '2 ст. л.' },
    ],
    steps: [
      {
        step: 1,
        img: null,
        text: 'В бульон закинуть мелко нарезанный картофель, морковь с луком поджарить на растительном масле с 2 -мя ложками кетчупа, добавить грибы, все обжарить в течение 10 минут.',
      },
      {
        step: 2,
        img: null,
        text: 'Добавить зажарку в бульон, туда же натереть на терке сырки, варить 20 минут, влить сливки, добавить тертый сыр, специи. Варить до растворения сыра.',
      },
      {
        step: 3,
        img: null,
        text: 'Можно взбить суп блендером или миксером, получится суп-пюре.',
      },
    ],
  },
  {
    id: '21',
    name: 'Шаблон 1',
    img: cake_00,
    ingredients: [
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
      { i_name: '', i_weight: '' },
    ],
    steps: [
      {
        step: 1,
        img: null,
        text: '',
      },
      {
        step: 2,
        img: null,
        text: '',
      },
      {
        step: 3,
        img: null,
        text: '',
      },
      {
        step: 4,
        img: null,
        text: '',
      },
      {
        step: 5,
        img: null,
        text: '',
      },
      {
        step: 6,
        img: null,
        text: '',
      },
    ],
  },
];
