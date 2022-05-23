import { prescriptionMenuList } from "utils/constants/menu";
import { prescriptionRouteList } from "utils/constants/route/prescriptionRouteList";
import CustomClinicalMenuRoute from "../CustomClinicalMenuRoute";

interface Props { }


const PrescriptionIndex = (props: Props) => {

  return (
    <CustomClinicalMenuRoute
      menuList={prescriptionMenuList}
      routeList={prescriptionRouteList}
    />
  );
};

export default PrescriptionIndex;
