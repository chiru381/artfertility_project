import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useIntl, FormattedMessage } from 'react-intl';

import { PaperWithLabel } from 'components';
import { ControllerProps } from 'react-hook-form';
import { CustomSelect, CustomTextBox, CustomTimePicker } from 'components/forms';
import { booleanOptions } from 'utils/constants';
import { validationRule } from 'utils/global';


interface Props {
    control: ControllerProps["control"];
}

const SpermTestPreparationTab = (props: Props) => {
    const { control } = props;
    const { formatMessage } = useIntl();

    return (
        <Box style={{ border: "1px solid #707070", borderRadius: "3px", padding: "13px" }}>
            <Grid container spacing={2}>

                <Grid item xs={3}>
                    <CustomSelect
                        label={formatMessage({ id: "selection-method" })}
                        name="selectionMethod"
                        control={control}
                        options={booleanOptions}
                    />
                </Grid>

                <Grid item xs={3}>
                    <CustomTextBox
                        label={formatMessage({ id: "used-volume" }) + " (ml)"}
                        name="usedVolume"
                        control={control}
                    />
                </Grid>
                <Grid item xs={3}>
                    <CustomTextBox
                        label={formatMessage({ id: "qualified-volume" }) + " (ml)"}
                        name="qualifiedVolume"
                        control={control}
                    />
                </Grid>

                <Grid item xs={3}>
                    <CustomTextBox
                        label={formatMessage({ id: "final-concentration" }) + " (M/ml)"}
                        name="finalConcentration"
                        control={control}
                    />
                </Grid>
                <Grid item xs={3}>
                    <CustomTextBox
                        label={formatMessage({ id: "sperm-motility-recovery" }) + " (M/ml)"}
                        name="spermMotilityRecovery"
                        control={control}
                    />
                </Grid>





                {/* <Grid item lg={8} md={8} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: 'pre-analytical-data' })}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTextBox
                                            label={`${formatMessage({ id: "abstinence" })} (${formatMessage({ id: "days" })})`}
                                            name="abstinence"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "full-sample" })}
                                            name="isFullSample"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTimePicker
                                            label={formatMessage({ id: "collect-time" })}
                                            name="collectTime"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "previous-illness" })}
                                            name="previousIllness"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "free-text" })}
                                            name="previousIllness"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTimePicker
                                            label={formatMessage({ id: "analysis-start-time" })}
                                            name="analysisStartTime"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "previous-therapy" })}
                                            name="previousTherapy"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "free-text" })}
                                            name="previousIllness"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "semen-source" })}
                                            name="semenSource"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "previous-surgery" })}
                                            name="previousSurgery"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "free-text" })}
                                            name="previousIllness"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "collection-from" })}
                                            name="collectionFrom"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "difficulty-in-collection" })}
                                            name="difficultyInCollection"
                                            control={control}
                                            options={booleanOptions}
                                        />
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "free-text" })}
                                            name="previousIllness"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item sm={4} xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "collection-location" })}
                                    name="collectionLocation"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid> */}

            </Grid>
        </Box>
    )
}

export default SpermTestPreparationTab;