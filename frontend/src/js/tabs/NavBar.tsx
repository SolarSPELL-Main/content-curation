import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Tabs from './Tabs';

import { useCCSelector, useCCDispatch } from '../hooks';
import { update_current_tab } from '../state/global';

import Logo from '../../assets/logo.png';

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

const tabDescriptors = [
    {
        component: RouterLink,
        style: logoTabStyle,
        to: '/home',
        label: (
            <img src={Logo} style={logoStyle} />
        ),
        value: 'home',
    },
    {
        component: RouterLink,
        to: '/metadata',
        label: 'Metadata',
        value: 'metadata',
    },
    {
        component: RouterLink,
        to: '/content',
        label: 'Content',
        value: 'content',
    },
];

type NavBarProps = {

}

const tabMap: Record<string, string> = {
    '/': 'home',
    '/home': 'home',
    '/metadata': 'metadata',
    '/content': 'content',
};

/**
 * This component is the full nav bar integrated with Redux global state.
 * @param props The properties of the nav bar.
 * @returns The nav bar.
 */
function NavBar(_: NavBarProps): React.ReactElement {
    const currentTab = useLocation().pathname;
    const stateTab = useCCSelector(state => state.global.current_tab);
    const dispatch = useCCDispatch();

    const updateTab = React.useCallback((tab: string) => {
        dispatch(update_current_tab(tab));
    }, [dispatch]);

    React.useEffect(() => {
        if (tabMap[currentTab] !== stateTab) {
            updateTab(tabMap[currentTab]);
        }
    }, [updateTab, stateTab, currentTab, tabMap]);

    return (
        <Tabs
            tabs={tabDescriptors}
            currentTab={stateTab}
            updateTab={updateTab}
        />
    );
}

export default NavBar;
