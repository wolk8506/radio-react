// https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=Последние&country=by,ru,ua&language=ru

import { useState } from 'react';
import { getNews_Data } from 'store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from 'store/operation';
import { useEffect } from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import moment from 'moment';

export const News = () => {
  const dispatch = useDispatch();
  const news = useSelector(getNews_Data);
  const toalPages = news.totalResults;
  // console.log(toalPages);
  // console.log(news);

  const [country, setCountry] = useState(() => ['by', 'ru', 'us', 'ua']);

  const handleCountry = (event, newCountry) => {
    if (newCountry.length) {
      setCountry(newCountry);
    }
  };
  // не более пяти категорий можно выбрать одновременно
  const categoryName = [
    { name_ru: 'Бизнес', value: 'business', aria_label: 'Business' },
    { name_ru: 'Мир', value: 'world', aria_label: 'World' },
    { name_ru: 'Технологии', value: 'technology', aria_label: 'Technology' },
    { name_ru: 'Топ', value: 'top', aria_label: 'Top' },
    { name_ru: 'Политика', value: 'politics', aria_label: 'Politics' },
    { name_ru: 'Здоровье', value: 'health', aria_label: 'Health' },
    // { name_ru: 'Domestic', value: 'Domestic', aria_label: 'Domestic' },
    // { name_ru: 'Crime', value: 'Crime', aria_label: 'Crime' },
    // { name_ru: 'Education', value: 'Education', aria_label: 'Education' },
    // { name_ru: 'Entertainment', value: 'Entertainment', aria_label: 'Entertainment' },
    // { name_ru: 'Environment', value: 'Environment', aria_label: 'Environment' },
    // { name_ru: 'Food', value: 'Food', aria_label: 'Food' },
    // { name_ru: 'Lifestyle', value: 'Lifestyle', aria_label: 'Lifestyle' },
    // { name_ru: 'Other', value: 'Other', aria_label: 'Other' },
    // { name_ru: 'Science', value: 'Science', aria_label: 'Science' },
    // { name_ru: 'Sports', value: 'Sports', aria_label: 'Sports' },
    // { name_ru: 'Tourism', value: 'Tourism', aria_label: 'Tourism' },
  ];

  const [category, setCategory] = useState(() => []);

  const handleCategory = (event, newCategory) => {
    setCategory(newCategory);

    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&category=${newCategory}&country=${country.join(
          ','
        )}&language=ru`
      )
    );
    setPage(0);
    setPerPage([]);
  };

  useEffect(() => {
    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&country=${country.join(
          ','
        )}&language=ru`
      )
    );
    setPage(0);
    setPerPage([]);
  }, [country, dispatch]);

  const [value, setValue] = useState('');

  const handleChange = e => {
    const value = e.target.value;
    setValue(value);
  };

  const handleSearch = () => {
    const categoryParams = category.length === 0 ? '' : `&category=${category.join(',')}`;
    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${value}&country=${country.join(
          ','
        )}${categoryParams}&language=ru`
      )
    );
    setPage(0);
    setPerPage([]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const [perPage, setPerPage] = useState([]);
  console.log(perPage);

  const handleChangePage = (event, newPage) => {
    const nextPage = news.nextPage;
    // console.log(category.length);
    console.log(category);
    const categoryParams = category ? '' : `&category=${category}`;
    let nextPageParams = '';

    if (page < newPage) setPerPage({ ...perPage, [page]: { page, page_q: nextPage } });
    setPage(newPage);

    if (newPage > page) {
      //= perPage.length === 0 ? '' : `&category=${category.join(',')}`;
      nextPageParams = `&page=${nextPage}`;
    }
    if (newPage < page && newPage !== 0) {
      if (perPage[newPage - 1].page_q === undefined) {
        nextPageParams = '';
      } else nextPageParams = `&page=${perPage[newPage - 1].page_q}`;
    }

    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${
          value.length === 0 ? 'Последние' : value
        }&country=${country.join(',')}${categoryParams}&language=ru${nextPageParams}`
      )
    );
  };

  const dateHour = t => {
    const date = moment.utc(t);
    const timeDiff = moment.utc(moment().diff(date)).format('HH');
    const timeDiffH = moment.utc(moment().diff(date)).format('[ · ] HH [ч]');
    const timeDiffM = moment.utc(moment().diff(date)).format('[ · ]mm [мин]');
    return timeDiff === '0' ? timeDiffM : timeDiffH;
  };

  return (
    <div className="container-news">
      <div></div>
      <Paper
        component="div"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '80%',
          margin: '0 auto 30px',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: '$color-03c' }}
          placeholder="Поиск новостей"
          inputProps={{ 'aria-label': 'Поиск новостей' }}
          onChange={handleChange}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Paper>

      <div className="block-lang-pagination">
        <Stack direction="row" spacing={4}>
          <ToggleButtonGroup value={country} onChange={handleCountry} aria-label="device">
            <ToggleButton value="by" aria-label="by">
              Беларусь
            </ToggleButton>
            <ToggleButton value="ru" aria-label="ru">
              Россия
            </ToggleButton>
            <ToggleButton value="us" aria-label="us">
              США
            </ToggleButton>
            <ToggleButton value="ua" aria-label="ua">
              Украина
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <div className="category">
          <Stack direction="row" spacing={4}>
            <ToggleButtonGroup value={category} onChange={handleCategory} aria-label="category" exclusive>
              {categoryName.map(i => {
                return (
                  <ToggleButton value={i.value} aria-label={i.aria_label}>
                    {i.name_ru}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Stack>
        </div>
        <TablePagination
          component="div"
          count={toalPages}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <ul className="news-list">
        {news.results.map((i, index) => {
          //   console.log(i);
          return (
            <li key={i.link}>
              <div className="article">
                <div className="source">
                  <img className="source__img" src={i.source_icon} alt="" width={24} />
                  <span className="sourcce__title">{i.source_name}&nbsp; </span>
                  <span className="source__date">{dateHour(i.pubDate)}</span>
                </div>
                <a href={i.link} target="_blank" rel="noopener noreferrer">
                  {i.title}
                </a>
                <p>{i.description}</p>
              </div>
              <div className="image-block">
                <img className="image-block__img" src={i.image_url} alt="" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&country=ru&language=ru&category=politics

// не более пяти стран

// const country = [
//   'Afghanistan',
//   'Albania',
//   'Algeria',
//   'Andorra',
//   'Angola',
//   'Argentina',
//   'Armenia',
//   'Australia',
//   'Austria',
//   'Azerbaijan',
//   'Bahamas',
//   'Bahrain',
//   'Bangladesh',
//   'Barbados',
//   'Belarus',
//   'Belgium',
//   'Belize',
//   'Benin',
//   'Bermuda',
//   'Bhutan',
//   'Bolivia',
//   'Bosnia And Herzegovina',
//   'Botswana',
//   'Brazil',
//   'Brunei',
//   'Bulgaria',
//   'Burkina Fasco',
//   'Burundi',
//   'Cambodia',
//   'Cameroon',
//   'Canada',
//   'Cape Verde',
//   'Cayman Islands',
//   'Central African Republic',
//   'Chad',
//   'Chile',
//   'China',
//   'Colombia',
//   'Comoros',
//   'Congo',
//   'Cook Islands',
//   'Costa Rica',
//   'Croatia',
//   'Cuba',
//   'Curaçao',
//   'Cyprus',
//   'Czech Republic',
//   'Denmark',
//   'Djibouti',
//   'Dominica',
//   'Dominican Republic',
//   'DR Congo',
//   'Ecuador',
//   'Egypt',
//   'El Salvador',
//   'Equatorial Guinea',
//   'Eritrea',
//   'Estonia',
//   'Eswatini',
//   'Ethiopia',
//   'Fiji',
//   'Finland',
//   'France',
//   'French Polynesia',
//   'Gabon',
//   'Gambia',
//   'Georgia',
//   'Germany',
//   'Ghana',
//   'Gibraltar',
//   'Greece',
//   'Grenada',
//   'Guatemala',
//   'Guinea',
//   'Guyana',
//   'Haiti',
//   'Honduras',
//   'Hong Kong',
//   'Hungary',
//   'Iceland',
//   'India',
//   'Indonesia',
//   'Iran',
//   'Iraq',
//   'Ireland',
//   'Israel',
//   'Italy',
//   'Ivory Coast',
//   'Jamaica',
//   'Japan',
//   'Jersey',
//   'Jordan',
//   'Kazakhstan',
//   'Kenya',
//   'Kiribati',
//   'Kosovo',
//   'Kuwait',
//   'Kyrgyzstan',
//   'Laos',
//   'Latvia',
//   'Lebanon',
//   'Lesotho',
//   'Liberia',
//   'Libya',
//   'Liechtenstein',
//   'Lithuania',
//   'Luxembourg',
//   'Macau',
//   'Macedonia',
//   'Madagascar',
//   'Malawi',
//   'Malaysia',
//   'Maldives',
//   'Mali',
//   'Malta',
//   'Marshall Islands',
//   'Mauritania',
//   'Mauritius',
//   'Mexico',
//   'Micronesia',
//   'Moldova',
//   'Monaco',
//   'Mongolia',
//   'Montenegro',
//   'Morocco',
//   'Mozambique',
//   'Myanmar',
//   'Namibia',
//   'Nauru',
//   'Nepal',
//   'Netherland',
//   'New Caledonia',
//   'New Zealand',
//   'Nicaragua',
//   'Niger',
//   'Nigeria',
//   'North Korea',
//   'Norway',
//   'Oman',
//   'Pakistan',
//   'Palau',
//   'Palestine',
//   'Panama',
//   'Papua New Guinea',
//   'Paraguay',
//   'Peru',
//   'Philippines',
//   'Poland',
//   'Portugal',
//   'Puerto Rico',
//   'Qatar',
//   'Romania',
//   'Russia',
//   'Rwanda',
//   'Saint Lucia',
//   'Saint Martin(dutch)',
//   'Samoa',
//   'San Marino',
//   'Sao Tome And Principe',
//   'Saudi Arabia',
//   'Senegal',
//   'Serbia',
//   'Seychelles',
//   'Sierra Leone',
//   'Singapore',
//   'Slovakia',
//   'Slovenia',
//   'Solomon Islands',
//   'Somalia',
//   'South Africa',
//   'South Korea',
//   'Spain',
//   'Sri Lanka',
//   'Sudan',
//   'Suriname',
//   'Sweden',
//   'Switzerland',
//   'Syria',
//   'Taiwan',
//   'Tajikistan',
//   'Tanzania',
//   'Thailand',
//   'Timor-Leste',
//   'Togo',
//   'Tonga',
//   'Trinidad And Tobago',
//   'Tunisia',
//   'Turkey',
//   'Turkmenistan',
//   'Tuvalu',
//   'Uganda',
//   'Ukraine',
//   'United Arab Emirates',
//   'United Kingdom',
//   'United States Of America',
//   'Uruguay',
//   'Uzbekistan',
//   'Vanuatu',
//   'Vatican',
//   'Venezuela',
//   'Vietnam',
//   'Virgin Islands (British)',
//   'World',
//   'Yemen',
//   'Zambia',
//   'Zimbabwe',
// ];
