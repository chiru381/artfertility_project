import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Cancel from '@material-ui/icons/Cancel';
import { FormErrorMessage } from './FormErrorMessage';
import Visibility from '@material-ui/icons/Visibility';

interface Props {
    error?: any;
    onClear?: () => void;
    onViewImage: () => void;
    defaultFileName?: string | undefined;
    label?: string
}

export const CustomFileUpload = React.forwardRef<HTMLInputElement, Props & React.HTMLProps<HTMLInputElement>>((props, ref) => {
    const { error, label, onClear, defaultFileName, onViewImage, accept, ...rest } = props;
    const [fileName, setFileName] = useState<string | undefined>(defaultFileName ?? undefined);

    return (
        <>
            <FormControl fullWidth>
                <Button
                    fullWidth
                    component="label"
                    variant="outlined"
                    // color="outlined"
                    disableElevation
                    disableFocusRipple
                    startIcon={fileName ? (
                        <IconButton
                            size="small"
                            style={{ margin: "0px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                onViewImage();
                            }}
                        >
                            <Visibility color="primary" />
                        </IconButton>
                    ) : null}
                    endIcon={fileName ? (
                        <IconButton
                            size="small"
                            style={{ margin: "0px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                setFileName(undefined);
                                if (onClear) {
                                    onClear();
                                }
                            }}
                        >
                            <Cancel color="primary" />
                        </IconButton>
                    ) :
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            color: '#fff',
                            backgroundColor: '#1b6c9b',
                            padding: '10px',
                            marginRight: '-12px'
                        }}><span style={{ fontSize: "12px", marginRight: '5px' }}>Browse</span>

                            {/* <CloudUpload /> */}
                        </div>}
                    style={{
                        justifyContent: "space-between", height: "40px", textTransform: "none", fontSize: "12px", borderRadius: 4,
                        whiteSpace: "nowrap", overflow: "hidden",
                    }}
                >
                    <Box component="div" style={{ lineClamp: 1, overflow: "hidden" }}>{fileName ? fileName : label}</Box>
                    <input
                        type="file"
                        hidden
                        accept={accept}
                        ref={ref}
                        {...rest}
                        onChange={e => {
                            if (e.target?.files) {
                                setFileName(e.target.files?.[0]?.name)
                            }
                            if (rest?.onChange) {
                                rest.onChange(e);
                            }
                        }}
                    />
                </Button>
                <span style={{ fontSize: "12px", marginTop: "5px", color: "rgba(0,0,0,0.5)" }}>({accept} supported only)</span>

                {/* error message */}
                <FormErrorMessage error={error} />
            </FormControl>
        </>
    );
});

CustomFileUpload.defaultProps = {
    accept: ".png, .jpg, .jpeg",
    label: 'Choose file'

}
export default CustomFileUpload;