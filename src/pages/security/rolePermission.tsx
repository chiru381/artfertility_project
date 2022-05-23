
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory, useLocation } from 'react-router-dom';

import { CheckBox } from 'components/forms';
import { HoverLoader } from 'components';
import { SaveButton, SecondaryButton } from 'components/button';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { FormPrimaryHeading } from 'components/forms';

const RolePermission = () => {
    const { handleSubmit, formState: { errors } } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const location = useLocation<any>();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [permissionAreaData, setPermissionAreaData] = useState<any[]>([]);
    const [rolePermissionData, setRolePermissionData] = useState<any[]>([]);
    const [selectedActionIds, setSelectedActionIds] = useState<any[]>([]);
    const [parentExpanded, setParentExpanded] = useState<string | false>(false);
    const [expanded, setExpanded] = useState<string | false>(false);

    let roleData = location.state ?? {};

    useEffect(() => {
        if (roleData) {
            onGetRolePermissionByRoleIdApiCall();
        }
    }, []);

    function onGetRolePermissionByRoleIdApiCall() {
        let params = {
            roleId: roleData.id
        }
        setLoading(true);
        services.getRolePermissionByRoleId(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    setRolePermissionData(res.data.response?.securedControllerActions);

                    let permissionAreaData = res.data.response?.securedControllerActions
                        ?.filter((item: any, i: any, arr: any) => arr.findIndex((t: any) => t.areaName === item.areaName) === i)
                        ?.map((option: any) => ({ areaName: option.areaName }))
                        ?.sort((field1: any, field2: any) => (field1.areaName < field2.areaName) ? -1 : 1);

                    setPermissionAreaData(permissionAreaData);
                    setSelectedActionIds(res.data.response?.selectedActionIds);
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    const handleParentAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setParentExpanded(isExpanded ? panel : false);
    };

    const handleAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    function checkSelectedActionIds(actionId: any) {
        let object = selectedActionIds?.find((item: any) => item === actionId);
        if (object) {
            return true;
        }
        else {
            return false;
        }
    }

    function handleActionChange(status: any, actionId: any) {
        if (status) {
            setSelectedActionIds([
                ...selectedActionIds,
                actionId
            ]);
        }
        else {
            setSelectedActionIds(selectedActionIds.filter((item: any) => item !== actionId));
        }
    }

    function onSubmit(data: any) {
        if (!selectedActionIds?.length) {
            toastMessage(formatMessage({ id: "role-selection-validation-message" }), 'error');
            return false;
        }

        let bodyData = {
            roleId: roleData.id,
            selectedActionIds: selectedActionIds
        }

        setLoading(true);
        services.updateRolePermission(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "update-message" }));
                    if (roleData) {
                        onGetRolePermissionByRoleIdApiCall();
                    }
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onCancel() {
        history.goBack();
    }

    return (
        <>
            <Box p={4}>
                <Grid container spacing={3}>
                    <div className="full-modal-container" style={{ width: "100%" }}>
                        <Box className="full-modal-scroll-container">
                            <div className="full-modal-head-container">
                                <FormPrimaryHeading label={`ROLE PERMISSIONS (${roleData?.name})`} />
                                <CustomFooter
                                    handleSubmit={handleSubmit}
                                    onSubmit={onSubmit}
                                    onCancel={onCancel}
                                />
                            </div>
                            <Box p={4}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} lg={12} md={12} sm={12}>
                                        {permissionAreaData?.map((area: any, indexParent: any) => {
                                            return (
                                                <Accordion
                                                    key={`${area.areaName}_${indexParent}`}
                                                    style={{ marginBottom: '10px' }}
                                                    expanded={parentExpanded === area.areaName}
                                                    onChange={handleParentAccordianToggle(area.areaName)}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-parent-header"
                                                        style={{ backgroundColor: "#F3F3F3", }}>
                                                        <Typography>{area.areaName}</Typography>
                                                    </AccordionSummary>

                                                    {rolePermissionData?.filter((data: any) => data.areaName == area.areaName)?.map((item: any, index: any) => {
                                                        return (
                                                            <Accordion
                                                                key={`${item.controllerId}_${index}`}
                                                                style={{ marginBottom: '8px', marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}
                                                                expanded={expanded === item.controllerId}
                                                                onChange={handleAccordianToggle(item.controllerId)}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                    style={{ backgroundColor: "#F3F3F3", }}>
                                                                    <Typography>
                                                                        {item.controllerName}
                                                                        {item?.mvcActions?.filter((option: any) => selectedActionIds?.includes(option.actionId))?.length > 0 &&
                                                                            <Chip
                                                                                label={item?.mvcActions?.filter((option: any) => selectedActionIds?.includes(option.actionId))?.length}
                                                                                style={{ backgroundColor: "darkblue", marginLeft: '10px', height: '30px' }} />
                                                                        }
                                                                    </Typography>
                                                                </AccordionSummary>

                                                                <AccordionDetails>
                                                                    <Grid container spacing={2}>
                                                                        {item?.mvcActions?.map((action: any, actionIndex: any) => {
                                                                            return (
                                                                                <Grid key={`${actionIndex}_${action.actionId}`} item xs={12} lg={3} md={3} sm={6}>
                                                                                    <CheckBox
                                                                                        label={action.actionName}
                                                                                        onChange={(e: any) => {
                                                                                            let status = e.target.checked;
                                                                                            handleActionChange(status, action.actionId);
                                                                                        }}
                                                                                        checked={checkSelectedActionIds(action.actionId)}
                                                                                    />
                                                                                </Grid>
                                                                            )
                                                                        })}
                                                                    </Grid>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        )
                                                    })}
                                                </Accordion>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </div>
                    {loading && <HoverLoader />}
                </Grid>
            </Box>
        </>
    )
}

export default RolePermission;

const CustomFooter = ({ handleSubmit, onSubmit, onCancel }: any) => {
    return (
        <div>
            <SaveButton
                onClick={handleSubmit(onSubmit)}
            />
            <SecondaryButton
                label="CANCEL"
                style={{ marginLeft: "10px" }}
                onClick={onCancel}
            />
        </div>
    )
}