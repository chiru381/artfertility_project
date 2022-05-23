import React, { useState, memo } from 'react';
import dayjs from 'dayjs';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Close from '@material-ui/icons/Close';

import { TextBox, Select, PrimaryDatePicker } from 'components/forms';
import { dateFiltersLists, filterOperators, filterTypes, images, numberFiltersLists, textFiltersLists } from 'utils/constants';
import { PopupTooltip } from 'components/PopupTooltip';
import { useAsyncDebounce } from 'utils/hooks';
import { makeStyles } from '@material-ui/core';


interface Props {
    column: { [key: string]: any };
    setTableState: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}

const useStyles = makeStyles(() => ({
    root: {
        height: "28px",
        minWidth: "140px"
    },
}));

const TableFilter = memo((props: Props) => {
    const { column, setTableState } = props;
    let columnType = column?.type;

    if (columnType === filterTypes.number) {
        return <TableNumberFilter
            column={column}
            setTableState={setTableState}
        />
    } else if (columnType === filterTypes.date) {
        return <TableDateFilter
            column={column}
            setTableState={setTableState}
        />
    } else if (columnType === filterTypes.select || columnType === filterTypes.multiSelect || column.type === filterTypes.boolean) {
        return <TableSelectFilter
            column={column}
            setTableState={setTableState}
        />
    } else {
        return <TableTextFilter
            column={column}
            setTableState={setTableState}
        />
    }
})

export default TableFilter;




export const TableTextFilter = memo(({ column, setTableState }: any) => {
    const { name, primaryColumnName } = column;
    let memberName = primaryColumnName ?? name;
    const classes = useStyles();

    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(filterOperators.contains);


    const onChangeValue = useAsyncDebounce((value: string) => {
        if (value) {
            onChangeTableState(value, selectedOperator);
        } else {
            setTableState((prevState: any) => ({ ...prevState, columnFilter: prevState.columnFilter.filter((column: any) => column.member !== memberName) }));
        }
    }, 400);

    function onChangeOperator(operator: number) {
        setSelectedOperator(operator);
        if (searchText) {
            onChangeTableState(searchText, operator);
        }
    }

    function onChangeTableState(value: string, operator: number) {
        setTableState((prevState: any) => ({ ...prevState, columnFilter: [...prevState.columnFilter.filter((column: any) => column.member !== memberName), { member: memberName, value, operator }] }));
    }

    return (
        <TextBox
            placeholder={`Search`}
            value={searchText}
            onChange={e => {
                onChangeValue(e.target.value);
                setSearchText(e.target.value);
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <PopupTooltip
                            content={<CustomFilterPopup filterOperators={textFiltersLists} selectedOperator={selectedOperator} onChangeOperator={onChangeOperator} />}
                            open={open}
                            placement="bottom-end"
                            onClose={() => setOpen(false)}
                            style={{ marginTop: "10px" }}
                        >
                            <div style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
                                <img src={images.filterIcon} style={{ width: "12px", height: "12px" }} />
                            </div>
                        </PopupTooltip>
                    </InputAdornment>
                ),
                classes: { root: classes.root }
            }}
        />
    )
});



export const TableNumberFilter = memo(({ column, setTableState }: any) => {
    const { name, primaryColumnName } = column;
    let memberName = primaryColumnName ?? name;
    const classes = useStyles();

    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(filterOperators.isGreaterThanOrEqualTo);

    const onChangeValue = useAsyncDebounce((value: string) => {
        if (value) {
            onChangeTableState(value, selectedOperator);
        } else {
            setTableState((prevState: any) => ({ ...prevState, columnFilter: prevState.columnFilter.filter((column: any) => column.member !== memberName) }));
        }
    }, 200);

    function onChangeOperator(operator: number) {
        setSelectedOperator(operator);
        if (searchText) {
            onChangeTableState(searchText, operator);
        }
    }

    function onChangeTableState(value: string, operator: number) {
        setTableState((prevState: any) => ({ ...prevState, columnFilter: [...prevState.columnFilter.filter((column: any) => column.member !== memberName), { member: memberName, value, operator }] }));
    }

    return (
        <TextBox
            placeholder={`Search`}
            value={searchText}
            onChange={e => {
                onChangeValue(e.target.value);
                setSearchText(e.target.value);
            }}
            type="number"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <PopupTooltip
                            content={<CustomFilterPopup filterOperators={numberFiltersLists} selectedOperator={selectedOperator} onChangeOperator={onChangeOperator} />}
                            open={open}
                            placement="bottom-end"
                            onClose={() => setOpen(false)}
                            style={{ marginTop: "10px" }}
                        >
                            <div style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
                                <img src={images.filterIcon} style={{ width: "12px", height: "12px" }} />
                            </div>
                        </PopupTooltip>
                    </InputAdornment>
                ),
                classes: { root: classes.root }
            }}
        />
    )
});


