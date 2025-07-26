import * as React from 'react';
import { useSelector } from 'react-redux';

import { weatherSelectors } from 'store';

import { TilesTemperatura } from './TilesTemperatura';
import { TilesCloud } from './TilesCloud';
import { TilesWind } from './TilesWind';
import { TilesPressure } from './TilesPressure';
import { TilesFeelTemp } from './TilesFeelTemp';
import { TilesHumidity } from './TilesHumidity';
import { TilesMoon } from './TilesMoon';
import { TilesSun } from './TilesSun';
import { TilesMoonPhase } from './TilesMoonPhase';
import { TilesPrecip } from './TilasPrecip';
import { TilesVisibility } from './TilesVisibility';
import { TilesUv } from './TilesUv';

export const Tiles = () => {
  const timeUpdate = useSelector(weatherSelectors.getWeatherToday_TimeUpdate);
  const data = useSelector(weatherSelectors.getWeatherWeek_Data);
  // console.log(data);
  return (
    <section className="tiles-block">
      <div className="tiles-block__title">
        <span>Сведения о погоде</span>
        <span className="title__time-update">{timeUpdate}</span>
      </div>
      {!data?.days || data.days.length < 5 ? (
        <div></div>
      ) : (
        <div className="tiles-block__card">
          <TilesHumidity></TilesHumidity>
          <TilesUv></TilesUv>
          <TilesVisibility></TilesVisibility>
          <TilesPrecip></TilesPrecip>
          <TilesMoonPhase></TilesMoonPhase>
          <TilesSun></TilesSun>
          <TilesMoon></TilesMoon>
          <TilesTemperatura></TilesTemperatura>
          <TilesPressure></TilesPressure>
          <TilesFeelTemp></TilesFeelTemp>
          <TilesCloud></TilesCloud>
          <TilesWind></TilesWind>
        </div>
      )}
    </section>
  );
};
