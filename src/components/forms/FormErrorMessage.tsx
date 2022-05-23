import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';

interface Props {
    error: any
}

function errorMessage(error: any) {
    switch (error.type) {
        case "required":
            return error.message || 'Required';
        default:
            return error.message;
    }
}

const FormErrorMessage = React.memo(({ error }: Props) => {
    return (
        <div>
            {error ? (
                <div style={{ color: 'red', display: 'flex', marginTop: "5px", alignItems: 'center' }}>
                    <ErrorIcon style={{marginRight: "3px", fontSize: "18px"}}/>
                    <span style={{fontSize: "14px"}}>{errorMessage(error)}</span>
                </div>
            ) : null}
        </div>
    )
});

export { FormErrorMessage };