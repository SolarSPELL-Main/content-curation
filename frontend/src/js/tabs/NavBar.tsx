import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Tabs from './Tabs';

import { useCCSelector, useCCDispatch } from '../hooks';
import { update_current_tab } from '../state/global';

type NavBarProps = {
    tabDescriptors: (
        React.ComponentProps<typeof Tab> &
        React.ComponentProps<typeof RouterLink>
    )[]
}

/**
 * This component is the full nav bar integrated with Redux global state.
 * @param props The properties of the nav bar.
 * @returns The nav bar.
 */
function NavBar({
    tabDescriptors,
}: NavBarProps): React.ReactElement {
    // Construct tabMap from tabDescriptors
    // Maps URL paths to values for Redux
    const tabMap = tabDescriptors.reduce(
        (accum, val) => ({
            ...accum,
            [val.to as string]: val.value,
        }),
        {} as Record<string,string>,
    );
    
    const currentTab = useLocation().pathname;
    const stateTab = useCCSelector(state => state.global.current_tab);
    const dispatch = useCCDispatch();

    const updateTab = React.useCallback((tab: string) => {
        dispatch(update_current_tab(tab));
    }, [dispatch]);

    React.useEffect(() => {
        // Default tab to home
        const tab = tabMap[currentTab] ?? 'home';
        if (tab !== stateTab) {
            updateTab(tab);
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
