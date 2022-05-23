import { useState } from 'react'

import Box from '@material-ui/core/Box';
import CustomTable from 'components/table';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { patientDataAcknowledgementColumn, tableInitialState } from 'utils/constants';

interface Props {

}

const PatientDataAcknowledgeMent = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);

    return (
        <Box className="container table-container">
            <CustomTable
                columns={[...patientDataAcknowledgementColumn(formatMessage)]}
                tableData={[]}
                tableState={tableState}
                setTableState={setTableState}
                title="Patient Data Acknowledgement"
            // rowsCount={totalRecord}
            // toolbar={<TableCreateButton onClick={onCreate} />}
            // loading={loading}
            />
        </Box>
    )
}

export default PatientDataAcknowledgeMent;