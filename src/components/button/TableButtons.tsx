import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import PersonAdd from '@material-ui/icons/PersonAdd';
import LinkOff from '@material-ui/icons/LinkOff';
import Tooltip from '@material-ui/core/Tooltip';

import { ReactComponent as UserEditIcon } from 'assets/images/icons/user-edit.svg';
import { ReactComponent as CheckListIcon } from 'assets/images/icons/checklist-icon.svg';
import { ReactComponent as ReSamplingIcon } from 'assets/images/icons/resampling-icon.svg';
import { ReactComponent as ResultIcon } from 'assets/images/icons/result-icon.svg';
import { ReactComponent as DispatchIcon } from 'assets/images/icons/dispatch-icon.svg';

import { images } from 'utils/constants';

interface Props extends IconButtonProps {
    tooltipLabel?: string;
    imageStyle?: React.CSSProperties;
}


const TableViewButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                {...rest}
            >
                <Visibility htmlColor="#EAD966" />
            </IconButton>
        </Tooltip>
    )
});

const TableEditButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? "Edit"}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <img src={images.editIcon} alt="edit icon" style={{ width: "25px", height: "25px" }} />
            </IconButton>
        </Tooltip>
    )
});

const CustomTableButton = React.memo((props: Props & { children: JSX.Element }) => {
    const { tooltipLabel, children, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                {children}
            </IconButton>
        </Tooltip>
    )
});

const TableRefundButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <img src={images.refundIcon} alt="refund icon" style={{ width: "25px", height: "25px" }} />
            </IconButton>
        </Tooltip>
    )
});

const TableDeleteButton = React.memo((props: Props) => {
    const { tooltipLabel, imageStyle, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="secondary"
                {...rest}
            >
                {/* <Delete /> */}
                <img src={images.deleteIcon} alt="refund icon" style={{ width: "22px", height: "22px", ...imageStyle }} />
            </IconButton>
        </Tooltip>
    )
});

const TablePersonAddButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <PersonAdd color="action" />
            </IconButton>
        </Tooltip>
    )
});

const TablePersonEditButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                {...rest}
            >
                <UserEditIcon style={{ height: "25px", width: "25px", objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />
            </IconButton>
        </Tooltip>
    )
});

const TableDeLinkButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <LinkOff />
            </IconButton>
        </Tooltip>
    )
});

const TableDischargeButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <img src={images.dischargeIcon} alt="discharge icon" />
            </IconButton>
        </Tooltip>
    )
});

const TableReSamplingButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <ReSamplingIcon style={{ height: "25px", width: "25px", objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />
            </IconButton>
        </Tooltip>
    )
});

const TableResultEntryButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <ResultIcon style={{ height: "25px", width: "25px", objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />
            </IconButton>
        </Tooltip>
    )
});

const TableAuthorizationButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <CheckListIcon style={{ height: "25px", width: "25px", objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />
            </IconButton>
        </Tooltip>
    )
});

const TableDispatchButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
                <DispatchIcon style={{ height: "25px", width: "25px", objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />
            </IconButton>
        </Tooltip>
    )
});

const TablePermissionButton = React.memo((props: Props) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <IconButton
                size="small"
                color="primary"
                {...rest}
            >
              <img src={images.lockIcon} alt="role and permission icon" style={{ height: "25px", width: "25px", objectFit: "cover" }} />
            </IconButton>
        </Tooltip>
    )
});

export {
    TableViewButton,
    TableDeLinkButton,
    TableEditButton,
    TableDeleteButton,
    TablePersonAddButton,
    TablePersonEditButton,
    TableRefundButton,
    CustomTableButton,
    TableDischargeButton,
    TableReSamplingButton,
    TableResultEntryButton,
    TableAuthorizationButton,
    TableDispatchButton,
    TablePermissionButton
};