import { useEffect, useState, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { useTheme } from '@material-ui/core/styles';

import { TextBox } from './forms';

interface Props {
    columns: string[];
    colSpans: number[];
    tableData: { [key: string]: any }[];
    paperProps?: PaperProps;
    label?: string;
    searchEnabled?: boolean;
}

const SimpleSearchableTable = memo(({ tableData, columns, colSpans, paperProps, label, searchEnabled = true }: Props) => {
    const theme = useTheme();
    const [searchResult, setSearchResult] = useState<{ [key: string]: any }[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setSearchResult(tableData);
    }, [tableData])

    function onSearchKeyword(searchKey: string) {
        if (searchKey) {
            let result = tableData.filter(item => {
                let isKeywordFound = false;
                columns.map(col => {
                    if (item?.[col] && typeof item?.[col] === "string") {
                        isKeywordFound = String(item[col]).toLowerCase().includes(searchKey.toLowerCase());
                    }
                })
                return isKeywordFound;
            });
            setSearchResult(result);
        } else {
            setSearchResult(tableData);
        }
    }

    return (
        <Paper
            elevation={0}
            style={{ overflowY: "auto", maxHeight: "400px", minHeight: "200px", width: "100%", border: "1px solid #C2C2C2" }}
            {...paperProps}
        >
            <div style={{ width: '100%' }}>
                <div style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="text-15 font-medium">{label}:</span>

                    {searchEnabled && (
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
                            style={{ width: "300px" }}
                            size="small"
                            onChange={e => {
                                setSearchText(e.target.value);
                                onSearchKeyword(e.target.value)
                            }}
                        />
                    )}
                </div>
            </div>

            <hr style={{ margin: "0px", padding: "0px" }} />

            <TableContainer style={{ overflow: "hidden", width: "100%" }}>
                <Table aria-label="sticky-table" size="small">
                    <TableBody>
                        {searchResult.map((item: any, index: number) => {
                            return (
                                <TableRow hover key={index} >
                                    {columns.map((col: any, subIndex: number) => (
                                        <TableCell
                                            key={subIndex}
                                            padding="checkbox"
                                            style={{
                                                height: "35px",
                                                width: `${colSpans?.[subIndex] ? `${colSpans[subIndex]}%` : 'auto'}`,
                                                background: (index % 2) === 0 ? "#F6FFFF" : "#F8F8F8",
                                                border: "none"
                                            }}
                                            className="text-13 font-regular"
                                        >
                                            {item?.[col] ?? '-'}
                                        </TableCell>
                                    )
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {searchResult.length === 0 && (
                <span className="text-14 font-medium" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <FormattedMessage id="no-records-found" />
                </span>
            )}
        </Paper>
    )
});

export { SimpleSearchableTable };