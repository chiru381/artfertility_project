import { Grid } from '@material-ui/core';
import React, { memo } from 'react';

interface Props {
    children: any;
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

const ButtonGroup = memo((props: Props) => {
    const { children, spacing = 2 } = props;
    let buttonGroup = children?.length ? children.filter((group: any) => group !== false) : children;
    return (
        <div>
            <Grid container spacing={spacing}>
                {buttonGroup?.length ? (
                    buttonGroup.map((item: any, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                {item ? (
                                    <Grid item>
                                        {item}
                                    </Grid>
                                ) : null}
                            </React.Fragment>
                        )
                    })
                ) : buttonGroup}
            </Grid>
        </div>
    )
});

export { ButtonGroup };