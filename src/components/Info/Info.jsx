import * as React from 'react';
import { version } from 'components/info';

export const Info = () => {
  return (
    <section>
      <div className="about">radio {version}</div>
    </section>
  );
};
