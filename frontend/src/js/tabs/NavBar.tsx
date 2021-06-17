import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useCCSelector, useCCDispatch } from '../hooks';
import { update_current_tab } from '../state/global';

import Logo from '../../assets/logo.png';

type NavBarProps = {

}

const logoStyle: React.CSSProperties = {
    height: '75px',
    width: '300px',
    margin: '10px',
};

const logoTabStyle: React.CSSProperties = {
    width: '320px',
    maxWidth: '320px',
    backgroundColor: 'var(--ocean-blue)',
};

const linkMap: Record<string, number> = {
    '/': 0,
    '/home': 0,
    '/metadata': 1,
    '/content': 2,
};

function NavBar(_: NavBarProps): React.ReactElement {
    const path = useLocation().pathname;
    const currentTab = useCCSelector(state => state.global.current_tab);
    const dispatch = useCCDispatch();

    const updateTab = React.useCallback((tab: number) => {
        dispatch(update_current_tab(tab));
    }, [dispatch]);

    React.useEffect(() => {
        if (linkMap[path] !== currentTab) {
            updateTab(linkMap[path]);
        }
    }, [updateTab, currentTab, path]);

    return (
        <Tabs
            value={currentTab}
            TabIndicatorProps={{style: {backgroundColor: '#75B2DD', height: '5px', borderRadius: '5px'}}}
            indicatorColor={'primary'}
            variant={'scrollable'}
            onChange={(_, v) => updateTab(v)}
        >
            <Tab component={RouterLink} style={logoTabStyle} to={'/home'} label={<img src={Logo} style={logoStyle} />} />
            <Tab component={RouterLink} to={'/metadata'} label={'Metadata'} />
            <Tab component={RouterLink} to={'/content'} label={'Content'} />
        </Tabs>
    );
}

export default NavBar;
