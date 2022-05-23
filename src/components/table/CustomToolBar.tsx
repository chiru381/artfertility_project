import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import LinearProgress from '@material-ui/core/LinearProgress';
import Search from '@material-ui/icons/Search';

import { TextBox } from "components/forms";
import { useAsyncDebounce } from 'utils/hooks';
import { PopupTooltip } from "components";
import { SecondaryButton } from "components/button";


export const CustomToolbar = React.memo((props: any) => {
    const { setTableState, columns, toolbar, loading } = props;

    return (
        <>
            <SearchFilter setTableState={setTableState} columns={columns} />

            {toolbar ? toolbar : null}

            {loading && <LinearProgress style={{ position: "absolute", width: "100%", left: 0, bottom: 0 }} />}
        </>
    )
});


const SearchFilter = React.memo(({ columns, setTableState }: any) => {
    const [searchText, setSearchText] = useState('');
    const [searchFilterColumnOpen, setSearchFilterColumnOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    let filterColumns = columns?.filter((col: any) => col?.hideGlobalSearchFilter ? false : col.name).reduce((acc: any, curr: any) => (acc = [...acc, ...(curr?.extendedColumns ? curr?.extendedColumns : [{ label: curr.label, name: curr?.primaryColumnName ?? curr.name }])]), []);

    useEffect(() => {
        setSelectedColumns(filterColumns.map((col: any) => col.name));
    }, []);

    function onChangeSearchFilter(colName: string) {
        let isColExists = selectedColumns.some(selectedCol => selectedCol === colName);
        let searchFilters = [];

        if (isColExists) {
            searchFilters = selectedColumns.filter(col => col !== colName);
        } else {
            searchFilters = [...selectedColumns, colName];
        }
        setSelectedColumns(searchFilters);

        if (searchFilters.length && searchText) {
            onFilter(searchText, searchFilters);
        }
    }

    function onFilter(value: string | null, selectedColumns: string[]) {
        let data = [
            {
                "logicalOperator": 1,
                "customFilters": selectedColumns.map(col => ({ "member": col, "operator": 8, "value": value ?? "" }))
            }
        ];

        if (data[0].customFilters.length) {
            setTableState((prevState: any) => ({ ...prevState, searchColumnFilters: value ? data : [] }));
        }
    }

    const onChangeSearchQuery = useAsyncDebounce((value: string | null) => {
        if (selectedColumns.length) {
            onFilter(value, selectedColumns);
        }
    }, 400);

    function toggleAllFields(status: boolean) {
        let searchFilters = [];

        if (status) {
            searchFilters = filterColumns.map((col: any) => col.name);
        }
        setSelectedColumns(searchFilters);
        if (searchText) {
            onFilter(searchText, searchFilters);
        }
    }

    return (
        <>
            {filterColumns?.length ? (
                <div style={{ display: "flex" }}>
                    <PopupTooltip
                        content={(
                            <GlobalSearchColumnFilter
                                filterColumns={filterColumns}
                                selectedColumns={selectedColumns}
                                onChangeSearchFilter={onChangeSearchFilter}
                                toggleAllFields={toggleAllFields}
                            />
                        )}
                        open={searchFilterColumnOpen}
                        placement="bottom-end"
                        onClose={() => setSearchFilterColumnOpen(false)}
                        style={{ marginTop: "10px", zIndex: 100000 }}
                    >
                        <SecondaryButton
                            onClick={() => setSearchFilterColumnOpen(true)}
                            label={(
                                <Typography variant="body2">
                                    <FormattedMessage id="search-by" />
                                </Typography>
                            )}
                            endIcon={<ArrowDropDown style={{ fontSize: "22px" }} />}
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, height: "35px" }}
                        />
                    </PopupTooltip>

                    <TextBox
                        placeholder="Search"
                        style={{ width: "280px" }}
                        value={searchText}
                        onChange={e => {
                            setSearchText(e.target.value);
                            onChangeSearchQuery(e.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            style: { height: "35px", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                        }}
                    />
                </div>
            ) : <></>
            }
        </>
    )
})

const GlobalSearchColumnFilter = React.memo(({ filterColumns, selectedColumns, onChangeSearchFilter, toggleAllFields }: any) => {
    const [allFieldsSelected, setAllFiledSelected] = useState(true);
    const { formatMessage } = useIntl();

    useEffect(() => {
        setAllFiledSelected(selectedColumns.length === filterColumns.length);
    }, [selectedColumns]);

    return (
        <div style={{ backgroundColor: 'white', maxHeight: "500px", overflow: "auto" }}>
            <div style={{ width: "220px", padding: "0 12px" }}>
                <FormControlLabel
                    style={{ width: "100%" }}
                    control={
                        <Checkbox
                            size="small"
                            checked={allFieldsSelected}
                            onChange={e => {
                                setAllFiledSelected(e.target.checked);
                                toggleAllFields(e.target.checked);
                            }}
                        />
                    }
                    label={<Typography variant="body2">{formatMessage({id: "all-fields"})}</Typography>}
                />
            </div>

            {filterColumns.map((col: any, index: number) => (

                <div key={index} style={{ width: "220px", padding: "0 12px" }}>
                    <FormControlLabel
                        style={{ width: "100%" }}
                        control={
                            <Checkbox
                                size="small"
                                checked={selectedColumns.some((selectedCol: string) => selectedCol === col.name)}
                                onChange={() => onChangeSearchFilter(col.name)}
                                name="checkedB"
                            />
                        }
                        label={<Typography variant="body2">{col.label}</Typography>}
                    />
                </div>
            ))}
        </div>
    )
})