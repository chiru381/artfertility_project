import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { ButtonGroup, PrimaryButton } from 'components/button';

interface Props {

}

const TreatmentProcessFooterAction = (props: Props) => {
    const history = useHistory();

    function gotoCancelCycle() {
        let url = location.pathname.split('/').slice(0, 3).join('/');
        history.push(`${url}/stimulation/cancel-cycle`);
    }

    return (
        <Grid item xs={12}>
            <ButtonGroup>
                <PrimaryButton label="Go to stimulation cycle" />
                <PrimaryButton label="Finalize and close the cycle" />
                <PrimaryButton
                    label="Cancel cycle"
                    color="default"
                    onClick={gotoCancelCycle}
                />
            </ButtonGroup>
        </Grid>
    )
}

export default TreatmentProcessFooterAction;