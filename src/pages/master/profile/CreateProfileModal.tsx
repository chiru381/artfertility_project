import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect, TextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateProfileModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });

    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [profileName, setProfileName] = useState(null);

    const { billingServiceData, testData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            billingServiceData: masterPaginationReducer[masterPaginationServices.service].data,
            testData: masterPaginationReducer[masterPaginationServices.test].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.service, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.test, {}));
    }, []);

    let billingServiceOptions = billingServiceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let testOptions = testData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
       
        services.createProfile(bodyData)
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
                title={formatMessage({ id: "create-profile" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={billingServiceOptions}
                            label={formatMessage({ id: "billing-service" })}
                            name="profileId"
                            control={control}
                            error={errors.profileId}
                            onInputChange={(_, data: any) => {
                                setProfileName(data);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextBox
                            label={formatMessage({ id: "profile-name" })}
                            disabled={true}
                            value={profileName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={testOptions}
                            label={formatMessage({ id: "test" })}
                            name="testId"
                            control={control}
                            error={errors.testId}
                            rules={validationRule.textbox({ required: true })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "sequence-number" })}
                            name="sequence"
                            control={control}
                            error={errors.sequence}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateProfileModal;