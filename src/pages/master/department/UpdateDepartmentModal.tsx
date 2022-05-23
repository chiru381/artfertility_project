import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { CustomTextBox, CustomSelect, CustomCheckBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void;
}

const UpdateDepartmentModal = (props: Props) => {
    const { closeModal, selectedData, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { parentDepartmentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            parentDepartmentData: masterPaginationReducer[masterPaginationServices.department].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
        reset(selectedData);
    }, []);

    let parentDepartmentOptions = parentDepartmentData.modelItems?.filter((item: any) =>
        item.parentDepartmentId === null)?.map((option: any) => ({ label: option.name, value: option.id }));

        useEffect(() => {
            if (parentDepartmentOptions.length) {
                let data = {
                    ...selectedData,
                    parentDepartmentId: parentDepartmentOptions?.find((item: any) => item.value == selectedData?.parentDepartmentId) ?? null,
                };
                reset(data);
            }
        }, [reset, parentDepartmentOptions.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateDepartment(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-message" }));
                    closeModal();
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "update-department" })}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={parentDepartmentOptions}
                            label={formatMessage({ id: "parent-department" })}
                            name="parentDepartmentId"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "department-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
           
                        <CustomCheckBox
                            name="hasReporting"
                            label={formatMessage({ id: "is-reporting-required" })}
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={parentDepartmentOptions}
                            label={formatMessage({ id: "department-route" })}
                            name="parentDepartmentId"
                            control={control}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateDepartmentModal;