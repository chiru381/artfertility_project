import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";

interface Props {
    value: boolean;
}

const BooleanIcon = ({ value, ...rest }: Props) => {
    return value === true ? (
        <Check fontSize="small" color="primary" />
    ) : (
        <Clear fontSize="small" color="secondary" />
    )
}

export { BooleanIcon };