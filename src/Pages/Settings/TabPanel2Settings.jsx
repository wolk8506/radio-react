import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { dataActions, rootSelectors } from 'store';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import CustomSwitch from 'components/Elements/CustomSwitch';
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
      <FormControlLabel
        labelPlacement="start"
        sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
        control={<CustomSwitch checked={state.snow} onChange={handleChange} name="snow" />}
        label={state.snow ? 'выключить' : 'включить'}
      />
    </FormControl>
  );
};
