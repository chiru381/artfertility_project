import React, { ReactNode } from 'react';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumnState } from "mui-datatables";

import { CustomToolbar } from "./CustomToolBar";
import { useAsyncDebounce } from 'utils/hooks';
import { MuiThemeProvider, TableCell, Typography } from '@material-ui/core';
import { tableTheme } from 'assets/styles/mui';
import TableFilter from './TableFilter';

interface TableColumns extends MUIDataTableColumnState {
    type?: string;
    selectOptions?: { label: string, value: string | number | boolean }[];
    extendedColumns?: { label: string, name: string | number | boolean }[];
    primaryColumnName?: string; //if column name is modified and it will works for global search and custom filters
    secondaryColumnName?: string; //if we want to provide custom column name for custom filter. it only works for custom filter
    hideGlobalSearchFilter?: boolean;
    disableSort?: boolean;
    disableFilter?: boolean;
}

interface Props {
    tableState?: any;
    setTableState?: React.Dispatch<React.SetStateAction<any>>;
    tableData: { [key: string]: any }[];
    columns: TableColumns[];
    options?: MUIDataTableOptions;
    loading?: boolean;
    rowsCount?: number;
    title?: string;
    toolbar?: ReactNode;
}

let columnOptions = {
    sortThirdClickReset: true,
}

const CustomTable = React.memo((props: Props) => {
    const { tableState, setTableState, tableData, columns, loading, rowsCount, title, toolbar } = props;

    const handlePageChange = (page: number) => {
        if (setTableState) {
            setTableState((prevState: any) => ({ ...prevState, page: page + 1 }))
        }
    };

    const handlePageSizeChange = (numOfRows: number) => {
        if (setTableState) {
            setTableState((prevState: any) => ({ ...prevState, limit: numOfRows }))
        }
    };

    const onChangeSearchQuery = useAsyncDebounce((value: string | null) => {
        if (((value !== null) || (value === null && tableState?.searchText)) && setTableState) {
            setTableState((prevState: any) => ({ ...prevState, searchText: value ?? "" }));
        }
    }, 200);

    const handleSortModelChange = (changedColumn: string, direction: any | string) => {
        if (setTableState) {
            if (direction !== "none") {
                let selectedColumn = columns.find(col => col.name === changedColumn);
                setTableState((prevState: any) => ({ ...prevState, sortKey: selectedColumn?.primaryColumnName ?? changedColumn, sortType: direction }));
            } else {
                setTableState((prevState: any) => ({ ...prevState, sortKey: '', sortType: '' }));
            }
        }
    };

    let customToolbar = {
        customToolbar: () => <CustomToolbar toolbar={toolbar} columns={columns} setTableState={setTableState} tableState={tableState} loading={loading} />
    }

    let conditionalToolBar = (tableState || toolbar) ? customToolbar : {};

    const options: MUIDataTableOptions = {
        fixedHeader: false,
        filter: false,
        search: false,
        pagination: tableState ? true : false,
        print: false,
        download: false,
        viewColumns: false,
        sort: true,
        responsive: 'standard',
        serverSide: true,
        selectableRowsHideCheckboxes: true,
        count: rowsCount,
        rowsPerPage: tableState?.limit,
        rowsPerPageOptions: [10, 20, 30, 40, 50],
        isRowSelectable: () => false,
        onColumnSortChange: (changedColumn: string, direction: string) => handleSortModelChange(changedColumn, direction),
        onChangeRowsPerPage: (numOfRows: number) => handlePageSizeChange(numOfRows),
        onChangePage: (page: number) => handlePageChange(page),
        onSearchChange: (searchText: string | null) => onChangeSearchQuery(searchText),
        ...conditionalToolBar,
        draggableColumns: {
            enabled: true
        },
        elevation: 1,
        ...props.options,
        page: tableState?.page - 1,
    };

    let CustomHeader = (label: string) => {
        if (label) {
            return ({
                customHeadRender: (columnMeta: any, handleToggleColumn: any, sortOrder: any) => {
                    const { index, name } = columnMeta;
                    let isAsc = sortOrder?.direction === "asc" && name === sortOrder?.name;
                    let isDesc = sortOrder?.direction === "desc" && name === sortOrder?.name;
                    let selectedColumn = columns.find(col => col.name === name);
                    return (
                        <TableCell key={columnMeta.index}>
                            <div
                                onClick={() => selectedColumn?.disableSort ? null : handleToggleColumn(index)}
                                style={{
                                    display: "flex", alignItems: "center", marginBottom: "5px",
                                    cursor: selectedColumn?.disableSort ? "not-allowed" : "pointer",
                                    filter: selectedColumn?.disableSort ? "opacity(60%)" : "blur(0px)"
                                }}
                            >
                                <Typography variant="body2">
                                    <span style={{ fontWeight: 600, color: "grey" }}>{columnMeta.label}</span>
                                </Typography>
                                <span style={{ display: "flex", flexDirection: "column", marginLeft: "10px", }}>
                                    {!isDesc && <i className="arrow-up"></i>}
                                    {!isAsc && <i className="arrow-down" style={{ marginTop: "2px" }}></i>}
                                </span>
                            </div>

                            <div style={{
                                // maxWidth: "200px",
                                pointerEvents: selectedColumn?.disableFilter ? "none" : "unset",
                                filter: selectedColumn?.disableSort ? "opacity(60%)" : "blur(0px)"
                            }}>
                                {(selectedColumn && setTableState) && (
                                    <TableFilter
                                        column={selectedColumn}
                                        setTableState={setTableState}
                                    />
                                )}
                            </div>

                        </TableCell>
                    )
                }
            })
        } else {
            return {}
        }
    }

    return (
        <MuiThemeProvider theme={tableTheme}>
            <MUIDataTable
                title={title ? <Typography variant="body1" style={{ fontWeight: "bold", textTransform: "uppercase", color: "#222222" }}>{title}</Typography> : ""}
                data={tableData}
                columns={columns.map((column: any) => ({
                    ...column,
                    options: {
                        ...columnOptions,
                        ...column?.options ?? {},
                        ...CustomHeader(column.label),
                    }
                }))}
                options={options}
            />
        </MuiThemeProvider>

    )
});

export default CustomTable;