import soup_01 from '../img/soup_01.jpg';
import soup_02_00 from '../img/soup/02-00.png';
import soup_02_01 from '../img/soup/02-01.png';
import soup_02_02 from '../img/soup/02-02.png';
import soup_02_03 from '../img/soup/02-03.png';
import soup_02_04 from '../img/soup/02-04.png';

// import cake_00 from '../img/load.gif';

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
    id: '2',
    name: 'Турецкий грибной суп',
    img: soup_02_00,
    ingredients: [
      { i_name: 'Лук', i_weight: '2 шт.' },
      { i_name: 'Чеснок', i_weight: '5 зубчиков' },
      { i_name: 'Сливочное масло', i_weight: '1 ст.л.' },
      { i_name: 'Растительное масло', i_weight: '2 ст.л.' },
      { i_name: 'Грибы', i_weight: '800 гр.' },
      { i_name: 'Мука', i_weight: '3 ст.л.' },
      { i_name: 'Вода', i_weight: '2 литра' },
      { i_name: 'Сливки', i_weight: '200 мл' },
      { i_name: 'Черный перец', i_weight: '1 ч.л.' },
      { i_name: 'Соль', i_weight: '1 ч.л.' },
      { i_name: 'Укроп', i_weight: '1/2 пучка' },
    ],
    steps: [
      {
        step: 1,
        img: soup_02_01,
        text: 'На сливочно оливковом масле обжареваем лук и чеснок.',
      },
      {
        step: 2,
        img: soup_02_02,
        text: 'К обжареному луку добавляем грибы и обжареваем, по готовности грибов добавляем 3 ст.л. муки, перемешиваем  и готовим около минуты.',
      },
      {
        step: 3,
        img: soup_02_03,
        text: 'Солим грибы и к ним добавляем кипяток и варим 15 минут',
      },
      {
        step: 4,
        img: soup_02_04,
        text: 'Добавить сливки, перец, укроп и довести до кипения. Суп готов!',
      },
    ],
  },
  // ***
  // {
  //   id: '21',
  //   name: 'Шаблон 1',
  //   img: cake_00,
  //   ingredients: [
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //     { i_name: '', i_weight: '' },
  //   ],
  //   steps: [
  //     {
  //       step: 1,
  //       img: null,
  //       text: '',
  //     },
  //     {
  //       step: 2,
  //       img: null,
  //       text: '',
  //     },
  //     {
  //       step: 3,
  //       img: null,
  //       text: '',
  //     },
  //     {
  //       step: 4,
  //       img: null,
  //       text: '',
  //     },
  //     {
  //       step: 5,
  //       img: null,
  //       text: '',
  //     },
  //     {
  //       step: 6,
  //       img: null,
  //       text: '',
  //     },
  //   ],
  // },
];
