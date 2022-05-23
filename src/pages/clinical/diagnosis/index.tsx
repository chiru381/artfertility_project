import { diagnosisMenuList } from "utils/constants/menu";
import { diagnosisRouteList } from "utils/constants/route/diagnosisRouteList";
import CustomClinicalMenuRoute from "../CustomClinicalMenuRoute";

interface Props { }


const DiagnosisList = (props: Props) => {

  return (
    <CustomClinicalMenuRoute
      menuList={diagnosisMenuList}
      routeList={diagnosisRouteList}
    />
  );
};

export default DiagnosisList;