import {useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect, CustomCheckBox } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { transactionTypeList } from 'utils/constants/default';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void;
}

const UpdateSeriesModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const { closeModal, selectedData, onApiCall } = props;
    const [financialYearType, setFinancialYearType] = useState(null);

    const { clinicData } = useSelector(
        ({ masterPaginationReducer}: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
        }),
        shallowEqual
    );

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(()=>{
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    },[]);

    useEffect(()=>{
        if(clinicOptions.length){
            let data = {
                ...selectedData,
                clinicId: clinicOptions?.find((item: any) => item.value == selectedData?.clinicId) ?? null,
            };
            reset(data);
        }
    }, [reset, clinicOptions.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateSeries(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-message" }));
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
                            options={clinicOptions}
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
                            defaultValue={new Date().getFullYear() }
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "prefix" })}
                            name="prefix"
                            control={control}
                            error={errors.prefix}
                            rules={validationRule.textbox({type: "textWithNumber" })}
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

export default UpdateSeriesModal;