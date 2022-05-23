import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'

import { validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';

import { FormModal } from 'components/FormModal';
import { CustomTextBox } from 'components/forms';
import { useCreateLookupOptions } from 'utils/hooks';

interface Props {
    dynamiccopayData: any;
    setDynamiccopayData: any;
}

const DynamicCoPayCalculation = (props: Props) => {
    const { formatMessage } = useIntl();
    const [dynamicPayModalOpen, setDynamicPaymodalOpen] = useState(false);

    return (
        <>
            <Grid item xs={12}>
                <Link
                    component="button"
                    variant="body1"
                    underline="always"
                    color="textPrimary"
                    onClick={() => setDynamicPaymodalOpen(true)}
                    style={{ marginLeft: "15px" }}
                >{formatMessage({ id: "dynamic-co-pay" })}</Link>
            </Grid>

            {dynamicPayModalOpen && (
                <DynamiccopayModal
                    closeModal={() => setDynamicPaymodalOpen(false)}
                    {...props}
                />
            )}
        </>
    )
}

export default DynamicCoPayCalculation;


const DynamiccopayModal = ({ closeModal, dynamiccopayData, setDynamiccopayData }: any) => {
    const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: 'all' });
    const insurancePlans = useFieldArray({ control, name: 'insurancePlans' });
    const { formatMessage } = useIntl();

    const { patientLookupData } = useSelector(
        ({ patientLookupReducer }: RootReducerState) => {
            return ({
                patientLookupData: patientLookupReducer.data
            })
        },
        shallowEqual
    );

    // filtering blank record and formating for dropdown
    let selectOptions = useCreateLookupOptions(patientLookupData);

    useEffect(() => {
        if (dynamiccopayData.length) {
            reset({
                'insurancePlanName': dynamiccopayData[0].insurancePlanName,
                'insurancePlans': dynamiccopayData.map((copay: any) => ({
                    ...copay,
                    deductibaleAmount: +copay.deductibaleAmount,
                    coPayPerchantage: +copay.coPayPerchantage,
                    coPayAmount: +copay.coPayAmount,
                    maximumCoPay: +copay.maximumCoPay
                }))
            })
        } else {
            reset({
                'insurancePlans': selectOptions?.serviceCategory?.map((service: any) => ({
                    'serviceCategoryName': service.label,
                    'serviceCategoryId': service.value,
                    deductibaleAmount: 0,
                    coPayPerchantage: 0,
                    coPayAmount: 0,
                    maximumCoPay: 0
                }))
            })
        }
    }, [])


    function onSubmit(data: any) {
        setDynamiccopayData(data.insurancePlans.map((plan: any) => ({ ...plan, insurancePlanName: data.insurancePlanName })));
        closeModal();
    }

    return (
        <FormModal
            onCancel={closeModal}
            modalSize="medium"
            onConfirm={handleSubmit(onSubmit)}
            title={formatMessage({ id: "dynamic-co-pay" })}
        >
            <>
                <CustomTextBox
                    label={formatMessage({ id: "plan-name" })}
                    error={errors.insurancePlanName}
                    name="insurancePlanName"
                    control={control}
                    rules={{ required: true }}
                />

                <TableContainer style={{ marginTop: "25px" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{formatMessage({ id: "service-category" })}</TableCell>
                                <TableCell>{formatMessage({ id: "co-pay-percent" })}</TableCell>
                                <TableCell>{formatMessage({ id: "co-pay-amount" })}</TableCell>
                                <TableCell>{formatMessage({ id: "max-co-pay" })}</TableCell>
                                <TableCell>{formatMessage({ id: "deductable" })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {insurancePlans.fields.map((field: any, index) => {
                                return (
                                    <TableRow hover key={field.id} role="checkbox" tabIndex={-1} >
                                        <TableCell> {field.serviceCategoryName} </TableCell>
                                        <TableCell>
                                            <CustomTextBox
                                                rules={{ ...validationRule.textbox({ type: 'number' }), validate: val => (val >= 0 && val <= 100) || "invalid" }}
                                                control={control}
                                                name={`insurancePlans[${index}][coPayPerchantage]`}
                                                error={errors?.[`insurancePlans`]?.[index]?.['coPayPerchantage']}
                                                type="number"
                                                disabled={watch(`insurancePlans[${index}][coPayAmount]`) ? true : false}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CustomTextBox
                                                rules={validationRule.textbox({ type: 'number' })}
                                                control={control}
                                                name={`insurancePlans[${index}][coPayAmount]`}
                                                error={errors?.[`insurancePlans`]?.[index]?.['coPayAmount']}
                                                type="number"
                                                disabled={watch(`insurancePlans[${index}][coPayPerchantage]`) ? true : false}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CustomTextBox
                                                rules={validationRule.textbox({ type: 'number' })}
                                                control={control}
                                                name={`insurancePlans[${index}][maximumCoPay]`}
                                                error={errors?.[`insurancePlans`]?.[index]?.['maximumCoPay']}
                                                type="number"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <CustomTextBox
                                                rules={validationRule.textbox({ type: 'number' })}
                                                control={control}
                                                name={`insurancePlans[${index}][deductibaleAmount]`}
                                                error={errors?.[`insurancePlans`]?.[index]?.['deductibaleAmount']}
                                                type="number"
                                            />
                                        </TableCell>

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </FormModal>
    )
}