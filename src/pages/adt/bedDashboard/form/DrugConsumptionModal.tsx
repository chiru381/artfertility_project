import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import dayjs from 'dayjs';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import { TableButtonGroup, DeleteButton } from 'components/button';
import { TextBox, CustomTextBox } from 'components/forms';
import { FormModal } from 'components';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices, batchStorePopupColumns } from 'utils/constants';
import { createCustomCompositeFilter, getFormBody, validationRule } from 'utils/global';
import { PopupSearchTable } from 'components';
import { useAsyncDebounce } from 'utils/hooks';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
  closeModal: () => void;
  selectedData: any;
}

const DrugConsumptionModal = (props: Props) => {
  const { closeModal, selectedData } = props;
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { toastMessage } = useToastMessage();

  const { fields, append, remove } = useFieldArray({ control, name: "inPatientPharmacyBreakups" });

  const [loading, setLoading] = useState(false);
  const [drugPopupOpen, setDrugPopupOpen] = useState(false);
  const [drugText, setDrugText] = useState("");

  const { batchStoreData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      batchStoreData: masterPaginationReducer[masterPaginationServices.drugBatchStore].data
    }),
    shallowEqual
  );


  useEffect(() => {
    let params = { storeId: selectedData?.stationId };
    dispatch(getMasterPaginationData(masterPaginationServices.drugBatchStore, params));
  }, []);

  const onChangeValue = useAsyncDebounce((value: string) => {
    let members = ["Item.ItemLongName", "batchNumber"];
    let params = createCustomCompositeFilter(members, value);

    params = {
      ...params,
      storeId: selectedData?.stationId
    }

    dispatch(getMasterPaginationData(masterPaginationServices.drugBatchStore, params));
    if (!value) {
      setDrugText("");
    }
  }, 500);

  function onFocus() {
    setTimeout(() => {
      setDrugPopupOpen(true);
    }, 300);
  }

  function onRowClick(row: any) {
    if (row.id) {
      setDrugPopupOpen(false);
      setDrugText("");
      if (!fields.some(({ id, batchId }: any) => row.id == batchId)) {
        append({
          batchNo: row.batchNumber,
          orderQuantity: 0,
          totalAmount: 0,
          expiryDate: row?.expiryDate,
          itemName: row.itemItemLongName,
          quantity: row.quantity,
          mrp: row.mrp,
          purchaseCost: row.purchaseCost,
          sellingPrice: row.sellingPrice,
          itemId: row.itemId,
          drugCategoryId: row.itemDrugCategoryId,
          batchId: row.id
        });
      }
    }
  }

  function onSubmit(data: any) {

    let bodyData = getFormBody(data);

    let selectedAdmission = selectedData?.admissions?.find((item: any) => item.bedId == selectedData?.id)

    let inPatientPharmacyBreakupsData = bodyData?.inPatientPharmacyBreakups?.map((item: any) => ({
      ...item,
      totalAmount: item?.orderQuantity ?? 0 * item?.sellingPrice ?? 0
    }));

    bodyData = {
      ...bodyData,
      admissionId: selectedData.admissionId,
      packageAllocationId: selectedAdmission.inPatientPackageAllocationId,
      orderDoctorId: selectedAdmission?.inPatientPackageAllocationTreatingDoctorId,
      bedId: selectedData.id,
      inPatientPharmacyBreakups: inPatientPharmacyBreakupsData
    }

    setLoading(true);
    services.createBookConsumption(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          closeModal();
          toastMessage(formatMessage({ id: "consumable-consumption-create-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  return (
    <FormModal
      onCancel={closeModal}
      onConfirm={handleSubmit(onSubmit)}
      title={formatMessage({ id: "medication-consumption" })}
      modalSize="medium"
      confirmLabel="Save"
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextBox
            placeholder={formatMessage({ id: "search" })}
            value={drugText}
            name="drugName"
            required={true}
            error={errors.drugName}
            autoComplete="off"
            onChange={e => {
              setDrugText(e.target.value);
              onChangeValue(e.target.value);
            }}
            onFocus={onFocus}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {drugText ? (
                    <IconButton
                      onClick={() => {
                        setDrugText("");
                      }}
                      size="small"
                    >
                      <CancelIcon color="primary" />
                    </IconButton>
                  ) : (
                    <SearchIcon />
                  )}
                </InputAdornment>
              )
            }}
          />

          <PopupSearchTable
            popupOpen={drugPopupOpen && batchStoreData?.modelItems?.length}
            closePopup={() => setDrugPopupOpen(false)}
            tableData={batchStoreData.modelItems}
            columns={[...batchStorePopupColumns(formatMessage)]}
            onRowClick={onRowClick}
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer>
            <Table size="small" stickyHeader aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25%" }}><FormattedMessage id="item" /></TableCell>
                  <TableCell style={{ width: "23%" }}><FormattedMessage id="item-quantity" /></TableCell>
                  <TableCell style={{ width: "25%" }}><FormattedMessage id="batch-number" /></TableCell>
                  <TableCell style={{ width: "22%" }}><FormattedMessage id="expiry" /></TableCell>
                  <TableCell style={{ width: "5%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map(({ id, itemName, batchNo, expiryDate }: any, index) => {
                  return (
                    <TableRow key={id}>
                      <TableCell>{itemName}</TableCell>
                      <TableCell>
                        <CustomTextBox
                          name={`inPatientPharmacyBreakups[${index}][orderQuantity]`}
                          control={control}
                          error={errors?.[`inPatientPharmacyBreakups`]?.[index]?.["orderQuantity"]}
                          rules={validationRule.textbox({ type: "number" })}
                        />
                      </TableCell>
                      <TableCell>{batchNo}</TableCell>
                      <TableCell>
                        {expiryDate ? dayjs(expiryDate).format('DD-MM-YYYY') : ""}</TableCell>
                      <TableCell>
                        <TableButtonGroup>
                          <DeleteButton
                            onDelete={() => {
                              remove(index);
                            }}
                          />
                        </TableButtonGroup>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!fields?.length &&
                  <TableRow>
                    <TableCell style={{ textAlign: "center" }} colSpan={5}>No Record Available.</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </FormModal>
  )
}

export default DrugConsumptionModal;