import React, { useEffect, memo, useState } from "react";
import {
    NavLink,
    Route,
    Redirect,
    useRouteMatch,
    useLocation,
} from "react-router-dom";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";

import { ClinicalMenuState, routeState } from 'utils/types';


interface Props { }

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: theme.palette.grey[700],
        },
        activeMenu: {
            color: `${theme.palette.primary.main} !important`,
            fontWeight: "bold"
        },
        menuSubItem: {
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "30px",
            minHeight: "26px",
            color: theme.palette.grey[800],

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        sideMenu: {
            background: "#FFFFFF 0% 0% no-repeat padding-box",
            boxShadow: "3px 0px 4px #00000029",
            width: "220px",
            overflowY: "auto",
            float: "left",
            height: "100%"
        },
        openMenuToogle: {
            position: "absolute",
            bottom: 4,
            display: "flex",
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.1)",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            boxShadow: '0px 3px 5px #0000001A',
            cursor: "pointer"
        }
    })
);

interface Props {
    menuList: ClinicalMenuState[];
    routeList: routeState[];
}

const CustomClinicalMenuRoute = memo((props: Props) => {
    const { menuList, routeList } = props;
    let { path, url } = useRouteMatch();

    let initialRoute = routeList[0].path;

    return (
        <div style={{ display: "flex", height: "100%" }}>
            <SideMenu
                menuList={menuList}
            />

            <div style={{ flex: 1, overflowY: "auto" }}>
                <Route exact path={path}>
                    <Redirect to={`${url}${initialRoute}`} />
                </Route>

                {routeList.map((route, index: number) => (
                    <Route
                        key={index}
                        path={`${path}${route.path}`}
                        component={route.component}
                    />
                ))}
            </div>
        </div>
    )
});

export default CustomClinicalMenuRoute;

const SideMenu = memo((props: { menuList: ClinicalMenuState[] }) => {
    const { menuList } = props;
    const location = useLocation();
    const classes = useStyles();
    let { path, url } = useRouteMatch();

    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [activeSubMenu, setActiveSubMenu] = React.useState<null | number>(null);
    const [activeSubInnerMenu, setActiveSubInnerMenu] = React.useState<null | number>(null);

    useEffect(() => {
        if (location.pathname === path) {
            setActiveSubMenu(0);
        } else {
            let activeIndex = menuList.findIndex((list) =>
                list.subMenu?.some(
                    (subList) => subList.subMenu?.length ? subList.subMenu.some(innerSub => `${url}${innerSub.to}` === location.pathname) : `${url}${subList.to}` === location.pathname
                )
            );
            let subMenuList = menuList?.[activeIndex]?.subMenu;
            if (subMenuList?.length) {
                setActiveSubInnerMenu(subMenuList.findIndex(list => list.subMenu?.some(sub => `${url}${sub.to}` === location.pathname)));
            }
            setActiveSubMenu(activeIndex);
        }
    }, [location.pathname]);

    const conditionalProps = (to: string) => ({
        component: NavLink,
        activeClassName: classes.activeMenu + " font-bold",
        to: `${url}${to}`
    })

    return (
        <>
            {isMenuOpen && <div className={classes.sideMenu}>

                {menuList.map((list, index) => (
                    <React.Fragment key={index}>

                        <ListItem
                            button
                            onClick={() => {
                                setActiveSubMenu(index === activeSubMenu ? null : index);
                                setActiveSubInnerMenu(null);
                            }}
                            className={classes.menuItem}
                            // className={classes.menuItem + ` ${index === activeSubMenu ? classes.activeMenu : ''}`}
                            {...list.to ? conditionalProps(list.to) : {}}
                        >
                            <span className="text-13 font-bold text-uppercase">{list.label}</span>
                            {list?.subMenu?.length ? (index === activeSubMenu ? (<ExpandLess />) : (<ExpandMore />)) : ("")}
                        </ListItem>

                        {list?.subMenu?.map((subList, subIndex) => (
                            <Collapse
                                key={`sub-${subIndex}`}
                                in={index === activeSubMenu}
                                timeout="auto"
                                unmountOnExit
                            >
                                <ListItem
                                    button
                                    // className={classes.menuSubItem + `${(subIndex === activeSubInnerMenu) ? ` ${classes.activeMenu} font-bold` : ''}`}
                                    className={classes.menuSubItem + ' font-regular'}
                                    {...subList.to ? conditionalProps(subList.to) : {}}
                                    onClick={() => setActiveSubInnerMenu(subIndex === activeSubInnerMenu ? null : subIndex)}
                                >
                                    <span className="text-12">{subList.label}</span>
                                    {subList?.subMenu ? (subIndex === activeSubInnerMenu ? (<ExpandLess />) : (<ExpandMore />)) : ("")}
                                </ListItem>

                                {subList?.subMenu?.map((subInnerList, subInnerIndex) => (
                                    <Collapse
                                        key={`sub-inner-${subInnerIndex}`}
                                        in={subIndex === activeSubInnerMenu}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <ListItem
                                            button
                                            className={classes.menuSubItem + ' font-regular'}
                                            style={{ paddingLeft: "40px" }}
                                            {...conditionalProps(subInnerList.to)}
                                        >
                                            <span className="text-12">{subInnerList.label}</span>
                                        </ListItem>
                                    </Collapse>
                                ))}
                            </Collapse>
                        ))}
                        <hr style={{ margin: "0px" }} />
                    </React.Fragment>
                ))}
            </div>}

            {isMenuOpen && <div style={{ position: "absolute", left: 8, bottom: 8 }}>
                <IconButton size="small" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <ChevronLeft />
                </IconButton>
            </div>}

            {!isMenuOpen && <div
                className={classes.openMenuToogle}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <ChevronRight />
            </div>}
        </>
    )
});