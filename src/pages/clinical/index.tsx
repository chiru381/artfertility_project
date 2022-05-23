import React from "react";
import {
	NavLink,
	Route,
	Redirect,
	useRouteMatch,
	NavLinkProps,
} from "react-router-dom";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { clinicalSubRouteList } from "utils/constants";
import { clinicalTabMenuList } from "utils/constants/menu";
import ClinicalNav from "./ClinicalNav";
import UserBio from "./UserBio";
import { LeftArrow, RightArrow } from "./Arrows";
import { onScrollWheel } from "utils/global";
import "./ScrollMenu.css";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		menuItem: {
			textDecoration: "none",
			padding: "6px 14px !important",
			borderRadius: "5px",
			color: "#222222",
			whiteSpace: "nowrap",
			marginRight: "4px",
			textTransform: "none",
			"&:hover": {
				background: "#F6AC00",
				color: "#FFFFFF",
			},
		},
		activeMenu: {
			background: "#F6AC00",
			color: "#FFFFFF",
		},
	})
);

const ClinicalIndex = (props: Props) => {
	let initialRoute = clinicalSubRouteList[0].path;
	let { path, url } = useRouteMatch();
	const classes = useStyles();

	return (
		<div className="clinical-container">
			<ClinicalNav />
			<UserBio />

			<div style={{ background: "#E9E9E9" }}>
				<ScrollMenu
					LeftArrow={LeftArrow}
					RightArrow={RightArrow}
					onWheel={onScrollWheel}
				>
					{clinicalTabMenuList.map((route) => (
						<NavlinkMenu
							key={route.to}
							to={`${url}${route.to}`}
							label={route.label}
							itemId={route.to}
							className={classes.menuItem + " text-14 font-regular"}
							activeClassName={classes.activeMenu}
						/>
					))}
				</ScrollMenu>
			</div>

			<div style={{ flexGrow: 1, overflowY: "auto" }}>
				<Route exact path={path}>
					<Redirect to={`${url}${initialRoute}`} />
				</Route>

				{clinicalSubRouteList.map((route, index: number) => (
					<Route
						exact={route.exact}
						key={index}
						path={`${path}${route.path}`}
						component={route.component}
					/>
				))}
			</div>
		</div>
	);
};

export default ClinicalIndex;

interface NavlinkMenuProps {
	itemId: string;
	label: string;
}

const NavlinkMenu = ({
	itemId,
	label,
	...rest
}: NavlinkMenuProps & NavLinkProps) => {
	const visibility = React.useContext(VisibilityContext);
	visibility.isItemVisible(itemId);

	return (
		<Button
			component={NavLink}
			to={rest.to}
			// className={rest.className}
			activeClassName={rest.activeClassName}
		>
			{label}
		</Button>
	);
};
