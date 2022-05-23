import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { CustomTextBox, CustomSelect, CustomDatePicker } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateDoctorFeeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();


    const { medicalStaffData, clinicData, visitTypeData, tariffData} = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            visitTypeData: masterPaginationReducer[masterPaginationServices.visitType].data,
            tariffData: masterPaginationReducer[masterPaginationServices.tariff].data,
            
        }),
        shallowEqual
    );

    let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));
    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let tariffOptions = tariffData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));    
    let visitTypeOptions = visitTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    
    useEffect(()=>{
        dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));        
        dispatch(getMasterPaginationData(masterPaginationServices.visitType, {})); 
        dispatch(getMasterPaginationData(masterPaginationServices.tariff, {}));
    }, []);
    





    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createDoctorFee(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }
    return (
        <>
        <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "create-doctor-fee" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                           options={medicalStaffOptions}
                            label={formatMessage({ id: "doctor" })}
                            name="medicalStaffId"
                            control={control}
                            error={errors.medicalStaffId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                           options={clinicOptions}
                            label={formatMessage({ id: "clinic" })}
                            name="clinicId"
                            control={control}
                            error={errors.clinicId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                           options={visitTypeOptions}
                            label={formatMessage({ id: "visit" })}
                            name="visitTypeId"
                            control={control}
                            error={errors.visitTypeId}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <CustomSelect
                           options={medicalStaffOptions}
                            label={formatMessage({ id: "payer" })}
                            name="payerId"
                            control={control}
                            error={errors.payerId}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <CustomSelect
                           options={tariffOptions}
                            label={formatMessage({ id: "tariff-version" })}
                            name="tariffId"
                            control={control}
                            error={errors.tariffId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "fee" })}
                            name="price"
                            control={control}
                            error={errors.price}
                            rules={validationRule.textbox({ required: true, type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "mark-up" })}
                            name="markupPer"
                            control={control}
                            error={errors.markupPer}
                        />
                    </Grid>                    

                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "effective-form" })}
                            name="effectiveFrom"
                            control={control}
                            error={errors.validFrom}                            
                        />
                    </Grid>
                </Grid>

            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateDoctorFeeModal;