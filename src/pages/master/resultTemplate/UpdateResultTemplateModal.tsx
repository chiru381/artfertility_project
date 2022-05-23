import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { RichTextEditor } from 'components/forms/RichTextEditor';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateResultTemplateModal = (props: Props) => {
    const { closeModal, selectedData, onApiCall } = props;

    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState('');

    const { componentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            componentData: masterPaginationReducer[masterPaginationServices.component].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.component, {}));
    }, []);

    let componentOptions = componentData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        if (componentOptions?.length) {
            reset(selectedData);
            let data = {
                ...selectedData,
                componentId: componentOptions?.find((item: any) => item.value == selectedData?.componentId) ?? null,
            };
            reset(data);
            setTemplate(selectedData?.template);
        }
    }, [reset, componentOptions?.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id,
            template: template
        }
        setLoading(true);
        services.updateResultTemplate(bodyData)
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
                title={formatMessage({ id: "update-result-template" })}
                modalSize="medium"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "template-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={componentOptions}
                            label={formatMessage({ id: "component" })}
                            name="componentId"
                            control={control}
                            error={errors.componentId}
                            rules={validationRule.textbox({ required: true })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RichTextEditor
                            setTemplate={setTemplate}
                            value={template}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateResultTemplateModal