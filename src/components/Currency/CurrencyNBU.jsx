import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { getNBUtoday, getNBUtomorrow } from 'store/thunks';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { currencyNBUtodayStatus } from 'store/actions';

export const CurrencyNBU = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNBUtoday());
    dispatch(getNBUtomorrow());
  }, [dispatch]);

  // Обновление курса валют

  const handleUpdateCurrency = () => {
    dispatch(getNBUtoday());
    dispatch(getNBUtomorrow());
    dispatch(currencyNBUtodayStatus(false));
    dispatch(currencyNBUtodayStatus(false));
  };
  const data = useSelector(state => state.storeCurrencyNBUtoday.data);
  const data2 = useSelector(state => state.storeCurrencyNBUtomorrow.data);
  const TIME = useSelector(state => state.storeCurrencyNBUtoday.time);
  const STATUS1 = useSelector(state => state.storeCurrencyNBUtoday.status);
  const STATUS2 = useSelector(state => state.storeCurrencyNBUtomorrow.status);
  const [STATUS, setSTATUS] = React.useState(true);

  useEffect(() => {
    setSTATUS(STATUS1 && STATUS2);
  }, [STATUS1, STATUS2]);

  var moment = require('moment');
  let dateTomorrowTable = '---- -- ----';
  let dateTodayTable = moment().format('dddd DD MMMM');

  switch (moment().format('dddd')) {
    case 'пятница':
      require('moment/locale/ru');
      dateTomorrowTable = moment().add(3, 'days').format('dddd DD MMMM');
      break;
    case 'суббота':
      require('moment/locale/ru');
      dateTomorrowTable = moment().add(2, 'days').format('dddd DD MMMM');
      break;
    default:
      require('moment/locale/ru');
      dateTomorrowTable = moment().add(1, 'days').format('dddd DD MMMM');
      break;
  }

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const dataTable = [[], [], []];

  function f1(data, n) {
    if (data.length !== 0) {
      dataTable[n].push(data.find(el => el.cc === 'USD').rate);
      dataTable[n].push(data.find(el => el.cc === 'EUR').rate);
      dataTable[n].push(data.find(el => el.cc === 'RUB').rate);
      dataTable[n].push(data.find(el => el.cc === 'BYN').rate);
      dataTable[n].push(data.find(el => el.cc === 'PLN').rate);

      dataTable[n].push(data.find(el => el.cc === 'XAU').rate);
      dataTable[n].push(data.find(el => el.cc === 'XAG').rate);
      dataTable[n].push(data.find(el => el.cc === 'XPT').rate);
      dataTable[n].push(data.find(el => el.cc === 'XPD').rate);
    } else dataTable[n].push(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  f1(data, 0);
  f1(data2, 1);

  for (let i = 0; i < dataTable[0].length; i++) {
    if (dataTable[1][i] !== 0) {
      dataTable[2].push((dataTable[1][i] - dataTable[0][i]).toFixed(4));
    }
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Доллар США', dataTable[0][0], dataTable[1][0], dataTable[2][0]),
    createData('Евро', dataTable[0][1], dataTable[1][1], dataTable[2][1]),
    createData(
      'Российский рубль',
      dataTable[0][2],
      dataTable[1][2],
      dataTable[2][2]
    ),
    createData(
      'Белорусский рубль',
      dataTable[0][3],
      dataTable[1][3],
      dataTable[2][3]
    ),
    createData('Злотый', dataTable[0][4], dataTable[1][4], dataTable[2][4]),

    createData('Золото', dataTable[0][5], dataTable[1][5], dataTable[2][5]),
    createData('Серебро', dataTable[0][6], dataTable[1][6], dataTable[2][6]),
    createData('Платина', dataTable[0][7], dataTable[1][7], dataTable[2][7]),
    createData('Палладий', dataTable[0][8], dataTable[1][8], dataTable[2][8]),
  ];

  return (
    <div>
      <div className="nameSection">
        <IconButton
          color="primary"
          aria-label="add to shopping cart"
          onClick={handleUpdateCurrency}
        >
          <AutorenewIcon />
        </IconButton>
        <h2>Курс валют НБУ. Время обновления {TIME}</h2>
        {STATUS ? (
          <CheckCircleOutlineIcon color="success" />
        ) : (
          <WarningAmberIcon color="warning" />
        )}
      </div>

      <div></div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Валюта</StyledTableCell>
              <StyledTableCell align="right">
                Курс на {dateTodayTable}
              </StyledTableCell>
              <StyledTableCell align="right">
                Курс на {dateTomorrowTable}
              </StyledTableCell>
              <StyledTableCell align="right">Разницы</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <StyledTableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <StyledTableCell align="right">{row.calories}</StyledTableCell>
                <StyledTableCell align="right">{row.fat}</StyledTableCell>
                <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
