import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import Print from '@material-ui/icons/Print';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import Modal from '@material-ui/core/Modal';

import { CustomTextBox, CustomCheckBox, CustomDatePicker } from 'components/forms';
import { SaveButton, SecondaryButton, PrimaryButton } from 'components/button';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import { FormPrimaryHeading } from 'components/forms';
import { RichTextEditor } from 'components/forms/RichTextEditor';
import { ReactComponent as AuthorityIcon } from 'assets/images/icons/authority-icon.svg';
import { getFormBody } from 'utils/global';

const ResultEntry = React.memo(() => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const history = useHistory();
    const { toastMessage } = useToastMessage();
    const location = useLocation<any>();
    const [template, setTemplate] = useState('');
    const [loading, setLoading] = useState(false);
    const { fields, append, remove } = useFieldArray({ control, name: 'upsertComponentResultEntries' });

    let testOrderData = location.state ?? {};

    useEffect(() => {
        if (testOrderData) {
            onGetResultEntryByTestOrderDetailIdApiCall();
        }
    }, [testOrderData]);

    function onGetResultEntryByTestOrderDetailIdApiCall() {
        
        let requestData = {
            patientAgeInYear: testOrderData.patientAgeInYear,
            testOrderId: testOrderData.testOrderId,
            testOrderDetailId: testOrderData.id,
            patientGenderId: testOrderData.testOrderPatientGenderId
        }

        services.getResultEntryByTestOrderDetailId(requestData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    let data = res.data.response;
                    reset({ ...data, 'upsertComponentResultEntries': data?.upsertComponentResultEntries });
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: testOrderData.id,
            testStatusId: testOrderData.testStatusId,
            upsertComponentResultEntries: [
                {
                    id: 0,
                    isTemplateResult: true,
                    result: "",
                    templateResult: "",
                    referenceRange: "",
                    sequenceno: 0,
                    testOrderDetailId: testOrderData.testOrderDetailId,
                    testId: testOrderData.testId,
                    profileId: testOrderData.profileId,
                    componentId: 0
                }
            ]
        }

        setLoading(true);
        services.createResultEntry(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "update-message" }));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onSubmitAndRelease(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: testOrderData.id,
            testStatusId: testOrderData.testStatusId
        }

        setLoading(true);
        services.createAndReleaseResultEntry(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "result-release-message" }));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onAuthorization(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: testOrderData.id,
            testStatusId: testOrderData.testStatusId,
            upsertComponentResultEntries: [
                {
                    id: 0,
                    isTemplateResult: true,
                    result: "",
                    templateResult: "",
                    referenceRange: "",
                    sequenceno: 0,
                    testOrderDetailId: 0,
                    testId: 0,
                    profileId: 0,
                    componentId: 0
                }
            ]
        }
        setLoading(true);
        services.authorizeResultEntry(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "authorize-result-message" }));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onPrint() {

    }

    function onReset() {
        if (testOrderData) {
            onGetResultEntryByTestOrderDetailIdApiCall();
        }
    }

    function closeModal() {
        history.goBack();
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={testOrderData?.IsAuthorization ? "RESULT ENTRY AUTHORIZATION" : "RESULT ENTRY"} />
                            <CustomFooter
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                onPrint={onPrint}
                                onSubmitAndRelease={onSubmitAndRelease}
                                onAuthorization={onAuthorization}
                                onReset={onReset}
                                closeModal={() => {
                                    closeModal();
                                }}
                                IsAuthorization={testOrderData?.IsAuthorization}
                            />
                        </div>
                        <div className="full-modal-body-container">
                            <Grid container spacing={1}>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "uhid" })}
                                        name="testOrderPatientUHID"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "chn" })}
                                        name="partnerCHN"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "clinic" })}
                                        name="testOrderClinicName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "patient-name" })}
                                        name="testOrderPatientFullName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "gender" })}
                                        name="testOrderPatientGenderName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "current-ageinyears" })}
                                        name="patientAgeInYear"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "mobile" })}
                                        name="testOrderPatientTelephone"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "treating-doctor" })}
                                        name="testOrderPatientDoctorUserDisplayName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "partner-name" })}
                                        name="partnerName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "patient-note" })}
                                        name="testOrderPatientPatientNote"
                                        control={control}
                                        multiline
                                        rows={4}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <FormGroup>
                                        <CustomCheckBox
                                            name="testOrderPatientIsVIP"
                                            label={formatMessage({ id: "vip" })}
                                            control={control}
                                            disabled
                                        />
                                    </FormGroup>
                                </Grid>

                                <Grid item xs={12}>
                                    <h3 className="formHeading">
                                        <FormattedMessage id="sample-information" />
                                    </h3>
                                </Grid>

                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomDatePicker
                                        control={control}
                                        label={formatMessage({ id: "sample-collection-date" })}
                                        name="collectionDate"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomDatePicker
                                        control={control}
                                        label={formatMessage({ id: "sample-receiving-date" })}
                                        name="receivingdatetime"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomDatePicker
                                        control={control}
                                        label={formatMessage({ id: "result-date" })}
                                        name="testDoneDate"
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <h3 className="formHeading">
                                        <FormattedMessage id="report-status" />
                                    </h3>
                                </Grid>
                                
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "report-status" })}
                                        name="testStatusName"
                                        disabled
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <h3 className="formHeading">
                                        <FormattedMessage id="resulting-test-name" />
                                    </h3>
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "test-name" })}
                                        name="testName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "lab-number" })}
                                        name="labNumber"
                                        control={control}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <h3 className="formHeading">
                                        <FormattedMessage id="test-components" />
                                    </h3>
                                </Grid>
                                {
                                    <Grid container spacing={2} item xs={12} lg={3} md={4} sm={6}>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "cholestrol" })}
                                                name="totalcholestrol"
                                                control={control}
                                                error={errors.totalcholestrol}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            100-200%
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "hdl-c" })}
                                                name="hdlc"
                                                control={control}
                                                error={errors.hdlc}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            100-200%
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "ldl-c" })}
                                                name="ldlc"
                                                control={control}
                                                error={errors.ldlc}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            10-12 mmg
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "triglycerides" })}
                                                name="triglycerides"
                                                control={control}
                                                error={errors.triglycerides}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            10-12 mmg
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "vldl-c" })}
                                                name="vldlc"
                                                control={control}
                                                error={errors.vldlc}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            10-12 mmg
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "non-hdlc" })}
                                                name="nonhdlc"
                                                control={control}
                                                error={errors.nonhdlc}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            10-12 mmg
                                        </Grid>
                                        <Grid item xs={12} lg={8} md={4} sm={6}>
                                            <CustomTextBox
                                                label={formatMessage({ id: "cholestrol" })}
                                                name="cholestrol"
                                                control={control}
                                                error={errors.cholestrol}
                                            />
                                        </Grid>
                                        <Grid item xs={12} lg={4} md={4} sm={6}>
                                            10-12 mmg
                                        </Grid>
                                    </Grid>
                                }
                                {
                                    <Grid item xs={12} lg={6} md={4} sm={6}>
                                        <RichTextEditor
                                            setTemplate={setTemplate}
                                            value={template}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <h3 className="formHeading" style={{ marginTop: "20px" }}></h3>
                                </Grid>
                                <Grid item xs={12} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "released-by" })}
                                        name="verifiedByUserUserDisplayName"
                                        control={control}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Box>
                </div>
                {loading && <HoverLoader />}
            </>
        </Modal>
    );
});

