import React from 'react';
import Icons from './Icons';

type PageProps = {

}

/**
 * The home tab of the application.
 * @param _ Unused for now.
 * @returns The home tab body.
 */
function Page(_: PageProps): React.ReactElement {
    const icons = require('../').Icons;

    return (
        <Icons icons={icons} />
    );
}

export default Page;
