import React from 'react'
import { TextFieldProps } from '@material-ui/core/TextField';
import { TextBox } from './CustomTextBox';

import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';


interface Props {
    onCancel?: () => void;
}

export const SearchableTextBox = React.memo(((props: Props & TextFieldProps) => {
    const { onCancel, ...rest } = props;

    return (
        <TextBox
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {onCancel ? (
                            rest.value ? (
                                <IconButton
                                    onClick={onCancel}
                                    size="small"
                                >
                                    <CancelIcon color="primary" />
                                </IconButton>
                            ) : (
                                <SearchIcon />
                            )
                        ) : (
                            <SearchIcon />
                        )}
                    </InputAdornment>
                )
            }}
            autoComplete="no"
            {...rest}
        />
    )
}))