import React from 'react'
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import { useHistory, useRouteMatch, NavLink } from "react-router-dom";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./Arrows";
import { onScrollWheel } from 'utils/global';


import { images } from "utils/constants";
import { ReactComponent as InfertilitySummaryIcon } from "assets/images/icons/infertility-summary.svg";
import { ReactComponent as SerologyFemaleSummaryIcon } from "assets/images/icons/serology-summary-female.svg";
import { ReactComponent as SerologyMaleSummaryIcon } from "assets/images/icons/serology-summary-male.svg";
import { ReactComponent as DocumentUploadIcon } from "assets/images/icons/document-upload.svg";
import { ReactComponent as AppointmentIcon } from "assets/images/icons/appointment.svg";
import { ReactComponent as TaskIcon } from "assets/images/icons/task.svg";

interface Props { }

let quickLinkList = [
  { label: "Infertility Summary", Icon: InfertilitySummaryIcon, href: '#' },
  { label: "Document upload", Icon: DocumentUploadIcon, href: '/document-upload' },
  { label: "Serology Summary", Icon: SerologyFemaleSummaryIcon, href: '#' },
  { label: "Appointments", Icon: AppointmentIcon, href: '#' },
  { label: "Serology Summary", Icon: SerologyMaleSummaryIcon, href: '#' },
  { label: "Tasks", Icon: TaskIcon, href: '#' },
]

const UserBio = (props: Props) => {
  const history = useHistory();

  return (
    <>
      <Box className="user-bio-one">
        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          onWheel={onScrollWheel}
        >
          <PatientCard itemId="1" key="1" />
          <PartnerCard itemId="2" key="2" />
          <QuickLinkCard itemId="3" key="3" />
        </ScrollMenu>
      </Box>

      <Box className="user-bio-two">
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ display: "flex" }}>
            <PatientCard />
          </Grid>
          <Grid item xs={4} style={{ display: "flex" }}>
            <PartnerCard />
          </Grid>
          <Grid item xs={4} style={{ display: "flex" }}>
            <QuickLinkCard />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default UserBio;


const PatientCard = ({ itemId }: { itemId?: string }) => {
  const visibility = React.useContext(VisibilityContext);
  if (itemId) {
    visibility.isItemVisible(itemId);
  }

  return (
    <Paper className={`user-bio-card${itemId ? " scrollable-user-card" : ""}`}>

      <div style={{ display: "flex", padding: "12px 0" }}>
        <div style={{ margin: "0 15px" }}>
          <div className="patient_pic">
            <img src={images.female_pic} />
            <span>02</span>
          </div>
        </div>

        <div>
          <ul className="patient_detail">
            <li className="text-16 font-bold" style={{ color: "#FF20F0" }}>Swapna Gupta</li>
            <li className="text-13 font-regular">UHID000024231</li>
            <li className="text-12 font-light">More Connection</li>
            <li className="text-12 font-bold" style={{ letterSpacing: "5px" }}>{"G7P4A0E0".split('').map((code, index) => index % 2 === 0 ? code : <span key={index} className="font-light">{code}</span>)}</li>
          </ul>
        </div>
      </div>

      <div className="user-card-detail">
        <table>
          <tbody>
            <tr>
              <td className="text-12 font-light">AGE</td>
              <td className="text-12 font-regular">29</td>
            </tr>
            <tr>
              <td className="text-12 font-light">BMI</td>
              <td className="text-12 font-regular">32,78</td>
            </tr>
            <tr>
              <td className="text-12 font-light">AMH</td>
              <td className="text-12 font-regular">32,78</td>
            </tr>
            <tr>
              <td className="text-12 font-light">BLOOD GROUP</td>
              <td className="text-12 font-regular">29</td>
            </tr>
            <tr>
              <td className="text-12 font-light">ALLERGIES</td>
              <td className="text-12 font-regular">29</td>
            </tr>
          </tbody>
        </table>
      </div>

    </Paper>
  )
}

const PartnerCard = ({ itemId }: { itemId?: string }) => {
  const visibility = React.useContext(VisibilityContext);
  if (itemId) {
    visibility.isItemVisible(itemId);
  }

  return (
    <Paper className={`user-bio-card${itemId ? " scrollable-user-card" : ""}`} style={{ borderColor: "#16c7ff" }}>
      <div style={{ display: "flex", padding: "12px 0" }}>
        <div style={{ margin: "0 15px" }}>
          <div className="patient_pic male_partner">
            <img src={images.male_pic} />
            <span>02</span>
          </div>
        </div>

        <div>
          <ul className="patient_detail">
            <li className="text-16 font-bold" style={{ color: "#16c7ff" }}>Swapna Gupta</li>
            <li className="text-13 font-regular">UHID000024231</li>
            <li className="text-12 font-light">More Connection</li>
          </ul>
        </div>
      </div>

      <div className="user-card-detail">
        <table>
          <tbody>
            <tr>
              <td className="text-12 font-light">AGE</td>
              <td className="text-12 font-regular">29</td>
            </tr>
            <tr>
              <td className="text-12 font-light">BMI</td>
              <td className="text-12 font-regular">32,78</td>
            </tr>
            <tr>
              <td className="text-12 font-light">AMH</td>
              <td className="text-12 font-regular">32,78</td>
            </tr>
            <tr>
              <td className="text-12 font-light">BLOOD GROUP</td>
              <td className="text-12 font-regular">29</td>
            </tr>
            <tr>
              <td className="text-12 font-light">ALLERGIES</td>
              <td className="text-12 font-regular">29</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Paper>
  )
}

const QuickLinkCard = ({ itemId }: { itemId?: string }) => {
  const visibility = React.useContext(VisibilityContext);
  if (itemId) {
    visibility.isItemVisible(itemId);
  }
  let { url } = useRouteMatch();

  return (
    <Paper className={`user-bio-card quick-links${itemId ? " scrollable-user-card" : ""}`}>
      <ul className="">
        {quickLinkList.map((item, index) => (
          <li key={index}>
            <NavLink className="quick-link-label font-regular text-14" to={`${url}${item.href}`}>
              {item.label}
              <span>
                <item.Icon />
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </Paper>
  )
}