import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { currencySelectors, currencyOperations } from 'store';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

export const CurrencyNBU = () => {
  const dispatch = useDispatch();
  const numberDay = moment().isoWeekday();

  const timeUpdate_today = useSelector(currencySelectors.getCurrencyNBUtoday_TimeUpdate);
  const loading_today = useSelector(currencySelectors.getCurrencyNBUtoday_Loading);
  const status_today = useSelector(currencySelectors.getCurrencyNBUtoday_Status);
  const storeData_today = useSelector(currencySelectors.getCurrencyNBUtoday_Data);

  const timeUpdate_tomorrow = useSelector(currencySelectors.getCurrencyNBUtomorrow_TimeUpdate);
  const loading_tomorrow = useSelector(currencySelectors.getCurrencyNBUtomorrow_Loading);
  const status_tomorrow = useSelector(currencySelectors.getCurrencyNBUtomorrow_Status);
  const storeData_tomorrow = useSelector(currencySelectors.getCurrencyNBUtomorrow_Data);

  const dateToday = moment().format('YYYYMMDD');
  const BASE_URL = `https://bank.gov.ua/NBUStatService/v1/statdirectory/`;

  const dateTodayTable = moment().format('dddd DD MMMM');
  const [dateTomorrow, setDateTomorrow] = useState(moment().add(1, 'days').format('YYYYMMDD'));
  const [dateTomorrowTable, setDateTomorrowTable] = useState(moment().add(1, 'days').format('dddd DD MMMM'));
  const [timeUpdate, setTimeUpdate] = useState();

  useEffect(() => {
    if (numberDay > 4) {
      setDateTomorrow(
        moment()
          .add(8 - numberDay, 'days')
          .format('YYYYMMDD')
      );
      setDateTomorrowTable(
        moment()
          .add(8 - numberDay, 'days')
          .format('dddd DD MMMM')
      );
    }
  }, [numberDay]);

  useEffect(() => {
    setTimeUpdate(timeUpdate_today >= timeUpdate_tomorrow ? timeUpdate_tomorrow : timeUpdate_today);
  }, [timeUpdate_today, timeUpdate_tomorrow]);

  useEffect(() => {
    dispatch(currencyOperations.fetchCurrencyNBUtoday(`${BASE_URL}exchange?date=${dateToday}&json`));
    dispatch(currencyOperations.fetchCurrencyNBUtomorrow(`${BASE_URL}exchange?date=${dateTomorrow}&json`));
  }, [BASE_URL, dateToday, dateTomorrow, dispatch]);

  // Обновление курса валют

  const handleUpdateCurrency = () => {
    dispatch(currencyOperations.fetchCurrencyNBUtoday(`${BASE_URL}exchange?date=${dateToday}&json`));
    dispatch(currencyOperations.fetchCurrencyNBUtomorrow(`${BASE_URL}exchange?date=${dateTomorrow}&json`));
  };

  const [STATUS, setSTATUS] = React.useState(true);

  useEffect(() => {
    setSTATUS(status_today && status_tomorrow);
  }, [status_today, status_tomorrow]);

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
      // dataTable[n].push(data.find(el => el.cc === 'RUB').rate);
      // dataTable[n].push(data.find(el => el.cc === 'BYN').rate);
      dataTable[n].push(data.find(el => el.cc === 'PLN').rate);

      dataTable[n].push(data.find(el => el.cc === 'XAU').rate);
      dataTable[n].push(data.find(el => el.cc === 'XAG').rate);
      dataTable[n].push(data.find(el => el.cc === 'XPT').rate);
      dataTable[n].push(data.find(el => el.cc === 'XPD').rate);
    } else dataTable[n].push(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  f1(storeData_today, 0);
  f1(storeData_tomorrow, 1);

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
    // createData('Российский рубль', dataTable[0][2], dataTable[1][2], dataTable[2][2]),
    // createData('Белорусский рубль', dataTable[0][3], dataTable[1][3], dataTable[2][3]),
    createData('Злотый', dataTable[0][2], dataTable[1][2], dataTable[2][2]),

    createData('Золото', dataTable[0][3], dataTable[1][3], dataTable[2][3]),
    createData('Серебро', dataTable[0][4], dataTable[1][4], dataTable[2][4]),
    createData('Платина', dataTable[0][5], dataTable[1][5], dataTable[2][5]),
    createData('Палладий', dataTable[0][6], dataTable[1][6], dataTable[2][6]),
  ];

  return (
    <section className="secton-nbu">
      <div className="name-section">
        <Button
          className="load-btn"
          onClick={handleUpdateCurrency}
          loading={loading_today || loading_tomorrow}
          // loadingIndicator="Loading…"
          loadingPosition="start" //loadingPosition="end"
          variant="outlined" //outlined // contained
          startIcon={<AutorenewIcon />}
        >
          Обновить
        </Button>
        <h2 className="name-section__title">Курс валют НБУ.</h2>
        <div className="update-block">
          {STATUS ? <CheckCircleOutlineIcon className="icon-success" /> : <WarningAmberIcon className="icon-warning" />}
          <p className="update-time" title="Время обновления данных с сервера.">
            {timeUpdate}
          </p>
        </div>
      </div>

      <div></div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Валюта</StyledTableCell>
              <StyledTableCell align="right">Курс на {dateTodayTable}</StyledTableCell>
              <StyledTableCell align="right">Курс на {dateTomorrowTable}</StyledTableCell>
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
    </section>
  );
};
