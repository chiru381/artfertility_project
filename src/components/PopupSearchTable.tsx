import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';

import { PopupTooltip } from './PopupTooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { PopperProps } from '@material-ui/core/Popper';

interface PopupTableProps {
    tableData: { [key: string]: any }[];
    columns: { label: string, name: string }[];
    onRowClick?: (row: any) => void;
    loading?: boolean;
}

interface Props extends PopupTableProps {
    popupOpen: boolean;
    closePopup: React.Dispatch<React.SetStateAction<boolean>>;
    children?: React.ReactElement;
    popupTooltipStyle?: PopperProps['style'];
}

const PopupSearchTable = React.memo((props: Props) => {
    const { popupOpen, closePopup, tableData, columns, onRowClick, loading, children, popupTooltipStyle } = props;
    return (
        <PopupTooltip
            content={<PopupTable tableData={tableData} columns={columns} onRowClick={onRowClick} loading={loading} />}
            open={popupOpen}
            onClose={() => closePopup(false)}
            placement="bottom-start"
            style={{ marginTop: "10px", zIndex: 5000, ...popupTooltipStyle }}
        >
            {children ?? <Box component="div" style={{ width: "100%" }} />}
        </PopupTooltip>
    )
})

export { PopupSearchTable };


const PopupTable = React.memo(({ tableData, columns, onRowClick, loading }: PopupTableProps) => {

    function rowClick(row: any) {
        if (onRowClick) {
            onRowClick(row);
        }
    }

    return (
        <Box>
            <Box p={2}>
                <TableContainer style={{ maxHeight: "280px" }}>
                    {loading && <LinearProgress style={{ width: "100%" }} />}
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell key={index}>{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tableData.map((row: any, index: number) => (
                                <TableRow hover={true} key={index} onClick={() => rowClick(row)} style={{ cursor: "pointer" }}>
                                    {columns.map((col, subIndex) => (
                                        <TableCell key={subIndex}>{row?.[col.name] ?? '-'}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
});