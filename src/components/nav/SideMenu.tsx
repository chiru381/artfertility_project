import { useEffect, useState, Fragment } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import { TextBox } from 'components/forms';
import { menuList } from 'utils/constants/menu';
import { ClinicalMenuState } from 'utils/types';


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
            fontWeight: "bold",
            backgroundColor: "rgba(36, 64, 142, 0.1)"
        },
        menuSubItem: {
            paddingTop: "5px",
            paddingBottom: "5px",
            // paddingLeft: "30px",
            paddingLeft: "55px",
            minHeight: "26px",
            color: theme.palette.grey[800],

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }
    })
);

interface Props {
    sideMenuOpen: Boolean;
    toggleSideMenuOpen: () => void;
}


const SideMenu = ({ sideMenuOpen, toggleSideMenuOpen }: Props) => {
    const classes = useStyles();
    let { path } = useRouteMatch();

    const [activeSubMenu, setActiveSubMenu] = useState<null | number>(null);
    const [activeSubInnerMenu, setActiveSubInnerMenu] = useState<null | number>(null);
    const [searchText, setSearchText] = useState("");
    const [filteredMenuList, setFilteredMenuList] = useState<any>(menuList);

    useEffect(() => {
        if (location.pathname === path) {
            setActiveSubMenu(0);
        } else {
            let activeIndex = menuList.findIndex((list) =>
                list.subMenu?.some(
                    (subList) => subList.subMenu?.length ? subList.subMenu.some(innerSub => `${innerSub.to}` === location.pathname) : `${subList.to}` === location.pathname
                )
            );
            let subMenuList = menuList?.[activeIndex]?.subMenu;
            if (subMenuList?.length) {
                setActiveSubInnerMenu(subMenuList.findIndex(list => list.subMenu?.some(sub => `${sub.to}` === location.pathname)));
            }
            setActiveSubMenu(activeIndex);
        }
    }, [location.pathname]);


    function multiFilter(value: string) {
        if (value) {
            let expandedMenuList = menuList?.reduce((acc: ClinicalMenuState[], curr: ClinicalMenuState) => {
                let result: ClinicalMenuState[] = [];
                if (curr?.subMenu?.length) {
                    curr.subMenu.map(item => {
                        if (item.subMenu?.length) {
                            result = [...result, ...item.subMenu];
                        } else {
                            result = [...result, item];
                        }
                    })
                } else {
                    result = [...result, curr]
                }
                return [...acc, ...result];
            }, []) ?? [];
            let fiteredMenuList = expandedMenuList?.filter((menu: ClinicalMenuState) => menu.label?.toLowerCase().includes(value.toLocaleLowerCase()));
            setFilteredMenuList(fiteredMenuList);
        } else {
            setFilteredMenuList(menuList);
        }
    }

    const conditionalProps = (to: string) => ({
        component: NavLink,
        activeClassName: classes.activeMenu + " font-bold",
        to: `${to}`
    })

    return (
        <>
            <div className={`root-sidebar ${sideMenuOpen ? 'root-sidebar-open' : ''}`}>
                <div style={{ width: '90%', marginLeft: '15px', marginTop: '15px' }}>
                    <TextBox
                        placeholder="Search"
                        value={searchText}
                        name="menuSearch"
                        autoComplete="off"
                        onChange={e => {
                            setSearchText(e.target.value);
                            multiFilter(e.target.value);
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <hr style={{ margin: "10px 0 0 0" }} />

                {filteredMenuList.map((list: any, index: number) => (
                    <Fragment key={index}>
                        <ListItem
                            button
                            onClick={() => {
                                setActiveSubMenu(index === activeSubMenu ? null : index);
                                setActiveSubInnerMenu(null);
                            }}
                            className={classes.menuItem}
                            {...list.to ? conditionalProps(list.to) : {}}
                        >
                            <div className='flex-center'>
                                {list?.icon && <list.icon style={{ marginRight: "20px" }} color="primary" />}
                                <span className="text-14 font-regular text-uppercase">{list.label}</span>
                            </div>
                            {list?.subMenu?.length ? (index === activeSubMenu ? (<ExpandLess />) : (<ExpandMore />)) : ("")}
                        </ListItem>

                        {list?.subMenu?.map((subList: any, subIndex: number) => (
                            <Collapse
                                key={`sub-${subIndex}`}
                                in={index === activeSubMenu}
                                timeout="auto"
                                unmountOnExit
                            >
                                <ListItem
                                    button
                                    className={classes.menuSubItem + ' font-regular'}
                                    {...subList.to ? conditionalProps(subList.to) : {}}
                                    onClick={() => setActiveSubInnerMenu(subIndex === activeSubInnerMenu ? null : subIndex)}
                                >
                                    <span className="text-13">{subList.label}</span>
                                    {subList?.subMenu ? (subIndex === activeSubInnerMenu ? (<ExpandLess />) : (<ExpandMore />)) : ("")}
                                </ListItem>

                                {subList?.subMenu?.map((subInnerList: any, subInnerIndex: number) => (
                                    <Collapse
                                        key={`sub-inner-${subInnerIndex}`}
                                        in={subIndex === activeSubInnerMenu}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <ListItem
                                            button
                                            className={classes.menuSubItem + ' font-regular'}
                                            style={{ paddingLeft: "60px" }}
                                            {...conditionalProps(subInnerList.to)}
                                        >
                                            <span className="text-13">{subInnerList.label}</span>
                                        </ListItem>
                                    </Collapse>
                                ))}
                            </Collapse>
                        ))}
                        <hr style={{ margin: "0px" }} />
                    </Fragment>
                ))}
            </div>

            {sideMenuOpen && <div
                onClick={toggleSideMenuOpen}
                className="root-sidebar-overlay"
            />}
        </>
    )
}

export { SideMenu };