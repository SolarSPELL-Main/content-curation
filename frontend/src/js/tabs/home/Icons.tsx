import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

type IconsProps = {
    icons: Record<string, any>
}

const containerStyle: React.CSSProperties = {
    padding: '20px',
};

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
        <Grid container spacing={5} justify={'center'} style={containerStyle}>
            {Object.entries(icons).map((entry, idx: number) => (
                <Grid item key={idx} xs>
                    <Link to={`/${entry[0]}`} style={iconStyle} >
                        <img src={entry[1]} style={iconStyle} />
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
}

export default Icons;
