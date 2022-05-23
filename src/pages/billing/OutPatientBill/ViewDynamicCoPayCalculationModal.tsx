import { useIntl } from 'react-intl';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

import { FormModal } from 'components/FormModal';
import { TextBox } from 'components/forms';

const ViewDynamiccopayCalculationModal = ({ closeModal, dynamiccopayData }: any) => {
    const { formatMessage } = useIntl();

    return (
        <FormModal
            onCancel={closeModal}
            modalSize="medium"
            title={formatMessage({ id: "dynamic-co-pay" })}
        >
            <>
                <TextBox
                    label={formatMessage({ id: "plan-name" })}
                    value={dynamiccopayData?.[0]?.insurancePlanName}
                    disabled
                />

                <TableContainer component={Paper} elevation={1} style={{ marginTop: "25px" }}>
                    <Table aria-label="sticky table">
                        <TableHead style={{ background: "#DFE8FF" }}>
                            <TableRow>
                                <TableCell><strong>{formatMessage({ id: "service-category" })}</strong></TableCell>
                                <TableCell><strong>{formatMessage({ id: "co-pay-percent" })}</strong></TableCell>
                                <TableCell><strong>{formatMessage({ id: "co-pay-amount" })}</strong></TableCell>
                                <TableCell><strong>{formatMessage({ id: "max-co-pay" })}</strong></TableCell>
                                <TableCell><strong>{formatMessage({ id: "deductable" })}</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dynamiccopayData.map((field: any, index: number) => {
                                return (
                                    <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                                        <TableCell> {field.serviceCategoryName} </TableCell>
                                        <TableCell> {field.coPayPerchantage} </TableCell>
                                        <TableCell> {field.coPayAmount} </TableCell>
                                        <TableCell> {field.maximumCoPay} </TableCell>
                                        <TableCell> {field.deductibaleAmount} </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </FormModal>
    )
}

export default ViewDynamiccopayCalculationModal;