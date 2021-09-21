import React, { useEffect } from 'react';
import {Typography} from '@material-ui/core';
import {useCCDispatch} from '../../hooks';
import {update_current_tab} from '../../state/global';
import { Tabs } from '../../enums';

export default () => {
    const dispatch = useCCDispatch();
    useEffect(() => {
        dispatch(update_current_tab(Tabs.COPYRIGHT));
    }, [dispatch])

    return <>
        <Typography variant="h2" style={{
            margin: "0 auto",
            marginTop: "2em"
        }}>
            🚧 Under Construction 🚧
        </Typography>
    </>
}
