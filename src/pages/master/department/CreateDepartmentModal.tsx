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
    onApiCall: (status: boolean) => void
}

const CreateDepartmentModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
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
    }, []);

    let parentDepartmentOptions = parentDepartmentData.modelItems?.filter((item: any) =>
        item.parentDepartmentId === null)?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createDepartment(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
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
                title={formatMessage({ id: "create-department" })}
            >
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
                            name="hasSpeciality"
                            label={formatMessage({ id: "is-specialty" })}
                            control={control}
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

export default CreateDepartmentModal;