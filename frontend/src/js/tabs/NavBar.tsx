import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type NavBarProps = {

}

const linkMap: Record<string, number> = {
    '/': 0,
    '/home': 0,
    '/metadata': 1,
    '/content': 2,
};

function NavBar(_: NavBarProps): React.ReactElement {
    const path = useLocation().pathname;
    const [currentTab, setCurrentTab] = React.useState(linkMap[path]);

    React.useEffect(() => {
        setCurrentTab(linkMap[path]);
    }, [setCurrentTab, path]);

    return (
        <Tabs
            value={currentTab}
            TabIndicatorProps={{style: {backgroundColor: '#75B2DD', height: '5px', borderRadius: '5px'}}}
            indicatorColor={'primary'}
            variant={'scrollable'}
            onChange={(_, v) => setCurrentTab(v)}
        >
            <Tab component={RouterLink} to={'/home'} label={'Home'} />
            <Tab component={RouterLink} to={'/metadata'} label={'Metadata'} />
            <Tab component={RouterLink} to={'/content'} label={'Content'} />
        </Tabs>
    );
}

export default NavBar;
