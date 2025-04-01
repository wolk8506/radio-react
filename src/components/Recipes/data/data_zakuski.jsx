import zakuski_01 from '../img/zakuski_01.jpg';

// import cake_00 from '../img/load.gif';

export const data_zakuski = [
  {
    id: '1',
    name: 'Бутерброд с бананом и корицей',
    img: zakuski_01,
    ingredients: [
      { i_name: 'Яйца', i_weight: '2 шт.' },
      { i_name: 'Банан', i_weight: '1 шт.' },
      { i_name: 'Молоко', i_weight: '120 мл' },
      { i_name: 'Корица', i_weight: '1 ч.л.' },
      { i_name: 'Хлеб', i_weight: '2 куска' },
      { i_name: 'Масло', i_weight: 'для жарки' },
    ],
    steps: [
      {
        step: 1,
        img: null,
        text: 'Смешай в блендере 2 яйца, 1 банан, 120 мл молока и 1 ч. л. молотой корицы.',
      },
      {
        step: 2,
        img: null,
        text: 'Разрежь пополам 2 куска хлеба. Пропитай их яичной смесью, а затем жарь с обеих сторон на сковородке с небольшим количеством масла, пока не станут золотистыми и хрустящими.',
      },
    ],
  },
];
