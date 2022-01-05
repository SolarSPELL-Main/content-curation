/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

/** Main props type */
type IconsProps = {
    /** URL paths mapped to image assets */
    icons: Record<string, any>
}

const iconStyle: React.CSSProperties = {
  width: '200px',
  height: '200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
  borderRadius: '40px',
  boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),'
        + '0px 2px 2px 0px rgba(0,0,0,0.14),'
        + '0px 1px 5px 0px rgba(0,0,0,0.12)',
};

function Icons({
  icons,
}: IconsProps): React.ReactElement {
  return (
    <Box p={2} style={{paddingTop: '10vh'}}>
      <Grid container justify={'center'}>
        {Object.entries(icons).map(([href, icon], idx: number) => (
          <Grid item key={idx} xs={6} lg={3} style={{padding: "2em"}}>
            <Link to={href} style={iconStyle}>
              <img src={icon} style={iconStyle} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Icons;
