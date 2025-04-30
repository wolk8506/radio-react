import React, { Fragment } from 'react';
import Media from 'react-media';

import { SidebarDesctop } from './Sidebar-desctop';
import { SidebarMobile } from './Sidebar-mobile';

export const Sidebar = ({ audio }) => {
  return (
    <Media
      queries={{
        small: '(max-width: 599px)',
        large: '(min-width: 600px)',
      }}
    >
      {matches => (
        <Fragment>
          {matches.small && <SidebarMobile />}
          {matches.large && <SidebarDesctop audio={audio} />}
        </Fragment>
      )}
    </Media>
  );
};
