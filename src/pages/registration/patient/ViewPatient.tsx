import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import { RootReducerState } from 'utils/types';
import { SecondaryButton } from 'components/button';
import { images, masterPaginationServices, partnerInformations, patientChannelInformation, patientInformations } from 'utils/constants';
import { HoverLoader } from 'components';
import { FormPrimaryHeading } from 'components/forms';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { eligibilityAuthorizationList } from 'utils/constants';

interface Props {
    closeModal: () => void;
    patientId: string | number;
}

const ViewPatient = ({ closeModal, patientId }: Props) => {
    const [loading, setLoading] = useState(false);
    let [patientData, setPatientData] = useState<any>({});
    let [insuranceName, setInsuranceName] = useState<any>({});
    const dispatch = useDispatch();
    const { insuranceCompanyData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                insuranceCompanyData: masterPaginationReducer[masterPaginationServices.insuranceCompany].data,
            })
        },
        shallowEqual
    );

    let coupleData = patientData?.wifeCouples;
    let partnerData = coupleData?.[0] ?? {};

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.insuranceCompany, {}));
    }, [])

    useEffect(() => {
        if (patientData && insuranceCompanyData.modelItems.length) {
            let insuranceId = patientData.payerInsuranceCompanyId;
            let selectedInsurance = insuranceCompanyData.modelItems.find((insurance: any) => +insurance.id === +insuranceId);
            let insuranceName = {};
            if (selectedInsurance?.primarySponsorId) {
                insuranceName = { ...insuranceName, sponsorInsuranceCompanyName: selectedInsurance.name };
                let payerInsurance = insuranceCompanyData.modelItems.find((insurance: any) => +insurance.id === +selectedInsurance.primarySponsorId);
                if (payerInsurance) {
                    insuranceName = { ...insuranceName, payerInsuranceCompanyName: payerInsurance.name };
                }
            } else if (selectedInsurance) {
                insuranceName = { ...insuranceName, payerInsuranceCompanyName: selectedInsurance.name };
            }
            setInsuranceName(insuranceName);
        }
    }, [patientData, insuranceCompanyData.modelItems]);

    useEffect(() => {
        if (patientId) {
            const parms = {
                patientId
            }
            setLoading(true);
            services.getPatientWithPartnerById(parms)
                .then((res) => {
                    setLoading(false);
                    if (res.status === 200) {
                        setPatientData(res.data.response);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                })
        }
    }, []);
    let patientImageUrl = patientData?.imageDataBase64String ? `data:image/jpeg;base64,${patientData?.imageDataBase64String}` : null;
    let partnerImageUrl = partnerData?.husbandPatientImageDataBase64String ? `data:image/jpeg;base64,${partnerData?.husbandPatientImageDataBase64String}` : null;


    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container patient-view-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={"PATIENT VIEWING SCREEN"} />

                            <div>
                                <SecondaryButton
                                    label="Cancel"
                                    style={{ marginRight: "15px" }}
                                    onClick={closeModal}
                                />
                            </div>
                        </div>

                        <div className="full-modal-body-container">

                            <Box className="patient-view-card" marginBottom={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box display="flex" flexDirection="column">
                                            <Typography variant="body2" component="span" color="textSecondary">
                                                <FormattedMessage id="chn" />
                                            </Typography>
                                            <Typography variant="subtitle2" component="span" color="textPrimary">
                                                <Box fontWeight="fontWeightBold">
                                                    {partnerData?.chnId ?? "-"}
                                                </Box>
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Box display="flex" flexDirection="column">
                                            <Typography variant="body2" component="span" color="textSecondary">
                                                <FormattedMessage id="registration-clinic" />
                                            </Typography>
                                            <Typography variant="subtitle2" component="span" color="textPrimary">
                                                <Box fontWeight="fontWeightBold">
                                                    {patientData?.clinicName ?? "-"}
                                                </Box>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            <div className="patient-top-row">

                                <div className="patient-view-card">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className="heading">
                                                <h1 className="formHeadingSecondary">
                                                    <FormattedMessage id="patient-information" />
                                                </h1>
                                            </div>
                                        </Grid>


                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <div style={{ width: "150px", height: "150px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", position: "relative" }} >
                                                        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={patientImageUrl ?? images.defaultAvatar} alt="patient-registration-image" />
                                                    </div>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="uhid" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {patientData?.['uhid'] ?? '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="name" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {patientData?.['fullNameWithTitle'] ?? '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="date-of-birth" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {patientData?.['birthDate'] ? dayjs(patientData?.['birthDate']).format('DD-MM-YYYY') : '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>


                                        {patientInformations.map((field, index) => {
                                            let labelValue = '';
                                            if (field.name === "patientLanguages") {
                                                let languageString = patientData?.[field.name]?.map((lan: any) => lan.languageName);
                                                labelValue = languageString?.length ? languageString.join(', ') : "-";
                                            } else if (field.name === "idType") {
                                                labelValue = patientData?.['patientDocuments']?.[0] ? patientData?.['patientDocuments']?.[0]?.documentTypeName : '-'
                                            } else if (field.name === "documentType") {
                                                labelValue = patientData?.['patientDocuments']?.[0] ? patientData?.['patientDocuments']?.[0]?.documentValue : '-'
                                            } else if (field.name === "address") {
                                                labelValue = patientData?.['cityProvinceCountryName'] ? `${patientData?.['address']}, ${patientData?.['localityName']}, ${patientData?.['cityName']}, ${patientData?.['cityProvinceName']}, ${patientData?.['cityProvinceCountryName']}, ${patientData?.['zipCode']}` : '-';
                                            } else {
                                                labelValue = patientData?.[field.name] ?? '-'
                                            }

                                            return (
                                                <Grid item xs={6} key={index}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography variant="body2" component="span" color="textSecondary">
                                                            <FormattedMessage id={field.label} />
                                                        </Typography>
                                                        <Typography variant="subtitle2" component="span" color="textPrimary">
                                                            <Box fontWeight="fontWeightBold">
                                                                {labelValue}
                                                            </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </div>

                                <div className="patient-view-card">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className="heading">
                                                <h1 className="formHeadingSecondary">
                                                    <FormattedMessage id="partner-information" />
                                                </h1>

                                            </div>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <div style={{ width: "150px", height: "150px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", position: "relative" }} >
                                                        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={partnerImageUrl ?? images.defaultAvatar} alt="patient-registration-image" />
                                                    </div>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="uhid" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {partnerData?.['husbandPatientUHID'] ?? '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="name" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {partnerData?.['husbandFullName'] ?? '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box display="flex" flexDirection="column">
                                                                <Typography variant="body2" component="span" color="textSecondary">
                                                                    <FormattedMessage id="date-of-birth" />
                                                                </Typography>
                                                                <Typography variant="subtitle2" component="span" color="textPrimary">
                                                                    <Box fontWeight="fontWeightBold">
                                                                        {partnerData?.['husbandPatientBirthDate'] ? dayjs(partnerData?.['husbandPatientBirthDate']).format('DD-MM-YYYY') : '-'}
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {partnerInformations.map((field, index) => {
                                            let labelValue = '';
                                            if (field.name === "husbandPatientPatientLanguages") {
                                                let languageString = partnerData?.[field.name]?.map((lan: any) => lan.languageName);
                                                labelValue = languageString?.length ? languageString.join(', ') : "-";
                                            } else if (field.name === "idType") {
                                                labelValue = partnerData?.['husbandPatientPatientDocuments']?.[0] ? partnerData?.['husbandPatientPatientDocuments']?.[0]?.documentTypeName : '-'
                                            } else if (field.name === "documentType") {
                                                labelValue = partnerData?.['husbandPatientPatientDocuments']?.[0] ? partnerData?.['husbandPatientPatientDocuments']?.[0]?.documentValue : '-'
                                            } else if (field.name === "husbandPatientAddress") {
                                                labelValue = partnerData?.['husbandPatientCityProvinceCountryName'] ? `${partnerData?.['husbandPatientAddress']}, ${partnerData?.['husbandPatientLocalityName']}, ${partnerData?.['husbandPatientCityName']}, ${partnerData?.['husbandPatientCityProvinceName']}, ${partnerData?.['husbandPatientCityProvinceCountryName']}, ${partnerData?.['husbandPatientZIPCode']}` : '-'
                                            } else {
                                                labelValue = partnerData?.[field.name] ?? '-'
                                            }

                                            return (
                                                <Grid item xs={6} key={index}>
                                                    <Box display="flex" flexDirection="column">
                                                        <Typography variant="body2" component="span" color="textSecondary">
                                                            <FormattedMessage id={field.label} />
                                                        </Typography>
                                                        <Typography variant="subtitle2" component="span" color="textPrimary">
                                                            <Box fontWeight="fontWeightBold">
                                                                {labelValue}
                                                            </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            )
                                        })}

                                    </Grid>
                                </div>
                            </div>

                            {patientData?.paymentTypeId !== 1 && <div className="patient-view-card" style={{ marginTop: "25px", width: '100%' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <h3 className="formHeading">
                                            <FormattedMessage id="patient-channel-information" />
                                        </h3>
                                    </Grid>

                                    {patientChannelInformation.map((field, index) => {
                                        let labelValue = '';
                                        if (field.name === 'payerInsuranceCompanyName') {
                                            labelValue = insuranceName?.payerInsuranceCompanyName;
                                        } else if (field.name === 'sponsorInsuranceCompanyName') {
                                            labelValue = insuranceName?.sponsorInsuranceCompanyName;
                                        } else if (field.name === "insuranceValidFrom" || field.name === "insuranceValidTo") {
                                            labelValue = patientData?.[field.name] ? dayjs(patientData?.[field.name]).format('DD-MM-YYYY') : "-";
                                        } else if (field.name === "planName") {
                                            labelValue = patientData?.['insurancePlans']?.length ? patientData?.['insurancePlans']?.[0]?.insurancePlanName : "-";
                                        } else if (field.name === "eligibilityAuthorizationStatus") {
                                            labelValue = eligibilityAuthorizationList.find(status => +status.value === +patientData[field.name])?.label ?? "-";
                                        } else {
                                            labelValue = patientData?.[field.name] ?? '-';
                                        }
                                        return (
                                            <Grid item xs={12} lg={3} md={4} sm={6} key={index}>
                                                <Box display="flex" flexDirection="column">
                                                    <Typography variant="body2" component="span" color="textSecondary">
                                                        <FormattedMessage id={field.label} />
                                                    </Typography>
                                                    <Typography variant="subtitle2" component="span" color="textPrimary">
                                                        <Box fontWeight="fontWeightBold">
                                                            {labelValue}
                                                        </Box>
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </div>}
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
}

export default ViewPatient;