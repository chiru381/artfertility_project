import { useIntl } from "react-intl";
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import BlockIcon from '@material-ui/icons/Block';

import { bedStatus } from 'utils/constants';

interface Props {
    bedDetail: any;
}

const BedCard = (props: Props) => {

    const { formatMessage } = useIntl();
    const { bedDetail } = props;

    return (
        <>
            {bedDetail.bedStatusId === bedStatus.Vacant &&
                <div style={{ backgroundColor: `${bedDetail.colorCode}` }} className="bed_block">
                    <span className="bed_name_inner">{bedDetail.name}</span>
                    <AirlineSeatFlatIcon />
                </div>
            }
            {bedDetail.bedStatusId === bedStatus.BlockedforMaintenance &&
                <div style={{ backgroundColor: `${bedDetail.colorCode}` }} className="bed_block">
                    <span className="bed_name_inner">{bedDetail.name}</span>
                    <BlockIcon />
                </div>
            }
            {(bedDetail.bedStatusId === bedStatus.PreOperativeArea
                || bedDetail.bedStatusId === bedStatus.InOT
                || bedDetail.bedStatusId === bedStatus.PostOT) &&
                <div style={{ backgroundColor: `${bedDetail.colorCode}` }} className="bed_block">
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "uhid" })}</span>
                        <span>:</span><span>{bedDetail?.admissions[0]?.patientUHID ?? '-'}</span>
                    </div>
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "chn" })}</span>
                        <span>:</span><span>{bedDetail?.admissions[0]?.coupleCHNId ?? '-'}</span>
                    </div>
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "patient-name" })}</span>
                        <span>:</span><span>{bedDetail?.admissions[0]?.patientFullName ?? '-'}</span>
                    </div>
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "bed-name" })}</span>
                        <span>:</span> <span>{bedDetail.name}</span>
                    </div>
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "treating-doctor-name" })}</span>
                        <span>:</span> <span>{bedDetail.treatingDoctorName}</span>
                    </div>
                    <div className="bed_detail">
                        <span>{formatMessage({ id: "procedure-name" })}</span>
                        <span>:</span> <span>{bedDetail.procedureName}</span>
                    </div>
                </div>
            }
        </>
    )
}
export { BedCard }