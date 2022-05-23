import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Header from "pages/clinical/Header";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Grid from "@material-ui/core/Grid";
import {CustomClinicalActionHeaderWithWrap} from 'pages/clinical/CustomClinicalActionHeader';

import { getFormBody } from "utils/global";
import { RadioButton } from "components/forms";
import { services } from "utils/services";
import { RootReducerState } from 'utils/types';
import { CustomSelect, CustomTextBox } from "components/forms";
import { useCreateLookupOptions, useToastMessage } from "utils/hooks";
import { getPrescriptionLookUp } from 'redux/actions';

function PrescriptionAllMedicationView() {
    const location = useLocation<any>();
    const dispatch = useDispatch();
    const history = useHistory();
    const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [isEditOn, setIsEditOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPatient, setIsPatient] = useState(true);


    let prescriptionData = location.state ?? {};
    const { prescriptionLookupData } = useSelector(
        ({ prescriptionLookupReducer }: RootReducerState) => ({
            prescriptionLookupData: prescriptionLookupReducer.data
        }),
        shallowEqual
    );

    let selectOptions = useCreateLookupOptions(prescriptionLookupData);

    useEffect(() => {
        dispatch(getPrescriptionLookUp());
    }, []);

    useEffect(() => {
        if (prescriptionData?.id && Object.keys(prescriptionLookupData).length) {
            onEdit();
        }
    }, [prescriptionData?.id && Object.keys(prescriptionLookupData).length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: prescriptionData?.id ?? 1,
        };
        setLoading(true);
        let prescriptionService = services[(prescriptionData?.id ? 'updatePrescription' : 'createPrescription') as keyof typeof services];
        prescriptionService(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
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

    function onDelete() {
        const parms = {
            PartnersId: prescriptionData?.id ?? 1,
        }
        setLoading(true);
        services.deleteVital(parms)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    setIsEditOn(false);
                    resetForm();
                    toastMessage(formatMessage({ id: "delete-message" }));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onEdit() {
        let paramsData = {
            Id: prescriptionData?.id ?? 1
        };
        setLoading(true);
        services.getPrescriptionById(paramsData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    setIsEditOn(true);
                    reset(res.data.response);
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function resetForm() {
        reset({});
    }
    function onPrint() { }
    function onNext() { }
    function onPrevious() { }

    return (
        <CustomClinicalActionHeaderWithWrap
        title={formatMessage({ id: "new-prescription-partner" })}
        onSave={handleSubmit(onSubmit)}
        saveButtonProps={{
          // disabled: !vitalData?.id,
        }}
        goBack={() => history.goBack()}
        backButtonProps={{ label: formatMessage({ id: "summary" }) }}
      >
            <Box padding={2} component={Paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={12} md={12} sm={12}>
                        <RadioButton
                            label="Patient"
                            name="isNoKnowAllergy"
                            onChange={() => {
                                setIsPatient(true);
                            }}
                            checked={isPatient}
                        />
                        <RadioButton
                            label="Partner"
                            name="isAllergiesHistory"
                            onChange={() => {
                                setIsPatient(false);
                            }}
                            checked={!isPatient}
                        />
                    </Grid>
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table" size="small">
                            <TableHead >
                                <TableRow>
                                    <TableCell style={{ width: "2%" }}>
                                        <FormattedMessage id="s-no" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="brand-name" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="generic-name" />
                                    </TableCell>
                                    <TableCell style={{ width: "3%" }}>
                                        <FormattedMessage id="route" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="strength" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="dosage" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="frequency" />
                                    </TableCell>
                                    <TableCell style={{ width: "8%" }} colSpan={2} align="center">
                                        <FormattedMessage id="duration" />
                                    </TableCell>
                                    <TableCell style={{ width: "5%" }}>
                                        <FormattedMessage id="instructions" />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        1
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={selectOptions?.medication ?? []}
                                            label=""
                                            name="medicationId"
                                            control={control}
                                            error={errors.medicationId}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="genericName"
                                            control={control}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={selectOptions?.prescriptionRoute ?? []}
                                            label=""
                                            name="prescriptionRouteId"
                                            control={control}
                                            error={errors.prescriptionRouteId}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={selectOptions?.strengthUnit ?? []}
                                            label=""
                                            name="strengthUnitId"
                                            control={control}
                                            error={errors.strengthUnitId}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="dosage"
                                            control={control}
                                            error={errors.dosage}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={selectOptions?.prescriptionFrequency ?? []}
                                            label=""
                                            name="prescriptionFrequencyId"
                                            control={control}
                                            error={errors.prescriptionFrequencyId}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="duration"
                                            control={control}
                                            error={errors.duration}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="durationUnit"
                                            control={control}
                                            error={errors.durationUnit}

                                        />
                                    </TableCell>

                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="instruction"
                                            control={control}
                                            error={errors.instruction}
                                        // rules={validationRule.textbox({ type: "number" })}
                                        />
                                    </TableCell>


                                </TableRow>

                                {/* row 2 */}

                                <TableRow>
                                    <TableCell>
                                        2
                                    </TableCell>

                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="medicationId"
                                            control={control}
                                            error={errors.medicationId}

                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="parentalConsanguinityFemale"
                                            control={control}

                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="prescriptionRouteId"
                                            control={control}
                                            error={errors.prescriptionRouteId}

                                        />
                                    </TableCell>

                                    {/* strength */}
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="strengthUnitId"
                                            control={control}
                                            error={errors.strengthUnitId}

                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="dosage"
                                            control={control}
                                            error={errors.dosage}
                                        // rules={validationRule.textbox({ type: "number" })}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="prescriptionFrequencyId"
                                            control={control}
                                            error={errors.prescriptionFrequencyId}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="duration"
                                            control={control}
                                            error={errors.duration}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomSelect
                                            options={[]}
                                            label=""
                                            name="durationUnit"
                                            control={control}
                                            error={errors.durationUnit}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: "4px" }}>
                                        <CustomTextBox
                                            label=""
                                            name="instruction"
                                            control={control}
                                            error={errors.instruction}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Box>
        </CustomClinicalActionHeaderWithWrap>
    )
};
export default PrescriptionAllMedicationView;