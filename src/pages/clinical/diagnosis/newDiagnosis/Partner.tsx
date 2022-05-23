import React from 'react'
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { CustomSelect, CustomTextBox, RadioButton, CustomDatePicker, CustomCheckBox, } from "components/forms";
import { useToastMessage } from "utils/hooks";
import { SecondaryButton, TableEditButton, TableDeleteButton, TableButtonGroup } from 'components/button';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { useTheme } from '@material-ui/core/styles';
import { HoverLoader, SimpleTable } from 'components';
import { masterPaginationServices, diagnosisPatientProcessColumn, diagnosisStatusOptions } from 'utils/constants';
import { getMasterPaginationData } from "redux/actions";
import { useGetPatientId } from 'utils/hooks';
import { RootReducerState } from 'utils/types';

interface Props {

}

const DiagnosisPatient = (props: Props) => {

    const location = useLocation<any>();
    const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });
    const history = useHistory();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const theme = useTheme();
    const dispatch = useDispatch();

    let patientId = useGetPatientId();

    const { diagnosisSummaryData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                diagnosisSummaryData: masterPaginationReducer[masterPaginationServices.diagnosisProcess].data,
                loading: masterPaginationReducer[masterPaginationServices.diagnosisProcess].loading
            })
        },
        shallowEqual
    );

    const { modelItems } = diagnosisSummaryData;

    useEffect(() => {
        let params = { patientId };
        dispatch(getMasterPaginationData(masterPaginationServices.diagnosisProcess, params));
    }, []);

    function onSubmit() {

    }
    function handleRowClick(rowData: any) {
        history.push(`general`, { ...rowData });
    }

    function onDelete(data: any) {
    }

    let tableRows = modelItems.map((item: any) => {
        return ({
            ...item,
            action: <TableButtonGroup>
                <TableEditButton
                    tooltipLabel="Edit"
                    onClick={() => handleRowClick(item)}
                />
                <TableDeleteButton
                    tooltipLabel="Delete"
                    onClick={() => onDelete(item)}
                />
            </TableButtonGroup>
        })
    }

    )

    return (
        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "diagnosis-partner" })}
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
                        <Box>
                            <h3 className="patientName">
                                <FormattedMessage id="partner" />
                            </h3>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={2} md={4} sm={6}>
                        <CustomDatePicker
                            label={formatMessage({ id: "start-date" })}
                            name="diagnosisDate"
                            control={control}
                            error={errors.diagnosisDate}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "start-age" })}
                            name="patientAge"
                            control={control}
                            error={errors.patientAge}
                        // rules={validationRule.textbox({ type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12} lg={2} md={3} sm={6}>
                        <CustomSelect
                            options={[]}
                            label={formatMessage({ id: "professional" })}
                            name="professionalId"
                            control={control}
                            error={errors.professionalId}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "clinic" })}
                            name="workingCenter"
                            control={control}
                            error={errors.workingCenter}
                        // rules={validationRule.textbox({ type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3} md={4} sm={6}>
                        <CustomSelect
                            options={diagnosisStatusOptions}
                            label={formatMessage({ id: "status" })}
                            name="diagnosisStatus"
                            control={control}
                            error={errors.diagnosisStatus}
                        />
                    </Grid>
                    <Grid item xs={12} lg={10} md={8} sm={8}>
                        <Box>
                            <h3 className="patientName">
                                <FormattedMessage id="add-diagnosis" />
                            </h3>
                        </Box>
                    </Grid>
                    <SecondaryButton
                        label="Add New Diagnosis"
                        onClick={() => history.push('/create')}
                        name="addICDDiagnosises"
                        // control={control}
                        // error={errors.addICDDiagnosises}
                        style={{ margin: "18px 10px" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SimpleTable
                        columns={diagnosisPatientProcessColumn}
                        // colSpans={[80, 10, 10]}
                        tableData={tableRows}
                    />
                </Grid>
            </Box>
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default DiagnosisPatient;