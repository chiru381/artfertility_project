import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PlusOne from '@material-ui/icons/AddCircle';
import Delete from '@material-ui/icons/Delete';

import { CustomTextBox, TextBox, Select, DatePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { emiSchemeOptions } from "utils/constants";

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateMerchantModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [merchantBreakupModels, setMerchantBreakupModels] = useState<any>([]);

    function handleAddMoreClick() {
        setMerchantBreakupModels([
            ...merchantBreakupModels,
            {
                id: 0,
                effectiveFrom: null,
                effectiveTo: null,
                subventionCharges: 0,
                emiSchemeId: 0,
                emiSchemeName: ""
            }
        ]);
    }

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            merchantBreakupModels: merchantBreakupModels
        }
        setLoading(true);
        services.createMerchant(bodyData)
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

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "create-merchant" })}
                modalSize="medium"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "merchant-name" })}
                            name="name"
                            control={control}
                            error={errors.merchantname}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "merchant-contact" })}
                            name="telephone"
                            control={control}
                            error={errors.telephone}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "merchant-address" })}
                            name="address"
                            control={control}
                            error={errors.address}
                        />
                    </Grid>

                    {merchantBreakupModels?.map((record: any, index: any) => {
                        return (
                            <Grid item xs={12} key={index} style={{ position: "relative" }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} lg={5} md={6} sm={6}>
                                        <Select
                                            label={formatMessage({ id: "emi-scheme" })}
                                            options={emiSchemeOptions}
                                            onChange={(_, data: any) => {
                                                let newList = merchantBreakupModels?.map((item: any, idx: any) => ({
                                                    ...item,
                                                    emiSchemeId: index === idx ? data?.value : item.emiSchemeId
                                                }))
                                                setMerchantBreakupModels(newList)
                                            }}

                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={5} md={6} sm={6}>
                                        <TextBox
                                            label={formatMessage({ id: "subvention-charges" })}
                                            onChange={(e: any) => {
                                                let newList = merchantBreakupModels?.map((item: any, idx: any) => ({
                                                    ...item,
                                                    subventionCharges: index === idx ? e.target?.value : item.subventionCharges
                                                }))
                                                setMerchantBreakupModels(newList)
                                            }} 
                                            type="number"
                                            value={record.subventionCharges}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                        <DatePicker
                                            label={formatMessage({ id: "effective-from-date" })}
                                            onChange={(_, data: any) => {
                                                let newList = merchantBreakupModels?.map((item: any, idx: any) => ({
                                                    ...item,
                                                    effectiveFrom: index === idx ? data : item.effectiveFrom
                                                }))
                                                setMerchantBreakupModels(newList)
                                            }}
                                            value={record.effectiveFrom}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={4} md={4} sm={6}>
                                        <DatePicker
                                            label={formatMessage({ id: "effective-to-date" })}
                                            onChange={(_, data: any) => {
                                                let newList = merchantBreakupModels?.map((item: any, idx: any) => ({
                                                    ...item,
                                                    effectiveTo: index === idx ? data : item.effectiveTo
                                                }))
                                                setMerchantBreakupModels(newList)
                                            }}
                                            value={record.effectiveTo}
                                        />
                                    </Grid>
                                    {merchantBreakupModels.length > 1 && (
                                        <Grid item xs={12} lg={2} md={4} sm={6}>
                                            <Button onClick={() => {
                                                let data = merchantBreakupModels?.filter((item: any, idx: any) => idx !== index)
                                                setMerchantBreakupModels(data)
                                            }}
                                                variant="contained" color="secondary">
                                                <Delete />
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                        )
                    })
                    }
                    <Grid item xs={12} md={9}>
                        <Button
                            onClick={handleAddMoreClick}
                            variant="contained"
                            color="primary"
                            endIcon={<PlusOne />}
                        >Add More</Button>
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}

        </>
    )
}

export default CreateMerchantModal;