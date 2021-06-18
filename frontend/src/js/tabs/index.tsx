import NavBar from './NavBar';
import Home from './home';
import Metadata, { Icon as MetadataIcon } from './metadata';
import Content, { Icon as ContentIcon } from './content';

export const Pages = {
    'home': Home,
    'metadata': Metadata,
    'content': Content,
};

export const Icons = {
    'metadata': MetadataIcon,
    'content': ContentIcon,
};

export { NavBar };
