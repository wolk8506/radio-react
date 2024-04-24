import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import s from './Currency.module.css';
import { useEffect } from 'react';
import { useState } from 'react';

import { getKursTodayBanks } from 'store/thunks';

export const CurrencyBanks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getKursTodayBanks());
  }, [dispatch]);

  // Обновление курса валют
  const handleUpdateCurrency = () => {
    dispatch(getKursTodayBanks());
  };

  const BANK = useSelector(state => state.storeKursTodayBanks.data.exchangers);

  // !!! Контроллер выбора банка    !!!
  const [valueBank1, setValueBank1] = useState('12');
  const [valueBank2, setValueBank2] = useState('0');
  const [listBank, setListBank] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let key in BANK) {
      if (BANK.hasOwnProperty(key)) {
        arr.push({ key: key, name: BANK[key].name });
      }
    }
    setListBank(arr);
  }, [BANK]);

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
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  useEffect(() => {
    console.log(BANK);
  }, [BANK]);

  function createData(name: string, buy: number, sel: number) {
    return { name, buy, sel };
  }

  const rows = [
    createData(
      'Евро',
      BANK[valueBank1].rates.eur.buy,
      BANK[valueBank1].rates.eur.sel
    ),
    createData(
      'Доллар',
      BANK[valueBank1].rates.usd.buy,
      BANK[valueBank1].rates.usd.sel
    ),
    createData(
      'Злотый',
      BANK[valueBank1].rates.pln.buy,
      BANK[valueBank1].rates.pln.sel
    ),
    createData(
      'Фунт стерлингов',
      BANK[valueBank1].rates.gbp.buy,
      BANK[valueBank1].rates.gbp.sel
    ),
    createData(
      'Российский рубль',
      BANK[valueBank1].rates.rur.buy,
      BANK[valueBank1].rates.rur.sel
    ),
    createData(
      'Швейцарский франк',
      BANK[valueBank1].rates.chf.buy,
      BANK[valueBank1].rates.chf.sel
    ),
  ];

  const rows2 = [
    createData(
      'Евро',
      BANK[valueBank2].rates.eur.buy,
      BANK[valueBank2].rates.eur.sel
    ),
    createData(
      'Доллар',
      BANK[valueBank2].rates.usd.buy,
      BANK[valueBank2].rates.usd.sel
    ),
    createData(
      'Злотый',
      BANK[valueBank2].rates.pln.buy,
      BANK[valueBank2].rates.pln.sel
    ),
    createData(
      'Фунт стерлингов',
      BANK[valueBank2].rates.gbp.buy,
      BANK[valueBank2].rates.gbp.sel
    ),
    createData(
      'Российский рубль',
      BANK[valueBank2].rates.rur.buy,
      BANK[valueBank2].rates.rur.sel
    ),
    createData(
      'Швейцарский франк',
      BANK[valueBank2].rates.chf.buy,
      BANK[valueBank2].rates.chf.sel
    ),
  ];

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
        <h2>Курс валют в банках</h2>
      </div>
      {BANK && (
        <div className={s.tables}>
          <TableContainer className={s.table} component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <div className={s.tableName}>
                      <img
                        src={BANK[valueBank1].image}
                        alt={BANK[valueBank1].name}
                        width={64}
                      />

                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 200 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Банк
                        </InputLabel>
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
                  </TableCell>
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
          <TableContainer className={s.table} component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <div className={s.tableName}>
                      <img
                        src={BANK[valueBank2].image}
                        alt={BANK[valueBank2].name}
                        width={64}
                      />

                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 200 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Банк
                        </InputLabel>
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
                  </TableCell>
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
      )}
    </div>
  );
};
