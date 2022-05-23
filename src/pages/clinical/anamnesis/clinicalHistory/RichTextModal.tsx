import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { FormModal } from 'components';
import { RichTextEditor } from 'components/forms/RichTextEditor';

interface Props {
    closeModal: () => void;
    setContent: (template: string) => void;
    headerLabel: string;
    selectedValue?:any;
}

const RichTextModal = (props: Props) => {
    const { closeModal, headerLabel, setContent,selectedValue } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [template, setTemplate] = useState(selectedValue);

    function onSubmit(data: any) {
        setContent(template);
        closeModal();
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: headerLabel })}
                modalSize="medium"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <RichTextEditor
                            setTemplate={setTemplate}
                            value={template}
                        />
                    </Grid>
                </Grid>
            </FormModal>
        </>
    )
}

export default RichTextModal;