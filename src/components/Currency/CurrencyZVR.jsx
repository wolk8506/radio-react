import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  getCurrencyZVRPrevious_Loading,
  getCurrencyZVRPrevious_Status,
  getCurrencyZVRPrevious_TimeUpdate,
  getCurrencyZVRPrevious_Data,
  getCurrencyZVRCurrent_Loading,
  getCurrencyZVRCurrent_Status,
  getCurrencyZVRCurrent_TimeUpdate,
  getCurrencyZVRCurrent_Data,
} from '../../store/selectors';
import { fetchCurrencyZVRPrevious, fetchCurrencyZVRCurrent } from '../../store/operation';

import { styled } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';

import moment from 'moment';

export const CurrencyZVR = () => {
  const BASE_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/res';
  const dispatch = useDispatch();

  const timeUpdate = useSelector(getCurrencyZVRPrevious_TimeUpdate);
  const loading = useSelector(getCurrencyZVRPrevious_Loading);
  const status = useSelector(getCurrencyZVRPrevious_Status);
  const storeData = useSelector(getCurrencyZVRPrevious_Data);

  const timeUpdate2 = useSelector(getCurrencyZVRCurrent_TimeUpdate);
  const loading2 = useSelector(getCurrencyZVRCurrent_Loading);
  const status2 = useSelector(getCurrencyZVRCurrent_Status);
  const storeData2 = useSelector(getCurrencyZVRCurrent_Data);

  const currentDateZVRPrevious = moment().add(-1, 'month').format('YYYY-MM-DD');
  const currentDateZVRCurrent = moment().add(0, 'month').format('YYYY-MM-DD');

  const [monthPreviousNew, setMonthPreviousNew] = React.useState();
  const [monthCurrentNew, setMonthCurrentNew] = React.useState();

  const [valueZVRPrevious, setValueZVRPrevious] = React.useState(dayjs(currentDateZVRPrevious));
  const [valueZVRCurrent, setValueZVRCurrent] = React.useState(dayjs(currentDateZVRCurrent));

  useEffect(() => {
    let mm;
    if (valueZVRPrevious.$M + 1 < 10) mm = '0' + (valueZVRPrevious.$M + 1);
    else mm = valueZVRPrevious.$M + 1;
    const date = `${valueZVRPrevious.$y}${mm}`;
    setMonthPreviousNew(date);

    dispatch(fetchCurrencyZVRPrevious(`${BASE_URL}?date=${date}&json`));
  }, [dispatch, valueZVRPrevious]);

  useEffect(() => {
    let mm;
    if (valueZVRCurrent.$M + 1 < 10) mm = '0' + (valueZVRCurrent.$M + 1);
    else mm = valueZVRCurrent.$M + 1;
    const date = `${valueZVRCurrent.$y}${mm}`;
    setMonthCurrentNew(date);

    dispatch(fetchCurrencyZVRCurrent(`${BASE_URL}?date=${date}&json`));
  }, [dispatch, valueZVRCurrent]);

  useEffect(() => {
    const monthPrevious = moment().add(-1, 'month').format('YYYYMM');
    const monthCurrent = moment().add(0, 'month').format('YYYYMM');

    dispatch(fetchCurrencyZVRPrevious(`${BASE_URL}?date=${monthPrevious}&json`));
    dispatch(fetchCurrencyZVRCurrent(`${BASE_URL}?date=${monthCurrent}&json`));
  }, [dispatch]);

  const hahdleCurrencyZVR = () => {
    dispatch(fetchCurrencyZVRPrevious(`${BASE_URL}?date=${monthPreviousNew}&json`));
    dispatch(fetchCurrencyZVRCurrent(`${BASE_URL}?date=${monthCurrentNew}&json`));
  };

  // --------------------------------

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
      createData('Прочие резервные активы', storeData.find(el => el.id_api === 'RES_OthReserveAssets').value),
      createData('Резервная позиция в МВФ ', storeData.find(el => el.id_api === 'RES_IMFResPosition').value),
      createData('Специальные права заимствования ', storeData.find(el => el.id_api === 'RES_SDRs').value),
      createData('Золото ', storeData.find(el => el.id_api === 'RES_Gold').value),
      createData('Резервы в иностранной валюте', storeData.find(el => el.id_api === 'RES_ForCurrencyAssets').value),
      createData('Официальные резервные активы', storeData.find(el => el.id_api === 'RES_OffReserveAssets').value),
    ];
  }

  let rows2 = [];
  if (storeData2.length === 0) {
    rows2 = [createData('Данные доступны после 6-го числа текущего месяца')];
  } else {
    rows2 = [
      createData('Прочие резервные активы', storeData2.find(el => el.id_api === 'RES_OthReserveAssets').value),
      createData('Резервная позиция в МВФ ', storeData2.find(el => el.id_api === 'RES_IMFResPosition').value),
      createData('Специальные права заимствования ', storeData2.find(el => el.id_api === 'RES_SDRs').value),
      createData('Золото ', storeData2.find(el => el.id_api === 'RES_Gold').value),
      createData('Резервы в иностранной валюте', storeData2.find(el => el.id_api === 'RES_ForCurrencyAssets').value),
      createData('Официальные резервные активы', storeData2.find(el => el.id_api === 'RES_OffReserveAssets').value),
    ];
  }

  return (
    <div>
      <div className="nameSection">
        <LoadingButton
          className="load-btn"
          onClick={hahdleCurrencyZVR}
          loading={loading || loading2}
          // loadingIndicator="Loading…"
          loadingPosition="start" //loadingPosition="end"
          variant="outlined" //outlined // contained
          startIcon={<AutorenewIcon />}
        >
          Обновить
        </LoadingButton>
        <h2>Золото-валютные резервы</h2>
      </div>
      <div className="tables">
        <TableContainer className="table" component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginLeft: '16px',
                      color: 'var(--color-2)',
                    }}
                  >
                    <p>Золото-валютные резервы на {moment(storeData[0].dt).format('MMMM YYYY')}</p>
                    <div>
                      {status ? (
                        <CheckCircleOutlineIcon className="icon-success" />
                      ) : (
                        <WarningAmberIcon className="icon-warning" />
                      )}
                      <p className="update-time" title="Время обновления данных с сервера.">
                        {timeUpdate}
                      </p>
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ru}>
                      <DemoContainer
                        components={['MobileDatePicker', 'DatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                      >
                        <DatePicker
                          className="date-picker"
                          label={'месяц / год'}
                          views={['year', 'month']}
                          minDate={dayjs('2004-01-01')}
                          maxDate={dayjs(currentDateZVRPrevious)}
                          defaultValue={dayjs(currentDateZVRPrevious)}
                          value={valueZVRPrevious}
                          onAccept={selectionState => setValueZVRPrevious(selectionState)}
                          slotProps={{
                            actionBar: {
                              actions: ['cancel', 'accept'],
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginLeft: '16px',
                      color: 'var(--color-2)',
                    }}
                  >
                    <p>
                      Золото-валютные резервы на{' '}
                      {storeData2[0]?.dt ? moment(storeData2[0].dt).format('MMMM YYYY') : moment().format('MMMM YYYY')}
                    </p>
                    <div>
                      {status2 ? (
                        <CheckCircleOutlineIcon className="icon-success" />
                      ) : (
                        <WarningAmberIcon className="icon-warning" />
                      )}
                      <p className="update-time" title="Время обновления данных с сервера.">
                        {timeUpdate2}
                      </p>
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ru}>
                      <DemoContainer
                        components={['MobileDatePicker', 'DatePicker', 'DesktopDatePicker', 'StaticDatePicker']}
                      >
                        <DatePicker
                          className="date-picker"
                          label={'месяц / год'}
                          views={['year', 'month']}
                          minDate={dayjs('2004-01-01')}
                          maxDate={dayjs(currentDateZVRCurrent)}
                          defaultValue={dayjs(currentDateZVRCurrent)}
                          value={valueZVRCurrent}
                          onAccept={selectionState => setValueZVRCurrent(selectionState)}
                          slotProps={{
                            actionBar: {
                              actions: ['cancel', 'accept'],
                            },
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
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
