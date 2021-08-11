import React from 'react';

import MUITabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { BRIGHT_BLUE } from '../theme';

/** Main props type */
type TabsProps<T> = {
    /** Props passed to each tab */
    tabs: React.ComponentProps<typeof Tab>[]
    /** Current selected tab */
    currentTab: T
    /** Style of the indicator below selected tab */
    indicatorStyle?: React.CSSProperties
}

const defaultIndicatorStyle: React.CSSProperties = {
  backgroundColor: BRIGHT_BLUE,
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
