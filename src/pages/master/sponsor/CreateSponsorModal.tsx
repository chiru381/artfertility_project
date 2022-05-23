import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CustomTextBox, CustomSelect, CustomDatePicker, CustomCheckBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}


const CreateSponsorModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control,watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();


    const { sponsorData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            sponsorData: masterPaginationReducer[masterPaginationServices.sponsor].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.sponsor, {}));
    }, []);

    let sponsorOptions = sponsorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createSponsor(bodyData)
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
                title={formatMessage({ id: "create-insurance-company" })}
            >
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "sponsor-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>
                   

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "primary-sponsor-code" })}
                            name="primarySponsorCode"
                            control={control}
                            error={errors.primarySponsorCode}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckBox
                            name="IsSecondarySponsor"
                            label={formatMessage({ id: "is-secondary-sponsor" })}
                            control={control}
                            error={errors.IsSecondarySponsor}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "secondary-sponsor-code" })}
                            name="secondarySponsorCode"
                            control={control}
                            error={errors.secondarySponsorCode}
                            disabled={watch("IsSecondarySponsor") ? false : true}
                            rules={validationRule.textbox({ required: watch("IsSecondarySponsor") ? true : false, type: "textWithNumber" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={sponsorOptions}
                            label={formatMessage({ id: "primary-sponsor-name" })}
                            name="primarySponsorId"
                            control={control}
                            error={errors.primarySponsorId}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "billing-address" })}
                            name="address"
                            control={control}
                            error={errors.address}                            
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "contact" })}
                            name="telephone"
                            control={control}
                            error={errors.telephone}
                            rules={validationRule.textbox({ required: true, type: "number" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "contact-email" })}
                            name="email"
                            control={control}
                            error={errors.email}                            
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "credit-limit-in-days" })}
                            name="creditLimit"
                            control={control}
                            error={errors.creditLimit}                            
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "validity-from" })}
                            name="validFrom"
                            control={control}
                            error={errors.validFrom}                            
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "validity-to" })}
                            name="validto"
                            control={control}
                            error={errors.validto}                            
                        />
                    </Grid>

                    



                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateSponsorModal;