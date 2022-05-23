import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import BorderColorOutlinedIcon from '@material-ui/icons/BorderColorOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import FormControl from '@material-ui/core/FormControl';

import { CustomSelect, CustomCheckBox, CustomTextBox, CustomDatePicker, SearchableTextBox } from "components/forms";
import { HoverLoader, PaperWithLabel } from "components";
import { consanguinityOptions, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";
import { Tooltip } from "@material-ui/core";

interface Props { }

const NewRequest = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const { handleSubmit, formState: { errors }, control, reset, } = useForm({ mode: "all" });

  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [listRows, setListRows] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [testEditable, setTestEditable] = useState(false);

  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });

  let patientData = location.state ?? {};

  const { medicalStaffData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
    }),
    shallowEqual
  );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
  }, []);


  const { modelItems } = medicalStaffData;

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
    let paramsData = {
      clinicalHistoryId: patientData?.id ?? 1
    };
    setLoading(true);
    services.getClinicalHistoryById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setFormData(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function setFormData(resData: any) {
    let newList = resData.clinicalHistoryContraceptions.map((item: any) => ({
      ...item,
      contraceptiveMethodId: { label: item.contraceptiveMethodName, value: item.contraceptiveMethodId }
    }));

    let data = {
      ...resData,
      responsibleId: medicalStaffOptions?.find((item: any) => item.value == resData?.responsibleId) ?? null,
      wifeParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.wifeParentsConsanguinityId) ?? null,
      husbandParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.husbandParentsConsanguinityId) ?? null,
      coupleConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.coupleConsanguinityId) ?? null,
      cycleType: cycleOptions?.find((item: any) => item.value == resData?.cycleType) ?? null,
      clinicalHistoryContraceptions: newList
    }

    reset(data);
  }

  function onPlaceOrder(data: any) {

  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "blood-lab-new-request" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onClickSecondaryButton={handleSubmit(onPlaceOrder)}
      secondaryButtonProps={{
        label: formatMessage({ id: "place-order" })
      }}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "request-id" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "request-date" })}
              name="capturingDate"
              control={control}
              error={errors.capturingDate}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "requesting-doctor" })}
              name="responsibleId"
              control={control}
              error={errors.responsibleId}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "assistant" })}
              name="responsibleId"
              control={control}
              error={errors.responsibleId}
              rules={validationRule.textbox({ required: true })}
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
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "profile-name" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "clinic" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12}>
            <h3 className="formHeading">
            </h3>
          </Grid>
          <Grid item xs={12} lg={6} >
            <PaperWithLabel label={formatMessage({ id: "request" })}>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ display: "flex" }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth style={{ alignItems: "flex-start", textDecoration: "underline" }}>
                      <span className="text-14 font-bold">{formatMessage({ id: "hematology" })}</span>
                    </FormControl>
                    <p>Blood group and Rh</p>
                    <p>Hemoglobin Electrophoresis</p>
                    <p>CBC</p>

                    <FormControl fullWidth style={{ alignItems: "flex-start", textDecoration: "underline" }}>
                      <span className="text-14 font-bold">{formatMessage({ id: "biochemistry" })}</span>
                    </FormControl>
                    <p>E2 (Estradiol)</p>
                    <p>FSH</p>
                    <p>LH</p>
                    <p>PRL(Prolactin)</p>
                    <p>bHCG</p>
                    <p>TSH</p>
                    <p>AMH</p>
                    <p>P4 Gen3 (Progesterone)</p>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth style={{ alignItems: "flex-start", textDecoration: "underline" }}>
                      <span className="text-14 font-bold">{formatMessage({ id: "hormones" })}</span>
                    </FormControl>
                    <p>Vitamin D Total</p>
                    <FormControl fullWidth style={{ alignItems: "flex-start", textDecoration: "underline" }}>
                      <span className="text-14 font-bold">{formatMessage({ id: "biochemistry" })}</span>
                    </FormControl>
                    <p>HBsAg</p>
                    <p>Anti HCV</p>
                    <p>HIV Ag-Ab</p>
                    <p>Rubella IgG</p>
                    <p>Rubella IgM</p>
                    <p>Syphills (Treponemal Antibodies)</p>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name="companyName"
                    control={control}
                    error={errors.companyName}
                    rules={validationRule.textbox({ maxLength: 100 })}
                  />
                </Grid>
              </Grid>
            </PaperWithLabel>
          </Grid>
          <Grid item xs={12} lg={6}>
            <PaperWithLabel label={formatMessage({ id: "customize-order" })}>
              <>
                <Tooltip title={testEditable ? "Disable" : "Enable"}>
                  <div onClick={() => { setTestEditable(!testEditable) }}
                    className="cursorPointer"
                    style={{ float: "right", opacity: 1, padding: "2px", marginTop: "-45px" }}>
                    {testEditable ? <CancelOutlinedIcon /> : <BorderColorOutlinedIcon />}
                  </div>
                </Tooltip>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <CustomSelect
                      options={[]}
                      name="category"
                      label={formatMessage({ id: "category" })}
                      control={control}
                      disabled={!testEditable}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <SearchableTextBox
                      placeholder={formatMessage({ id: "search" })}
                      onChange={(e: any) => {
                        if (e.target.value) {
                          let newList = listRows.filter((item: any) => item.name?.toLowerCase().includes(e.target.value?.toLowerCase()));
                          setListRows(newList);
                        }
                        else {
                          let newListRows = modelItems.map((item: any) => ({
                            ...item,
                            isSelected: fields?.some((options: any) => item.id == options.disorderId),
                          }));
                          setListRows(newListRows);
                        }
                        setSearchText(e.target.value);
                      }}
                      value={searchText}
                      disabled={!testEditable}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "albumin" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "alkaline-phosphatase" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "anti-hcv" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "bilirubin-total" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "blood-glucose-fasting" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "calcium" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "creatinine" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "direct-bilirubin" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "e2" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "fsh" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomCheckBox
                      name="isFatherDeceased"
                      label={formatMessage({ id: "tsh" })}
                      control={control}
                      error={errors?.isFatherDeceased}
                      labelPlacement="end"
                    />
                  </Grid>
                </Grid>
              </>
            </PaperWithLabel>
          </Grid>

        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default NewRequest;
