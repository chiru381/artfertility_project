import React, { useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import Print from '@material-ui/icons/Print';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';

import { getFormBody } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { HoverLoader } from 'components';
import PartnerForm from './PartnerForm';
import { FormPrimaryHeading } from 'components/forms';
import { SaveButton, SecondaryButton } from 'components/button';
import { useCreateLookupOptions } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    demographicData?: any;
    patientId?: string | number;
    partnerId?: string | number;
    onApiCall: (status: boolean) => void;
    parentModalClose?: () => void;
    selectedPartnerChnId: string | null;
}

const CreatePartner = React.memo(({ closeModal, demographicData, patientId, partnerId, onApiCall, parentModalClose, selectedPartnerChnId }: Props) => {
    const { handleSubmit, formState: { errors }, control, watch, register, setValue, clearErrors, getValues } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();

    const [createPartnerLoading, setCreatePartnerLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);
    const [partnerData, setPartnerData] = useState(null);
    const [patientDocument, setPatientDocument] = useState<any>([]);
    const [disableForm, setDisableForm] = useState(false);
    const [partnerResponse, setPartnerResponse] = useState<{ [key: string]: any }>({});

    const { patientLookupData, loading, selectedClinic } = useSelector(
        ({ patientLookupReducer, utilityReducer }: RootReducerState) => {
            return ({
                patientLookupData: patientLookupReducer.data,
                loading: patientLookupReducer.loading,
                selectedClinic: utilityReducer.selectedClinic
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(patientLookupData);

    useEffect(() => {
        if (partnerId) {
            const parms = {
                patientId: partnerId
            }
            setCreatePartnerLoading(true);
            services.getPatientById(parms)
                .then((res) => {
                    setCreatePartnerLoading(false);
                    if (res.data?.succeeded) {
                        updateFields(res.data.response);
                        setPartnerData(res.data.response);
                        if (res.data.response?.patientDocuments?.length) {
                            setPatientDocument(res.data.response?.patientDocuments);
                        }
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setCreatePartnerLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }, [])

    useEffect(() => {
        if (demographicData && Object.keys(selectOptions)?.length) {
            let fields = {
                ...demographicData,
                maritalStatusId: selectOptions?.maritalStatus.find((status: any) => +status.value === +(demographicData.maritalStatusId?.value ?? demographicData.maritalStatusId)),
                birthCountryId: selectOptions?.countries.find((status: any) => +status.value === +(demographicData.birthCountryId?.value ?? demographicData.birthCountryId)),
            }
            Object.keys(fields).map(key => {
                setValue(key, fields[key]);
            });
        }
    }, [demographicData, selectOptions])

    function onSubmit(data: any) {
        const bodyData = getFormBody(data, true);
        let formData = new FormData();

        formData.append("isDonor", "false");
        if (partnerId) {
            formData.append("id", partnerId + "");
            formData.append("isAccessibleByAnotherClinic", "false");
            formData.append("isVIP", "false");
            formData.append("clinicId", selectedClinic);
            formData.append("leadSource1Id", "1");
            formData.append("leadSource2Id", "1");
            formData.append("leadSource3Id", "1");
        } else {
            formData.append("wifePatientId", String(patientId));
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
                if (!data[key]?.length && partnerId) {
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

        setCreatePartnerLoading(true);

        let partnerService = services[(partnerId ? 'updatePatient' : 'createPartner') as keyof typeof services];
        partnerService(formData)
            .then((res) => {
                setCreatePartnerLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: partnerId ? "partner-update-message" : "partner-register-message" }));
                    if (partnerId) {
                        closeModal();
                        onApiCall(true);
                    } else {
                        if (res.data.response?.uhid) {
                            setPartnerResponse(res.data.response);
                        }
                        setDisableForm(true);
                    }
                } else {
                    toastMessage(res.data?.message, "error");
                }
            })
            .catch((err) => {
                setCreatePartnerLoading(false);
                toastMessage(err.message, 'error');
            })
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
            } else if (data[key] && key === "refferingDoctorId") {
                formatedFormData[key] = data.referringDoctorName ? { value: String(data[key]), label: data.referringDoctorName } : null;
            } else if (data[key] && key.includes("Id")) {
                if (data[key.replace('Id', "Name")]) {
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

    function onClose() {
        closeModal();
        if (disableForm || parentModalClose) {
            onApiCall(true);
        }
        if (parentModalClose) {
            parentModalClose();
        }
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={"PARTNER REGISTRATION"} />

                            <div>
                                <SecondaryButton
                                    label="Cancel"
                                    style={{ marginRight: "15px" }}
                                    onClick={onClose}
                                />

                                {(partnerId || disableForm) && (
                                    <SecondaryButton
                                        label="Print"
                                        endIcon={<Print color="primary" />}
                                        style={{ marginRight: "15px" }}
                                    />
                                )}

                                {!disableForm && <SaveButton
                                    onClick={handleSubmit(onSubmit)}
                                    label={formatMessage({ id: partnerId ? "update" : "save" })}
                                />}
                            </div>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3} style={{ pointerEvents: disableForm ? "none" : "unset", filter: disableForm ? "blur(0.8px)" : "blur(0px)" }}>
                                <PartnerForm
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                    register={register}
                                    clearErrors={clearErrors}
                                    isPartnerUpdate={partnerId ? true : false}
                                    partnerData={partnerData}
                                    partnerResponse={partnerResponse}

                                    patientDocument={patientDocument}
                                    setPatientDocument={setPatientDocument}
                                    selectedPartnerChnId={selectedPartnerChnId}
                                    demographicData={demographicData}
                                />
                            </Grid>
                        </div>

                    </Box>
                </div>

                {(loading || createPartnerLoading) && <HoverLoader />}
            </>
        </Modal>
    )
});

export default CreatePartner;