import { useEffect, useMemo, useState, useContext } from 'react';
import { useHistory, useLocation, useRouteMatch, } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { HoverLoader, SimpleTable } from 'components';
import { documentUploadColumns, documentUploadMockData, masterPaginationServices, ownerOptions, tableInitialState } from 'utils/constants';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import { RootReducerState } from 'utils/types';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { IconButton, InputAdornment, useTheme } from '@material-ui/core';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { useGetPatientId } from 'utils/hooks';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/Remove';
import RootContext from "utils/context/RootContext";
import { services } from 'utils/services';
import { DeleteButton, SecondaryButton, TableEditButton } from 'components/button';
import { TextBox } from 'components/forms';
import SearchIcon from '@material-ui/icons/Search';
import { Folder } from '@material-ui/icons';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import dayjs from 'dayjs';
interface Props {

}

const DocumentUpload = (props: Props) => {
    const { toastMessage } = useContext<any>(RootContext);
    const history = useHistory();
    const { formatMessage } = useIntl();
    const [tableState, setTableState] = useState(tableInitialState);
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const theme = useTheme();
    let { url } = useRouteMatch();
    const [searchText, setSearchText] = useState('');

    const { documentUpload, documentUploadLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                documentUpload: masterPaginationReducer[masterPaginationServices.clinicalDocumentUpload].data,
                documentUploadLoading: masterPaginationReducer[masterPaginationServices.clinicalDocumentUpload].loading
            })
        },
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    let patientId = useGetPatientId();

    function onApiCall(withState: boolean = true) {
        let params = getTableParams(tableState);
        params.patientId = patientId;
        dispatch(getMasterPaginationData(masterPaginationServices.clinicalDocumentUpload, params));
    }

    // console.log({ documentUpload })
    const { modelItems } = documentUpload;

    const [tableRows, setTableRows] = useState<{ [key: string]: any }[]>([]);

    useEffect(() => {
        if (documentUploadMockData) {
            const uniqueArray = documentUploadMockData.filter((v, i, a) => a.findIndex(t => (t.clinicalDocumentTypeId === v.clinicalDocumentTypeId)) === i);
            const finalArray = uniqueArray.map((item, index) => ({
                folderName: `Folder Name ${index + 1}`,
                children: documentUploadMockData.filter(child => +child.clinicalDocumentTypeId === +item.clinicalDocumentTypeId)
            }))
            setTableRows(finalArray)
        }
    }, [documentUploadMockData])


    function onDeleteData(data: any) {
        const parms = {
            serviceId: data.id,
        };
        setDeleteLoading(true);
        services
            .deleteDocumentUpload(parms)
            .then((res: any) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "delete-message" }));
                } else {
                    toastMessage(res.data?.message, "error");
                }
            })
            .catch((err: any) => {
                setDeleteLoading(false);
                toastMessage(err.message, "error");
            });
    }


    const ExpandableTableRow = ({ children, expandComponent, ...otherProps }: any) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <>
                <TableRow {...otherProps}>
                    <TableCell padding="checkbox">
                        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                            {!isExpanded ? <AddCircleIcon /> : <RemoveIcon />}
                        </IconButton>
                    </TableCell>
                    {children}
                </TableRow>
                {isExpanded && (
                    expandComponent?.map((row: any, index: number) => <TableRow key={index}>
                        <TableCell padding="checkbox" />
                        <TableCell>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <InsertDriveFileIcon style={{ color: "#CB0606" }} />{row.documentName}
                            </div>
                        </TableCell>
                        <TableCell align="center">{row.documentDate ? dayjs(row.documentDate).format("DD-MM-YYYY") : ""}</TableCell>
                        <TableCell align="center">{ownerOptions.find((item: any) => +item.value === +row.owner)?.label}</TableCell>
                        <TableCell align="center">{row.observations}</TableCell>
                        <TableCell align="center"><TableEditButton
                            onClick={() => history.push(`${url}/edit/${row.id}`)}
                        /></TableCell>
                        <TableCell align="center"><DeleteButton
                            onDelete={() => onDeleteData(row)}
                        /></TableCell>
                    </TableRow>)
                )}
            </>
        );
    };


    function onSearchKeyword(searchKey: string) {
        const uniqueArray = documentUploadMockData.filter((v, i, a) => a.findIndex(t => (t.clinicalDocumentTypeId === v.clinicalDocumentTypeId)) === i);
        const finalArray = uniqueArray.map((item, index) => ({
            folderName: `Folder Name ${index + 1}`,
            children: documentUploadMockData.filter(child => +child.clinicalDocumentTypeId === +item.clinicalDocumentTypeId)
        }))
        if (searchKey) {
            let result = finalArray.filter((item: any) => {
                let isKeywordFound = false;
                // documentUploadColumns.map((col: any) => {
                //     if (item?.[col] && typeof item?.[col] === "string") {
                isKeywordFound = String(item['folderName']).toLowerCase().includes(searchKey.toLowerCase());
                //     }
                // })
                return isKeywordFound;
            });
            setTableRows(result);
        } else {
            setTableRows(finalArray);
        }
    }


    return (
        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "document-upload" })}
        >

            <Box padding={2} component={Paper}>
                <div style={{
                    flexGrow: 1,
                    borderBottom: '1px solid',
                    marginBottom: '15px',
                    padding: '10px'
                }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} lg={3} md={3} sm={12}>
                            <span className="text-15 font-medium"> Document List</span>
                        </Grid>
                        <Grid item xs={12} lg={3} md={3} sm={12}>
                        </Grid>
                        <Grid item xs={12} lg={4} md={4} sm={12}>
                            <TextBox
                                placeholder="Find (word search)"
                                value={searchText}

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <SearchIcon htmlColor={theme.palette.grey[700]} />
                                        </InputAdornment>
                                    )
                                }}

                                size="small"
                                onChange={e => {
                                    setSearchText(e.target.value);
                                    onSearchKeyword(e.target.value)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} lg={2} md={2} sm={12}>
                            <SecondaryButton
                                style={{ width: '100%' }}
                                label="+ Add Document File"
                                onClick={() => history.push(`${url}/create`)}
                            />
                        </Grid>
                    </Grid>
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer style={{ whiteSpace: "nowrap" }}>
                            <Table stickyHeader aria-label="sticky-table" size="small">
                                <TableHead style={{ height: "35px", }}>
                                    <TableRow>
                                        <TableCell style={{ backgroundColor: '#eefafe' }}></TableCell>
                                        {documentUploadColumns.map((colName, index: number) => (
                                            <TableCell
                                                style={{ backgroundColor: '#eefafe' }}
                                                key={index}
                                                // width={`${colSpans?.[index] ? `${colSpans[index]}%` : 'auto'}`}
                                                align={index === 0 ? "left" : "center"}
                                            >
                                                <span className="text-14 font-medium">
                                                    <FormattedMessage id={colName.label} />
                                                </span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {tableRows.map((row: any, index: number) => {
                                        return (
                                            <ExpandableTableRow
                                                hover
                                                key={index}
                                                style={{ height: "35px" }}
                                                expandComponent={row?.children}
                                            >
                                                <TableCell component="th" scope="row" colSpan={6}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                    }}>
                                                        <Folder style={{ color: '#ffcc66' }} /> {row.folderName}
                                                    </div>
                                                </TableCell>
                                            </ExpandableTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {tableRows.length === 0 && (
                            <span className="text-14 font-medium" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <FormattedMessage id="no-records-found" />
                            </span>
                        )}
                    </Grid>
                </Grid>
            </Box>


            {(documentUploadLoading || deleteLoading) && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default DocumentUpload;