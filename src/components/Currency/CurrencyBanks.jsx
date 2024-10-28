import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  getCurrencyBanksToday_Loading,
  getCurrencyBanksToday_Status,
  getCurrencyBanksToday_TimeUpdate,
  getCurrencyBanksToday_Data,
} from '../../store/selectors';
import { fetchCurrencyBanksToday } from '../../store/operation';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const CurrencyBanks = () => {
  const dispatch = useDispatch();

  const timeUpdate = useSelector(getCurrencyBanksToday_TimeUpdate);
  const loading = useSelector(getCurrencyBanksToday_Loading);
  const status = useSelector(getCurrencyBanksToday_Status);
  const storeData = useSelector(getCurrencyBanksToday_Data);

  useEffect(() => {
    dispatch(fetchCurrencyBanksToday('https://apiexpressdata-1z2wmj3x.b4a.run/api/contacts'));
  }, [dispatch]);

  // Обновление курса валют
  const handleUpdateCurrency = () => {
    dispatch(fetchCurrencyBanksToday('https://apiexpressdata-1z2wmj3x.b4a.run/api/contacts'));
  };

  // !!! Контроллер выбора банка    !!!
  const [valueBank1, setValueBank1] = useState('12');
  const [valueBank2, setValueBank2] = useState('0');
  const [listBank, setListBank] = useState([
    {
      key: '0',
      name: 'PrivatBank',
    },
    {
      key: '1',
      name: 'National Bank',
    },
    {
      key: '2',
      name: 'UKRSIBBANK',
    },
    {
      key: '3',
      name: 'OTP bank',
    },
    {
      key: '4',
      name: 'Oschad Bank',
    },
    {
      key: '7',
      name: 'KredoBank',
    },
    {
      key: '9',
      name: 'Universal Bank',
    },
    {
      key: '12',
      name: 'ПУМБ',
    },
    {
      key: '13',
      name: 'Monobank',
    },
    {
      key: '14',
      name: 'Privat24',
    },
    {
      key: '15',
      name: 'Bank Lviv',
    },
    {
      key: '17',
      name: 'BTA Bank',
    },
    {
      key: '18',
      name: 'A-Bank',
    },
    {
      key: '19',
      name: 'AccordBank',
    },
  ]);

  useEffect(() => {
    const arr = [];

    for (let key in storeData) {
      if (storeData.hasOwnProperty(key)) {
        arr.push({ key: key, name: storeData[key].name });
      }
    }
    setListBank(arr);
  }, [storeData]);

  const handleChangeBank1 = e => {
    setValueBank1(e.target.value);
  };
  const handleChangeBank2 = e => {
    setValueBank2(e.target.value);
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  function createData(name, buy, sel) {
    return { name, buy, sel };
  }
  let rows = [
    createData('Евро', storeData[valueBank1].rates.eur.buy, storeData[valueBank1].rates.eur.sel),
    createData('Доллар', storeData[valueBank1].rates.usd.buy, storeData[valueBank1].rates.usd.sel),
    createData('Злотый', storeData[valueBank1].rates.pln.buy, storeData[valueBank1].rates.pln.sel),
    createData('Фунт стерлингов', storeData[valueBank1].rates.gbp.buy, storeData[valueBank1].rates.gbp.sel),
    createData('Российский рубль', storeData[valueBank1].rates.rur.buy, storeData[valueBank1].rates.rur.sel),
    createData('Швейцарский франк', storeData[valueBank1].rates.chf.buy, storeData[valueBank1].rates.chf.sel),
  ];

  let rows2 = [
    createData('Евро', storeData[valueBank2].rates.eur.buy, storeData[valueBank2].rates.eur.sel),
    createData('Доллар', storeData[valueBank2].rates.usd.buy, storeData[valueBank2].rates.usd.sel),
    createData('Злотый', storeData[valueBank2].rates.pln.buy, storeData[valueBank2].rates.pln.sel),
    createData('Фунт стерлингов', storeData[valueBank2].rates.gbp.buy, storeData[valueBank2].rates.gbp.sel),
    createData('Российский рубль', storeData[valueBank2].rates.rur.buy, storeData[valueBank2].rates.rur.sel),
    createData('Швейцарский франк', storeData[valueBank2].rates.chf.buy, storeData[valueBank2].rates.chf.sel),
  ];

  return (
    <div>
      <div className="nameSection">
        <LoadingButton
          className="load-btn"
          onClick={handleUpdateCurrency}
          loading={loading}
          loadingPosition="start" //loadingPosition="end"
          variant="outlined" //outlined // contained
          startIcon={<AutorenewIcon />}
        >
          Обновить
        </LoadingButton>
        <h2>Курс валют в банках.</h2>
        <div className="update-block">
          {status ? <CheckCircleOutlineIcon className="icon-success" /> : <WarningAmberIcon className="icon-warning" />}
          <p className="update-time" title="Время обновления данных с сервера.">
            {timeUpdate}
          </p>
        </div>
      </div>

      <div className="tables">
        <TableContainer className="table" component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <div className="table-name">
                  <a
                    className="bank-img"
                    href={storeData[valueBank1].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={storeData[valueBank1].image} alt={storeData[valueBank1].name} width={64} />
                  </a>

                  <FormControl className="select-bank" variant="standard" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-standard-label">Банк</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={valueBank1}
                      onChange={handleChangeBank1}
                      label="Converter"
                    >
                      {listBank.map(i => (
                        <MenuItem key={i.key} value={i.key}>
                          {i.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </TableRow>
              <TableRow>
                <StyledTableCell>Показатель</StyledTableCell>
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
                  <StyledTableCell align="right">{row.buy}</StyledTableCell>
                  <StyledTableCell align="right">{row.sel}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer className="table" component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <div className="table-name">
                  <a
                    className="bank-img"
                    href={storeData[valueBank2].website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={storeData[valueBank2].image} alt={storeData[valueBank2].name} width={64} />
                  </a>

                  <FormControl className="select-bank" variant="standard" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-standard-label">Банк</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={valueBank2}
                      onChange={handleChangeBank2}
                      label="Converter"
                    >
                      {listBank.map(i => (
                        <MenuItem key={i.key} value={i.key}>
                          {i.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </TableRow>
              <TableRow>
                <StyledTableCell>Показатель</StyledTableCell>
                <StyledTableCell align="right">Покупка</StyledTableCell>
                <StyledTableCell align="right">Продажа</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows2.map(row => (
                <StyledTableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <StyledTableCell align="right">{row.buy}</StyledTableCell>
                  <StyledTableCell align="right">{row.sel}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
