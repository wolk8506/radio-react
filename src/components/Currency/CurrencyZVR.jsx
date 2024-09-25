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

import { getZVRCurrent, getZVRPrevious } from 'store/thunks';

export const CurrencyZVR = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getZVRPrevious());
    dispatch(getZVRCurrent());
  }, [dispatch]);

  // Обновление курса валют
  const handleUpdateCurrency = () => {
    dispatch(getZVRPrevious());
    dispatch(getZVRCurrent());
  };

  const storeData = useSelector(state => state.storeCurrencyZVRPrevious);
  const storeData2 = useSelector(state => state.storeCurrencyZVRCurrent);
  const moment = require('moment');
  const monthPreviousTable = moment().add(-1, 'months').format('MMMM YYYY');
  const monthCurrentTable = moment().format('MMMM YYYY');

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
  function createData(name, value, fat, carbs, protein) {
    return { name, value, fat, carbs, protein };
  }
  let rows = [createData('Данные доступны после 6-го числа текущего месяца')];
  if (storeData.length !== 0) {
    rows = [
      createData(
        'Прочие резервные активы',
        storeData.find(el => el.id_api === 'RES_OthReserveAssets').value
      ),
      createData(
        'Резервная позиция в МВФ ',
        storeData.find(el => el.id_api === 'RES_IMFResPosition').value
      ),
      createData(
        'Специальные права заимствования ',
        storeData.find(el => el.id_api === 'RES_SDRs').value
      ),
      createData(
        'Золото ',
        storeData.find(el => el.id_api === 'RES_Gold').value
      ),
      createData(
        'Резервы в иностранной валюте',
        storeData.find(el => el.id_api === 'RES_ForCurrencyAssets').value
      ),
      createData(
        'Официальные резервные активы',
        storeData.find(el => el.id_api === 'RES_OffReserveAssets').value
      ),
    ];
  }

  let rows2 = [];
  if (storeData2.length === 0) {
    rows2 = [createData('Данные доступны после 6-го числа текущего месяца')];
  } else {
    rows2 = [
      createData(
        'Прочие резервные активы',
        storeData2.find(el => el.id_api === 'RES_OthReserveAssets').value
      ),
      createData(
        'Резервная позиция в МВФ ',
        storeData2.find(el => el.id_api === 'RES_IMFResPosition').value
      ),
      createData(
        'Специальные права заимствования ',
        storeData2.find(el => el.id_api === 'RES_SDRs').value
      ),
      createData(
        'Золото ',
        storeData2.find(el => el.id_api === 'RES_Gold').value
      ),
      createData(
        'Резервы в иностранной валюте',
        storeData2.find(el => el.id_api === 'RES_ForCurrencyAssets').value
      ),
      createData(
        'Официальные резервные активы',
        storeData2.find(el => el.id_api === 'RES_OffReserveAssets').value
      ),
    ];
  }

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
        <h2>Золото-валютные резервы</h2>
      </div>
      <div className="tables">
        <TableContainer className="table" component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Золото-валютные резервы на {monthPreviousTable}
                </TableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Показатель</StyledTableCell>
                <StyledTableCell align="right">млн. $ USA</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <StyledTableCell align="right">{row.value}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer className="table" component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  Золото-валютные резервы на {monthCurrentTable}
                </TableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Показатель</StyledTableCell>
                <StyledTableCell align="right">млн. $ USA</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows2.map(row => (
                <StyledTableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <StyledTableCell align="right">{row.value}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
