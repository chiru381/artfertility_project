import Typography from '@material-ui/core/Typography';
import React from 'react';

interface Props {
    label: string;
    textTransform?: React.CSSProperties['textTransform'];
}

const FormPrimaryHeading = ({ label, textTransform = "none" }: Props) => {
    return (
        <Typography variant="body1" style={{ fontWeight: "bold", fontSize: "18px", textTransform }}>
            {label}
        </Typography>
    )
}

export { FormPrimaryHeading };
