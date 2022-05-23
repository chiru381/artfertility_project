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

import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { TableButtonGroup, DeleteButton, SecondaryButton } from 'components/button';
import { TextBox, CustomTextBox, Select, CheckBox } from 'components/forms';
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

const ConsumableIssueModal = (props: Props) => {
  const { closeModal, selectedData } = props;
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { toastMessage } = useToastMessage();

  const { fields, append, remove } = useFieldArray({ control, name: "inPatientPharmacyBreakups" });

  const [loading, setLoading] = useState(false);

  const [drugPopupOpen, setDrugPopupOpen] = useState(false);
  const [drugText, setDrugText] = useState("");
  const [kitItems, setKITItems] = useState<any>([]);
  const [value, setValue] = useState<any>({});
  const [openSelectedIndex, setOpenSelectedIndex] = useState(-1);

  const { batchStoreData, kitTemplateData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      batchStoreData: masterPaginationReducer[masterPaginationServices.consumableBatchStore].data,
      kitTemplateData: masterPaginationReducer[masterPaginationServices.kitTemplate].data
    }),
    shallowEqual
  );

  let kitTemplateOptions = kitTemplateData.modelItems?.map((option: any) => ({ label: option.kitName, value: option.id, }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.kitTemplate, {}));
    let params = { storeId: selectedData?.stationId };
    dispatch(getMasterPaginationData(masterPaginationServices.consumableBatchStore, params));
  }, [])


  const onChangeValue = useAsyncDebounce((value: string) => {
    let members = ["Item.ItemLongName", "batchNumber"];
    let params = createCustomCompositeFilter(members, value);
    params = {
      ...params,
      storeId: selectedData?.stationId
    }
    dispatch(getMasterPaginationData(masterPaginationServices.consumableBatchStore, params));
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
      if (row?.id) {
        append(
          {
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
          }
        )
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
          toastMessage(formatMessage({ id: "medication-consumption-create-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function getKITTemplateByIdApiCall(kitId: any) {
    let params = {
      kitTemplateId: kitId
    };

    services.getKITTemplateById(params)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          let kitData = res.data.response?.kitItemMappings?.map((item: any) => ({
            ...item,
            itemName: item.itemItemLongName,
            itemBatchStores: item?.itemBatchStores?.map((row: any) => ({ ...row, isSelected: false })),
            isSelected: false
          }));
          setKITItems(kitData);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onAddKITItemToBookingList() {

    kitItems?.map((row: any) => {
      if (row.isSelected || row?.itemBatchStores?.some((item: any) => item.isSelected)) {

        row?.itemBatchStores?.map((option: any) => {
          if (!fields.some(({ id, batchId }: any) => option.id == batchId)) {
            append({
              batchNo: option.batchNumber,
              orderQuantity: 0,
              totalAmount: 0,
              expiryDate: option?.expiryDate,
              itemName: option.itemItemLongName,
              quantity: option.quantity,
              mrp: option.mrp,
              purchaseCost: option.purchaseCost,
              sellingPrice: option.sellingPrice,
              itemId: option.itemId,
              drugCategoryId: option.itemDrugCategoryId,
              batchId: option.id
            });
          }
        })
      }
    });
  }

  return (
    <FormModal
      onCancel={closeModal}
      onConfirm={handleSubmit(onSubmit)}
      title={formatMessage({ id: "consumable-consumption" })}
      modalSize="medium"
      confirmLabel="Save"
    >
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              label={formatMessage({ id: "kit" })}
              options={kitTemplateOptions}
              value={value}
              onChange={(_, data: any) => {
                setValue(data);
                if (data?.value) {
                  getKITTemplateByIdApiCall(data?.value);
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table size="small" aria-label="sticky table" style={{ border: "1px solid #c2c2c2" }}>
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedMessage id="kit-item" /></TableCell>
                    <TableCell><FormattedMessage id="kit-quantity" /></TableCell>
                    <TableCell><FormattedMessage id="qoh" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kitItems.map((item: any, index: number) => {
                    return (
                      <>
                        <TableRow key={index}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.qoh}</TableCell>
                          <TableCell>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpenSelectedIndex(openSelectedIndex == index ? -1 : index)}>
                              {openSelectedIndex == index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                            <Collapse in={openSelectedIndex == index} timeout="auto" unmountOnExit>
                              <Box margin={1}>
                                <Table size="small" aria-label="sticky table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell><FormattedMessage id="batch-number" /></TableCell>
                                      <TableCell><FormattedMessage id="expiry" /></TableCell>
                                      <TableCell><FormattedMessage id="quantity" /></TableCell>
                                      <TableCell>
                                        {kitItems?.length > 0 && <CheckBox
                                          onChange={(_, data: any) => {
                                            let kitData = kitItems?.map((record: any, idx: number) => ({
                                              ...record,
                                              itemBatchStores: index == idx ? record?.itemBatchStores?.map((option: any) => ({
                                                ...option,
                                                isSelected: data,
                                              })) : record?.itemBatchStores?.map((option: any) => ({
                                                ...option,
                                                isSelected: false
                                              })),
                                              isSelected: index == idx ? data : false
                                            }));
                                            setKITItems(kitData);
                                          }}
                                          checked={item.isSelected}
                                        />
                                        }
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {item.itemBatchStores?.map((row: any, subIndex: number) => (
                                      <TableRow key={row.expiryDate}>
                                        <TableCell component="th" scope="row">
                                          {row.batchNumber}
                                        </TableCell>
                                        <TableCell>
                                          {row.expiryDate ? dayjs(row.expiryDate).format('DD-MM-YYYY') : ""}</TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>
                                          <CheckBox
                                            onChange={(_, data: any) => {
                                              let kitData = kitItems?.map((record: any, idx: number) => ({
                                                ...record,
                                                itemBatchStores: index == idx ? record?.itemBatchStores?.map((option: any, subIdx: number) => ({
                                                  ...option,
                                                  isSelected: subIndex == subIdx ? data : option.isSelected,
                                                })) : record?.itemBatchStores?.map((option: any) => ({
                                                  ...option,
                                                  isSelected: false
                                                }))
                                              }));

                                              setKITItems(kitData);
                                            }}
                                            checked={row.isSelected}
                                          />
                                        </TableCell>

                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    )
                  })}
                  {!kitItems?.length &&
                    <TableRow>
                      <TableCell style={{ textAlign: "center" }} colSpan={4}>No Record Available.</TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <SecondaryButton
              label={formatMessage({ id: "add" })}
              onClick={() => {
                onAddKITItemToBookingList();
              }}
              style={{ display: "flex", float: "right" }}
            />
          </Grid>
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
                    <TableCell style={{ width: "25%" }}><FormattedMessage id="expiry" /></TableCell>
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
                        <TableCell>{expiryDate ? dayjs(expiryDate).format('DD-MM-YYYY') : ""}</TableCell>
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
      </>
    </FormModal>
  )
}

export default ConsumableIssueModal;