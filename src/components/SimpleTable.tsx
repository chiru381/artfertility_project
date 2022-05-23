import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { FormattedMessage } from 'react-intl';

interface Props {
    columns: { label: string, name: string }[];
    colSpans?: number[];
    tableData: { [key: string]: any }[];
    paperProps?: PaperProps;
}


const SimpleTable = ({ columns, colSpans, tableData, paperProps }: Props) => {
    return (
        <Paper
            elevation={0}
            style={{ overflowY: "auto", maxHeight: "400px", minHeight: "200px", width: "100%", border: "1px solid #C2C2C2" }}
            {...paperProps}
        >
            <TableContainer style={{ whiteSpace: "nowrap" }}>
                <Table stickyHeader aria-label="sticky-table" size="small">
                    <TableHead style={{ height: "35px" }}>
                        <TableRow>
                            {columns.map((colName, index: number) => (
                                <TableCell
                                    key={index}
                                    width={`${colSpans?.[index] ? `${colSpans[index]}%` : 'auto'}`}
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
                        {tableData.map((item: any, index: number) => {
                            return (
                                <TableRow hover key={index} style={{ height: "35px" }}>
                                    {columns.map((col: any, subIndex: number) => (
                                        <TableCell
                                            key={subIndex}
                                            padding="checkbox"
                                            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
                                            className="text-13 font-regular"
                                            align={subIndex === 0 ? "left" : "center"}
                                        >
                                            {item?.[col.name] ?? '-'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {tableData.length === 0 && (
                <span className="text-14 font-medium" style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <FormattedMessage id="no-records-found" />
                </span>
            )}
        </Paper>
    )
}

export { SimpleTable };