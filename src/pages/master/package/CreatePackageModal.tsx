import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { TableDeleteButton } from 'components/button';
import { CustomTextBox, CustomSelect, CustomCheckBox, CustomDatePicker, CustomRadioGroup } from 'components/forms';
import { masterPaginationServices, packagesOptions, servicePackageColumn } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader, SimpleSearchableTable, SimpleTable } from 'components';
import { validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useCreateDropdownOptions, useToastMessage } from 'utils/hooks';
import { AddCircle, CheckCircle } from "@material-ui/icons";
import { Checkbox, TextField } from "@material-ui/core";
import { ServiceFormState } from "./interface";
interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreatePackageModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm<ServiceFormState & any>({
        mode: 'all', defaultValues: {
            packageStartDate: null,
            packageEndDate: null,
        }
    });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPackageCost, setTotalPackageCost] = useState<number>(0);
    const { toastMessage } = useToastMessage();
    const [serviceList, setServiceList] = useState<{ [key: string]: any }[]>([]);
    const { stageData, serviceData, merchantData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            stageData: masterPaginationReducer[masterPaginationServices.stage].data,
            serviceData: masterPaginationReducer[masterPaginationServices.service].data,
            merchantData: masterPaginationReducer[masterPaginationServices.merchant].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (serviceData?.modelItems?.length > 0) {
            setServiceList(serviceData.modelItems.map((item: any) => ({ ...item, isSelected: false, packageUtilityItems: { qty: 0, amount: 0, serviceItemId: item.id } })))
        }
    }, [serviceData?.modelItems]);

    const stageOptions = useCreateDropdownOptions(stageData.modelItems);
    const merchantOptions = useCreateDropdownOptions(merchantData.modelItems);

    let serviceTableRows = useMemo(() => {
        //BIND WITH HOOK FORM
        setValue('packageUtilityItems', serviceList.filter(item => item.isSelected).map((item) => item.packageUtilityItems));

        return serviceList.map((item: any) => ({
            ...item,
            serviceCheckBox: (
                <Checkbox
                    checked={item.isSelected}
                    icon={<AddCircle htmlColor="#D6D6D6" />}
                    checkedIcon={<CheckCircle htmlColor="#48A865" />}
                    onChange={() => onToggleService(item.id)}
                />
            )
        }))
    }, [serviceList]);

    let selectedServiceTableRows = serviceList.filter(item => item.isSelected).map((item, index) => ({
        ...item,
        qty:
            <CustomTextBox
                defaultValue={item.qty}
                onBlur={(e) => onChange(item.id, 'qty', e.target.value)}
                name={`packageUtilityItems.${index}.qty`}
                control={control}
                error={errors?.packageUtilityItems?.[index]?.qty}
                rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
            />,
        amount:
            <CustomTextBox
                onBlur={(e) => onChange(item.id, 'amount', e.target.value)}
                defaultValue={item.amount}
                name={`packageUtilityItems.${index}.amount`}
                control={control}
                error={errors?.packageUtilityItems?.[index]?.amount}
                rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
            />,

        action: <TableDeleteButton
            imageStyle={{ width: "20px", height: "20px" }}
            onClick={() => onToggleService(item.id)}
        />
    }));
    function onSubmit(data: any) {
        let bodyData = {
            ...data,
            durationInDay: +data.durationInDay,
            maximumNumberOfVisits: +data.maximumNumberOfVisits,
            maximumVisitAmount: +data.maximumVisitAmount,
            maximumInvestigationAmount: +data.maximumInvestigationAmount,
            maximumConsumablesAmount: +data.maximumConsumablesAmount,
            maximumDrugsAmount: +data.maximumDrugsAmount,
            isDonorPackage: data.isDonorPackage === '1' ? true : false,
            packageCost: +totalPackageCost,
            packageMerchants: data?.packageMerchants?.map((item: any) => ({
                merchantId: +item.value,
            })),
            stageId: data?.stageId?.value,
            packageUtilityItems: selectedServiceTableRows.map((item: any) => ({
                qty: +item?.packageUtilityItems?.qty ?? 0,
                amount: +item?.packageUtilityItems?.amount ?? 0,
                serviceItemId: +item?.packageUtilityItems?.serviceItemId,
                stageId: +data?.packageStageId?.value,
            })),
        };

        delete bodyData.packageStageId;

        setLoading(true);
        services.createPackage(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                } else {
                    toastMessage(res.data?.messge, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }


    function onToggleService(serviceId: number) {
        setServiceList(prevState => prevState.map((list) => ({
            ...list,
            isSelected: (serviceId === list.id) ? !list.isSelected : list.isSelected,
            packageUtilityItems: (serviceId === list.id) ? {
                qty: 0,
                amount: 0,
                serviceItemId: serviceId,
            } : list.packageUtilityItems,
        })));
    }

    function onChange(serviceId: number, name: string, value: any) {
        setServiceList(serviceList.map((list) => ({
            ...list, packageUtilityItems: (serviceId === list.id) ? {
                qty: name === 'qty' ? value : list?.packageUtilityItems?.qty ?? 0,
                amount: name === 'amount' ? value : list?.packageUtilityItems?.amount ?? 0,
                serviceItemId: serviceId,
            } : list.packageUtilityItems
        })));
    }

    useEffect(() => {
        if (watch('maximumVisitAmount') || watch('maximumConsumablesAmount') || watch('maximumDrugsAmount')) {
            let visit = !isNaN(watch('maximumVisitAmount')) ? watch('maximumVisitAmount') : 0;
            let consumable = !isNaN(watch('maximumConsumablesAmount')) ? watch('maximumConsumablesAmount') : 0;
            let drugs = !isNaN(watch('maximumDrugsAmount')) ? watch('maximumDrugsAmount') : 0;
            setTotalPackageCost(Number(visit) + Number(consumable) + Number(drugs))
        }
    }, [watch('maximumVisitAmount'), watch('maximumConsumablesAmount'), watch('maximumDrugsAmount')])

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "create-package" })}
                modalSize="half-page"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "package-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, maxLength: 200 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomRadioGroup
                            name="isDonorPackage"
                            control={control}
                            groupList={packagesOptions}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={stageOptions}
                            label={formatMessage({ id: "treatment-starting-stage" })}
                            name="stageId"
                            control={control}
                            error={errors.stageId}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "package-duration" })}
                            name="durationInDay"
                            control={control}
                            error={errors.durationInDay}
                            rules={validationRule.textbox({ type: 'number' })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "package-start-date" })}
                            name="packageStartDate"
                            control={control}
                            error={errors.packageStartDate}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "package-end-date" })}
                            name="packageEndDate"
                            control={control}
                            error={errors.packageEndDate}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={stageOptions}
                            label={formatMessage({ id: "package-stage" })}
                            name="packageStageId"
                            control={control}
                            error={errors.packageStageId}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            <Grid item md={4} sm={12} style={{ display: 'flex' }}>
                                <SimpleSearchableTable
                                    columns={["name", "serviceCheckBox"]}
                                    colSpans={[90, 10]}
                                    tableData={serviceTableRows}
                                    label="Service"
                                    searchEnabled={false}
                                />
                            </Grid>
                            <Grid item md={8} sm={12} style={{ display: 'flex' }}>
                                <SimpleTable
                                    colSpans={[40, 30, 30, 10]}
                                    columns={servicePackageColumn}
                                    tableData={selectedServiceTableRows}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckBox
                            label={formatMessage({ id: "multiple-visit-allow" })}
                            name="isMultipleVisitAllowed"
                            control={control}
                            error={errors.isMultipleVisitAllowed}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "service-limit" })}
                            name="servicelimit"
                            control={control}
                            error={errors.servicelimit}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "no-of-visit-allowed" })}
                            name="maximumNumberOfVisits"
                            control={control}
                            error={errors.maximumNumberOfVisits}
                            rules={validationRule.textbox({ required: true })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "visit-amount" })}
                            name="maximumVisitAmount"
                            control={control}
                            error={errors.maximumVisitAmount}
                            rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "drug" })}
                            name="maximumDrugsAmount"
                            control={control}
                            rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
                            error={errors.maximumDrugsAmount}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "consumable" })}
                            name="maximumConsumablesAmount"
                            control={control}
                            error={errors.maximumConsumablesAmount}
                            rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "investing-amount" })}
                            name="maximumInvestigationAmount"
                            control={control}
                            error={errors.maximumInvestigationAmount}
                            rules={validationRule.textbox({ type: 'numberWithDecimal', required: true })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label={formatMessage({ id: "total-package-cost" })}
                            name="packageCost"
                            value={totalPackageCost}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomCheckBox
                            name="isSubventionPackage"
                            label={formatMessage({ id: "subvention-package" })}
                            control={control}
                            error={errors.isSubventionPackage}
                        />
                    </Grid>
                    {(watch("isSubventionPackage") === 1 ||
                        watch("isSubventionPackage") === true) && (
                            <Grid item xs={12}>
                                <CustomSelect
                                    options={merchantOptions}
                                    label={formatMessage({ id: "merchant" })}
                                    name="packageMerchants"
                                    control={control}
                                    multiple
                                    error={errors.packageMerchants}
                                    rules={{ required: true }}
                                />
                            </Grid>
                        )}
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreatePackageModal;