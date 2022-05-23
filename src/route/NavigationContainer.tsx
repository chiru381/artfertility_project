import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';

import BackToTop from './ScrollToTop';
import { Header, SideMenu } from "components";
import { makeStyles } from "@material-ui/core/styles";


interface Props {
    children: any;
}

const useStyles = makeStyles(theme => ({
    appbar: {
        backgroundColor: "#F3F6FF",
        boxShadow: '0 1.5px 1.5px rgba(27,31,35,.15)',
    }
}));

function NavigationContainer(props: Props) {
    // const [sideMenuOpen, setSidemenuOpen] = useState(window.innerWidth < 1260 ? false : true);
    const [sideMenuOpen, setSidemenuOpen] = useState(false);
    const classes = useStyles();
    const trigger = useScrollTrigger();

    function toggleSideMenuOpen() {
        setSidemenuOpen(!sideMenuOpen);
    }

    return (
        <>
            <SideMenu sideMenuOpen={sideMenuOpen} toggleSideMenuOpen={toggleSideMenuOpen} />

            <main
                className={`root-body ${sideMenuOpen ? "root-body-open" : ""}`}>
                <CssBaseline />
                <Slide appear={false} direction="down" in={!trigger} >
                    <AppBar position="sticky" className={classes.appbar} elevation={0}>
                        <Header toggleSideMenuOpen={toggleSideMenuOpen} />
                    </AppBar>
                </Slide>

                <div id="back-to-top-anchor" />
                {props.children}
            </main>

            <Zoom in={trigger} mountOnEnter unmountOnExit>
                <BackToTop />
            </Zoom>
        </>
    )
}


export default NavigationContainer;