export const TableDateFilter = ({ column, setTableState }: any) => {
    const { name, primaryColumnName } = column;
    let memberName = primaryColumnName ?? name;
    const classes = useStyles();

    const [date, setDate] = useState<null | string>(null);
    const [open, setOpen] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(filterOperators.isGreaterThanOrEqualTo);


    const onChangeDate = (value: string) => {
        if (value) {
            onChangeTableState(value, selectedOperator);
        } else {
            setTableState((prevState: any) => ({ ...prevState, columnFilter: prevState.columnFilter.filter((column: any) => column.member !== memberName) }));
        }
    };

    function onChangeOperator(operator: number) {
        setSelectedOperator(operator);
        if (date) {
            onChangeTableState(date, operator);
        }
    }

    function onChangeTableState(value: string, operator: number) {
        setTableState((prevState: any) => ({ ...prevState, columnFilter: [...prevState.columnFilter.filter((column: any) => column.member !== memberName), { member: memberName, value, operator }] }));
    }

    return (
        <PrimaryDatePicker
            onChange={(date: any) => {
                let formatedDate = dayjs(date).format('YYYY-MM-DD');
                if (date === null) {
                    onChangeDate('');
                    setDate(null);
                } else if (formatedDate !== "Invalid Date") {
                    onChangeDate(formatedDate);
                    setDate(formatedDate);
                }
            }}
            value={date}
            style={{ background: 'white' }}
            format="DD-MM-YYYY"
            placeholder="dd-mm-yyyy"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {date ? (
                            <div
                                style={{ cursor: "pointer", display: "flex" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChangeDate('');
                                    setDate(null);
                                }}>
                                <Close fontSize="small" style={{ fontSize: "18px" }} />
                            </div>
                        ) : (
                            <CalendarToday fontSize="small" style={{ fontSize: "14px" }} />
                        )}
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <PopupTooltip
                            content={<CustomFilterPopup filterOperators={dateFiltersLists} selectedOperator={selectedOperator} onChangeOperator={onChangeOperator} />}
                            open={open}
                            placement="bottom-end"
                            onClose={() => setOpen(false)}
                            style={{ marginTop: "10px" }}
                        >
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(!open)
                                }}>
                                <img src={images.filterIcon} style={{ width: "12px", height: "12px" }} />
                            </div>
                        </PopupTooltip>
                    </InputAdornment>
                ),
                classes: { root: classes.root }
            }}
        />
    )
}


export const TableSelectFilter = memo(({ column, setTableState }: any) => {
    const { name, selectOptions, type, primaryColumnName, secondaryColumnName } = column;
    let memberName = secondaryColumnName ?? primaryColumnName ?? name;

    const isMultiSelect = type === filterTypes.multiSelect;
    let operator = isMultiSelect ? filterOperators.isContainedIn : (type === filterTypes.boolean) ? filterOperators.isEqualTo : filterOperators.isEqualTo;
    let defaultValue = isMultiSelect ? [] : null;

    const [value, setValue] = React.useState<any>(defaultValue);

    const onChangeValue = (value: any) => {
        if (value?.value || value?.length) {
            let selectValue = isMultiSelect ? value.map((v: any) => String(v.value)) : String(value.value);
            setTableState((prevState: any) => ({
                ...prevState,
                columnFilter: [
                    ...prevState.columnFilter.filter((column: any) => column.member !== memberName),
                    { member: memberName, value: selectValue, operator }
                ]
            }));
        } else {
            setTableState((prevState: any) => ({ ...prevState, columnFilter: prevState.columnFilter.filter((column: any) => column.member !== memberName) }));
        }
    };

    return (
        <Select
            options={selectOptions}
            placeholder={`Select`}
            value={value}
            onChange={(_, data) => {
                setValue(data);
                onChangeValue(data)
            }}
            multiple={isMultiSelect}
            ListboxProps={{ style: { fontSize: '14px' } }}
            textFieldProps={{
                InputProps: {
                    style: { height: 28 }
                }
            }}
        />
    )
});



interface CustomFilterState {
    filterOperators: { label: string, operator: number }[];
    selectedOperator: number;
    onChangeOperator: (operator: number) => void;
}

export function CustomFilterPopup({ filterOperators, selectedOperator, onChangeOperator }: CustomFilterState) {
    return (
        <div>
            {filterOperators.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChangeOperator(item.operator);
                    }}
                    style={{ backgroundColor: (selectedOperator === item.operator) ? 'rgba(0,0,0,0.1)' : 'white', fontSize: "14px" }}
                >
                    <span>{item.label}</span>
                </MenuItem>
            ))}
        </div>
    )
}