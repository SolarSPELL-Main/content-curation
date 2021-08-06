import { createMuiTheme } from "@material-ui/core/styles/"

//SolarSPELL brand approved colors
export const ocean_blue = "#00A3E0"
export const bright_blue = "#0676D8"
export const maroon = "#8C1D40"

export default createMuiTheme({
    typography: {
        h2: {
            color: bright_blue,
            fontWeight: "bolder",
            marginRight: "1em"
        },
        subtitle2: {
            fontWeight: "bold",
            marginTop: "1em",
            marginRight: "1em"
        }
    },
    props: {
        MuiButton: {
            variant: "contained",
            color: "primary"
        }
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
            main: bright_blue
        },
        secondary: {
            main: maroon
        }
    },
})

