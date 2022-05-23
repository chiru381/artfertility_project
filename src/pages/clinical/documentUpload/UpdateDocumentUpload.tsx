import React, { useEffect, useState, memo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { CustomRadioGroup, CustomSelect, CustomTextBox, CustomFileUpload } from 'components/forms'
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices, ownerOptions } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FILE_URI } from 'redux/apiEndPoints';
import { getFormBody, jsonToFormData, validationRule } from 'utils/global';
import { useCreateDropdownOptions, useGetPatientId, useToastMessage } from 'utils/hooks';
import { Box, Button, Paper } from '@material-ui/core';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import { services } from "utils/services";
import { HoverLoader } from 'components';
import { PrimaryButton, SecondaryButton } from 'components/button';
import { images } from 'utils/constants';
interface Props {

}

const UpdateDocumentUploadForm = (props: Props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    let { id } = useParams<{ id: any }>();
    const { handleSubmit, formState: { errors }, control, register, setValue, clearErrors, reset, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState<boolean>(false);
    const { toastMessage } = useToastMessage();
    const [selectedData, setSelectedData] = useState<any>({})
    const { clinicalDocumentType } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                clinicalDocumentType: masterPaginationReducer[masterPaginationServices.clinicalDocumentType].data,
            })
        },
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinicalDocumentType, {}));
        services.getDocumentUploadById({ id }).then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                setSelectedData(res.data?.response)
            } else {
                toastMessage(res.data?.messge, "error");
            }
        })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, "error");
            });;
    }, [])

    const clinicalDocumentTypeOptions = useCreateDropdownOptions(clinicalDocumentType?.modelItems);
    let patientId: any = useGetPatientId();

    function onSubmit(data: any) {
        // let formData: any = new FormData();
        // formData.append("documentFile", data?.documentFile?.[0]);
        // formData.append("patientId", +patientId);
        // formData.append("clinicalDocumentTypeId", +data?.clinicalDocumentTypeId?.value);
        let formData = {
            ...data,
            id: +selectedData?.id,
            documentFile: data?.documentFile?.[0],
            patientId: patientId,
            clinicalDocumentTypeId: data?.clinicalDocumentTypeId?.value
        };
        setLoading(true);
        services
            .updateDocumentUpload(jsonToFormData(formData))
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    history.goBack();
                    toastMessage(formatMessage({ id: "insert-message" }));
                } else {
                    toastMessage(res.data?.messge, "error");
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, "error");
            });
    }

    useEffect(() => {
        if (selectedData) {
            reset({
                ...selectedData,
                clinicalDocumentTypeId: clinicalDocumentTypeOptions?.find((item: any) => +item.value === +selectedData?.clinicalDocumentTypeId) ?? null,
                owner: `${selectedData?.owner}`
            });
        }
    }, [selectedData]);

    let objectUrl = "";
    let previewImage = "";

    if (watch('documentFile')?.[0]) {
        const split = watch('documentFile')?.[0]?.name?.split('.');

        if (['pdf', 'xls', 'xlsx', 'docx'].includes(split?.pop())) {
            objectUrl = URL.createObjectURL(watch('documentFile')?.[0]);
            previewImage = images.document;
        } else {
            objectUrl = URL.createObjectURL(watch('documentFile')?.[0]);
            previewImage = URL.createObjectURL(watch('documentFile')?.[0]);
        }
    }

    // if (p && defaultFileName === undefined) {
    //     let fileUrl = patientDocument?.[index].url;
    //     objectUrl = FILE_URI + fileUrl;
    //     defaultFileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1)
    // }


    return (
        <CustomClinicalActionHeaderWithWrap
            goBack={() => history.goBack()}

            title={formatMessage({ id: "document-upload" })}
        >
            <Box padding={2} component={Paper}>
                <div style={{ padding: "10px", borderBottom: '1px solid' }}>
                    <span className="text-15 font-medium"> Edit Document File</span>
                </div>

                <Grid item xs={12} style={{
                    marginTop: '15px'
                }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={4} md={4} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <CustomFileUpload
                                        accept=".png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx"
                                        label="Choose file"
                                        error={errors?.documentFile}
                                        {...register('documentFile', {
                                            required: true,
                                            validate: (value: any) => {
                                                const { type, size } = value?.["0"] ?? {};
                                                const isValidSize = +size / 1024 / 1024 >= 2;
                                                if (type && !(type === "image/png" || type === "image/jpg" || type === "image/jpeg" || type === "application/pdf" || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type === 'application/pdf' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                                                    return ".png, .jpg, .jpeg, .pdf, .xls, .xlsx, .docx supported only";
                                                } else if (isValidSize) {
                                                    return "Maximum size 2 MB";
                                                } else {
                                                    return true;
                                                }
                                            }
                                        })}
                                        defaultFileName={''}
                                        onViewImage={() => {
                                            window.open(objectUrl, "_blank");
                                        }}
                                        onClear={() => {
                                            setValue(`documentFile`, null);
                                            clearErrors(`documentFile`);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <CustomSelect
                                        options={clinicalDocumentTypeOptions}
                                        label={formatMessage({ id: "document-type" })}
                                        name="clinicalDocumentTypeId"
                                        control={control}
                                        error={errors.clinicalDocumentTypeId}
                                        rules={validationRule.textbox({ required: true })}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <CustomTextBox
                                        label={formatMessage({ id: "document-name" })}
                                        name="documentName"
                                        control={control}
                                        error={errors.documentName}
                                        rules={validationRule.textbox({
                                            required: true,
                                            type: "textWithSpace",
                                            maxLength: 125,
                                            minLength: 0,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <CustomTextBox
                                        label={formatMessage({ id: "keywords" })}
                                        name="keywords"
                                        control={control}
                                        error={errors.keywords}
                                        rules={validationRule.textbox({
                                            required: true,
                                            type: "textWithSpace",
                                            maxLength: 125,
                                            minLength: 0,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <CustomRadioGroup
                                        name="owner"
                                        control={control}
                                        groupList={ownerOptions}
                                        error={errors.owner}
                                        rules={{ required: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4} md={4} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}  >
                                    <CustomTextBox
                                        rows={5}
                                        label={formatMessage({ id: "remarks" })}
                                        name="observations"
                                        multiline
                                        control={control}
                                        error={errors.observations}
                                        rules={validationRule.textbox({
                                            required: true,
                                            type: "textWithSpace",
                                            maxLength: 200,
                                            minLength: 0,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <div className="text-right">
                                        <PrimaryButton
                                            label="Upload Now"
                                            onClick={handleSubmit(onSubmit)}
                                            style={{ marginRight: '5px' }}
                                        />
                                        <SecondaryButton
                                            label="Cancel"
                                            onClick={() => history.goBack()}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4} md={4} sm={12}>
                            <a href={`${objectUrl ? objectUrl : images.preview}`} target={"_blank"}>
                                <Grid xs={12} justify="space-between"
                                    style={{
                                        backgroundImage: `url(${objectUrl ? objectUrl : images.preview})`,
                                        height: '300px',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                </Grid>
                            </a>
                        </Grid>
                    </Grid>
                </Grid>
                {loading && <HoverLoader />}

            </Box>
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default UpdateDocumentUploadForm;
