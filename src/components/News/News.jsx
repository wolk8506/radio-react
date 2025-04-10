// https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=Последние&country=by,ru,ua&language=ru

import { useState } from 'react';
import { getNews_Data } from 'store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from 'store/operation';
import { useEffect } from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
// import DirectionsIcon from '@mui/icons-material/Directions';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';

// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
// import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
// import LaptopIcon from '@mui/icons-material/Laptop';
// import TvIcon from '@mui/icons-material/Tv';
// import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
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

  const [language, setLanguage] = useState(() => ['by', 'ru', 'ua']);

  const handleDevices = (event, newDevices) => {
    if (newDevices.length) {
      setLanguage(newDevices);
    }
  };

  useEffect(() => {
    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=Последние&country=${language.join(
          ','
        )}&language=ru`
      )
    );
  }, [language, dispatch]);

  //   const [news, setNews] = useState([]);
  //   fetch(
  //     `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ru,ua&language=ru&category=technology `,
  //     { referrerPolicy: 'origin-when-cross-origin' }
  //   )
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       setNews(data.results);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching news:', error);
  //     });

  //   const [search, setSearch] = useState('');
  //   const [searchResults, setSearchResults] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  const [value, setValue] = useState('');

  const handleChange = e => {
    const value = e.target.value;
    setValue(value);
    // console.log(value);
    // dispatch(fetchNews(value));
  };

  const handleSearch = () => {
    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${value}&country=${language.join(
          ','
        )}&language=ru`
      )
    );
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // console.log('newPage', newPage);

    const nextPage = news.nextPage;

    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${
          value.length === 0 ? 'Последние' : value
        }&country=${language.join(',')}&language=ru&page=${nextPage}`
      )
    );
  };

  //   const handleChangeRowsPerPage = event => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //     console.log('назад');
  //   };

  const dateHour = t => {
    const date = moment.utc(t);
    const timeDiff = moment.utc(moment().diff(date)).format('HH');
    const timeDiffH = moment.utc(moment().diff(date)).format('[ · ] HH [ч]');
    const timeDiffM = moment.utc(moment().diff(date)).format('[ · ]mm [мин]');

    // console.log(timeDiff);
    return timeDiff === '0' ? timeDiffM : timeDiffH;
  };

  // const [imageStatus, setImageStatus] = useState([
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  //   'loading',
  // ]);

  // const handleImageLoaded = () => {
  //   setImageStatus('loaded');
  // };

  // const handleImageErrored = () => {
  //   setImageStatus('failed to load');
  // };

  // const handleImageLoaded = (index, newStatus) => {
  //   setImageStatus(prevStatus => {
  //     const updatedStatus = [...prevStatus]; // Создаем копию массива
  //     updatedStatus[index] = newStatus; // Изменяем нужный элемент
  //     return updatedStatus; // Возвращаем обновленный массив
  //   });
  // };

  // const handleImageErrored = (index, newStatus) => {
  //   setImageStatus(prevStatus => {
  //     const updatedStatus = [...prevStatus]; // Создаем копию массива
  //     updatedStatus[index] = newStatus; // Изменяем нужный элемент
  //     return updatedStatus; // Возвращаем обновленный массив
  //   });
  // };

  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // const handleImageLoaded = event => {
  //   const { naturalWidth, naturalHeight } = event.target;
  //   setDimensions({ width: naturalWidth, height: naturalHeight });
  // };

  // const [alignment, setAlignment] = useState('left');

  // const handleAlignment = (event, newAlignment) => {
  //   if (newAlignment !== null) {
  //     setAlignment(newAlignment);
  //   }
  // };

  return (
    <div className="container-news">
      <div></div>
      {/* <h2>Новости</h2> */}
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
          <ToggleButtonGroup value={language} onChange={handleDevices} aria-label="device">
            <ToggleButton value="by" aria-label="by">
              {/* <LaptopIcon /> */}
              Беларусь
            </ToggleButton>
            <ToggleButton value="ru" aria-label="ru">
              {/* <TvIcon /> */}
              Россия
            </ToggleButton>
            <ToggleButton value="ua" aria-label="ua">
              {/* <PhoneAndroidIcon /> */}
              Украина
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
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
                {/* <img
                  className="image-block__img"
                  src={i.image_url}
                  alt=""
                  onLoad={event => {
                    const { naturalWidth, naturalHeight } = event.target;
                    console.log(`Image ${index + 1}: Width = ${naturalWidth}px, Height = ${naturalHeight}px`);
                  }}
                /> */}

                {/* {i.image_url !== '' && (
                  <div>
                    <img src={i.image_url} alt="Example" onLoad={handleImageLoaded} />
                    <p>Width: {dimensions.width}px</p>
                    <p>Height: {dimensions.height}px</p>
                  </div>

                  
                )} */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
