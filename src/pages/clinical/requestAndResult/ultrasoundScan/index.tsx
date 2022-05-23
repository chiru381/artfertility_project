import { useEffect, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import dayjs from 'dayjs';

import { SecondaryButton, TableEditButton, DeleteButton, TableViewButton, TableButtonGroup } from 'components/button';
import { HoverLoader, SimpleTable } from 'components';
import { getMasterPaginationData } from "redux/actions";
import { masterPaginationServices, ultrasoundSummaryColumns, usgStatus,usgStatusOptions } from 'utils/constants';
import { requestResultMenuList } from 'utils/constants/menu';
import { services } from 'utils/services';
import { useToastMessage, useGetPatientId } from 'utils/hooks';
import { RootReducerState } from 'utils/types';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import CreateRequestModal from "./CreateRequestModal";

const UltrasoundScanSummary = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const dispatch = useDispatch();
  const { toastMessage } = useToastMessage();
  const { handleSubmit, formState: { errors }, register } = useForm({ mode: "all" });

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createRequestModalOpen, setCreateRequestModalOpen] = useState(false);

  let patientId = useGetPatientId();

  const { ultrasoundSummaryData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        ultrasoundSummaryData: masterPaginationReducer[masterPaginationServices.ultrasoundSummary].data,
        loading: masterPaginationReducer[masterPaginationServices.ultrasoundSummary].loading
      })
    },
    shallowEqual
  );

  const { modelItems } = ultrasoundSummaryData;

  useEffect(() => {
    onApiCall();
  }, []);

  function onApiCall() {
    let params = { patientId };
    dispatch(getMasterPaginationData(masterPaginationServices.ultrasoundSummary, params));
  }

  function handleRowClick(rowData: any) {
    history.push(`ultrasound-scan-general`, { ...rowData });
  }

  function onDelete(data: any) {
    const parms = {
      ultrasoundRequestId: data.ultrasoundRequestId
    }
    setDeleteLoading(true);
    services.deleteUltrasoundRequest(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "delete-message" }));
          onApiCall();
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onFileUpload(files: any, data: any) {

    let formData = new FormData();
    formData.append("ultrasoundGeneralId", `${data.ultraSoundGeneralId}`);
    formData.append("documentFile", files?.[0]);

    setLoading(true);
    services.createUltrasoundGeneralDocument(formData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "delete-message" }));
          onApiCall();
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onViewFile(data: any) {

  }

  let tableRows = modelItems.map((item: any) => {
    return ({
      ...item,
      action: <TableButtonGroup>
        <TableEditButton
          tooltipLabel="Edit"
          onClick={() => handleRowClick(item)}
        />
        {item?.usgStatus == usgStatus.Requested && !item?.ultraSoundGeneralId &&
          <DeleteButton
            tooltipLabel="Delete"
            onDelete={() => onDelete(item)}
          />
        }
        {item?.usgStatus == usgStatus.Verified &&
          <IconButton
            component="label"
            size="small"
          >
            <CloudUploadIcon style={{ width: "25px", height: "25px" }} />
            <input
              type="file"
              hidden
              {...register("documentFile", {
                validate: (value: any) => {
                  const { type, size } = value?.["0"] ?? {};
                  if (type && size) {
                    const isValidSize = +size / 1024 <= 30;
                    if (type && !(type === "application/pdf")) {
                      return "only .pdf supported";
                    } else if (!isValidSize) {
                      return "Maximum size 30 KB";
                    } else {
                      return true;
                    }
                  }
                }
              })}
              onChange={(event: any) => {
                if (event?.target?.files?.length) {
                  onFileUpload(event?.target?.files, item);
                }
              }}
              accept="application/pdf"
            />
          </IconButton>
        }
        <TableViewButton
          tooltipLabel="View File"
          onClick={() => onViewFile(item)}
        />
      </TableButtonGroup >,
      createdDateTime: item?.createdDateTime ? dayjs(item?.createdDateTime).format('DD-MM-YYYY') : '-',
      usgStatus: usgStatusOptions.find(type => +type.value == +item.usgStatus)?.label
    })
  });

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "ultrasound-request" })}
      menuList={requestResultMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="flex-end" justify="space-between">
              <Grid item xs={12} lg={12} sm={12}>
                <SecondaryButton
                  label={formatMessage({ id: "add-new-request" })}
                  onClick={() => {
                    setCreateRequestModalOpen(true);
                  }}
                  style={{ display: "flex", float: "right" }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SimpleTable
              columns={ultrasoundSummaryColumns(formatMessage)}
              tableData={tableRows}
            />
          </Grid>
        </Grid>
      </Box>

      {createRequestModalOpen && (
        <CreateRequestModal
          closeModal={() => {
            setCreateRequestModalOpen(false);
          }}
        />
      )}

      {loading || deleteLoading && <HoverLoader />}

    </CustomClinicalActionHeaderWithWrap>
  )
}

export default UltrasoundScanSummary;