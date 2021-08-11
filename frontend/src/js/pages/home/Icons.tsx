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
};

function Icons({
    icons,
}: IconsProps): React.ReactElement {
    return (
        <Box p={2}>
            <Grid container justify={'center'}>
                {Object.entries(icons).map((entry, idx: number) => (
                    <Grid item key={idx} xs={4}>
                        <Link to={entry[0]} style={iconStyle} >
                            <img src={entry[1]} style={iconStyle} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Icons;
