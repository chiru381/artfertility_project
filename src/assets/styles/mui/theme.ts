import { createMuiTheme } from '@material-ui/core';
// import { createTheme } from '@material-ui/core/styles'
export const getMuiTheme = createMuiTheme({
    palette: {
        primary: {
            light: '#5a6abf',
            main: '#24408e',
            dark: '#001b60',
            contrastText: '#ffffff',
        },
    },
    overrides: {
        // outlined input
        MuiOutlinedInput: {
            root: {
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor: "#5a6abf",
                    '@media (hover: none)': {
                        borderColor: "#5a6abf",
                    },
                },
                fontSize: "14px",
                background: "#FFFFFF",
                // minHeight: "35px"
            },
            // input: {
            //     paddingTop: "9px !important",
            //     paddingBottom: "9px !important",
            // },
        },
        MuiInputLabel: {
            root: {
                fontSize: "14px"
            }
        },

        // MuiCheckbox: {
        //     colorPrimary: {
        //         '&:not(&checked):not($disabled):not($focused):not($error)': {
        //             color: '#1AA659',
        //         },
        //     }
        // },

        MuiChip: {
            root: {
                backgroundColor: "rgba(26, 166, 89, 0.9)",
                color: "#FFFFFF",
            },
            deleteIcon: {
                color: "white"
            }
        }
    }
})