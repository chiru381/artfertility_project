import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { stimulationMenuList } from "utils/constants/menu";
import { CustomClinicalTabActionHeaderWithWrap } from "../CustomClinicalActionHeader";
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId } from 'utils/hooks';
import { CustomSelect, TextBox, CustomTextBox, CustomDatePicker, CustomCheckBoxGroup, CustomRadioGroup, CustomTimePicker } from 'components/forms';
import { RootReducerState } from 'utils/types';
import StimulationInfoForm from './StimulationInfoForm'

let preparation = [
    { label: "OCP", startDate: '', endDate: "" },
    { label: "Duphaston", startDate: '', endDate: "" },
    { label: "Estradiol", startDate: '', endDate: "" },
    { label: "Antagonist Priming", startDate: '', endDate: "" },
    { label: "Deca 3.75 1st dose", startDate: '', endDate: "" },
    { label: "Deca 3.75 2nd dose", startDate: '', endDate: "" },
    { label: "Deca 3.75 3rd dose", startDate: '', endDate: "" },
]

export const stimulationDetailRadioGroup = [
    { value: 'iuitoivf', label: "IUI to IVF" },
    { value: 'ivftoiui', label: "IVF to IUI" }
]

interface Props {

}

const Stimulation = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm({ mode: 'all' });
    const plannedProcessId = useGetOngoingTreatmentProcessId();
    const { formatMessage } = useIntl();

    const { treatmentPlanLookupData } = useSelector(
        ({ treatmentPlanLookupReducer }: RootReducerState) => {
            return ({
                treatmentPlanLookupData: treatmentPlanLookupReducer.data
            })
        },
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(treatmentPlanLookupData);

    return (
        <CustomClinicalTabActionHeaderWithWrap
            menuList={stimulationMenuList}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={2}>

                    <StimulationInfoForm
                        control={control}
                    />

                    <Grid item xs={12}>
                        <Box style={{ background: "#F9F9F9", border: "1px solid #707070", borderRadius: "7px", overflow: "hidden" }}>
                            <Box padding={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} lg={2} md={3} sm={4}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "amh-validated" })}
                                            name="patientType"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={6} lg={2} md={3} sm={4}>
                                        <CustomDatePicker
                                            label={formatMessage({ id: "amh-date" })}
                                            name="patientType"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item lg={3} sm={6} xs={12}>
                                        <Grid container spacing={2} alignItems='center'>
                                            <Grid item xs={2}>
                                                <span className='text-14 font-bold' style={{ float: "right" }}>MP:</span>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "interval" })}
                                                    name="patientType"
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "duration" })}
                                                    name="patientType"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={5} sm={6} xs={12}>
                                        <Grid container spacing={2} alignItems='center' justify='flex-end'>
                                            <span className='text-14 font-bold' style={{ float: "right" }}>#Antral Follicles:</span>
                                            <Grid item xs={3}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "right" })}
                                                    name="patientType"
                                                    control={control}
                                                />
                                            </Grid>
                                            <span>+</span>
                                            <Grid item xs={3}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "left" })}
                                                    name="patientType"
                                                    control={control}
                                                />
                                            </Grid>
                                            <span>=</span>
                                            <Grid item xs={3}>
                                                <CustomTextBox
                                                    label={formatMessage({ id: "total" })}
                                                    name="patientType"
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Grid container spacing={0}>
                                <Grid item xs={4} style={{display: "flex"}}>
                                    <div style={{ border: "1px solid #C1C1C1", width: '100%' }}>
                                        <div style={{ padding: '10px', background: '#EEFAFE', textAlign: "center", borderBottom: "1px solid #C1C1C1" }}>
                                            <span className="text-14 font-bold">
                                                <FormattedMessage id="preparation" />
                                            </span>
                                        </div>

                                        <div style={{ padding: '11px' }} className='stimulation-preparation-table'>
                                            <TableContainer style={{ whiteSpace: "nowrap" }}>
                                                <Table size="small">
                                                    <TableHead style={{ background: "unset" }}>
                                                        <TableRow>
                                                            <TableCell></TableCell>
                                                            <TableCell className="text-13 font-regular">Start Date</TableCell>
                                                            <TableCell className="text-13 font-regular">End Date</TableCell>
                                                            <TableCell className="text-13 font-regular">Day</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        {preparation.map((item, index: number) => {
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell className="text-13 font-regular">{item.label}</TableCell>
                                                                    <TableCell></TableCell>
                                                                    <TableCell></TableCell>
                                                                    <TableCell></TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>

                                            <Grid container spacing={2} style={{ marginTop: "11px" }}>
                                                <Grid item xs={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "planning-hysteroscopy" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomDatePicker
                                                        label={formatMessage({ id: "date" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </div>
                                </Grid>

                                <Grid item xs={5} style={{display: "flex"}}>
                                    <div style={{ border: "1px solid #C1C1C1", width: '100%' }}>
                                        <div style={{ padding: '10px', background: '#EEFAFE', textAlign: "center", borderBottom: "1px solid #C1C1C1" }}>
                                            <span className="text-14 font-bold">
                                                <FormattedMessage id="stimulation-details" />
                                            </span>
                                        </div>

                                        <div style={{ padding: '11px' }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "protocol" })}
                                                        name="patientType"
                                                        control={control}
                                                        options={[]}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "stimulated-by" })}
                                                        name="patientType"
                                                        control={control}
                                                        options={[]}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "clinic" })}
                                                        name="patientType"
                                                        control={control}
                                                        options={[]}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "referral-doctor" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <CustomDatePicker
                                                        label={formatMessage({ id: "lmp-1" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <CustomDatePicker
                                                        label={formatMessage({ id: "lmp-2" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "beginning-stimulation" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "observation-for-stimulation" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "recruited-for-studies" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomRadioGroup
                                                        name="patientType"
                                                        control={control}
                                                        groupList={stimulationDetailRadioGroup}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>

                                    </div>
                                </Grid>

                                <Grid item xs={3} style={{display: "flex"}}>
                                    <div style={{ border: "1px solid #C1C1C1", width: '100%' }}>
                                        <div style={{ padding: '10px', background: '#EEFAFE', textAlign: "center", borderBottom: "1px solid #C1C1C1" }}>
                                            <span className="text-14 font-bold">
                                                <FormattedMessage id="final-oocyte-maturation" />
                                            </span>
                                        </div>

                                        <div style={{ padding: '11px' }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <CustomDatePicker
                                                        label={formatMessage({ id: "trigger-date" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomTimePicker
                                                        label={formatMessage({ id: "time" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomSelect
                                                        label={formatMessage({ id: "type-maturation" })}
                                                        name="patientType"
                                                        control={control}
                                                        options={[]}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomTextBox
                                                        label={formatMessage({ id: "duration" })}
                                                        name="duration"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomDatePicker
                                                        label={formatMessage({ id: "pickup-date" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <CustomTimePicker
                                                        label={formatMessage({ id: "time" })}
                                                        name="patientType"
                                                        control={control}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TableContainer style={{ whiteSpace: "nowrap" }} className='final-oocyte-table'>
                                                        <Table size="small">
                                                            <TableHead style={{ background: "unset" }}>
                                                                <TableRow>
                                                                    <TableCell className="text-13 font-medium">Trigger medication</TableCell>
                                                                    <TableCell className="text-13 font-medium">Via</TableCell>
                                                                    <TableCell className="text-13 font-medium">Date</TableCell>
                                                                </TableRow>
                                                            </TableHead>

                                                            <TableBody>
                                                                {[1, 2, 3].map((item, index: number) => {
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell></TableCell>
                                                                            <TableCell></TableCell>
                                                                            <TableCell></TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>

                                            </Grid>
                                        </div>

                                    </div>
                                </Grid>

                            </Grid>

                        </Box>
                    </Grid>


                </Grid>
            </Box>
        </CustomClinicalTabActionHeaderWithWrap>
    )
}

export default Stimulation;