import { createMuiTheme } from '@material-ui/core';
// import { createTheme } from '@material-ui/core/styles'

export const tableTheme = createMuiTheme({
    overrides: {
        MuiTable: {
            root: {
                borderCollapse: "unset",
            },
        },
        MUIDataTableToolbar: {
            titleText: {
                color: "#575555",
            },
            root: {
                minHeight: "60px !important",
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
            },
            actions: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
            }
        },
        MUIDataTableHeadCell: {
            data: {
                color: '#39504f',
                fontWeight: 600,
            }
        },
        MuiTableCell: {
            head: {
                padding: "10px 10px",
                minWidth: "140px",
                whiteSpace: "nowrap",
            },
            body: {
                // fontFamily: "Open Sans, sans-serif",
                padding: "8px 10px",
                minWidth: "140px",
                whiteSpace: "nowrap",
            },
        },
        // outlined input
        MuiOutlinedInput: {
            root: {
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor: "#5a6abf",
                    '@media (hover: none)': {
                        borderColor: "#5a6abf",
                    },
                },

                '&&[class*="MuiAutocomplete-inputRoot"]': {
                    flexWrap: "nowrap !important",
                    paddingRight: '10px !important',
                },

                fontSize: "14px",
                background: "#FFFFFF",
                // height: "28px",
            },
            input: {
                padding: "8px",
            },
            adornedEnd: {
                paddingRight: "8px"
            },
            adornedStart: {
                paddingLeft: "8px"
            },

        },
        MuiInputLabel: {
            root: {
                fontSize: "14px",
                lineHeight: 0.5,

                "&$animated": {
                    fontSize: '1rem',
                    lineHeight: 1
                }
            },
        }
    }
})