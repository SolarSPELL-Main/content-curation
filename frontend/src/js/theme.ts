import { createMuiTheme } from "@material-ui/core/styles/"

//SolarSPELL brand approved colors
//const ocean_blue = "#00A3E0"
const bright_blue = "#0676D8"
const maroon = "#8C1D40"

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
    palette: {
        primary: {
            main: bright_blue
        },
        secondary: {
            main: maroon
        }
    },
})

