import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Cancel from '@material-ui/icons/Cancel';
import CloudUpload from '@material-ui/icons/CloudUpload';

import { FormErrorMessage } from './FormErrorMessage';
import Visibility from '@material-ui/icons/Visibility';

interface Props {
    error?: any;
    onClear?: () => void;
    onViewImage: () => void;
    defaultFileName?: string | undefined;
}

export const FileUpload = React.forwardRef<HTMLInputElement, Props & React.HTMLProps<HTMLInputElement>>((props, ref) => {
    const { error, onClear, defaultFileName, onViewImage, ...rest } = props;
    const [fileName, setFileName] = useState<string | undefined>(defaultFileName ?? undefined);

    return (
        <>
            <FormControl fullWidth>
                <Button
                    fullWidth
                    component="label"
                    variant="contained"
                    color="primary"
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
                            <Visibility htmlColor="#FFF" />
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
                            <Cancel htmlColor="#FFF" />
                        </IconButton>
                    ) : <CloudUpload />}
                    style={{
                        justifyContent: "space-between", height: "40px", textTransform: "none", fontSize: "12px", borderRadius: 4,
                        whiteSpace: "nowrap", overflow: "hidden",
                    }}
                >
                    <Box component="div" style={{ lineClamp: 1, overflow: "hidden" }}>{fileName ?? "Choose File"}</Box>
                    <input
                        type="file"
                        hidden
                        accept="image/png, image/jpg, image/jpeg"
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

                {/* error message */}
                <FormErrorMessage error={error} />
            </FormControl>
        </>
    );
});


export default FileUpload;