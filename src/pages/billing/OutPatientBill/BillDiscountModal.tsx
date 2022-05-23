import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

import { CheckBox, CustomSelect, CustomTextBox, TextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { floatNumConv, getFormBody, regExp, validationRule } from 'utils/global';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';
import { ButtonGroup, PrimaryButton } from 'components/button';
import { services } from 'utils/services';

interface Props {
    closeModal: () => void;
    setServiceItem: React.Dispatch<React.SetStateAction<{ [key: string]: any }[]>>;
    serviceItem: { [key: string]: any }[];
}


const BillDiscountModal = (props: Props) => {
    const { closeModal, serviceItem, setServiceItem } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [discountApplicableToAll, setDiscountApplicableToAll] = useState(false);
    const [discountServiceItem, setDiscountServiceItem] = useState<{ [key: string]: any }[]>(serviceItem);
    const [loading, setLoading] = useState(false);

    const { billingLookupData } = useSelector(
        ({ billingLookupReducer }: RootReducerState) => {
            return ({
                billingLookupData: billingLookupReducer.data,
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);

    useEffect(() => {
        if (selectOptions?.discountTypes?.length && serviceItem.length) {
            let { discountReasonId, discountTypeId, roleId, discountPerchantage } = serviceItem[0];
            setValue('discountReasonId', selectOptions?.discountReasons?.find((options: any) => (+options.value === +discountReasonId)) ?? null);
            setValue('discountTypeId', selectOptions?.discountTypes?.find((options: any) => (+options.value === +discountTypeId)) ?? null);
            setValue('roleId', selectOptions?.roles?.find((options: any) => (+options.value === +roleId)) ?? null);
            if (+discountTypeId === 2) {
                setValue('discountPerchantage', discountPerchantage);
            }
        } else {
            setValue('discountTypeId', selectOptions?.discountTypes[0]);
        }
    }, [selectOptions?.discountTypes]);

    const handleSameDiscountForAllService = () => {
        let discountPerchantage = discountServiceItem[0]?.discountPerchantage;
        const newList = discountServiceItem.map((item) => ({
            ...item,
            discountPerchantage,
            discountAmount: floatNumConv((discountPerchantage / 100) * item.serviceAmount)
        }));
        setDiscountServiceItem(newList);
    }

    const handleDiscountChange = (value: any, index: number) => {
        if (!value) {
            const newList = discountServiceItem.map((item: any, i: number) => {
                if (index === i) {
                    return ({
                        ...item,
                        discountPerchantage: null,
                        discountAmount: null
                    })
                }
                return item;
            });

            setDiscountServiceItem(newList);
        } else if ((+value > 100 || +value < 0 || !regExp.numberWithDecimal.test(value))) {

        } else {
            const newList = discountServiceItem.map((item: any, i: number) => {
                return ({
                    ...item,
                    discountPerchantage: discountApplicableToAll ? value : (index === i ? value : item.discountPerchantage),
                    discountAmount: discountApplicableToAll ? floatNumConv((value / 100) * item.serviceAmount) : (index === i ? floatNumConv((value / 100) * item.serviceAmount) : item.discountAmount)
                })
            });

            setDiscountServiceItem(newList);
        }
    }

    function onSubmit({ discountPerchantage, ...rest }: any) {
        let formBody = getFormBody(rest)

        let params = {
            roleId: formBody.roleId,
            DiscountTypeId: formBody.discountTypeId,
            discountReasonId: formBody.discountReasonId
        };
        console.log({params})
        setLoading(true);
        services.checkOPBillMaxDiscount(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    setServiceItem(discountServiceItem.map(service => {
                        let item = {
                            ...service,
                            ...formBody
                        }
                        if (discountPerchantage) {
                            item = {
                                ...item,
                                discountPerchantage: +discountPerchantage,
                                discountAmount: floatNumConv(((+discountPerchantage / 100) * service.serviceAmount))
                            }
                        }
                        return item;
                    }));
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

    function onReset() {
        let resetValue = {
            discountReasonId: null,
            discountTypeId: null,
            roleId: null,
            discountPerchantage: null
        };
        reset(resetValue);
        setServiceItem(discountServiceItem.map(service => ({
            ...service,
            ...resetValue,
            discountPerchantage: null,
            discountAmount: null
        })))
    }

    function CustomFooter() {
        return (
            <ButtonGroup>
                <PrimaryButton
                    label={formatMessage({ id: "reset" })}
                    onClick={onReset}
                />
                <PrimaryButton
                    label={formatMessage({ id: "add-discount" })}
                    onClick={handleSubmit(onSubmit)}
                />
            </ButtonGroup>
        )
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                title={formatMessage({ id: "discount" })}
                modalSize="medium"
                customFooter={CustomFooter()}
            >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <CustomSelect
                            label={formatMessage({ id: "discount-reason" })}
                            options={selectOptions?.discountReasons ?? []}
                            control={control}
                            name="discountReasonId"
                            error={errors.discountReasonId}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomSelect
                            label={formatMessage({ id: "discount-type" })}
                            options={selectOptions?.discountTypes ?? []}
                            control={control}
                            name="discountTypeId"
                            error={errors.discountTypeId}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomSelect
                            label={formatMessage({ id: "discount-authorized-by" })}
                            options={selectOptions?.roles ?? []}
                            control={control}
                            name="roleId"
                            error={errors.roleId}
                            rules={{ required: true }}
                        />
                    </Grid>

                    {watch('discountTypeId')?.value === "2" && (
                        <Grid item xs={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "discount-percent" })}
                                name="discountPerchantage"
                                control={control}
                                error={errors.discountPerchantage}
                                type="number"
                                rules={validationRule.textbox({ required: true, type: "numberWithDecimal", min: 0, max: 100 })}
                            />
                        </Grid>
                    )}


                    {watch('discountTypeId')?.value === "1" && (
                        <Grid item xs={12}>
                            <CheckBox
                                label={formatMessage({ id: "discount-applicable-to-all" })}
                                checked={discountApplicableToAll}
                                onChange={(e: any) => {
                                    let status = e.target.checked;
                                    setDiscountApplicableToAll(status);
                                    if (status) {
                                        handleSameDiscountForAllService();
                                    }
                                }}
                                name="isSameTimeForAllDays"
                                style={{ margin: "4px 0" }}
                            />

                            <TableContainer component={Paper} elevation={1}>
                                <Table aria-label="sticky table">
                                    <TableHead style={{ background: "#DFE8FF" }}>
                                        <TableRow>
                                            <TableCell><strong>#</strong></TableCell>
                                            <TableCell><strong>{formatMessage({ id: "service-name" })}</strong></TableCell>
                                            {/* <TableCell><strong>{formatMessage({ id: "discount-applicable" })}</strong></TableCell> */}
                                            <TableCell><strong>{formatMessage({ id: "discount" })} %</strong></TableCell>
                                            <TableCell><strong>{formatMessage({ id: "discount-amount" })}</strong></TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {discountServiceItem.map((service, index) => {
                                            return (
                                                <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{service.serviceItemName}</TableCell>
                                                    <TableCell>
                                                        <TextBox
                                                            value={service.discountPerchantage}
                                                            inputProps={{
                                                                style: {
                                                                    padding: "6px 8px"
                                                                }
                                                            }}
                                                            onChange={e => handleDiscountChange(e.target.value, index)}
                                                            type="number"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{service.discountAmount}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}

                </Grid>
            </FormModal>

            {loading && <HoverLoader/>}

        </>
    )
}

export default BillDiscountModal;