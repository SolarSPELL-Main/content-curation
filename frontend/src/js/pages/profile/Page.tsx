import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';

import ProfileImpact from '../../../assets/profileimpact.jpg';
import { useCCSelector, useCCDispatch } from '../../hooks';
import { logout, update_current_tab } from '../../state/global';
import { Tabs } from '../../enums';
import { hasPermission } from '../../utils/permissions';
import APP_URLS from '../../urls';

export default (): React.ReactElement => {
  const dispatch = useCCDispatch();
  const user = useCCSelector(state => state.global.user);
    
  React.useEffect(
    () => {
      dispatch(update_current_tab(Tabs.PROFILE));
    },
    [dispatch],
  );

  const adminButton = hasPermission(user.permissions, 'special', 'admin') ?
    <Button href="/admin/" style={{marginRight: '1em'}}>
            Admin Site
    </Button>
    :
    <></>;

  return (
    <Box pt={'4em'} p={2}>
      <Grid container spacing={2}>
        <Grid item xs={1} />
        <Grid item xs={6} style={{paddingRight: '1em'}}>
          <img src={ProfileImpact} style={{maxWidth: '100%'}} />
        </Grid>
        <Grid item xs={5} style={{paddingLeft: '1em'}}>
          {user.username ? <>
            <Typography variant="h2">Hello, {user.username}! 👋</Typography>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{user.email}</Typography>
            <Typography variant="subtitle2">Permission Groups</Typography>
            {user.groups.map((group, idx) => <Chip
              style={{marginRight: '1em'}}
              key={idx}
              label={group}
            />)}
            <Typography variant="subtitle2">
                            Resources Uploaded
            </Typography>
            <Typography>{user.profile?.num_content ?? 0}</Typography>
            <div style={{marginTop: '2em'}}/>
            <Button
              style={{marginRight: '1em'}}
              onClick={_ => dispatch(logout())}
            >
                            LOGOUT
            </Button>
            <Button
              style={{marginRight: '1em'}}
              onClick={_ => window.open(APP_URLS.BUG_REPORT)}
            >
                            REPORT A BUG
            </Button>
            {adminButton}
          </> : <>
            <Typography variant="h2">
                            You are logged out
            </Typography>
            <Button
              style={{marginTop: '2em'}}
              href={APP_URLS.LOGIN_GOOGLE}
            >
                            Login
            </Button>
          </>}
        </Grid>
      </Grid>
    </Box>
  );
};
