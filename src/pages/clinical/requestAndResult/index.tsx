import { requestResultMenuList } from "utils/constants/menu";
import { requestResultRouteList } from "utils/constants/route/requestResultRouteList";
import CustomClinicalMenuRoute from "../CustomClinicalMenuRoute";

interface Props { }

const RequestResultIndex = (props: Props) => {

  return (
    <CustomClinicalMenuRoute
      menuList={requestResultMenuList}
      routeList={requestResultRouteList}
    />
  );
};

export default RequestResultIndex;