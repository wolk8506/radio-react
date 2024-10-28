import * as React from 'react';
import { useEffect, useState } from 'react';

import eventsJSON from './data/events.json';
import anecdoteJSON from './data/anecdote.json';
import 'dayjs/locale/ru';

export const Event = () => {
  let moment = require('moment');
  let currentDayEvent = moment().format('MM-DD');
  const events = eventsJSON;
  const [event, setEvent] = useState(['Сегодня событий нет']);
  const [fact, setFact] = useState([]);
  const [joke, setJoke] = useState([]);

  useEffect(() => {
    if (anecdoteJSON[0].joke[0]) {
      setJoke(anecdoteJSON[moment().dayOfYear()].joke);
    } else {
      setJoke(false);
    }
  }, [currentDayEvent, events, moment]);

  useEffect(() => {
    if (events[currentDayEvent].fact) {
      setFact(events[currentDayEvent].fact);
    } else {
      setFact(false);
    }
  }, [currentDayEvent, events]);

  useEffect(() => {
    if (events[currentDayEvent].event) {
      setEvent(events[currentDayEvent].event);
    } else {
      setEvent(['Сегодня событий нет']);
    }
  }, [currentDayEvent, events]);

  return (
    <section className="graph">
      <h1>Шутка / Факт / События</h1>
      <div>
        <ul className="days">
          {joke &&
            joke.map(i => (
              <li className="event-item" key={i}>
                Шутка дня:
                <br /> <span>{i}</span>
              </li>
            ))}
          {fact &&
            fact.map(i => (
              <li className="event-item" key={i}>
                Факт дня:
                <br /> <span>{i}</span>
              </li>
            ))}
          <li className="event-item" key="sdfasdf">
            События дня:
            <ul>
              {event.map(i => (
                <li className="event-item event-item--event" key={i}>
                  {i}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
};
