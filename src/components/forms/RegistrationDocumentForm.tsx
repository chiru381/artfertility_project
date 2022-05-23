import React, { useEffect, useState, memo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import AddCircle from '@material-ui/icons/AddCircle';

import { CustomSelect, CustomTextBox, FileUpload } from 'components/forms'
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal } from 'components/FormModal';
import { SecondaryButton } from 'components/button';
import { FILE_URI } from 'redux/apiEndPoints';

const RegistrationDocumentForm = memo(({ patientDocument, setPatientDocument }: any) => {
    const { formatMessage } = useIntl();
    const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);

    return (
        <>
            <Grid item xs={12}>
                <Link
                    component="button"
                    variant="body1"
                    color="textPrimary"
                    underline="always"
                    style={{ marginLeft: "15px" }}
                    onClick={() => setUploadDocumentOpen(true)}
                >{formatMessage({ id: "upload-document" })}</Link>
            </Grid>

            {uploadDocumentOpen && (
                <UploadDocumentModal
                    closeModal={() => setUploadDocumentOpen(false)}
                    patientDocument={patientDocument}
                    setPatientDocument={setPatientDocument}
                />
            )}
        </>
    )
});

export { RegistrationDocumentForm };

const UploadDocumentModal = memo(({ closeModal, patientDocument, setPatientDocument }: any) => {
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control, register, setValue, clearErrors, reset, watch } = useForm({ mode: 'all' });
    const { fields, append, remove } = useFieldArray({ control, name: 'patientDocuments' });
    const { formatMessage } = useIntl();

    const { documentTypeData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                documentTypeData: masterPaginationReducer[masterPaginationServices.documentType].data,
            })
        },
        shallowEqual
    );

    let documentTypeOptions = documentTypeData.modelItems.map((type: any) => ({ label: type.name, value: type.id }));

    useEffect(() => {
        if (patientDocument.length) {
            if (patientDocument?.[0]?.id) {
                reset({
                    'patientDocuments': patientDocument.map((doc: any) => ({
                        ...doc,
                        documentTypeId: { label: doc.documentTypeName, value: doc.documentTypeId }
                    }))
                });
            } else {
                reset({ 'patientDocuments': patientDocument });
            }
        } else {
            append({});
        }
        dispatch(getMasterPaginationData(masterPaginationServices.documentType, {}));
    }, [reset]);

    function onSubmit(data: any) {
        setPatientDocument(data.patientDocuments.filter((d: any) => (d.documentTypeId && d.documentValue && (d.documentFile || d.url))));
        closeModal();
    }

    return (
        <FormModal
            onCancel={closeModal}
            modalSize="medium"
            onConfirm={handleSubmit(onSubmit)}
            title={formatMessage({ id: "upload-document" })}
        >
            <Grid container spacing={2}>
                {fields.map(({ id }, index) => {
                    let defaultFileName = patientDocument?.[index]?.documentFile?.[0]?.name;
                    let objectUrl = '';
                    if (watch(`patientDocuments[${index}][documentFile]`)?.[0]) {
                        objectUrl = URL.createObjectURL(watch(`patientDocuments[${index}][documentFile]`)?.[0]);
                    }
                    if (patientDocument?.[index]?.url && defaultFileName === undefined) {
                        let fileUrl = patientDocument?.[index].url;
                        objectUrl = FILE_URI + fileUrl;
                        defaultFileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1)
                    }
                    let isAllFieldsFilled = watch(`patientDocuments[${index}][documentTypeId]`) || watch(`patientDocuments[${index}][documentValue]`) || watch(`patientDocuments[${index}][documentFile]`)?.[0];
                    let initialCancelEnable = (fields.length - 1) === 0 ? (isAllFieldsFilled ? true : false) : false;

                    return (
                        <React.Fragment key={id}>
                            <Grid item xs={12} style={{ padding: "12px 0" }}>
                                <Grid container spacing={1} style={{ position: "relative" }}>
                                    <Grid item xs={12} lg={4}>
                                        <CustomSelect
                                            label={formatMessage({ id: "document-type" })}
                                            options={documentTypeOptions}
                                            control={control}
                                            rules={{ required: true }}
                                            name={`patientDocuments[${index}][documentTypeId]`}
                                            error={errors?.[`patientDocuments`]?.[index]?.['documentTypeId']}
                                        />
                                    </Grid>

                                    <Grid item xs={12} lg={4}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "document-id" })}
                                            rules={{ required: true }}
                                            control={control}
                                            name={`patientDocuments[${index}][documentValue]`}
                                            error={errors?.[`patientDocuments`]?.[index]?.['documentValue']}
                                        />
                                    </Grid>

                                    <Grid item xs={12} lg={4} style={{ position: "relative" }}>
                                        <FileUpload
                                            label="Upload file"
                                            error={errors?.[`patientDocuments`]?.[index]?.['documentFile']}
                                            {...register(`patientDocuments[${index}][documentFile]`, {
                                                validate: (value: any) => {
                                                    const { type, size } = value?.["0"] ?? {};
                                                    const isValidSize = +size / 1024 / 1024 >= 2;
                                                    if (type && !(type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {
                                                        return ".png .jpg, and .jpeg supported";
                                                    } else if (isValidSize) {
                                                        return "Maximum size 2 MB";
                                                    } else {
                                                        return true;
                                                    }
                                                }
                                            })}
                                            defaultFileName={defaultFileName}
                                            onViewImage={() => {
                                                window.open(objectUrl, "_blank");
                                            }}
                                            onClear={() => {
                                                setValue(`patientDocuments[${index}][documentFile]`, null);
                                                clearErrors(`patientDocuments[${index}][documentFile]`);
                                            }}
                                        />
                                        <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>(.png, .jpg, .jpeg supported)</span>
                                    </Grid>

                                    {((fields.length - 1) !== 0 || initialCancelEnable) && <IconButton
                                        size="small"
                                        style={{ margin: "0px", position: "absolute", right: 0, marginTop: "-18px", marginRight: "-8px" }}
                                        color="secondary"
                                        onClick={() => {
                                            if (initialCancelEnable) {
                                                reset({ 'patientDocuments': [{ documentTypeId: null, documentValue: null, documentFile: null }] });
                                                setPatientDocument([]);
                                            } else {
                                                remove(index);
                                            }
                                        }}
                                    >
                                        <Cancel fontSize="small" />
                                    </IconButton>}
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="line" />
                            </Grid>
                        </React.Fragment>
                    )
                })}

                <Grid item xs={12}>
                    <SecondaryButton
                        label="Add More"
                        endIcon={<AddCircle color="primary" />}
                        onClick={() => append({})}
                    />
                </Grid>

            </Grid>
        </FormModal>
    )
});