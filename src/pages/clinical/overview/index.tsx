import React from "react";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ReactComponent as SerologyFemaleSummaryIcon } from "assets/images/icons/serology-summary-female.svg";
import { ReactComponent as SerologyMaleSummaryIcon } from "assets/images/icons/serology-summary-male.svg";
// import Container from "@material-ui/core/Container";

import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";

interface Props {}

const index = (props: Props) => {
  return (
     <div>
     <div className="box-card-flex">
       <div className="box-card-body">
       <Tabs
              value="tabArea"
              className="vitalhead"
              indicatorColor="primary"
              textColor="primary"
              onChange={() => {}}
            >
              <Tab className="overviewTab" label="Vitals" />
              <Tab className="overviewTab" label="Diagonsis" />
            </Tabs>
            <span className="tab_icon">
              <BorderColorOutlinedIcon />
            </span>
            <p className="innerBoxData">Primary Infertility N97.9</p>

       </div>
       <div className="box-card-body">
           <Tabs
              value="tabArea"
              indicatorColor="primary"
              className="stimulationhead"
              textColor="primary"
              onChange={() => {}}
            >
             <Tab className="overviewTab" label="Stimulation" />
              <Tab className="overviewTab" label="Treatment Plan" />
            </Tabs>
            <span className="tab_icon">
              <BorderColorOutlinedIcon />
            </span>
            <p className="innerBoxData">Primary Infertility N97.9</p>
       </div>

       <div className="box-card-body">
         <Tabs
              value="tabArea"
              className="IVFhead"
              indicatorColor="primary"
              textColor="primary"
              onChange={() => {}}
            >
              <Tab className="overviewTab" label="IVF Lab" />
              <Tab className="overviewTab" label="Cryopreservation" />
            </Tabs>
            <span className="tab_icon">
              <BorderColorOutlinedIcon />
            </span>
            <p className="innerBoxData">Primary Infertility N97.9</p>
       </div>
       
       
       <div className="box-card-body-flex">
         <div className="items">
              <Tabs
                value="tabArea"
                className="ultrahead"
                indicatorColor="primary"
                textColor="primary"
                onChange={() => {}}
              >
                <Tab className="ultraTab" label="Ultrasound" />
              </Tabs>
              <span className="pink_icon">
                <SerologyFemaleSummaryIcon fill="rgba(0, 0, 0, 0.54)" />
              </span>
              <span className="tab_icon">
                <BorderColorOutlinedIcon />
              </span>
              <p className="innerBoxData">
                01/12/2021<span>Normal</span>
              </p>
              <p className="innerBoxData">
                30/12/2021<span>Normal</span>
              </p>
              </div>

              <div className="items">
              <Tabs
                value="tabArea"
                className="ultrahead"
                indicatorColor="primary"
                textColor="primary"
                onChange={() => {}}
              >
                <Tab className="ultraTab" label="Lab Tests" />
              </Tabs>
              <span className="pink_icon">
                <SerologyFemaleSummaryIcon fill="rgba(0, 0, 0, 0.54)" />
              </span>
              <span className="tab_icon">
                <BorderColorOutlinedIcon />
              </span>
              <p className="innerBoxData">No data available</p>
            </div>
       </div>


  <div className="sperm-test-flex">
    <div className="sperm-test">
         <div className="spermiogram">
              <Tabs
                value="tabArea"
                className="sperm-head"
                indicatorColor="primary"
                textColor="primary"
                onChange={() => {}}
              >
                <Tab className="spermiogramTab" label="spermiogram" />
              </Tabs>
              <span className="blue_icon">
                <SerologyMaleSummaryIcon fill="rgba(0, 0, 0, 0.54)" />
              </span>
              <span className="tab_icon">
                <BorderColorOutlinedIcon />
              </span>
              <p className="innerBoxData">Normospermia</p>
              </div>

         <div className="spermiogram">
              <Tabs
                value="tabArea"
                className="sperm-head"
                indicatorColor="primary"
                textColor="primary"
                onChange={() => {}}
              >
               <Tab className="testiculorTab" label="Testiculor Biopsy" />
              </Tabs>
              <span className="blue_icon">
                <SerologyMaleSummaryIcon fill="rgba(0, 0, 0, 0.54)" />
              </span>
              <span className="tab_icon">
                <BorderColorOutlinedIcon />
              </span>
              <p className="innerBoxData">Normospermia</p>
              </div>

           </div>

      <div className="items sperm-lab-test">
              <Tabs
                value="tabArea"
                className="sperm-head"
                indicatorColor="primary"
                textColor="primary"
                onChange={() => {}}
              >
                <Tab className="ultraTab" label="Lab Tests" />
              </Tabs>
              <span className="blue_icon">
                <SerologyMaleSummaryIcon fill="rgba(0, 0, 0, 0.54)" />
              </span>
              <span className="tab_icon">
                <BorderColorOutlinedIcon />
              </span>
              <p className="innerBoxData">No data available</p>
          </div>
      </div>

      <div className="PrescriptionBox">
             <Tabs
                value="tabArea"
                indicatorColor="primary"
                className="vitalhead"
                textColor="primary"
                onChange={() => {}}
              >
                <Tab className="overviewTab" label="Prescription" />
                <Tab className="overviewTab" label="Follow ups" />
              </Tabs>
            <span className="tab_icon">
              <BorderColorOutlinedIcon />
            </span>
            <p className="innerBoxData">No data available</p>
       </div>
     </div>     
    </div>
  );
};

export default index;
