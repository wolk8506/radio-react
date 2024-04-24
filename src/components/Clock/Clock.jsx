import { useEffect, useState } from 'react';
import * as React from 'react';

// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SnackbarContent from '@mui/material/SnackbarContent';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import s from './Clock.module.css';
import eventsJSON from './events.json';
import 'dayjs/locale/ru';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

const eventRegular3 = [
  [
    ['🎄'], //?  01.january
    [], //?  02.january
    [], //?  03.january
    [], //?  04.january
    [], //?  05.january
    [], //?  06.january
    ['👼'], //?  07.january
    [], //?  08.january
    [], //?  09.january
    [], //?  10.january
    [], //?  11.january
    [], //?  12.january
    [], //?  13.january
    [], //?  14.january
    [], //?  15.january
    [], //?  16.january
    [], //?  17.january
    [], //?  18.january
    [], //?  19.january
    [], //?  20.january
    [], //?  21.january
    [], //?  22.january
    [], //?  23.january
    [], //?  24.january
    [], //?  25.january
    [], //?  26.january
    [], //?  27.january
    [], //?  28.january
    [], //?  29.january
    [], //?  30.january
    [], //?  31.january
  ],
  [
    [], //?  01.february
    [], //?  02.february
    [], //?  03.february
    ['🎂'], //?  04.february
    [], //?  05.february
    [], //?  06.february
    [], //?  07.february
    [], //?  08.february
    [], //?  09.february
    [], //?  10.february
    [], //?  11.february
    [], //?  12.february
    ['📻'], //?  13.february
    ['💘'], //?  14.february
    [], //?  15.february
    [], //?  16.february
    [], //?  17.february
    [], //?  18.february
    [], //?  19.february
    [], //?  20.february
    [], //?  21.february
    [], //?  22.february
    [], //?  23.february
    [], //?  24.february
    [], //?  25.february
    [], //?  26.february
    [], //?  27.february
    [], //?  28.february
    [], //?  29.february
  ],
  [
    [], //?  01.march
    [], //?  02.march
    [], //?  03.march
    [], //?  04.march
    [], //?  05.march
    [], //?  06.march
    [], //?  07.march
    ['🌸'], //?  08.march
    [], //?  08.march
    [], //?  09.march
    [], //?  10.march
    [], //?  11.march
    [], //?  12.march
    [], //?  13.march
    [], //?  14.march
    [], //?  15.march
    [], //?  16.march
    [], //?  17.march
    [], //?  18.march
    [], //?  19.march
    [], //?  20.march
    [], //?  21.march
    [], //?  22.march
    [], //?  23.march
    [], //?  24.march
    [], //?  25.march
    [], //?  26.march
    [], //?  27.march
    [], //?  28.march
    [], //?  29.march
    [], //?  30.march
    [], //?  31.march
  ],
  [
    ['🤪'], //?  01.April
    [], //?  02.April
    [], //?  03.April
    [], //?  04.April
    [], //?  05.April
    [], //?  06.April
    [], //?  07.April
    [], //?  08.April
    [], //?  09.April
    [], //?  10.April
    [], //?  11.April
    ['🚀'], //? 12.April
    [], //?  13.April
    [], //?  14.April
    [], //?  15.April
    [], //?  16.April
    [], //?  17.April
    ['📻'], //?  18.April
    ['🚴'], //?  19.April
    [], //?  20.April
    [], //?  21.April
    [], //?  22.April
    [], //?  23.April
    [], //?  24.April
    [], //?  25.April
    [], //?  26.April
    [], //?  27.April
    [], //?  28.April
    [], //?  29.April
    [], //?  30.April
    [], //?  31.April
  ],
  [
    ['🛠'], //? 01.May
    [], //? 02.May
    [], //? 03.May
    [], //? 04.May
    ['🐇'], //? 05.May
    [], //? 06.May
    [], //? 07.May
    [], //? 08.May
    ['🎖️'], //? 09.May
    [], //? 10.May
    [], //? 11.May
    ['👩‍👧‍👦'], //? 12.May
    [], //? 13.May
    [], //? 14.May
    [], //? 15.May
    [], //? 16.May
    [], //? 17.May
    [], //? 18.May
    [], //? 19.May
    [], //? 20.May
    [], //? 21.May
    [], //? 22.May
    [], //? 23.May
    [], //? 24.May
    [], //? 25.May
    [], //? 26.May
    [], //? 27.May
    [], //? 28.May
    [], //? 29.May
    ['🎂'], //? 30.May
    [], //? 31.May
  ],
  [
    ['👶'], //?  01.June
    ['🎂'], //?  02.June
    [], //?  03.June
    [], //?  04.June
    [], //?  05.June
    [], //?  06.June
    [], //?  07.June
    [], //?  08.June
    [], //?  09.June
    [], //?  10.June
    [], //?  11.June
    [], //?  12.June
    [], //?  13.June
    [], //?  14.June
    [], //?  15.June
    [], //?  16.June
    [], //?  17.June
    [], //?  18.June
    [], //?  19.June
    [], //?  20.June
    [], //?  21.June
    [], //?  22.June
    [], //?  23.June
    [], //?  24.June
    [], //?  25.June
    [], //?  26.June
    ['🐠'], //?  27.June
    [], //?  28.June
    [], //?  29.June
    [], //?  30.June
    [], //?  31.June
  ],
  [
    [], //?  01.July
    ['🛸'], //?  02.July
    [], //?  03.July
    [], //?  04.July
    [], //?  05.July
    [], //?  06.July
    [], //?  07.July
    [], //?  08.July
    [], //?  09.July
    [], //?  10.July
    [], //?  11.July
    [], //?  12.July
    [], //?  13.July
    [], //?  14.July
    [], //?  15.July
    [], //?  16.July
    [], //?  17.July
    [], //?  18.July
    [], //?  19.July
    [], //?  20.July
    [], //?  21.July
    [], //?  22.July
    [], //?  23.July
    [], //?  24.July
    [], //?  25.July
    [], //?  26.July
    [], //?  27.July
    [], //?  28.July
    [], //?  29.July
    [], //?  30.July
    [], //?  31.July
  ],
  [
    [], //?  01.August
    ['🍻'], //?  02.August
    [], //?  03.August
    [], //?  04.August
    [], //?  05.August
    [], //?  06.August
    [], //?  07.August
    [], //?  08.August
    [], //?  09.August
    [], //?  10.August
    [], //?  11.August
    [], //?  12.August
    [], //?  13.August
    [], //?  14.August
    [], //?  15.August
    [], //?  16.August
    [], //?  17.August
    [], //?  18.August
    [], //?  19.August
    [], //?  20.August
    [], //?  21.August
    [], //?  22.August
    ['🏢'], //?  23.August
    [], //?  24.August
    [], //?  25.August
    [], //?  26.August
    [], //?  27.August
    [], //?  28.August
    [], //?  29.August
    [], //?  30.August
    [], //?  31.August
  ],
  [
    ['🏫'], //?  01.september
    [], //?  02.september
    [], //?  03.september
    [], //?  04.september
    [], //?  05.september
    [], //?  06.september
    [], //?  07.september
    [], //?  08.september
    [], //?  09.september
    [], //?  10.september
    [], //?  11.september
    [], //?  12.september
    [], //?  13.september
    [], //?  14.september
    [], //?  15.september
    [], //?  16.september
    [], //?  17.september
    [], //?  18.september
    [], //?  19.september
    [], //?  20.september
    [], //?  21.september
    [], //?  22.september
    [], //?  23.september
    [], //?  24.september
    [], //?  25.september
    [], //?  26.september
    [], //?  27.september
    [], //?  28.september
    [], //?  29.september
    [], //?  30.september
    [], //?  31.september
  ],
  [
    [], //?  01.october
    [], //?  02.october
    [], //?  03.october
    [], //?  04.october
    [], //?  05.october
    [], //?  06.october
    [], //?  07.october
    [], //?  08.october
    [], //?  09.october
    [], //?  10.october
    [], //?  11.october
    [], //?  12.october
    [], //?  13.october
    [], //?  14.october
    [], //?  15.october
    [], //?  16.october
    [], //?  17.october
    [], //?  18.october
    [], //?  19.october
    [], //?  20.october
    [], //?  21.october
    [], //?  22.october
    [], //?  23.october
    [], //?  24.october
    [], //?  25.october
    [], //?  26.october
    [], //?  27.october
    [], //?  28.october
    [], //?  29.october
    [], //?  30.october
    ['🎃'], //?  31.october
  ],
  [
    [], //?  01.november
    [], //?  02.november
    [], //?  03.november
    [], //?  04.november
    [], //?  05.november
    [], //?  06.november
    [], //?  07.november
    [], //?  08.november
    [], //?  09.november
    [], //?  10.november
    [], //?  11.november
    [], //?  12.november
    [], //?  13.november
    [], //?  14.november
    [], //?  15.november
    [], //?  16.november
    [], //?  17.november
    [], //?  18.november
    [], //?  19.november
    [], //?  20.november
    [], //?  21.november
    [], //?  22.november
    [], //?  23.november
    [], //?  24.november
    [], //?  25.november
    [], //?  26.november
    [], //?  27.november
    [], //?  28.november
    [], //?  29.november
    [], //?  30.november
    [], //?  31.november
  ],
  [
    [], //?  01.december
    [], //?  02.december
    [], //?  03.december
    [], //?  04.december
    [], //?  05.december
    [], //?  06.december
    [], //?  07.december
    [], //?  08.december
    [], //?  09.december
    [], //?  10.december
    [], //?  11.december
    [], //?  12.december
    [], //?  13.december
    [], //?  14.december
    [], //?  15.december
    [], //?  16.december
    [], //?  17.december
    [], //?  18.december
    [], //?  19.december
    [], //?  20.december
    [], //?  21.december
    [], //?  22.december
    [], //?  23.december
    [], //?  24.december
    ['👼'], //?  25.december
    [], //?  26.december
    [], //?  27.december
    [], //?  28.december
    [], //?  29.december
    [], //?  30.december
    [], //?  31.december
  ],
];
if (eventRegular3[3]) {
}
function ServerDay(props) {
  const {
    highlightedDays = [],
    day2,
    day,
    outsideCurrentMonth,
    ...other
  } = props;
  const ii = day.$D - 1;
  const mm = day.$M;
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;
  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? eventRegular3[mm][ii] : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export const Clock = () => {
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!    C A L E N D A R   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const eventRegular2 = [
    [1, 7], //январь
    [4, 13, 14, 23], //февраль
    [8, 9, 10, 11], //март
    [1, 12, 18, 19], //апрель
    [1, 5, 9, 12, 30], //май
    [1, 2, 27], //июнь
    [2], //июль
    [2, 23], //август
    [1], //сентябрь
    [14, 31], //октябрь
    [], //ноябрь
    [25], //декабрь
  ];

  const events = eventsJSON;
  let moment = require('moment');
  let currentDayEvent = moment().format('MM-DD');
  let currentMonthEvent = moment().format('M');
  const [highlightedDays, setHighlightedDays] = React.useState(
    eventRegular2[currentMonthEvent - 1]
  );
  const handleMonthChange = data => {
    setHighlightedDays(eventRegular2[data.$M]);
  };
  const [event, setEvent] = useState(['Сегодня событий нет']);

  useEffect(() => {
    if (events[currentDayEvent]) {
      setEvent(events[currentDayEvent]);
    } else {
      setEvent(['Сегодня событий нет']);
    }
  }, [currentDayEvent, events]);

  // ?????????????????  CLOCK   ????????????????????

  const deg = 6;
  const [hh, setHh] = useState(new Date());
  const [mm, setMm] = useState(0);
  const [ss, setSs] = useState(0);

  let hour = { transform: `rotateZ(${hh}deg)` };
  let min = { transform: `rotateZ(${mm}deg)` };
  let sec = { transform: `rotateZ(${ss}deg)` };

  const setClock = () => {
    let day = new Date();

    setHh(day.getHours() * 30);
    setMm(day.getMinutes() * deg);
    setSs(day.getSeconds() * deg);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.calendarBlock}>
      <div></div>
      <div>
        <div className={s.body}>
          <div className={s.clock}>
            <div className={s.hour} style={hour}></div>
            <div className={s.min} style={min}></div>
            <div className={s.sec} style={sec}></div>
          </div>
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <DateCalendar
          onMonthChange={handleMonthChange}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            },
          }}
        />
      </LocalizationProvider>

      <Stack spacing={2} sx={{ minWidth: 500 }}>
        {event.map(i => (
          <SnackbarContent key={i} message={i} />
        ))}
      </Stack>
    </div>
  );
};
