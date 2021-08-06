import React from 'react';

import MUITabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

type TabsProps<T> = {
    tabs: React.ComponentProps<typeof Tab>[]
    currentTab: T
    indicatorStyle?: React.CSSProperties
}

const defaultIndicatorStyle: React.CSSProperties = {
    backgroundColor: 'var(--bright-blue)',
    height: '5px',
    borderRadius: '5px',
};

/**
 * The tabs displayed to users at the top of the page.
 * Type parameter is the type of the values associated with tabs.
 * @param props The tabs to display and the context.
 * @returns The tabs.
 */
function Tabs<T>({
    tabs,
    currentTab,
    indicatorStyle = defaultIndicatorStyle,
}: TabsProps<T>): React.ReactElement {
    return (
        <MUITabs
            value={currentTab}
            TabIndicatorProps={{style: indicatorStyle}}
            variant={'scrollable'}
        >
            {tabs.map((props, idx) => (
                <Tab {...props} key={idx} />
            ))}
        </MUITabs>
    );
}

export default Tabs;
