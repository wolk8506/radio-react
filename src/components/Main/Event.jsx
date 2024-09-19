import { useEffect, useState } from 'react';
import * as React from 'react';

import eventsJSON from './data/events.json';
import 'dayjs/locale/ru';

export const Event = () => {
  let moment = require('moment');
  let currentDayEvent = moment().format('MM-DD');
  const events = eventsJSON;
  const [event, setEvent] = useState(['Сегодня событий нет']);

  useEffect(() => {
    if (events[currentDayEvent]) {
      setEvent(events[currentDayEvent]);
    } else {
      setEvent(['Сегодня событий нет']);
    }
  }, [currentDayEvent, events]);

  return (
    <section className="graph">
      <h1>События</h1>
      <div>
        <ul className="days">
          {event.map(i => (
            <li className="event-item" key={i}>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
