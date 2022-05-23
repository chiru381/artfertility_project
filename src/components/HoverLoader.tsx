import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';

interface Props {

}

const HoverLoader = (props: Props) => {
    return (
        <Modal
            open={true}
        >
            <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: '100%' }} >
                <CircularProgress color="secondary" />
            </div>
        </Modal>
    )
}

export { HoverLoader };