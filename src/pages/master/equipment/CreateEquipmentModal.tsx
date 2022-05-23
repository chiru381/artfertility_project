import {  useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateEquipmentModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const { clinicData, departmentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            departmentData: masterPaginationReducer[masterPaginationServices.department].data,

        }),
        shallowEqual
    );

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let departmentOptions = departmentData.modelItems?.filter((item:any)=>item.parentDepartmentId!==null)?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
    }, []);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createEquipment(bodyData)
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
                title={formatMessage({ id: "create-equipment" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "equipment" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={clinicOptions}
                            label={formatMessage({ id: "clinic" })}
                            name="clinicId"
                            control={control}
                            error={errors.clinicId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={departmentOptions}
                            label={formatMessage({ id: "sub-department" })}
                            name="subDepartmentId"
                            control={control}
                            error={errors.subDepartmentId}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateEquipmentModal;