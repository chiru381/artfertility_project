import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { CustomTextBox, CustomSelect, CustomCheckBox } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { transactionTypeList } from 'utils/constants/default';



interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateSeriesModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [financialYearType, setFinancialYearType] = useState(null);

    const { clinicData, transactionTypeData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            transactionTypeData: masterPaginationReducer[masterPaginationServices.transactionType].data
        }),
        shallowEqual
    );


    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let transactionTypeOptions = transactionTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.transactionType, {}));
    }, []);




    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            financialYearType: financialYearType === "1" ? true : false
        }
        console.log('bodyData : ', bodyData)

        setLoading(true);
        services.createSeries(bodyData)
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
                title={formatMessage({ id: "create-series" })}
            >
                <Grid container spacing={2}>
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
                            options={transactionTypeOptions}
                            label={formatMessage({ id: "transaction-type" })}
                            name="transactionTypeId"
                            control={control}
                            error={errors.transactionTypeName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RadioGroup row aria-label="position"
                            name="position"
                            defaultValue="top"
                            value={financialYearType} onChange={(event: any) => {
                                setFinancialYearType(event.target.value);
                            }}
                        >
                            <FormControlLabel value="1" control={<Radio color="primary" />} label={formatMessage({ id: "january-december" })} />
                            <FormControlLabel value="0" control={<Radio color="primary" />} label={formatMessage({ id: "april-march" })} />
                        </RadioGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "year" })}
                            name="year"
                            control={control}
                            error={errors.year}
                            defaultValue={new Date().getFullYear()}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "prefix" })}
                            name="prefix"
                            control={control}
                            error={errors.prefix}
                            rules={validationRule.textbox({ type: "textWithNumber" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "sequence" })}
                            name="sequence"
                            control={control}
                            error={errors.sequence}                            
                            rules={validationRule.textbox({type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomCheckBox
                            name="counterResetOnFinancialYear"
                            label={formatMessage({ id: "counter-reset" })}
                            control={control}
                            error={errors.counterResetOnFinancialYear}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default CreateSeriesModal;