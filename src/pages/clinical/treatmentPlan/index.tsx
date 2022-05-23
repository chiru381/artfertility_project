import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMasterPaginationData, getTreatmentPlanLookup } from "redux/actions";
import { masterPaginationServices } from "utils/constants";

import { treatmentPlanMenuList } from "utils/constants/menu";
import { treatmentPlanRouteList } from "utils/constants/route/treatmentPlanRouteList";
import { useGetPatientId } from "utils/hooks";
import CustomClinicalMenuRoute from '../CustomClinicalMenuRoute';

interface Props { }


const TreatmentPlanIndex = (props: Props) => {
    const dispatch = useDispatch();
    let patientId = useGetPatientId();

    useEffect(() => {
        let params = { patientId };
        dispatch(getTreatmentPlanLookup());
        dispatch(getMasterPaginationData(masterPaginationServices.treatmentProcess, params));
    }, []);

    return (
        <CustomClinicalMenuRoute
            menuList={treatmentPlanMenuList}
            routeList={treatmentPlanRouteList}
        />
    );
};

export default TreatmentPlanIndex;