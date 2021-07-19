//Importing from outside the project
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

//Importing from other files in the project
import Tabs from './Tabs';
import { useCCSelector } from '../hooks';

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
    const stateTab = useCCSelector(state => state.global.current_tab);

    return (
        <Tabs
            tabs={tabDescriptors}
            currentTab={stateTab}
        />
    );
}

export default NavBar;
