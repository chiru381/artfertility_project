import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Print from '@material-ui/icons/Print';
import Modal from '@material-ui/core/Modal';
import Link from '@material-ui/core/Link';

import { getFormBody } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { CustomDialog, HoverLoader } from 'components';
import { services } from 'utils/services';
import PatientForm from './PatientForm';
import { eligibilityAuthorizationList, masterPaginationServices } from 'utils/constants';
import { useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SaveButton, SecondaryButton } from 'components/button';
import CreatePartner from './CreatePartner';
import { FormPrimaryHeading } from 'components/forms';
import PatientDataTransferModal from './PatientDataTransferModal';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void;
    patientId?: string | number;
    chnId?: string | null;
}

// patient registration and update is handled with same component
const CreatePatient = React.memo((props: Props) => {
    const { closeModal, onApiCall, patientId, chnId } = props;
    const { handleSubmit, formState: { errors }, control, watch, register, getValues, setValue, clearErrors } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [patientDataTransferModalOpen, setPatientDataTransferModalOpen] = useState(false);
    const [createPatientLoading, setCreatePatientLoading] = useState(false);
    const [demographicCopyDialog, setDemographicCopyDialog] = useState(false);
    const [createPartnerModalOpen, setCreatePartnerModalOpen] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const [demographicData, setDemographicData] = useState<any>(null);
    const [patientData, setPatientData] = useState<any>(null);
    const [patientResponse, setPatientResponse] = useState<{ [key: string]: any }>({});
    const [patientDocument, setPatientDocument] = useState<any>([]);
    const [dynamiccopayData, setDynamiccopayData] = useState<any>([]);

    const { leadSourceDataLoading, insuranceCompanyDataLoading, selectedClinic } = useSelector(
        ({ utilityReducer, masterPaginationReducer }: RootReducerState) => {
            return ({
                selectedClinic: utilityReducer.selectedClinic,
                leadSourceDataLoading: masterPaginationReducer[masterPaginationServices.leadSource].loading,
                insuranceCompanyDataLoading: masterPaginationReducer[masterPaginationServices.insuranceCompany].loading,
            })
        },
        shallowEqual
    );
    let loading = leadSourceDataLoading || insuranceCompanyDataLoading;

    // useEffect(() => {
    //     const errorsvalues = Object.values(errors);
    //     if (errorsvalues.length > 0) {
    //         errorsvalues?.[0]?.ref?.scrollIntoView({ behavior: 'smooth' })
    //     }
    // }, [errors]);


    useEffect(() => {
        if (patientId) {
            const params = {
                patientId: patientId
            }
            setCreatePatientLoading(true);
            services.getPatientById(params)
                .then((res) => {
                    setCreatePatientLoading(false);
                    if (res.data?.succeeded) {
                        updateFields(res.data.response);
                        setPatientData(res.data.response);
                        if (res.data.response?.insurancePlans?.length) {
                            setDynamiccopayData(res.data.response?.insurancePlans);
                        }
                        if (res.data.response?.patientDocuments?.length) {
                            setPatientDocument(res.data.response?.patientDocuments);
                        }
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setCreatePatientLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }, [])

    function onSubmit(data: any) {
        const bodyData = getFormBody(data, true);
        let formData = new FormData();

        formData.append("isAccessibleByAnotherClinic", "false");
        if (patientId) {
            formData.append("clinicId", selectedClinic);
            formData.append("isDonor", "false");
            formData.append("id", patientId + "");

        } else {
            formData.append("isDonor", "false");
            formData.append("isBlocked", "false");
        }

        Object.keys(bodyData).map(key => {
            if (key === 'image') {
                if (bodyData[key]?.[0]) {
                    formData.append(key, bodyData[key]?.[0]);
                }
            } else if (key === 'patientLanguageIds') {
                data[key]?.map((option: any) => {
                    formData.append(key, option.value);
                })
            } else if (key === 'patientClinicalComplications') {
                data[key]?.map((d: any, index: number) => {
                    formData.append(`${key}[${index}].details`, d.label);
                    formData.append(`${key}[${index}].ClinicalComplicationTypeId`, d.value);
                })
                if (!data[key]?.length && patientId) {
                    formData.append(`ClinicalComplicationId`, "1");
                }
            } else if (key === "payerInsuranceCompanyId" || key === "PayerInsuranceCompanyPrimarySponsorId") {
                if (key === "payerInsuranceCompanyId") {
                    formData.append(key, bodyData['PayerInsuranceCompanyPrimarySponsorId'] ?? bodyData['payerInsuranceCompanyId']);
                } else if (key === "PayerInsuranceCompanyPrimarySponsorId") {
                    formData.append(key, bodyData['PayerInsuranceCompanyPrimarySponsorId']);
                }
            } else {
                formData.append(key, bodyData[key]);
            }
        });

        if (patientDocument.length) {
            patientDocument.map((doc: any, index: number) => {
                if (doc.documentFile?.[0]) {
                    formData.append(`patientDocuments[${index}].documentFile`, doc.documentFile?.[0] ?? '');
                }
                if (doc.id) {
                    formData.append(`patientDocuments[${index}].id`, doc.id);
                }
                formData.append(`patientDocuments[${index}].documentValue`, doc.documentValue);
                formData.append(`patientDocuments[${index}].documentTypeId`, doc.documentTypeId?.value ? doc.documentTypeId?.value : doc.documentTypeId);
            })
        }

        if (dynamiccopayData.length) {
            dynamiccopayData.map((copay: any, index: number) => {
                if (copay.id) {
                    formData.append(`insurancePlans[${index}].id`, copay.id);
                }
                formData.append(`insurancePlans[${index}].payerInsuranceCompanyId`, bodyData['PayerInsuranceCompanyPrimarySponsorId'] ?? bodyData['payerInsuranceCompanyId'] ?? null);
                formData.append(`insurancePlans[${index}].insurancePlanName`, copay.insurancePlanName);
                formData.append(`insurancePlans[${index}].serviceCategoryName`, copay.serviceCategoryName);
                formData.append(`insurancePlans[${index}].serviceCategoryId`, copay.serviceCategoryId);
                formData.append(`insurancePlans[${index}].deductibaleAmount`, copay.deductibaleAmount ?? "0");
                formData.append(`insurancePlans[${index}].coPayPerchantage`, copay.coPayPerchantage ?? "0");
                formData.append(`insurancePlans[${index}].coPayAmount`, copay.coPayAmount ?? "0");
                formData.append(`insurancePlans[${index}].maximumCoPay`, copay.maximumCoPay ?? "0");
            })
        }

        // create and update api ishandled from single service
        let patientService = services[(patientId ? 'updatePatient' : 'createPatient') as keyof typeof services];
        setCreatePatientLoading(true);
        patientService(formData)
            .then((res) => {
                setCreatePatientLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: patientId ? "patient-update-message" : "patient-register-message" }));
                    if (!patientId) {
                        setPatientResponse(res.data.response);
                        setDisableForm(true);
                    } else {
                        closeModal();
                        onApiCall(true);
                    }
                } else {
                    toastMessage(res.data.message, "error");
                }
            })
            .catch((err) => {
                setCreatePatientLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function updateFields(data: any) {
        let formData = getValues();
        let formatedFormData: any = {};

        Object.keys(formData).map(key => {
            if (key === "zipCode" || key === "localityId" || key === "cityId") {
                return null;
            } else if (data[key] && key === "eligibilityAuthorizationStatus") {
                formatedFormData[key] = eligibilityAuthorizationList.find(status => +status.value === +data[key]) ?? null;
            } else if (data[key] && key === "patientClinicalComplications") {
                formatedFormData[key] = data[key]?.map((d: any) => ({ label: d.clinicalComplicationTypeName, value: String(d.clinicalComplicationTypeId) }));
            } else if (data["patientLanguages"] && key === "patientLanguageIds") {
                formatedFormData[key] = data["patientLanguages"]?.map((d: any) => ({ label: d.languageName, value: String(d.languageId) }));
            } else if (data[key] && key === "doctorId") {
                formatedFormData[key] = data.doctorUserDisplayName ? { value: String(data[key]), label: data.doctorUserDisplayName } : null;
            } else if (data[key] && key === "refferingDoctorId") {
                formatedFormData[key] = data.referringDoctorName ? { value: String(data[key]), label: data.referringDoctorName } : null;
            } else if (data[key] && key.includes("Id")) {
                if (data[key.replace('Id', "Name")] && key !== "payerInsuranceCompanyId") {
                    formatedFormData[key] = { value: String(data[key]), label: data[key.replace('Id', "Name")] };
                } else {
                    formatedFormData[key] = null;
                }
            } else if (data[key]) {
                formatedFormData[key] = data[key];
            }
        });

        Object.keys(formatedFormData).map(key => {
            setValue(key, formatedFormData[key]);
        })
    }


    function onDisagree() {
        setDemographicCopyDialog(false);
        setCreatePartnerModalOpen(true);
        setDemographicData(null);
    }

    function onAgree() {
        setDemographicCopyDialog(false);
        let { maritalStatusId, marriedSince, zipCode, address,
            occupationId, nationalityId, birthCountryId } = getValues();

        setDemographicData({
            maritalStatusId, marriedSince, zipCode, address,
            occupationId, nationalityId, birthCountryId
        });
        setCreatePartnerModalOpen(true);
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={"PATIENT REGISTRATION"} />

                            <ButtonGroup>
                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={() => {
                                        closeModal();
                                        if (disableForm) {
                                            onApiCall(true);
                                        }
                                    }}
                                />

                                {patientId && (
                                    <SecondaryButton
                                        label={formatMessage({ id: "print" })}
                                        endIcon={<Print color="primary" />}
                                    />
                                )}

                                {!patientResponse?.uhid && (
                                    <SaveButton
                                        label={formatMessage({ id: patientId ? "update" : "save" })}
                                        onClick={handleSubmit(onSubmit)}
                                    />
                                )}

                                {patientResponse?.uhid && (
                                    <SecondaryButton
                                        label={formatMessage({ id: "print" })}
                                        endIcon={<Print color="primary" />}
                                    />
                                )}

                                {patientResponse?.uhid && (
                                    <PrimaryButton
                                        onClick={() => setDemographicCopyDialog(true)}
                                        label={formatMessage({ id: "register-partner" })}
                                    />
                                )}
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3} style={{ pointerEvents: disableForm ? "none" : "unset", filter: disableForm ? "blur(0.8px)" : "blur(0px)" }}>
                                <PatientForm
                                    errors={errors}
                                    control={control}
                                    watch={watch}
                                    register={register}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    isUpdateModal={patientId ? true : false}
                                    updateFields={updateFields}
                                    patientData={patientData}
                                    patientResponse={patientResponse}

                                    patientDocument={patientDocument}
                                    setPatientDocument={setPatientDocument}
                                    dynamiccopayData={dynamiccopayData}
                                    setDynamiccopayData={setDynamiccopayData}
                                    chnId={chnId}
                                />

                                {patientId && <Grid item xs={12}>
                                    <Link
                                        component="button"
                                        variant="body1"
                                        color="textPrimary"
                                        underline="always"
                                        style={{ marginLeft: "15px" }}
                                        onClick={() => setPatientDataTransferModalOpen(true)}
                                    >{formatMessage({ id: "data-accessbility" })}</Link>
                                </Grid>}
                            </Grid>
                        </div>

                    </Box>
                </div>

                {createPartnerModalOpen && <CreatePartner
                    closeModal={() => {
                        setCreatePartnerModalOpen(false);
                    }}
                    parentModalClose={closeModal}
                    onApiCall={onApiCall}
                    demographicData={demographicData}
                    patientId={patientResponse?.patientId}
                    selectedPartnerChnId={null}
                />}

                {(loading || createPatientLoading) && <HoverLoader />}

                {patientDataTransferModalOpen && (
                    <PatientDataTransferModal
                        closeModal={() => setPatientDataTransferModalOpen(false)}
                    />
                )}

                <CustomDialog
                    open={demographicCopyDialog}
                    onDisagree={onDisagree}
                    onAgree={onAgree}
                    title={formatMessage({ id: "register-partner" }) + "?"}
                    subTitle={formatMessage({ id: "copy-demographic-data-message" }) + "?"}
                />
            </>
        </Modal >
    )
});

export default CreatePatient;