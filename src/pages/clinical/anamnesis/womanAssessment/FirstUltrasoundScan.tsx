import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import { CustomTextBox, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import { services } from "utils/services";
import { useToastMessage, useGetClinicalUrlFirstRoute, useGetPatientId } from "utils/hooks";
import { SecondaryButton } from "components/button";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const FirstUltrasoundScan = (props: Props) => {
  const history = useHistory();

  const { formState: { errors }, control, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [loading, setLoading] = useState(false);

  const firstPath = useGetClinicalUrlFirstRoute();

  let patientId = useGetPatientId();

  useEffect(() => {
    getUltrasoundGeneralApiCallById();
  }, []);

  function getUltrasoundGeneralApiCallById() {
    let paramsData = {
      UltrasoundGeneralId: patientId
    };
    setLoading(true);
    services.getFirstUltrasoundGeneralById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          reset(res.data?.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }
  
  function onGoToUSGScan() {
    history.push(`/${firstPath}/${patientId}/request-result/ultrasound-scan-general`);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "first-ultrasound-scan" })}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <SecondaryButton
              label="Go to USG Scan"
              onClick={onGoToUSGScan}
              style={{ marginRight: "10px", padding: "10px", background: "#0BDB5E", color: "white", border: "none" }}
            />
          </Grid>

          <Grid item xs={12} lg={2} md={2} sm={4}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="ultrasoundDate"
              control={control}
              error={errors.ultrasoundDate}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "performed-by" })}
              name="doctorUserDisplayName"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "clinic" })}
              name="clinicName"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "type-of-ultrasound" })}
              name="ultrasoundTypeName"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "method-of-ultrasound" })}
              name="ultrasoundMethodName"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={3} md={5} sm={6}>
            <CustomTextBox
              style={{ marginTop: "30px" }}
              label={formatMessage({ id: "endometrial-thickness" })}
              name="endometrialThickness"
              control={control}
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={8} md={6} sm={6} style={{ marginLeft: "14px" }}>
            <Grid>
              <h3 style={{ fontSize: "12px", marginTop: "4px" }}>
                <FormattedMessage id="number-of-antral-follicies" />
              </h3>
            </Grid>
            <>
              <div style={{ display: "flex", columnGap: "30px", width: "100%" }} >
                <CustomTextBox
                  label={formatMessage({ id: "right-ovary" })}
                  name="folliclesRight"
                  control={control}
                  disabled
                />
                <CustomTextBox
                  label={formatMessage({ id: "left-ovary" })}
                  name="folliclesLeft"
                  control={control}
                  disabled
                />
              </div>
            </>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <CustomTextBox
              style={{ marginTop: "30px" }}
              label={formatMessage({ id: "ultrasound-notes/remarks" })}
              name="notes"
              control={control}
              disabled
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default FirstUltrasoundScan;