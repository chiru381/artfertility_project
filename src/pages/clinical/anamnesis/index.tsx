import { anamnesisMenuList } from "utils/constants/menu";
import { anamnesisRouteList } from "utils/constants/route/anamnesisRouteList";
import CustomClinicalMenuRoute from "../CustomClinicalMenuRoute";

interface Props { }

const AnamnesisIndex = (props: Props) => {
  return (
    <CustomClinicalMenuRoute
      menuList={anamnesisMenuList}
      routeList={anamnesisRouteList}
    />
  );
};

export default AnamnesisIndex;
