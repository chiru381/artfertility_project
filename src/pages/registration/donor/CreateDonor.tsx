import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Print from '@material-ui/icons/Print';

import { getFormBody } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import DonorForm from './DonorForm';
import { ButtonGroup, SaveButton, SecondaryButton } from 'components/button';
import { useToastMessage } from 'utils/hooks';
import { FormPrimaryHeading } from 'components/forms';

interface Props {
    closeModal: () => void;
    donorId?: number | string;
    onApiCall: (status: boolean) => void;
    isUpdateModal?: boolean;
}

// Create and Update Donor is handled by single component
const CreateDonor = React.memo(({ closeModal, donorId, onApiCall, isUpdateModal = false }: Props) => {
    const { handleSubmit, formState: { errors }, control, watch, register, setValue, clearErrors, getValues } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [createDonorLoading, setCreateDonorLoading] = useState(false);
    const [donorResponse, setDonorResponse] = useState<{ [key: string]: any }>({});
    const [selectedDonorData, setSelectedDonorData] = useState<{ [key: string]: any }>({});
    const [patientDocument, setPatientDocument] = useState<any>([]);
    const [disableForm, setDisableForm] = useState(false);


    const { loading, selectedClinic } = useSelector(
        ({ patientLookupReducer, utilityReducer }: RootReducerState) => {
            return ({
                loading: patientLookupReducer.loading,
                selectedClinic: utilityReducer.selectedClinic
            })
        },
        shallowEqual
    );

    useEffect(() => {
        // Get donor by id while updating donor
        onGetDonorByIdApiCall();
    }, []);

    function onGetDonorByIdApiCall(id: null | number = null) {
        if (donorId) {
            const params = {
                patientId: donorId
            }

            setCreateDonorLoading(true);
            services.getPatientById(params)
                .then((res) => {
                    setCreateDonorLoading(false);
                    if (res.data?.succeeded) {
                        updateFields(res.data.response);
                        setSelectedDonorData({
                            uhid: res.data.response.uhid,
                            imageDataBase64String: res.data.response.imageDataBase64String,
                            createdDateTime: res.data.response.createdDateTime,
                            currentAge: res.data.response.currentAge,
                            startAge: res.data.response.startAge,
                            zipCode: res.data.response.zipCode
                        });
                        if (res.data.response?.patientDocuments?.length) {
                            setPatientDocument(res.data.response?.patientDocuments);
                        }
                    }
                })
                .catch((err) => {
                    setCreateDonorLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }

    function updateFields(data: any) {
        let formData = getValues();
        let formatedFormData: any = {};

        Object.keys(formData).map(key => {
            if (key === "zipCode" || key === "localityId" || key === "cityId") {
                return null;
            } else if (data[key] && key === "patientClinicalComplications") {
                formatedFormData[key] = data[key]?.map((d: any) => ({ label: d.clinicalComplicationTypeName, value: String(d.clinicalComplicationTypeId) }));
            } else if (data["patientLanguages"] && key === "patientLanguageIds") {
                formatedFormData[key] = data["patientLanguages"]?.map((d: any) => ({ label: d.languageName, value: String(d.languageId) }));
            } else if (data[key] && key === "doctorId") {
                formatedFormData[key] = data.doctorUserDisplayName ? { value: String(data[key]), label: data.doctorUserDisplayName } : null;
            } else if (data[key] && key.includes("Id")) {
                if (data[key] && data[key.replace('Id', "Name")]) {
                    formatedFormData[key] = { value: String(data[key]), label: data[key.replace('Id', "Name")] };
                } else {
                    formatedFormData[key] = null;
                }
            } else if (data[key]) {
                formatedFormData[key] = data[key] ? data[key] : "";
            }
        });

        Object.keys(formatedFormData).map(key => {
            setValue(key, formatedFormData[key]);
        })
    }

    function onSubmit(data: any) {
        const bodyData = getFormBody(data, true);
        let formData = new FormData();

        formData.append("isDonor", "true");
        if (isUpdateModal) {
            formData.append("id", donorId + "");
            formData.append("clinicId", selectedClinic);
        } else {
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
                if (!data[key]?.length && donorId) {
                    formData.append(`ClinicalComplicationId`, "1");
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

        setCreateDonorLoading(true);
        // create and update api ishandled from single service
        let donorService = services[(isUpdateModal ? 'updateDonor' : 'createDonor') as keyof typeof services];
        donorService(formData)
            .then((res) => {
                setCreateDonorLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: isUpdateModal ? "donor-details-updated-successfully" : "donor-registered-successfully" }));
                    if (!isUpdateModal) {
                        setDonorResponse(res.data.response);
                        setDisableForm(true);
                    } else {
                        closeModal();
                        onApiCall(true);
                    }
                } else {
                    toastMessage(res.data?.message, "error");
                }
            })
            .catch((err) => {
                setCreateDonorLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={"DONOR REGISTRATION"} />

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

                                {(isUpdateModal || donorResponse?.uhid) && (
                                    <SecondaryButton
                                        label={formatMessage({ id: "print" })}
                                        endIcon={<Print color="primary" />}
                                    />
                                )}

                                {!donorResponse?.uhid && (
                                    <SaveButton
                                        onClick={handleSubmit(onSubmit)}
                                        label={formatMessage({ id: isUpdateModal ? "update" : "save" })}
                                    />
                                )}
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3} style={{ pointerEvents: disableForm ? "none" : "unset", filter: disableForm ? "blur(0.8px)" : "blur(0px)" }}>
                                <DonorForm
                                    errors={errors}
                                    control={control}
                                    watch={watch}
                                    register={register}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    isUpdateModal={isUpdateModal}
                                    selectedDonorData={selectedDonorData}
                                    donorResponse={donorResponse}

                                    patientDocument={patientDocument}
                                    setPatientDocument={setPatientDocument}
                                />
                            </Grid>
                        </div>

                    </Box>
                </div>

                {(loading || createDonorLoading) && <HoverLoader />}
            </>
        </Modal>
    )
});

export default CreateDonor;