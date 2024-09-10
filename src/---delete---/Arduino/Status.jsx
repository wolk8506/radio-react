import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import axios from 'axios';
// import { Connector } from 'mqtt-react-hooks';
// import Status from './Status';
import { useMqttState } from 'mqtt-react-hooks';
export const Status = () => {
  const { connectionStatus } = useMqttState();

  return <h1>{`Status: ${connectionStatus}`}</h1>;
};
