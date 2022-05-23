import { surgeryMenuList } from "utils/constants/menu";
import { surgeryRouteList } from "utils/constants/route/surgeryRouteList";
import CustomClinicalMenuRoute from "../CustomClinicalMenuRoute";

interface Props { }

const SurgeryIndex = (props: Props) => {
  return (
    <CustomClinicalMenuRoute
      menuList={surgeryMenuList}
      routeList={surgeryRouteList}
    />
  );
};

export default SurgeryIndex;