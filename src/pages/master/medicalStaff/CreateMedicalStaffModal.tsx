import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal } from 'components';
import { validationRule } from 'utils/global';
import { top100Films } from 'utils/constants';


interface Props {
    closeModal: () => void;
}

const CreateMedicalStaffModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal } = props;

    function onSubmit(data: any) {
       
    }

    return (
        <FormModal
            onCancel={closeModal}
            onConfirm={handleSubmit(onSubmit)}
            title={formatMessage({ id: "create-city" })}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "city-name" })}
                        name="cityName"
                        control={control}
                        error={errors.cityName}
                        rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                    />
                </Grid>


                <Grid item xs={12}>
                    <CustomSelect
                        options={top100Films}
                        label={formatMessage({ id: "province" })}
                        name="province"
                        control={control}
                        error={errors.province}
                    />
                </Grid>

                <Grid item xs={12}>
                    <CustomSelect
                        options={top100Films}
                        label={formatMessage({ id: "country" })}
                        name="country"
                        control={control}
                        error={errors.country}
                    />
                </Grid>
            </Grid>
        </FormModal>
    )
}

export default CreateMedicalStaffModal;