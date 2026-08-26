import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

import { SidebarDesctop } from './Sidebar-desctop';
import { SidebarMobile } from './Sidebar-mobile';

export const Sidebar = ({ audio }) => {
  const isMobile = useMediaQuery('(max-width: 599px)');

  return isMobile ? <SidebarMobile /> : <SidebarDesctop audio={audio} />;
};
