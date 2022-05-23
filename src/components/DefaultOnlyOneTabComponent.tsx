import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';


interface Props {

}

const DefaultOnlyOneTabComponent = (props: Props) => {
    const theme = useTheme();

    return (
        <Box padding={2} component={Paper} margin={2} textAlign="center">
            <h2
                className='font-bold'
                style={{ fontSize: "35px", color: theme.palette.secondary.main }}
            >SORRY!!</h2>
            <h3 className='font-regular' style={{ fontSize: "20px" }}>You can only have this application opened in one tab.</h3>

        </Box>
    )
}

export { DefaultOnlyOneTabComponent };