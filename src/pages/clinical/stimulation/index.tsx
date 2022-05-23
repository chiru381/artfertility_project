import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Route,
    Redirect,
    useRouteMatch,
} from "react-router-dom";
import { getMasterPaginationData, getStimulationLookup } from "redux/actions";
import { masterPaginationServices } from "utils/constants";
import { stimulationRouteList } from "utils/constants/route/stimulationRouteList";

interface Props {

}

const StimulationIndex = (props: Props) => {
    const routeList = stimulationRouteList;
    let { path, url } = useRouteMatch();
    const dispatch = useDispatch();

    let initialRoute = routeList[0].path;


    useEffect(()=> {
        // let params = { patientId: 1 };
        // dispatch(getStimulationLookup());
        // dispatch(getMasterPaginationData(masterPaginationServices.treatmentProcess, params));
    }, []);

    return (
        <>
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
        </>
    )
}

export default StimulationIndex;