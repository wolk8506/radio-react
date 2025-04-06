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

export const News = () => {
  const dispatch = useDispatch();
  const news = useSelector(getNews_Data);
  const toalPages = news.totalResults;
  console.log(toalPages);
  console.log(news);

  useEffect(() => {
    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=Последние&country=by,ru,ua&language=ru`
      )
    );
  }, [dispatch]);

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
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${value}&country=by,ru,ua&language=ru`
      )
    );
  };

  const [page, setPage] = useState(2);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log('newPage', newPage);

    const nextPage = news.nextPage;

    dispatch(
      fetchNews(
        `https://newsdata.io/api/1/news?apikey=pub_7872192e719b0dd34ea7170690fc216c060c4&q=${
          value.length === 0 ? 'Последние' : value
        }&country=by,ru,ua&language=ru&page=${nextPage}`
      )
    );
  };

  //   const handleChangeRowsPerPage = event => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //     console.log('назад');
  //   };

  return (
    <div className="container-news">
      <h2>Новости</h2>
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

      <TablePagination
        component="div"
        count={toalPages}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ul>
        {news.results.map(i => {
          //   console.log(i);
          return (
            <li key={i.link}>
              <a href={i.link} target="_blank" rel="noopener noreferrer">
                {i.title}
              </a>
              <p>{i.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
