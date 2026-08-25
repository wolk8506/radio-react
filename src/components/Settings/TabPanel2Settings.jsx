import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { dataActions, rootSelectors } from 'store';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useEffect } from 'react';

export const TabPanel2Settings = () => {
  const dispatch = useDispatch();
  const THEME_NEW_YEAR = useSelector(rootSelectors.getThemeNewYear);
  const [state, setState] = React.useState(THEME_NEW_YEAR);

  useEffect(() => {
    dispatch(dataActions.setThemeNewYear(state));
  }, [dispatch, state]);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <FormControl className="form-auto-chenge-theme">
      <FormLabel id="controlled-radio-widget">Новый год</FormLabel>
      <Divider />

      <FormLabel id="controlled-radio-widget">Падающий снег</FormLabel>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>выкл</Typography>
        <Switch defaultChecked checked={state.snow} onChange={handleChange} name="snow" />
        <Typography>вкл</Typography>
      </Stack>
    </FormControl>
  );
};
