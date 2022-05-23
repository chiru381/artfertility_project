import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Grid from '@material-ui/core/Grid';

import { FormModal } from "components";
import { CustomSelect, Select, CustomTextBox, CustomDatePicker, } from "components/forms";
import { rightLeftOptions, masterPaginationServices, } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";

interface Props {
  closeModal: () => void;
  selectedData: any
  onAddSurgeryData: (data: any) => void;
}

const CreateSurgeryModal = (props: Props) => {
  const { closeModal, selectedData, onAddSurgeryData } = props;
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const [surgicalHistorySurgeryType, setSurgicalHistorySurgeryType] = useState<any>({});
  const [surgeryTechniqueOptions, setSurgeryTechniqueOptions] = useState<any>([]);

  const { surgeryTypeData, surgeryIndicationData, surgeryTechniqueData } =
    useSelector(({ masterPaginationReducer }: RootReducerState) => ({
      surgeryTypeData: masterPaginationReducer[masterPaginationServices.surgicalHistorySurgeryType].data,
      surgeryIndicationData: masterPaginationReducer[masterPaginationServices.surgeryIndication].data,
      surgeryTechniqueData: masterPaginationReducer[masterPaginationServices.surgeryTechnique].data
    }),
      shallowEqual
    );

  let surgeryTypeOptions = surgeryTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id, }));
  let surgeryIndicationOptions = surgeryIndicationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id, }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.surgicalHistorySurgeryType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.surgeryIndication, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.surgeryTechnique, {}));
  }, []);

  useEffect(() => {

    if (selectedData && surgeryTypeOptions?.length && surgeryIndicationOptions?.length) {
      let record = surgeryTechniqueData.modelItems?.filter((item: any) => item.surgicalHistorySurgeryTypeId == selectedData?.surgicalHistorySurgeryTypeId)?.map((option: any) => ({ label: option.name, value: option.id, }));
      setSurgeryTechniqueOptions(record);

      let data = {
        ...selectedData,
        surgeryDate: selectedData?.surgeryDate,
        surgeryTechniqueId: record?.find((item: any) => item.value == selectedData?.surgeryTechniqueId) ?? null,
        surgeryIndicationId: surgeryIndicationOptions?.find((item: any) => item.value == selectedData?.surgeryIndicationId) ?? null,
        rightOrLeft: rightLeftOptions?.find((item: any) => item.value == selectedData?.rightOrLeft) ?? null,
      };
      setSurgicalHistorySurgeryType(surgeryTypeOptions?.find((item: any) => item.value == selectedData?.surgicalHistorySurgeryTypeId) ?? null);
      reset(data);
    }
  }, [reset, selectedData && surgeryTypeOptions?.length && surgeryIndicationOptions?.length]);

  useEffect(() => {
    if (surgicalHistorySurgeryType) {
      let record = surgeryTechniqueData.modelItems?.filter((item: any) => item.surgicalHistorySurgeryTypeId == surgicalHistorySurgeryType?.value)?.map((option: any) => ({ label: option.name, value: option.id, }));
      setSurgeryTechniqueOptions(record);
    }
  }, [surgicalHistorySurgeryType]);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      id: selectedData.id ?? 0,
      surgeryDate: data.surgeryDate,
      surgicalHistorySurgeryTypeId: surgicalHistorySurgeryType?.value ?? 0,
      surgeryTypeName: surgicalHistorySurgeryType ? surgicalHistorySurgeryType?.label : "",
      surgerytechniqueName: data?.surgeryTechniqueId ? data?.surgeryTechniqueId.label : "",
      surgeryIndicationName: data?.surgeryIndicationId ? data?.surgeryIndicationId.label : ""
    }
    onAddSurgeryData(bodyData);
    closeModal();
  }

  return (
    <>
      <FormModal
        onCancel={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        title={formatMessage({ id: Object.keys(selectedData).length ? "update-surgery" : "create-surgery" })}
        confirmLabel="Accept"
      >
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="surgeryDate"
              control={control}
              error={errors.surgeryDate}
              defaultValue={null}
              maxDate={new Date()}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              label={formatMessage({ id: "surgery-type" })}
              options={surgeryTypeOptions}
              onChange={(_, data: any) => {
                setSurgicalHistorySurgeryType(data);
              }}
              defaultValue={surgicalHistorySurgeryType}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "technique" })}
              options={surgeryTechniqueOptions}
              name="surgeryTechniqueId"
              control={control}
              error={errors.surgeryTechniqueId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "indication" })}
              options={surgeryIndicationOptions}
              name="surgeryIndicationId"
              control={control}
              error={errors.surgeryIndicationId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "right-left" })}
              options={rightLeftOptions}
              name="rightOrLeft"
              control={control}
              error={errors.rightOrLeft}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "complications" })}
              name="complication"
              control={control}
              error={errors.complication}
              rules={validationRule.textbox({ maxLength: 20 })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observations" })}
              name="observations"
              control={control}
              error={errors.observations}
              rules={validationRule.textbox({ maxLength: 100 })}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </FormModal>
    </>
  )
}

export default CreateSurgeryModal;