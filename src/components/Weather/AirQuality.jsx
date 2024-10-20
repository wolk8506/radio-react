import * as React from 'react';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import moment from 'moment';

import { getWeatherAirQuality } from 'store/thunks';

export const AirQuality = () => {
  const hour = Number(moment().format('H'));
  const data = useSelector(state => state.storeWeatherAirQuality);
  const CITY = useSelector(state => state.storeData.city);
  const dispatch = useDispatch();
  useEffect(() => {
    // const REACT_APP_WEATHER_API_KEY_2 = 'D6MDZY6JMNHMG6CBQANG3GNHD';

    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${CITY}?unitGroup=metric&key=ALDXRSSMA67DYTJF696P4X2T8&contentType=json&elements=datetime,pm1,pm2p5,pm10,o3,no2,so2,co,aqius,aqieur`;

    dispatch(getWeatherAirQuality(URL));
  }, [CITY, dispatch]);

  const [co, setCo] = useState(0);
  const [no2, setNo2] = useState(0);
  const [o3, setO3] = useState(0);
  const [pm2p5, setPm2p5] = useState(0);
  const [pm10, setPm10] = useState(0);
  const [so2, setSo2] = useState(0);

  const [coChart, setCoChart] = useState([{ code: 0, co: 1 }]);
  const [no2Chart, setNo2Chart] = useState([{ code: 0, no2: 1 }]);
  const [o3Chart, setO3Chart] = useState([{ code: 0, co: 1 }]);
  const [pm2p5Chart, setPm2p5Chart] = useState([{ code: 0, co: 1 }]);
  const [pm10Chart, setPm10Chart] = useState([{ code: 0, co: 1 }]);
  const [so2Chart, setSo2Chart] = useState([{ code: 0, co: 1 }]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return { code: n_text, co: Number(((i.co / 1000) * 0.8729).toFixed(3)) };
    });
    setCoChart(arr);
  }, [data.days]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return {
        code: n_text,
        no2: i.no2,
      };
    });
    setNo2Chart(arr);
  }, [data.days]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return {
        code: n_text,
        o3: i.o3,
      };
    });
    setO3Chart(arr);
  }, [data.days]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return {
        code: n_text,
        pm2p5: i.pm2p5,
      };
    });
    setPm2p5Chart(arr);
  }, [data.days]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return {
        code: n_text,
        pm10: i.pm10,
      };
    });
    setPm10Chart(arr);
  }, [data.days]);

  useEffect(() => {
    let n = -1;
    let arr;
    arr = data.days[0].hours.map(i => {
      n++;
      let n_text = n;
      if (n < 10) {
        n_text = '0' + n;
      }
      return {
        code: n_text,
        so2: i.so2,
      };
    });
    setSo2Chart(arr);
  }, [data.days]);

  useEffect(() => {
    setCo(((data.days[0].hours[hour].co / 1000) * 0.8729).toFixed(3));
    setNo2(data.days[0].hours[hour].no2);
    setO3(data.days[0].hours[hour].o3);
    setPm2p5(data.days[0].hours[hour].pm2p5);
    setPm10(data.days[0].hours[hour].pm10);
    setSo2(data.days[0].hours[hour].so2);
  }, [co, data, hour]);

  // ------------------------------
  const [coColor, setCoColor] = useState('#00982e');
  const [no2Color, setNo2Color] = useState('#00982e');
  const [o3Color, setO3Color] = useState('#00982e');
  const [pm2p5Color, setPm2p5Color] = useState('#00982e');
  const [pm10Color, setPm10Color] = useState('#00982e');
  const [so2Color, setSo2Color] = useState('#00982e');

  const [pocitionArrow, setPocitionArrow] = useState('calc(0% - 4px)');
  const [pocitionArrowNo2, setPocitionArrowNo2] = useState('calc(0% - 4px)');
  const [pocitionArrowO3, setPocitionArrowO3] = useState('calc(0% - 4px)');
  const [pocitionArrowPm2p5, setPocitionArrowPm2p5] = useState('calc(0% - 4px)');
  const [pocitionArrowPm10, setPocitionArrowPm10] = useState('calc(0% - 4px)');
  const [pocitionArrowSo2, setPocitionArrowSo2] = useState('calc(0% - 4px)');

  // ------------------------------

  const colorChartBarCo = data => {
    if (data > 30.4) return '#ce0000';
    else if (data > 15.5) return '#db6500';
    else if (data > 12.5) return '#d89d00';
    else if (data > 9.5) return '#c8b900';
    else if (data > 4.5) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  const colorChartBarNo2 = data => {
    if (data > 340) return '#ce0000';
    else if (data > 230) return '#db6500';
    else if (data > 120) return '#d89d00';
    else if (data > 90) return '#c8b900';
    else if (data > 40) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  const colorChartBarO3 = data => {
    if (data > 380) return '#ce0000';
    else if (data > 240) return '#db6500';
    else if (data > 130) return '#d89d00';
    else if (data > 100) return '#c8b900';
    else if (data > 50) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  const colorChartBarPm2p5 = data => {
    if (data > 75) return '#ce0000';
    else if (data > 50) return '#db6500';
    else if (data > 25) return '#d89d00';
    else if (data > 20) return '#c8b900';
    else if (data > 10) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  const colorChartBarPm10 = data => {
    if (data > 150) return '#ce0000';
    else if (data > 100) return '#db6500';
    else if (data > 50) return '#d89d00';
    else if (data > 40) return '#c8b900';
    else if (data > 20) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  const colorChartBarSo2 = data => {
    if (data > 750) return '#ce0000';
    else if (data > 500) return '#db6500';
    else if (data > 350) return '#d89d00';
    else if (data > 200) return '#c8b900';
    else if (data > 100) return '#6ec000';
    else if (data >= 0) return '#00982e';
  };

  useEffect(() => {
    if (co > 30.4) {
      setCoColor('#ce0000');
      setPocitionArrow(`calc(${(100 / 50.4) * co}% - 4px)`);
    } else if (co > 15.5) {
      setCoColor('#db6500');
      setPocitionArrow(`calc(${(83.33 / 30.5) * co}% - 4px)`);
    } else if (co > 12.5) {
      setCoColor('#d89d00');
      setPocitionArrow(`calc(${(66.66 / 15.5) * co}% - 4px)`);
    } else if (co > 9.5) {
      setCoColor('#c8b900');
      setPocitionArrow(`calc(${(50 / 12.5) * co}% - 4px)`);
    } else if (co > 4.5) {
      setCoColor('#6ec000');
      setPocitionArrow(`calc(${(33.33 / 9.5) * co}% - 4px)`);
    } else if (co >= 0) {
      setCoColor('#00982e');
      setPocitionArrow(`calc(${(16.66 / 4.5) * co}% - 4px)`);
    }
  }, [co]);

  useEffect(() => {
    if (no2 > 340) {
      setNo2Color('#ce0000');
      setPocitionArrowNo2(`calc(${(100 / 1000) * no2}% - 4px)`);
    } else if (no2 > 230) {
      setNo2Color('#db6500');
      setPocitionArrowNo2(`calc(${(83.33 / 340) * no2}% - 4px)`);
    } else if (no2 > 120) {
      setNo2Color('#d89d00');
      setPocitionArrowNo2(`calc(${(66.66 / 230) * no2}% - 4px)`);
    } else if (no2 > 90) {
      setNo2Color('#c8b900');
      setPocitionArrowNo2(`calc(${(50 / 120) * no2}% - 4px)`);
    } else if (no2 > 40) {
      setNo2Color('#6ec000');
      setPocitionArrowNo2(`calc(${(33.33 / 90) * no2}% - 4px)`);
    } else if (no2 >= 0) {
      setNo2Color('#00982e');
      setPocitionArrowNo2(`calc(${(16.66 / 40) * no2}% - 4px)`);
    }
  }, [no2]);

  useEffect(() => {
    if (o3 > 380) {
      setO3Color('#ce0000');
      setPocitionArrowO3(`calc(${(100 / 800) * o3}% - 4px)`);
    } else if (o3 > 240) {
      setO3Color('#db6500');
      setPocitionArrowO3(`calc(${(83.33 / 380) * o3}% - 4px)`);
    } else if (o3 > 130) {
      setO3Color('#d89d00');
      setPocitionArrowO3(`calc(${(66.66 / 240) * o3}% - 4px)`);
    } else if (o3 > 100) {
      setO3Color('#c8b900');
      setPocitionArrowO3(`calc(${(50 / 130) * o3}% - 4px)`);
    } else if (o3 > 50) {
      setO3Color('#6ec000');
      setPocitionArrowO3(`calc(${(33.33 / 100) * o3}% - 4px)`);
    } else if (o3 >= 0) {
      setO3Color('#00982e');
      setPocitionArrowO3(`calc(${(16.66 / 50) * o3}% - 4px)`);
    }
  }, [o3]);

  useEffect(() => {
    if (pm2p5 > 75) {
      setPm2p5Color('#ce0000');
      setPocitionArrowPm2p5(`calc(${(100 / 800) * pm2p5}% - 4px)`);
    } else if (pm2p5 > 50) {
      setPm2p5Color('#db6500');
      setPocitionArrowPm2p5(`calc(${(83.33 / 75) * pm2p5}% - 4px)`);
    } else if (pm2p5 > 25) {
      setPm2p5Color('#d89d00');
      setPocitionArrowPm2p5(`calc(${(66.66 / 50) * pm2p5}% - 4px)`);
    } else if (pm2p5 > 20) {
      setPm2p5Color('#c8b900');
      setPocitionArrowPm2p5(`calc(${(50 / 25) * pm2p5}% - 4px)`);
    } else if (pm2p5 > 10) {
      setPm2p5Color('#6ec000');
      setPocitionArrowPm2p5(`calc(${(33.33 / 20) * pm2p5}% - 4px)`);
    } else if (pm2p5 >= 0) {
      setPm2p5Color('#00982e');
      setPocitionArrowPm2p5(`calc(${(16.66 / 10) * pm2p5}% - 4px)`);
    }
  }, [pm2p5]);

  useEffect(() => {
    if (pm10 > 150) {
      setPm10Color('#ce0000');
      setPocitionArrowPm10(`calc(${(100 / 1200) * pm10}% - 4px)`);
    } else if (pm10 > 100) {
      setPm10Color('#db6500');
      setPocitionArrowPm10(`calc(${(83.33 / 150) * pm10}% - 4px)`);
    } else if (pm10 > 50) {
      setPm10Color('#d89d00');
      setPocitionArrowPm10(`calc(${(66.66 / 100) * pm10}% - 4px)`);
    } else if (pm10 > 40) {
      setPm10Color('#c8b900');
      setPocitionArrowPm10(`calc(${(50 / 50) * pm10}% - 4px)`);
    } else if (pm10 > 20) {
      setPm10Color('#6ec000');
      setPocitionArrowPm10(`calc(${(33.33 / 40) * pm10}% - 4px)`);
    } else if (pm10 >= 0) {
      setPm10Color('#00982e');
      setPocitionArrowPm10(`calc(${(16.66 / 20) * pm10}% - 4px)`);
    }
  }, [pm10]);

  useEffect(() => {
    if (so2 > 750) {
      setSo2Color('#ce0000');
      setPocitionArrowSo2(`calc(${(100 / 1250) * so2}% - 4px)`);
    } else if (so2 > 500) {
      setSo2Color('#db6500');
      setPocitionArrowSo2(`calc(${(83.33 / 750) * so2}% - 4px)`);
    } else if (so2 > 350) {
      setSo2Color('#d89d00');
      setPocitionArrowSo2(`calc(${(66.66 / 500) * so2}% - 4px)`);
    } else if (so2 > 200) {
      setSo2Color('#c8b900');
      setPocitionArrowSo2(`calc(${(50 / 350) * so2}% - 4px)`);
    } else if (so2 > 100) {
      setSo2Color('#6ec000');
      setPocitionArrowSo2(`calc(${(33.33 / 200) * so2}% - 4px)`);
    } else if (so2 >= 0) {
      setSo2Color('#00982e');
      setPocitionArrowSo2(`calc(${(16.66 / 100) * so2}% - 4px)`);
    }
  }, [so2]);

  // ------ Modal Open  -------------
  const [open_1, setOpen_1] = useState(false);
  const handleOpen_1 = () => setOpen_1(true);
  const handleClose_1 = () => setOpen_1(false);

  const [open_2, setOpen_2] = useState(false);
  const handleOpen_2 = () => setOpen_2(true);
  const handleClose_2 = () => setOpen_2(false);

  const [open_3, setOpen_3] = useState(false);
  const handleOpen_3 = () => setOpen_3(true);
  const handleClose_3 = () => setOpen_3(false);

  const [open_4, setOpen_4] = useState(false);
  const handleOpen_4 = () => setOpen_4(true);
  const handleClose_4 = () => setOpen_4(false);

  const [open_5, setOpen_5] = useState(false);
  const handleOpen_5 = () => setOpen_5(true);
  const handleClose_5 = () => setOpen_5(false);

  const [open_6, setOpen_6] = useState(false);
  const handleOpen_6 = () => setOpen_6(true);
  const handleClose_6 = () => setOpen_6(false);

  return (
    <div className="weather__air-quality">
      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">CO</p>
          <p className="name__text">окись углерода</p>
        </div>
        <div className="card__separator" style={{ background: coColor }}></div>
        <p className="card__value" style={{ color: coColor }}>
          {co}
        </p>
        <button className="card__info" onClick={handleOpen_1}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">NO₂</p>
          <p className="name__text">
            деоксид <br /> азота
          </p>
        </div>
        <div className="card__separator" style={{ background: no2Color }}></div>
        <p className="card__value" style={{ color: no2Color }}>
          {no2}
        </p>
        <button className="card__info" onClick={handleOpen_2}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">O₃</p>
          <p className="name__text">Озон</p>
        </div>
        <div className="card__separator" style={{ background: o3Color }}></div>
        <p className="card__value" style={{ color: o3Color }}>
          {o3}
        </p>
        <button className="card__info" onClick={handleOpen_3}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">PM₂ₚ₅</p>
          <p className="name__text">Твердые частицы</p>
        </div>
        <div className="card__separator" style={{ background: pm2p5Color }}></div>
        <p className="card__value" style={{ color: pm2p5Color }}>
          {pm2p5}
        </p>
        <button className="card__info" onClick={handleOpen_4}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">PM₁₀</p>
          <p className="name__text">Твердые частицы</p>
        </div>
        <div className="card__separator" style={{ background: pm10Color }}></div>
        <p className="card__value" style={{ color: pm10Color }}>
          {pm10}
        </p>
        <button className="card__info" onClick={handleOpen_5}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className="air-quality__card">
        <div className="card__name">
          <p className="name__title">SO₂</p>
          <p className="name__text">Диоксид серы</p>
        </div>
        <div className="card__separator" style={{ background: so2Color }}></div>
        <p className="card__value" style={{ color: so2Color }}>
          {so2}
        </p>
        <button className="card__info" onClick={handleOpen_6}>
          <InfoIcon className="info__icon" />
        </button>
      </div>

      <div className={`air-quality__modal-1 ${open_1 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">CO</p>
              <p className="description__subtitle">Окись углерода</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {co} <span>ppm</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarCo(coChart[0]?.co) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarCo(coChart[1]?.co) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarCo(coChart[2]?.co) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarCo(coChart[3]?.co) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarCo(coChart[4]?.co) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarCo(coChart[5]?.co) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarCo(coChart[6]?.co) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarCo(coChart[7]?.co) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarCo(coChart[8]?.co) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarCo(coChart[9]?.co) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarCo(coChart[10]?.co) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarCo(coChart[11]?.co) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarCo(coChart[12]?.co) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarCo(coChart[13]?.co) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarCo(coChart[14]?.co) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarCo(coChart[15]?.co) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarCo(coChart[16]?.co) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarCo(coChart[17]?.co) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarCo(coChart[18]?.co) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarCo(coChart[19]?.co) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarCo(coChart[20]?.co) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarCo(coChart[21]?.co) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarCo(coChart[22]?.co) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarCo(coChart[23]?.co) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)', //stroke: '#fce3af',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={coChart}
                  series={[{ dataKey: 'co', label: 'co' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Это бесцветный газ, выделяемый в атмосферу в результате автомобильных выбросов, пожаров, промышленных
              процессов, работы газовых плит, кухонных дымоходов, генераторов, копчения дров и т.д.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              Воздействие угарного газа вызывает отравление угарным газом (нарушение связи кислорода с гемоглобином) у
              людей, боли в груди, заболевания сердца, снижение умственных способностей, проблемы со зрением и
              способствует образованию смога.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              Он используется Агентством по охране окружающей среды США в качестве критерия AQI. Безопасный уровень
              воздействия составляет — 0-9,4 ppm за 8 часов.
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrow }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-4.4</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>4.5-9.4</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>9.5-12.4</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>12.5-15.4</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>15.5-30.4</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>30.4-50.4</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_1}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div className={`air-quality__modal-1 ${open_2 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">NO₂</p>
              <p className="description__subtitle">Диоксид азота</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {no2} <span>мкг/м3</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarNo2(no2Chart[0]?.no2) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarNo2(no2Chart[1]?.no2) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarNo2(no2Chart[2]?.no2) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarNo2(no2Chart[3]?.no2) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarNo2(no2Chart[4]?.no2) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarNo2(no2Chart[5]?.no2) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarNo2(no2Chart[6]?.no2) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarNo2(no2Chart[7]?.no2) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarNo2(no2Chart[8]?.no2) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarNo2(no2Chart[9]?.no2) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarNo2(no2Chart[10]?.no2) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarNo2(no2Chart[11]?.no2) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarNo2(no2Chart[12]?.no2) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarNo2(no2Chart[13]?.no2) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarNo2(no2Chart[14]?.no2) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarNo2(no2Chart[15]?.no2) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarNo2(no2Chart[16]?.no2) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarNo2(no2Chart[17]?.no2) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarNo2(no2Chart[18]?.no2) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarNo2(no2Chart[19]?.no2) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarNo2(no2Chart[20]?.no2) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarNo2(no2Chart[21]?.no2) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarNo2(no2Chart[22]?.no2) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarNo2(no2Chart[23]?.no2) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={no2Chart}
                  series={[{ dataKey: 'no2', label: 'NO₂' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Он попадает в окружающую среду в результате автомобильных выбросов, производства электроэнергии, сжигания
              топлива, сжигания ископаемого топлива и различных промышленных процессов.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              Отравление диоксидом азота так же опасно, как и отравление угарным газом. При вдыхании он может вызвать
              серьезные повреждения сердца, поглощается легкими, вызывает воспаление и раздражение дыхательных путей.
              Образование смога и повреждение листвы — вот некоторые экологические последствия воздействия диоксида
              азота.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              Агентство по охране окружающей среды используют диоксид азота в качестве параметра для расчета индекса
              качества воздуха. Безопасное воздействие составляет 0-80 мкг/м 3 (24 часа).
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrowNo2 }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-40</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>40-90</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>90-120</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>120-230</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>230-340</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>340-1000</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_2}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div className={`air-quality__modal-1 ${open_3 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">O₃</p>
              <p className="description__subtitle">Озон</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {o3} <span>мкг/м3</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarO3(o3Chart[0]?.o3) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarO3(o3Chart[1]?.o3) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarO3(o3Chart[2]?.o3) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarO3(o3Chart[3]?.o3) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarO3(o3Chart[4]?.o3) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarO3(o3Chart[5]?.o3) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarO3(o3Chart[6]?.o3) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarO3(o3Chart[7]?.o3) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarO3(o3Chart[8]?.o3) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarO3(o3Chart[9]?.o3) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarO3(o3Chart[10]?.o3) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarO3(o3Chart[11]?.o3) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarO3(o3Chart[12]?.o3) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarO3(o3Chart[13]?.o3) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarO3(o3Chart[14]?.o3) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarO3(o3Chart[15]?.o3) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarO3(o3Chart[16]?.o3) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarO3(o3Chart[17]?.o3) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarO3(o3Chart[18]?.o3) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarO3(o3Chart[19]?.o3) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarO3(o3Chart[20]?.o3) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarO3(o3Chart[21]?.o3) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarO3(o3Chart[22]?.o3) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarO3(o3Chart[23]?.o3) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={o3Chart}
                  series={[{ dataKey: 'o3', label: 'O₃' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Он выделяется промышленностью, автомобильными выбросами, парами бензина, растворителями, химикатами и
              электронными устройствами. Оксиды азота (NOx) и общие летучие органические соединения (tVOCs) также
              способствуют образованию приземного озона.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              Озон почвы влияет на процесс дыхания растений и повышает восприимчивость к стрессовым факторам окружающей
              среды. Когда озон вдыхается людьми, наблюдается снижение функции легких, воспаление дыхательных путей и
              раздражение глаз, носа и горла.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              Озон является одним из критериев AQI, используемых как индийским, так и американским EPA. Согласно
              индийскому правительству, безопасное воздействие составляет 0-100 мкг/м3 ( 8 часов), а согласно US-EPA —
              0-0,054 ppm (8 часов).
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrowO3 }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-50</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>50-100</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>100-130</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>130-240</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>240-380</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>380-800</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_3}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div className={`air-quality__modal-1 ${open_4 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">PM₂ₚ₅</p>
              <p className="description__subtitle">Твердые частицы</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {pm2p5} <span>мкг/м3</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarPm2p5(pm2p5Chart[0]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarPm2p5(pm2p5Chart[1]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarPm2p5(pm2p5Chart[2]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarPm2p5(pm2p5Chart[3]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarPm2p5(pm2p5Chart[4]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarPm2p5(pm2p5Chart[5]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarPm2p5(pm2p5Chart[6]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarPm2p5(pm2p5Chart[7]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarPm2p5(pm2p5Chart[8]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarPm2p5(pm2p5Chart[9]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarPm2p5(pm2p5Chart[10]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarPm2p5(pm2p5Chart[11]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarPm2p5(pm2p5Chart[12]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarPm2p5(pm2p5Chart[13]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarPm2p5(pm2p5Chart[14]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarPm2p5(pm2p5Chart[15]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarPm2p5(pm2p5Chart[16]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarPm2p5(pm2p5Chart[17]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarPm2p5(pm2p5Chart[18]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarPm2p5(pm2p5Chart[19]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarPm2p5(pm2p5Chart[20]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarPm2p5(pm2p5Chart[21]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarPm2p5(pm2p5Chart[22]?.pm2p5) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarPm2p5(pm2p5Chart[23]?.pm2p5) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={pm2p5Chart}
                  series={[{ dataKey: 'pm2p5', label: 'PM₂ₚ₅' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Твердые частицы выбрасываются в атмосферу в результате строительства, курения, уборки, ремонта, сноса
              зданий, строительства, стихийных бедствий, таких как землетрясения, извержения вулканов, а также выбросов
              промышленных предприятий, таких как печи для обжига кирпича, целлюлозно-бумажная промышленность и т. д.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              При вдыхании эти частицы могут проникать глубже в дыхательную систему и вызывать респираторные
              заболевания, такие как астма, кашель, чихание, раздражение дыхательных путей, глаз, носа, горла и т. д.
              Исследования также показали связь между воздействием PM и диабетом.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              PM10 и PM2.5 используют в качестве одного из критериев для расчета индекса качества воздуха. Безопасные
              уровни воздействия для PM 2.5 (24 часа) - 0-60 мкг/м 3..
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrowPm2p5 }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-10</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>10-20</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>20-25</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>25-50</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>50-75</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>75-800</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_4}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div className={`air-quality__modal-1 ${open_5 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">PM₁₀</p>
              <p className="description__subtitle">Твердые частицы</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {pm10} <span>мкг/м3</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarPm10(pm10Chart[0]?.pm10) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarPm10(pm10Chart[1]?.pm10) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarPm10(pm10Chart[2]?.pm10) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarPm10(pm10Chart[3]?.pm10) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarPm10(pm10Chart[4]?.pm10) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarPm10(pm10Chart[5]?.pm10) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarPm10(pm10Chart[6]?.pm10) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarPm10(pm10Chart[7]?.pm10) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarPm10(pm10Chart[8]?.pm10) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarPm10(pm10Chart[9]?.pm10) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarPm10(pm10Chart[10]?.pm10) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarPm10(pm10Chart[11]?.pm10) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarPm10(pm10Chart[12]?.pm10) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarPm10(pm10Chart[13]?.pm10) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarPm10(pm10Chart[14]?.pm10) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarPm10(pm10Chart[15]?.pm10) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarPm10(pm10Chart[16]?.pm10) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarPm10(pm10Chart[17]?.pm10) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarPm10(pm10Chart[18]?.pm10) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarPm10(pm10Chart[19]?.pm10) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarPm10(pm10Chart[20]?.pm10) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarPm10(pm10Chart[21]?.pm10) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarPm10(pm10Chart[22]?.pm10) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarPm10(pm10Chart[23]?.pm10) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={pm10Chart}
                  series={[{ dataKey: 'pm10', label: 'PM₁₀' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Твердые частицы выбрасываются в атмосферу в результате строительства, курения, уборки, ремонта, сноса
              зданий, строительства, стихийных бедствий, таких как землетрясения, извержения вулканов, а также выбросов
              промышленных предприятий, таких как печи для обжига кирпича, целлюлозно-бумажная промышленность и т. д.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              При вдыхании эти частицы могут проникать глубже в дыхательную систему и вызывать респираторные
              заболевания, такие как астма, кашель, чихание, раздражение дыхательных путей, глаз, носа, горла и т. д.
              Исследования также показали связь между воздействием PM и диабетом.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              PM10 и PM2.5 используют в качестве одного из критериев для расчета индекса качества воздуха. Безопасные
              уровни воздействия для PM10 (24 часа) составляют 0-100 мкг/м 3
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrowPm10 }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-20</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>20-40</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>40-50</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>50-100</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>100-150</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>150-1200</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_5}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>

      <div className={`air-quality__modal-1 ${open_6 && 'activ'}`}>
        <div className="description">
          <div className="description__top-block">
            <div>
              <p className="description__title">SO₂</p>
              <p className="description__subtitle">Диоксид серы</p>
              <div className="description__separator"></div>
              <p className="description__value">
                {so2} <span>мкг/м3</span>
              </p>
            </div>
            <div className="top-block__chart">
              <Box sx={{ width: '250px' }}>
                <BarChart
                  sx={theme => ({
                    [`.${barElementClasses.root}`]: {
                      fill: theme.palette.background.paper,
                      strokeWidth: 3,
                    },
                    [`.MuiBarElement-root`]: {
                      fill: 'rgb(225 150 70 / 50%)',
                    },
                    [`.MuiBarElement-root:nth-child(1)`]: { fill: colorChartBarSo2(so2Chart[0]?.so2) },
                    [`.MuiBarElement-root:nth-child(2)`]: { fill: colorChartBarSo2(so2Chart[1]?.so2) },
                    [`.MuiBarElement-root:nth-child(3)`]: { fill: colorChartBarSo2(so2Chart[2]?.so2) },
                    [`.MuiBarElement-root:nth-child(4)`]: { fill: colorChartBarSo2(so2Chart[3]?.so2) },
                    [`.MuiBarElement-root:nth-child(5)`]: { fill: colorChartBarSo2(so2Chart[4]?.so2) },
                    [`.MuiBarElement-root:nth-child(6)`]: { fill: colorChartBarSo2(so2Chart[5]?.so2) },
                    [`.MuiBarElement-root:nth-child(7)`]: { fill: colorChartBarSo2(so2Chart[6]?.so2) },
                    [`.MuiBarElement-root:nth-child(8)`]: { fill: colorChartBarSo2(so2Chart[7]?.so2) },
                    [`.MuiBarElement-root:nth-child(9)`]: { fill: colorChartBarSo2(so2Chart[8]?.so2) },
                    [`.MuiBarElement-root:nth-child(10)`]: { fill: colorChartBarSo2(so2Chart[9]?.so2) },
                    [`.MuiBarElement-root:nth-child(11)`]: { fill: colorChartBarSo2(so2Chart[10]?.so2) },
                    [`.MuiBarElement-root:nth-child(12)`]: { fill: colorChartBarSo2(so2Chart[11]?.so2) },
                    [`.MuiBarElement-root:nth-child(13)`]: { fill: colorChartBarSo2(so2Chart[12]?.so2) },
                    [`.MuiBarElement-root:nth-child(14)`]: { fill: colorChartBarSo2(so2Chart[13]?.so2) },
                    [`.MuiBarElement-root:nth-child(15)`]: { fill: colorChartBarSo2(so2Chart[14]?.so2) },
                    [`.MuiBarElement-root:nth-child(16)`]: { fill: colorChartBarSo2(so2Chart[15]?.so2) },
                    [`.MuiBarElement-root:nth-child(17)`]: { fill: colorChartBarSo2(so2Chart[16]?.so2) },
                    [`.MuiBarElement-root:nth-child(18)`]: { fill: colorChartBarSo2(so2Chart[17]?.so2) },
                    [`.MuiBarElement-root:nth-child(19)`]: { fill: colorChartBarSo2(so2Chart[18]?.so2) },
                    [`.MuiBarElement-root:nth-child(20)`]: { fill: colorChartBarSo2(so2Chart[19]?.so2) },
                    [`.MuiBarElement-root:nth-child(21)`]: { fill: colorChartBarSo2(so2Chart[20]?.so2) },
                    [`.MuiBarElement-root:nth-child(22)`]: { fill: colorChartBarSo2(so2Chart[21]?.so2) },
                    [`.MuiBarElement-root:nth-child(23)`]: { fill: colorChartBarSo2(so2Chart[22]?.so2) },
                    [`.MuiBarElement-root:nth-child(24)`]: { fill: colorChartBarSo2(so2Chart[23]?.so2) },
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: 'var(--color-03)',
                        strokeWidth: 1,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: 'var(--color-02)',
                      },
                    },
                    backgroundPosition: '20px 20px, 20px 20px',
                    ...theme.applyStyles('dark', {
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
                    }),
                  })}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'code',
                    },
                  ]}
                  margin={{ top: 5, right: 5, bottom: 20, left: 10 }}
                  height={100}
                  dataset={so2Chart}
                  series={[{ dataKey: 'so2', label: 'SO₂' }]}
                  slotProps={{ legend: { hidden: true } }}
                  leftAxis={null}
                  yAxis={[
                    {
                      valueFormatter: value => value,
                    },
                  ]}
                />
              </Box>
            </div>
          </div>

          <div className="description__text-block">
            <h5 className="text-block__title">Источники:</h5>
            <p className="text-block__text">
              Выбросы от автомобилей, промышленности, сжигания ископаемого топлива, выработки электроэнергии и т. д.
              являются причинами поступления диоксида серы в атмосферу.
            </p>
            <h5 className="text-block__title">Связанные эффекты:</h5>
            <p className="text-block__text">
              Диоксид серы является основной причиной образования дымки, кислотных дождей, повреждения листвы,
              памятников и зданий, реагирует и образует твердые частицы. У людей он вызывает дискомфорт при дыхании,
              астму, раздражение глаз, носа и горла, воспаление дыхательных путей и болезни сердца.
            </p>
            <h5 className="text-block__title">Безопасные пределы воздействия:</h5>
            <p className="text-block__text">
              Диоксид серы используется агентством по охране окружающей среды в качестве параметра для расчета индекса
              качества воздуха. Безопасный уровень воздействия составляет 0-80 мкг/м3 ( 24 часа).
            </p>
          </div>
        </div>
        <div className="scale">
          <div className="scale__pointer">
            <div className="pointer__arrow" style={{ top: pocitionArrowSo2 }}></div>
          </div>
          <div className="scale__gradient"></div>
          <div className="scale__name-group">
            <div className="name-group__item">
              <p className="item__number">①</p>
              <div>
                <p>очень хороший</p>
                <p>0-100</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">②</p>
              <div>
                <p>хороший</p>
                <p>100-200</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">③</p>
              <div>
                <p>умеренный</p>
                <p>200-350</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">④</p>
              <div>
                <p>плохой</p>
                <p>350-500</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑤</p>
              <div>
                <p>Очень плохой</p>
                <p>500-750</p>
              </div>
            </div>

            <div className="name-group__item">
              <p className="item__number">⑥</p>
              <div>
                <p>Крайне плохой</p>
                <p>750-1250</p>
              </div>
            </div>
          </div>
        </div>
        <IconButton
          className="btn-close"
          aria-label="delete"
          size="large"
          onClick={handleClose_6}
          sx={{ marginBottom: 'auto' }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
};
