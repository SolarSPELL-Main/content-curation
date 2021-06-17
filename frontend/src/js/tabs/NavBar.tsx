import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import Logo from '../../assets/logo.png';

type NavBarProps = {

}

const logoStyle: React.CSSProperties = {
    height: '75px',
    width: '300px',
    margin: '10px',
};

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
            <Tab component={RouterLink} style={{ width: '320px', maxWidth: '320px', backgroundColor: 'var(--ocean-blue)' }} to={'/home'} label={<img src={Logo} style={logoStyle} />} />
            <Tab component={RouterLink} to={'/metadata'} label={'Metadata'} />
            <Tab component={RouterLink} to={'/content'} label={'Content'} />
        </Tabs>
    );
}

export default NavBar;
