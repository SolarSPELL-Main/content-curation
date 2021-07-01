import React from 'react';
import Icons from './Icons';

type PageProps = {
    icons: Record<string,any>
}

/**
 * The home tab of the application.
 * @param _ Unused for now.
 * @returns The home tab body.
 */
function Page({
    icons,
}: PageProps): React.ReactElement {
    return (
        <Icons icons={icons} />
    );
}

export default Page;
