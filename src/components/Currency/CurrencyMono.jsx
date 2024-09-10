import { useEffect, useState } from 'react';
import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import { getMonoToday } from 'store/thunks';

import s from './Currency.module.css';

export const CurrencyMono = () => {
  var moment = require('moment');
  // Данные курса валют из запроса
  const dataMono = useSelector(state => state.storeCurrencyMonoToday);

  // Найденные значения в ответе курса
  const [USD, setUSD] = useState([]);
  const [PLN, setPLN] = useState([]);
  const [EUR, setEUR] = useState([]);
  const [RUB, setRUB] = useState([]);
  const [BYN, setBYN] = useState([]);
  const [eurTOusaSell, setEurTOusaSell] = useState('-,----');
  const [eurTOusaBuy, setEurTOusaBuy] = useState('-,----');
  const [usdTOeurSell, setUsdTOeurSell] = useState('-,----');
  const [usdTOeurBuy, setUsdTOeurBuy] = useState('-,----');

  useEffect(() => {
    if (dataMono.length !== 0) {
      setUSD(dataMono.find(el => el.currencyCodeA === 840));
      setPLN(dataMono.find(el => el.currencyCodeA === 985));
      setEUR(dataMono.find(el => el.currencyCodeA === 978));
      setRUB(dataMono.find(el => el.currencyCodeA === 943));
      setBYN(dataMono.find(el => el.currencyCodeA === 933));
      setEurTOusaSell((EUR.rateSell / USD.rateSell).toFixed(4));
      setEurTOusaBuy((EUR.rateBuy / USD.rateBuy).toFixed(4));
      setUsdTOeurSell((USD.rateSell / EUR.rateSell).toFixed(4));
      setUsdTOeurBuy((USD.rateBuy / EUR.rateBuy).toFixed(4));
    }
  }, [
    EUR.rateBuy,
    EUR.rateSell,
    USD.rateBuy,
    USD.rateSell,
    dataMono,
    eurTOusaBuy,
    eurTOusaSell,
    usdTOeurBuy,
    usdTOeurSell,
  ]);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!    Конвертер валют   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Выбранное значение выпадающего списка валют
  const [valueSelect1, setValueSelect1] = useState('UAH');
  const [valueSelect2, setValueSelect2] = useState('EUR');
  // Введенное значение поля ввода
  const [valueText1, setValueText1] = useState('1');
  const [valueText2, setValueText2] = useState('0');
  // Активное поле ввода, во время ввода
  const [textField_On_1, setTextField_On_1] = useState(true);
  const [textField_On_2, setTextField_On_2] = useState(false);
  // Список валют для выпадающих списков
  const [d1, setD1] = useState(['UAH', 'USD', 'PLN', 'RUB', 'BYN']);
  const [d2, setD2] = useState(['EUR', 'USD', 'PLN', 'RUB', 'BYN']);

  // Выбор малюты из выпадающего списка 1
  const handleChange1 = event => {
    setValueSelect1(event.target.value);
  };

  // Выбор малюты из выпадающего списка 2
  const handleChange2 = event => {
    setValueSelect2(event.target.value);
  };

  // Формирование данных в массиве d1, d2
  useEffect(() => {
    const arr1 = ['UAH', 'EUR', 'USD', 'PLN', 'RUB', 'BYN'];
    let a1 = [...arr1];
    let d1 = [...a1.splice(a1.indexOf(valueSelect1), 1), ...a1];
    const e1 = d1.indexOf(valueSelect2);
    d1.splice(e1, 1);
    setD1(d1);
    let a2 = [...arr1];
    let d2 = [...a2.splice(a2.indexOf(valueSelect2), 1), ...a2];
    const e2 = d2.indexOf(valueSelect1);
    d2.splice(e2, 1);
    setD2(d2);
  }, [valueSelect1, valueSelect2]);

  // Переключение направления конвертирования валют
  const handleExpanr = () => {
    setD1(d2);
    setD2(d1);
    const temp1 = valueSelect1;
    const temp2 = valueSelect2;
    setValueSelect1(temp2);
    setValueSelect2(temp1);
  };

  // Записывает значение поля ввода и назначает активное поле ввода 1
  const handleConvert1 = e => {
    setValueText1(e.target.value);
    setTextField_On_1(true);
    setTextField_On_2(false);
  };

  // Записывает значение поля ввода и назначает активное поле ввода 2
  const handleConvert2 = e => {
    setValueText2(e.target.value);
    setTextField_On_1(false);
    setTextField_On_2(true);
  };

  // Выбирает активную валюту из двух списков и делает расчет по курсу валют. Результат записывает в не активное поле ввода
  useEffect(() => {
    // Переменные хранят выбранные значения курса в switch
    let a = 1;
    let b = 1;

    // записывает значение курса для переменной "a"
    switch (valueSelect1) {
      case 'USD':
        a = USD.rateBuy;
        break;
      case 'EUR':
        a = EUR.rateBuy;
        break;
      case 'UAH':
        a = 1;
        break;
      case 'PLN':
        a = PLN.rateCross;
        break;
      case 'RUB':
        a = RUB.rateCross;
        break;
      case 'BYN':
        a = BYN.rateCross;
        break;
      default:
        break;
    }
    // записывает значение курса для переменной "b"
    switch (valueSelect2) {
      case 'USD':
        b = USD.rateBuy;
        break;
      case 'EUR':
        b = EUR.rateBuy;
        break;
      case 'UAH':
        b = 1;
        break;
      case 'PLN':
        b = PLN.rateCross;
        break;
      case 'RUB':
        b = RUB.rateCross;
        break;
      case 'BYN':
        b = BYN.rateCross;
        break;
      default:
        break;
    }

    // Расчет курса для двух полей ввода
    let c = (Number(valueText1) * (a / b)).toFixed(2);
    let d = (Number(valueText2) * (b / a)).toFixed(2);

    // Записывает результат в не активное поле вввода
    if (textField_On_1) {
      setValueText2(c);
    } else if (textField_On_2) {
      setValueText1(d);
    }
  }, [
    BYN.rateCross,
    EUR.rateBuy,
    PLN.rateCross,
    RUB.rateCross,
    USD.rateBuy,
    textField_On_1,
    textField_On_2,
    valueSelect1,
    valueSelect2,
    valueText1,
    valueText2,
  ]);

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  let dateToday = moment().format('DD MMMM YYYY');

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

  function createData(name: string, rateBuy: number, rateSell: number) {
    return { name, rateBuy, rateSell };
  }

  const rows = [
    createData('Доллар США', USD.rateBuy, USD.rateSell),
    createData('Евро', EUR.rateBuy, EUR.rateSell),
    createData('Российский рубль', RUB.rateCross, RUB.rateCross),
    createData('Белорусский рубль', BYN.rateCross, BYN.rateCross),
    createData('Злотый', PLN.rateCross, PLN.rateCross),
  ];

  // Обновление курса валют
  const dispatch = useDispatch();
  const handleUpdateCurrency = () => {
    dispatch(getMonoToday());
  };

  return (
    <div>
      <div className={s.nameSection}>
        <IconButton
          color="primary"
          aria-label="add to shopping cart"
          onClick={handleUpdateCurrency}
        >
          <AutorenewIcon />
        </IconButton>
        <h2>Конвертер валют</h2>
      </div>

      <div className="converter-block">
        <Box
          className={s.textFieldBlock}
          component="form"
          // sx={{'& > :not(style)': { m: 1, width: '25ch' },}}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={s.textField}
            id="cur1"
            label=""
            type="number"
            min="0"
            value={valueText1}
            onChange={handleConvert1}
            variant="standard"
            step="1.00"
            // color="warning"
          />
          <TextField
            className={s.textField}
            id="cor2"
            label=""
            type="number"
            min="0"
            value={valueText2}
            onChange={handleConvert2}
            variant="standard"
            step="1.00"
            // color="warning"
            // style={{ color: '#fff' }}
          />
        </Box>

        <div className={s.currencyBTN}>
          <FormControl
            className={s.currencyBtnSelect}
            variant="filled"
            // sx={{ m: 1, minWidth: 200 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Валюта
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={valueSelect1}
              onChange={handleChange1}
              label="Converter"
              // color="warning"
            >
              {d1.map(i => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            className={s.currencyBtnRevert}
            color="primary"
            aria-label="add to shopping cart"
            onClick={handleExpanr}
          >
            <AutorenewIcon />
          </IconButton>

          <FormControl
            className={s.currencyBtnSelect}
            variant="filled"
            // sx={{ m: 1, minWidth: 200 }}
          >
            <InputLabel id="demo-simple-select-filled-label">Валюта</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={valueSelect2}
              onChange={handleChange2}
              label="Converter"
              // color="warning"
            >
              {d2.map(i => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className={s.nameSection}>
        <IconButton
          color="primary"
          aria-label="add to shopping cart"
          onClick={handleUpdateCurrency}
        >
          <AutorenewIcon />
        </IconButton>
        <h2>Курс MONObank на {dateToday}</h2>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Валюта</StyledTableCell>
              <StyledTableCell align="right">Покупка</StyledTableCell>
              <StyledTableCell align="right">Продажа</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <StyledTableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <StyledTableCell align="right">{row.rateBuy}</StyledTableCell>
                <StyledTableCell align="right">{row.rateSell}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
