import { useState } from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import { useIntl } from 'react-intl';

import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import { ConfirmationIconButton } from 'components/button/ConfirmationIconButton';

interface Props extends ButtonProps {
    coupleId: string | number;
    onApiCall: (status: boolean) => void;
}

const DelinkCouple = (props: Props) => {
    const { coupleId, onApiCall } = props;
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);

    function onDeLink() {
        const params = {
            coupleId
        }
        setLoading(true);
        services.delinkCouple(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "delink-message" }));
                    onApiCall(true);
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
            <ConfirmationIconButton
                tooltipLabel="De-Link Partner"
                onConfirm={onDeLink}
                title="De-Link Couple?"
                subTitle="Are you sure you want to De-Link this couple?"
                color="secondary"
            />

            {loading && <HoverLoader />}
        </>
    )
};

export default DelinkCouple;