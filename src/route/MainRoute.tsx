import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

import { clinicalInitialRoutePath, routeList } from "utils/constants";
import { Auth, ChangePasswordByCode, Clinical } from "pages";
import NavigationContainer from "./NavigationContainer";
import { RootReducerState } from "utils/types";
import { setAuthHeader } from "utils/global";

interface Props {}

const MainRoute = (props: Props) => {
	const { authData, selectedClinic } = useSelector(
		({ auth, utilityReducer }: RootReducerState) => ({
			authData: auth.data,
			selectedClinic: utilityReducer.selectedClinic,
		}),
		shallowEqual
	);
	const [showRoute, setShowRoute] = useState<null | boolean>(null);
	const isAuthenticated = authData?.access_token;

	useEffect(() => {
		if (isAuthenticated) {
			setAuthHeader(isAuthenticated, selectedClinic);
		}
		setShowRoute(true);
	}, []);

	if (showRoute) {
		return (
			<Switch>
				<Route
					exact
					path="/login"
					render={(props) =>
						isAuthenticated ? (
							<Redirect to="/registration/patient" />
						) : (
							<Auth {...props} />
						)
					}
				/>
				<Route
					exact
					path="/changepasswordbycode"
					render={(props) =>
						isAuthenticated ? (
							<Redirect to="/registration/patient" />
						) : (
							<ChangePasswordByCode {...props} />
						)
					}
				/>
				<Route
					exact
					path="/"
					render={() => (
						<Redirect
							to={isAuthenticated ? "/registration/patient" : "/login"}
						/>
					)}
				/>
				{/* only acept number param */}
				<AuthRoute
					exact={false}
					path={`/${clinicalInitialRoutePath}/:patientId(\\d+)`}
					component={Clinical}
				/>
				<Route component={NonClinicalRouteContainer} />
			</Switch>
		);
	} else {
		return null;
	}
};

export default MainRoute;

const NonClinicalRouteContainer = () => {
	return (
		<NavigationContainer>
			{routeList.map((props, index) => (
				<AuthRoute key={index} {...props} />
			))}
			{/* <AuthRoute component={PageNotFound} /> */}
		</NavigationContainer>
	);
};

const AuthRoute = (props: RouteProps & { component: React.ComponentType }) => {
	const { component: Component, ...rest } = props;
	const { authData } = useSelector(
		({ auth }: RootReducerState) => ({
			authData: auth.data,
		}),
		shallowEqual
	);
	const isAuthenticated = authData?.access_token;

	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

function PageNotFound() {
	return (
		<div>
			<h1>No route found</h1>
		</div>
	);
}
