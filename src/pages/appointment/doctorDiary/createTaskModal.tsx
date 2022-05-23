import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { CustomDatePicker, CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getApiDate, getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useCreateDropdownOptions, useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';
import { masterPaginationServices } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';


interface Props {
    closeModal: () => void;
}

const CreateTaskReasonModal = (props: Props) => {
    const { closeModal } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const { taskReasonData, taskReasonDataLoading, userListDataLoading, userListData, selectedClinic } = useSelector(
        ({ masterPaginationReducer, utilityReducer }: RootReducerState) => ({
            taskReasonData: masterPaginationReducer[masterPaginationServices.taskReason].data,
            userListData: masterPaginationReducer[masterPaginationServices.user].data,
            taskReasonDataLoading: masterPaginationReducer[masterPaginationServices.taskReason].loading,
            userListDataLoading: masterPaginationReducer[masterPaginationServices.user].loading,
            selectedClinic: utilityReducer.selectedClinic,
        }),
        shallowEqual
    );
    const taskReasonOptions = useCreateDropdownOptions(taskReasonData.modelItems);
    const userListOptions = useCreateDropdownOptions(userListData.modelItems, null, null, "displayName");

    useEffect(() => {
        if (!taskReasonOptions.length) {
            dispatch(getMasterPaginationData(masterPaginationServices.taskReason, {}));
        }
        if (!userListOptions.length) {
            dispatch(getMasterPaginationData(masterPaginationServices.user, {}));
        }
    }, [])

    function onSubmit(data: any) {
        if (data.taskReasonId || data.taskRemark) {
            let bodyData = {
                ...getFormBody(data),
                clinicId: +selectedClinic,
                isCompleted: false,
                taskCompletionDate: getApiDate(data.taskCompletionDate)
            };
            setLoading(true);
            services.createTask(bodyData)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        toastMessage(formatMessage({ id: "create-task-message" }));
                        closeModal();
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toastMessage(err.message, 'error');
                })
        }else {
            toastMessage("Please select task reason or enter task remark", 'error');
        }

    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "create-task" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "task-reason" })}
                            name="taskReasonId"
                            control={control}
                            error={errors.taskReasonId}
                            options={taskReasonOptions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "task-remarks" })}
                            name="taskRemark"
                            control={control}
                            error={errors.taskRemark}
                            rules={validationRule.textbox({ maxLength: 125 })}
                            multiline
                            rowsMax={3}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "assigned-to" })}
                            name="assignedUserId"
                            control={control}
                            error={errors.assignedUserId}
                            options={userListOptions}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "timeline" })}
                            name="taskCompletionDate"
                            control={control}
                            error={errors.taskCompletionDate}
                            rules={{ required: true }}
                            minDate={new Date()}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {(loading || taskReasonDataLoading || userListDataLoading) && <HoverLoader />}
        </>
    )
}

export default CreateTaskReasonModal;