export default ResultEntry;

const CustomFooter = ({ handleSubmit, onSubmit, onSubmitAndRelease, closeModal, onPrint, onAuthorization, onReset, IsAuthorization }: any) => {
    return (
        <div>
            {!IsAuthorization &&
                <>
                    <SaveButton
                        onClick={handleSubmit(onSubmit)}
                        style={{ marginRight: "10px" }}
                    />
                    <SaveButton
                        label="Release"
                        onClick={handleSubmit(onSubmitAndRelease)}
                        style={{ marginRight: "10px" }}
                    />
                    <SecondaryButton
                        label="PRINT"
                        endIcon={<Print color="primary" />}
                        onClick={onPrint}
                        style={{ marginRight: "10px" }}
                    />
                </>
            }
            {IsAuthorization &&
                <>
                    <PrimaryButton
                        label="AUTHORIZE"
                        endIcon={<AuthorityIcon style={{ objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />}
                        onClick={handleSubmit(onAuthorization)}
                        style={{ marginRight: "10px" }}
                    />
                    <PrimaryButton
                        label="RESET"
                        endIcon={<AuthorityIcon style={{ objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />}
                        onClick={onReset}
                        style={{ marginRight: "10px" }}
                    />
                </>
            }
            <SecondaryButton
                label="CANCEL"
                style={{ marginRight: "10px" }}
                onClick={closeModal}
            />
        </div>
    )
}