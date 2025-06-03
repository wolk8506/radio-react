import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { currencySelectors, currencyOperations } from 'store';

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
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import dayjs from 'dayjs';

import moment from 'moment';
import { useCallback } from 'react';

export const CurrencyZVR = () => {
  const BASE_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/res';
  const dispatch = useDispatch();

  const timeUpdate = useSelector(currencySelectors.getCurrencyZVRPrevious_TimeUpdate);
  const loading = useSelector(currencySelectors.getCurrencyZVRPrevious_Loading);
  const status = useSelector(currencySelectors.getCurrencyZVRPrevious_Status);
  const storeData = useSelector(currencySelectors.getCurrencyZVRPrevious_Data);

  const timeUpdate2 = useSelector(currencySelectors.getCurrencyZVRCurrent_TimeUpdate);
  const loading2 = useSelector(currencySelectors.getCurrencyZVRCurrent_Loading);
  const status2 = useSelector(currencySelectors.getCurrencyZVRCurrent_Status);
  const storeData2 = useSelector(currencySelectors.getCurrencyZVRCurrent_Data);

  const currentDateZVRPrevious = moment().add(-1, 'month').format('YYYY-MM-DD');
  const currentDateZVRCurrent = moment().add(0, 'month').format('YYYY-MM-DD');

  const [monthPreviousNew, setMonthPreviousNew] = React.useState();
  const [monthCurrentNew, setMonthCurrentNew] = React.useState();

  const [valueZVRPrevious, setValueZVRPrevious] = React.useState(dayjs(currentDateZVRPrevious));
  const [valueZVRCurrent, setValueZVRCurrent] = React.useState(dayjs(currentDateZVRCurrent));

  const valueData = useCallback(value => {
    const mm = value.$M + 1 < 10 ? '0' + (value.$M + 1) : value.$M + 1;
    return `${value.$y}${mm}`;
  }, []);

  //  ~ DatePicker
  useEffect(() => {
    const date = valueData(valueZVRPrevious);
    setMonthPreviousNew(date);
    dispatch(currencyOperations.fetchCurrencyZVRPrevious(`${BASE_URL}?date=${date}&json`));
  }, [dispatch, valueData, valueZVRPrevious]);

  // ~ DatePicker
  useEffect(() => {
    const date = valueData(valueZVRCurrent);
    setMonthCurrentNew(date);
    dispatch(currencyOperations.fetchCurrencyZVRCurrent(`${BASE_URL}?date=${date}&json`));
  }, [dispatch, valueData, valueZVRCurrent]);

  useEffect(() => {
    const monthPrevious = moment().add(-1, 'month').format('YYYYMM');
    const monthCurrent = moment().add(0, 'month').format('YYYYMM');

    dispatch(currencyOperations.fetchCurrencyZVRPrevious(`${BASE_URL}?date=${monthPrevious}&json`));
    dispatch(currencyOperations.fetchCurrencyZVRCurrent(`${BASE_URL}?date=${monthCurrent}&json`));
  }, [dispatch]);

  const hahdleCurrencyZVR = () => {
    dispatch(currencyOperations.fetchCurrencyZVRPrevious(`${BASE_URL}?date=${monthPreviousNew}&json`));
    dispatch(currencyOperations.fetchCurrencyZVRCurrent(`${BASE_URL}?date=${monthCurrentNew}&json`));
  };

  // ~  Создание данных для наполнения таблиц
  const createDataTable = data => {
    const createData = (name, value, fat, carbs, protein) => {
      return { name, value, fat, carbs, protein };
    };
    const getValueById = (data, id) => data.find(el => el.id_api === id)?.value || '0';

    const createRows = data => [
      createData('Прочие резервные активы', getValueById(data, 'RES_OthReserveAssets')),
      createData('Резервная позиция в МВФ', getValueById(data, 'RES_IMFResPosition')),
      createData('Специальные права заимствования', getValueById(data, 'RES_SDRs')),
      createData('Золото', getValueById(data, 'RES_Gold')),
      createData('Резервы в иностранной валюте', getValueById(data, 'RES_ForCurrencyAssets')),
      createData('Официальные резервные активы', getValueById(data, 'RES_OffReserveAssets')),
    ];

    return data.length ? createRows(data) : [createData('Данные доступны после 6-го числа текущего месяца')];
  };

  const rows = createDataTable(storeData); //  # Данные для таблицы 1
  const rows2 = createDataTable(storeData2); //  # Данные для таблицы 2

  // ~ Стили таблиц
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

  return (
    <section className="secton-zvr">
      <div className="name-section">
        <Button
          className="load-btn"
          onClick={hahdleCurrencyZVR}
          loading={loading || loading2}
          loadingPosition="start" //loadingPosition="end"
          variant="outlined" //outlined // contained
          startIcon={<AutorenewIcon />}
        >
          Обновить
        </Button>
        <h2 className="name-section__title">Золото-валютные резервы</h2>
      </div>
      <div className="tables">
        <TableContainer className="table" component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  <div className="table__table-header">
                    <div className="table-header__title">
                      <p>Золото-валютные резервы на</p>
                      <p>{moment(storeData[0].dt).format('MMMM YYYY')}</p>
                    </div>

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

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
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
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  <div className="table__table-header">
                    <div className="table-header__title">
                      <p>Золото-валютные резервы на</p>
                      <p>
                        {storeData2[0]?.dt
                          ? moment(storeData2[0].dt).format('MMMM YYYY')
                          : moment().format('MMMM YYYY')}
                      </p>
                    </div>

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

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
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
    </section>
  );
};
