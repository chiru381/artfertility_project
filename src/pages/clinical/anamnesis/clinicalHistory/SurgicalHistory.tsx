import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

import { TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { CustomTextBox, RadioButton, TextBox } from "components/forms";
import { HoverLoader } from "components";
import { rightLeftOptions } from "utils/constants";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { SecondaryButton } from "components/button";
import CreateSurgeryModal from "./CreateSurgeryModal";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { CustomDialog } from 'components/CustomDialog';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const SurgicalHistory = (props: Props) => {
  const location = useLocation<any>();
  const { handleSubmit, formState: { errors }, control, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [createSurgeryModalOpen, setCreateSurgeryModalOpen] = useState(false);
  const [surgicalHistoryItems, setSurgicalHistoryItems] = useState<any>([]);
  const [hasSurgicalHistory, setHasSurgicalHistory] = useState(true)

  const [showConfirmation, setShowConfirmation] = useState(false);

  let patientId = useGetPatientId();

  useEffect(() => {
    onEdit();
  }, [])

  function onAddSurgeryData(data: any) {
    let record = surgicalHistoryItems

    if (selectedRowIndex == null) {
      if (surgicalHistoryItems?.length) {
        record.push(data);
      }
      else {
        record = [data]
      }
    }
    else {
      record = surgicalHistoryItems?.map((item: any, index: any) => ({
        ...item,
        surgeryDate: selectedRowIndex === index ? data.surgeryDate : item.surgeryDate,
        rightOrLeft: selectedRowIndex === index ? data.rightOrLeft : item.rightOrLeft,
        complication: selectedRowIndex === index ? data.complication : item.complication,
        surgicalHistorySurgeryTypeId: selectedRowIndex === index ? data.surgicalHistorySurgeryTypeId : item.surgicalHistorySurgeryTypeId,
        surgeryTypeId: selectedRowIndex === index ? data.surgicalHistorySurgeryTypeId : item.surgicalHistorySurgeryTypeId,
        surgeryTechniqueId: selectedRowIndex === index ? data.surgeryTechniqueId : item.surgeryTechniqueId,
        surgeryIndicationId: selectedRowIndex === index ? data.surgeryIndicationId : item.surgeryIndicationId,
        surgeryTypeName: selectedRowIndex === index ? data.surgeryTypeName : item.surgeryTypeName,
        surgerytechniqueName: selectedRowIndex === index ? data.surgerytechniqueName : item.surgerytechniqueName,
        surgeryIndicationName: selectedRowIndex === index ? data.surgeryIndicationName : item.surgeryIndicationName,
        observations: selectedRowIndex === index ? data.observations : item.observations
      }));
    }

    let sortedData = record.sort((first: any, second: any) => 0 - (first.surgeryDate < second.surgeryDate ? 1 : -1));
    setSurgicalHistoryItems(sortedData);

    setSelectedRow({});
    setSelectedRowIndex(null);
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let newList = surgicalHistoryItems.map((item: any) => ({
      ...item,
      surgeryTypeId: item.surgicalHistorySurgeryTypeId,
    }));

    bodyData = {
      ...bodyData,
      id: patientId,
      isSurgicalHistory: hasSurgicalHistory,
      hasSurgicalHistory: hasSurgicalHistory,
      surgicalHistoryItems: newList,
      manSurgicalItems: newList
    };

    setLoading(true);

    let surgicalHistoryService = location.pathname?.indexOf("/clinical-history/surgical") > -1 ?
      services[(isEditOn ? 'updateSurgicalHistory' : 'createSurgicalHistory') as keyof typeof services]
      : services[(isEditOn ? 'updateManSurgicalHistory' : 'createManSurgicalHistory') as keyof typeof services];

    surgicalHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          toastMessage(formatMessage({ id: isEditOn ? "surgical-history-update-message" : "surgical-history-create-message" }));
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function onDelete(data: any, index: any) {

    if (data.id) {
      let parms = {
        surgicalHistoryId: patientId,
        ManSurgicalHistoryId: patientId
      }
      setDeleteLoading(true);

      let surgicalHistoryService = services[(location.pathname?.indexOf("/clinical-history/surgical") > -1 ? 'deleteSurgicalHistory' : 'deleteManSurgicalHistory') as keyof typeof services];

      surgicalHistoryService(parms)
        .then((res) => {
          setDeleteLoading(false);
          if (res.data?.succeeded) {
            setIsEditOn(false);
            resetForm();
            toastMessage(formatMessage({ id: "delete-message" }));
          } else {
            toastMessage(res.data?.message, 'error');
          }
        })
        .catch((err) => {
          setDeleteLoading(false);
          toastMessage(err.message, 'error');
        })
    }
    else {
      let record = surgicalHistoryItems.filter((item: any, idx: any) => idx !== index);
      setSurgicalHistoryItems(record);
    }
  }

  function onEdit() {
    let paramsData = {
      surgicalHistoryId: patientId,
      ManSurgicalHistoryId: patientId
    }
    setLoading(true);
    let surgicalHistoryService = services[(location.pathname?.indexOf("/clinical-history/surgical") > -1 ? 'getSurgicalHistoryById' : 'getManSurgicalHistoryById') as keyof typeof services];
    surgicalHistoryService(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setFormData(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function resetForm() {
    reset({});
    setSurgicalHistoryItems([]);
  }

  function setFormData(resData: any) {
    reset(resData);
    if (location.pathname?.indexOf("/clinical-history/surgical") > -1) {
      let sortedData = resData.surgicalHistoryItems.sort((first: any, second: any) => 0 - (first.surgeryDate < second.surgeryDate ? 1 : -1));
      setSurgicalHistoryItems(sortedData);
      setHasSurgicalHistory(resData.hasSurgicalHistory)
    }
    else {
      let newList = resData.manSurgicalItems?.map((item: any) => ({
        ...item,
        surgicalHistorySurgeryTypeId: item.surgeryTypeId,
      }));
      let sortedData = newList.sort((first: any, second: any) => 0 - (first.surgeryDate < second.surgeryDate ? 1 : -1));
      setSurgicalHistoryItems(sortedData);
      setHasSurgicalHistory(resData.isSurgicalHistory)
    }
  }

  function handleClose() {
    setShowConfirmation(false);
  }

  function onAgree() {
    setSurgicalHistoryItems([]);
    setHasSurgicalHistory(false);
    setShowConfirmation(false);
  }

  return (


    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "heading-clinical-history-surgical" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
            <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "clinical-history-surgical" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="hasSurgicalHistory"
              onChange={() => {
                setHasSurgicalHistory(true);
              }}
              checked={hasSurgicalHistory}
            />
            <RadioButton
              label="No"
              name="hasSurgicalHistory"
              onChange={() => {
                if (surgicalHistoryItems?.length > 0) {
                  setShowConfirmation(true);
                }
                else {
                  setHasSurgicalHistory(false);
                }
              }}
              checked={!hasSurgicalHistory}
            />
          </Grid>

          <Grid item xs={12} lg={8} md={4} sm={6} style={{ textAlign: "right" }}>
            <SecondaryButton
              label={formatMessage({ id: "add-new-surgery" })}
              endIcon={<AddBoxOutlinedIcon color="primary" />}
              onClick={() => {
                setCreateSurgeryModalOpen(true);
                setSelectedRow({});
              }}
              disabled={hasSurgicalHistory ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="year" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="surgery-type" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="technique" /></TableCell>
                    <TableCell style={{ width: "15%" }}><FormattedMessage id="indication" /></TableCell>
                    <TableCell style={{ width: "10%" }}><FormattedMessage id="right-left" /></TableCell>
                    <TableCell style={{ width: "25%" }}><FormattedMessage id="complications" /></TableCell>
                    <TableCell style={{ width: "5%" }}><FormattedMessage id="action" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surgicalHistoryItems?.map((item: any, index: any) => {
                    return (
                      <>
                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                          <TableCell>{dayjs(item.surgeryDate).format('DD-MM-YYYY')}</TableCell>
                          <TableCell>{item.surgeryTypeName}</TableCell>
                          <TableCell>{item.surgerytechniqueName}</TableCell>
                          <TableCell>{item.surgeryIndicationName}</TableCell>
                          <TableCell>{rightLeftOptions.find(type => +type.value === +item.rightOrLeft)?.label}</TableCell>
                          <TableCell>{item.complication}</TableCell>
                          <TableCell>
                            <TableButtonGroup>
                              <TableEditButton onClick={() => {
                                setSelectedRow(item);
                                setCreateSurgeryModalOpen(true);
                                setSelectedRowIndex(index);
                              }}
                              />
                              <DeleteButton
                                onDelete={() => {
                                  let record = surgicalHistoryItems?.filter((item: any, idx: any) => idx !== index);
                                  setSurgicalHistoryItems(record);
                                }}
                              />
                            </TableButtonGroup>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={7} style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                            <TextBox
                              label={formatMessage({ id: "observations" })}
                              placeholder={formatMessage({ id: "observations" })}
                              value={item.observations}
                              onChange={(e: any) => {
                                let record = surgicalHistoryItems?.map((item: any, idx: any) => ({
                                  ...item,
                                  observations: idx === index ? e.target.value : item.observations
                                }));
                                setSurgicalHistoryItems(record);
                              }}
                              style={{ marginTop: "5px" }}
                              inputProps={{ maxLength: 100 }}
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}

                  {surgicalHistoryItems?.length == 0 &&
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell colSpan={7} align="center">No record available</TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observations" })}
              name="observations"
              control={control}
              error={errors.observations}
              rules={validationRule.textbox({ maxLength: 200 })}
              multiline
              rows={2}
            />
          </Grid>

        </Grid>
      </Box>

      {createSurgeryModalOpen && (
        <CreateSurgeryModal
          closeModal={() => {
            setCreateSurgeryModalOpen(false);
            setSelectedRow({});
            setSelectedRowIndex(null);
          }}
          selectedData={selectedRow}
          onAddSurgeryData={onAddSurgeryData}
        />
      )}

      {showConfirmation && (
        <CustomDialog
          open={true}
          onDisagree={handleClose}
          onAgree={onAgree}
          title={formatMessage({ id: "delete-title" })}
          subTitle={formatMessage({ id: "surgical-history-alert-confirmation-message" })}
        />
      )}

      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};
export default SurgicalHistory;
