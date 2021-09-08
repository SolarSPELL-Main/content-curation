import { createMuiTheme } from '@material-ui/core/styles/';

// SolarSPELL brand approved colors
export const OCEAN_BLUE = '#00A3E0';
export const BRIGHT_BLUE = '#0676D8';
export const MAROON = '#8C1D40';
export const SUNGLOW = '#FFC627';

export default createMuiTheme({
  typography: {
    h2: {
      color: BRIGHT_BLUE,
      fontWeight: 'bolder',
      marginRight: '1em',
      fontFamily: '"Akzidenz-Grotesk", "Arial", sans-serif',
    },
    subtitle2: {
      fontWeight: 'bold',
      marginTop: '1em',
      marginRight: '1em',
    },
    fontFamily: '"Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 'bold',
    },
  },
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
  },
  overrides: {
    MuiTablePagination: {
      // A bit of a full sweep across all the components in the pagination
      // component, but this ensures the row select and page indicator
      // won't disappear on page resize.
      caption: {
        display: 'block !important',
      },
      actions: {
        display: 'block !important',
      },
      selectIcon: {
        display: 'block !important',
      },
      select: {
        display: 'block !important',
      },
      selectRoot: {
        display: 'block !important',
      },
      input: {
        display: 'block !important',
      },
    },
  },
  palette: {
    primary: {
      main: BRIGHT_BLUE,
    },
    secondary: {
      main: MAROON,
    },
  },
});

