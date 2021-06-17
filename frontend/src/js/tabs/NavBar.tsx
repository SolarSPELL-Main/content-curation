import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useCCSelector, useCCDispatch } from '../hooks';
import { update_current_tab } from '../state/global';

type TabProps = React.ComponentProps<typeof RouterLink> & React.ComponentProps<typeof Tab>

type NavBarProps = {
    tabs: TabProps[],
    tabMap: Record<string, string>,
}

const tabIndicatorStyle: React.CSSProperties = {
    backgroundColor: 'var(--bright-blue)',
    height: '5px',
    borderRadius: '5px',
};

/**
 * The nav bar displayed to users at the top of the page.
 * This component is integrated with the Redux state.
 * @param props The tabs to display in the nav bar.
 * @returns The nav bar.
 */
function NavBar({
    tabs,
    tabMap,
}: NavBarProps): React.ReactElement {
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
            value={stateTab}
            TabIndicatorProps={{style: tabIndicatorStyle}}
            variant={'scrollable'}
            onChange={(_, v) => updateTab(v)}
        >
            {tabs.map(props => (
                <Tab component={RouterLink} {...props} />
            ))}
        </Tabs>
    );
}

export default NavBar;
