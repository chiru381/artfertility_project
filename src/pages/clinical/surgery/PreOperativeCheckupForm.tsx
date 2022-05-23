import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from '@material-ui/core/FormControl';

import { CustomSelect, CustomCheckBox, CustomTextBox, CustomDatePicker, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { consanguinityOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { surgeryMenuList } from "utils/constants/menu";
import { PaperWithLabel } from "components";

interface Props { }

const PreOperativeCheckupForm = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });

  let patientId = useGetPatientId();

  const { medicalStaffData, consultationReasonData
  } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
      consultationReasonData: masterPaginationReducer[masterPaginationServices.consultationReason].data,
    }),
    shallowEqual
  );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));
  let consultationReasonOptions = consultationReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.consultationReason, {}));

  }, []);

  function onAddContraceptiveMethod() {
    append({});
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    setLoading(true);

    let clinicalHistoryService = services[(isEditOn ? 'updateClinicalHistory' : 'createClinicalHistory') as keyof typeof services];

    clinicalHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          toastMessage(formatMessage({ id: isEditOn ? "update-message" : "create-message" }));
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function onEdit() {

  }


  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "pre-operative-check" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: "Save"
      }}
      menuList={surgeryMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "surgery-no" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "professional" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "patient-name" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "uhid" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "weight" })}
              name="weight"
              control={control}
              error={errors.weight}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bmi" })}
              name="bmi"
              control={control}
              error={errors.bmi}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "age" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Box>
              <h3 className="formHeading">
              </h3>
            </Box>
          </Grid>

          <Grid item lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "anesthetic-and-surgical-history" })}
                  name="anestheticAndSurgicalHistory"
                  control={control}
                  error={errors.anestheticAndSurgicalHistory}
                  rules={validationRule.textbox({ maxLength: 1000 })}
                  rows={4}
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "personal-history" })}
                  name="personalHistory"
                  control={control}
                  error={errors.personalHistory}
                  rules={validationRule.textbox({ maxLength: 1000 })}
                  rows={4}
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "complications" })}
                      name="complications"
                      control={control}
                      error={errors.complications}
                      rules={validationRule.textbox({ maxLength: 1000 })}
                      rows={4}
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "allergies" })}
                      name="allergies"
                      control={control}
                      error={errors.allergies}
                      rules={validationRule.textbox({ maxLength: 1000 })}
                      rows={4}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      label={formatMessage({ id: "pre-operative-assessment " })}
                      name="preOperativeAssessment"
                      control={control}
                      error={errors.preOperativeAssessment}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "habits" })}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={4} md={4} sm={6}>
                          <CustomTextBox
                            label={formatMessage({ id: "tobacco" })}
                            name="tobacco"
                            control={control}
                            error={errors.tobacco}
                          />
                        </Grid>
                        <Grid item xs={12} lg={8} md={4} sm={6}>
                          <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            name="observationMenstrualHistory"
                            control={control}
                            error={errors.observationMenstrualHistory}
                            rules={validationRule.textbox({ maxLength: 50 })}
                          />
                        </Grid>
                        <Grid item xs={12} lg={4} md={4} sm={6}>
                          <CustomTextBox
                            label={formatMessage({ id: "alcohol" })}
                            name="alcohol"
                            control={control}
                            error={errors.alcohol}
                          />
                        </Grid>
                        <Grid item xs={12} lg={8} md={4} sm={6}>
                          <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            name="observationMenstrualHistory"
                            control={control}
                            error={errors.observationMenstrualHistory}
                            rules={validationRule.textbox({ maxLength: 50 })}
                          />
                        </Grid>
                      </Grid>
                    </PaperWithLabel>
                  </Grid>
                  <Grid item xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "remarks" })}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <CustomSelect
                            options={consanguinityOptions}
                            label={formatMessage({ id: "suitable-for-anesthesia" })}
                            name="husbandParentsConsanguinityId"
                            control={control}
                            error={errors.husbandParentsConsanguinityId}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            name="observationMenstrualHistory"
                            control={control}
                            error={errors.observationMenstrualHistory}
                            rules={validationRule.textbox({ maxLength: 1000 })}
                            rows={4}
                            multiline
                          />
                        </Grid>
                      </Grid>
                    </PaperWithLabel>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PaperWithLabel label={formatMessage({ id: "test" })}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} lg={12} md={4} sm={6}>
                      <CustomDatePicker
                        label={formatMessage({ id: "test-date" })}
                        name="testDate"
                        control={control}
                        error={errors.testDate}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "platelets" })}
                        name="platelet"
                        control={control}
                        error={errors.platelet}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "hb" })}
                        name="hb"
                        control={control}
                        error={errors.hb}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "ht" })}
                        name="ht"
                        control={control}
                        error={errors.ht}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "quick" })}
                        name="quick"
                        control={control}
                        error={errors.quick}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "aptt" })}
                        name="aptt"
                        control={control}
                        error={errors.aptt}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "ptt" })}
                        name="aptt"
                        control={control}
                        error={errors.aptt}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "hba1c" })}
                        name="observationMenstrualHistory"
                        control={control}
                        error={errors.observationMenstrualHistory}
                        rules={validationRule.textbox({ type: "textWithSpace" })}
                      />
                    </Grid>
                  </Grid>
                </PaperWithLabel>
              </Grid>
              <Grid item xs={12}>
                <PaperWithLabel label={formatMessage({ id: "risk-score" })}>
                  <>
                    <Grid container spacing={3} style={{ alignItems: "center" }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <span className="text-14 font-medium">{formatMessage({ id: "asa-type" })}</span>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="I"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="II"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="III"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="IV"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={3} style={{ alignItems: "center" }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <span className="text-14 font-medium">{formatMessage({ id: "mallampetti" })}</span>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="I"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="II"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="III"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <RadioButton
                          label="IV"
                          name="isContraceptions"
                          onChange={() => {
                          }}
                        />
                      </Grid>
                    </Grid>
                  </>
                </PaperWithLabel>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default PreOperativeCheckupForm;
