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

const SpermiogramTab = (props: Props) => {
    const { control } = props;
    const { formatMessage } = useIntl();

    return (
        <Box style={{ border: "1px solid #707070", borderRadius: "3px", padding: "13px" }}>
            <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
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
                </Grid>

                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: 'permeability-of-the-membrane' })}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "color" })}
                                    name="color"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "viscosity" })}
                                    name="viscocity"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "liquefaction" })}
                                    name="liquefaction"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "volume" }) + " (>=.5ml)"}
                                    name="volume"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "pH" }) + " (>=7.2)"}
                                    name="ph"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "gelatinous-clumps" })}
                                    name="gelatinousClumps"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "remarks" })}
                                    name="remarks"
                                    control={control}
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                    <div className='text-14 font-medium'>
                        <FormattedMessage id="microscopical-examination" />
                        <hr style={{ background: "#707070", opacity: 1 }} />
                    </div>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "concentration" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "sperm-presence" })}
                                    name="spermPresence"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "count" }) + " (>=15M/ml)"}
                                    name="count"
                                    control={control}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "total-count" }) + " (>=39M)"}
                                    name="totalCount"
                                    control={control}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "permeability-of-the-membrance" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "total" }) + " (%)"}
                                    name="total"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "partial" }) + " (%)"}
                                    name="partial"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "negative" }) + " (%)"}
                                    name="negative"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "motility" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (>=32%)"}
                                    name="progressive"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 32, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (A) (%)"}
                                    name="progressiveA"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (B) (%)"}
                                    name="progressiveB"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "non-progressive" }) + " (C) (%)"}
                                    name="nonProgressiveC"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "immobile" }) + " (D) (%)"}
                                    name="immobileD"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "vitality" }) + " (>=58%)"}
                                            name="vitality"
                                            control={control}
                                            rules={validationRule.textbox({ type: "numberWithDecimal", min: 58, max: 100 })}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "mobile-total" }) + " (>=40%)"}
                                            name="mobileTotal"
                                            control={control}
                                            rules={validationRule.textbox({ type: "numberWithDecimal", min: 40, max: 100 })}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "progressive-motility-co" })}
                                            name="progressiveMotilityCo"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "survival" }) + " (24h) (%)"}
                                            name="survival"
                                            control={control}
                                            rules={validationRule.textbox({ type: "number", min: 0, max: 24 })}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "most" }) + " 4h (%)"}
                                            name="most4h"
                                            control={control}
                                            rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                            type="number"
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "most-r" })}
                                            name="mostR"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>


                        </Grid>
                    </PaperWithLabel>
                </Grid>


                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "motility" }) + "180°"}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (>=32%)"}
                                    name="progressive"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 32, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (A) (%)"}
                                    name="progressiveA"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "progressive" }) + " (B) (%)"}
                                    name="progressiveB"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "non-progressive" }) + " (C) (%)"}
                                    name="nonProgressiveC"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "immobile" }) + " (D) (%)"}
                                    name="immobileD"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "mobile-total" }) + " (>=40%)"}
                                    name="mobileTotal"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 40, max: 100 })}
                                    type="number"
                                />
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "cell-type" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "red-blood-cells" }) + " (M/ml)"}
                                    name="progressive"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 32, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "round-cells" }) + " (<=5 M/ml)"}
                                    name="roundCells"
                                    control={control}
                                    rules={validationRule.textbox({ type: "number", min: 0, max: 5 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "leucocytes" }) + " (<=1 M/ml)"}
                                    name="leucocytes"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 1 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "Epithelial cells" }) + " (<=1 </ml)"}
                                    name="epithelialCells"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid>


                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "other-characteristics" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "agglutination" })}
                                    name="agglutination"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "aggregation" })}
                                    name="aggregation"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={3} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "configuration-for-low-count" })}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomSelect
                                    label={formatMessage({ id: "low-count" })}
                                    name="lowCount"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "volume" }) + " (>=1.5ml)"}
                                    name="volume"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 1.5, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "count" }) + " (>=15M/ml)"}
                                    name="count"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 15, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "total-count" }) + " (>=39M)"}
                                    name="totalCount"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 1.5, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "morphology" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "not-assessable" })}
                                    name="notAssessable"
                                    control={control}
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "sperm-head-anamolies" }) + " (%)"}
                                    name="spermHeadAnamolies"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "sperm-tail-anamolies" }) + " (%)"}
                                    name="spermTailAnamolies"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "pi-anamolies" }) + " (%)"}
                                    name="piAnamolies"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "cytoplasmic-residues" }) + " (%)"}
                                    name="cytoplasmicResidues"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "apoptosis" }) + " (%)"}
                                    name="apoptosis"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "combined-head-tail" }) + " (%)"}
                                    name="combinedHeadTail"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "abnormal-forms" }) + " (%)"}
                                    name="abnormalForms"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "normal-forms" }) + " (>=4%)"}
                                    name="normalForms"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "teratozoospermia-index" }) + " (1-3)"}
                                    name="teratozoospermiaIndex"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item lg={8} md={8} sm={6} xs={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "remarks" })}
                                    name="remarks"
                                    control={control}
                                    rules={validationRule.textbox({ maxLength: 200 })}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={3} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "nuclear-maturation" })}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={`${formatMessage({ id: "mature-nucleus" })}, ${formatMessage({ id: "protamine" })}` + " (aniline-) %"}
                                    name="matureNucleus"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "semi-mature-nucleus" }) + " (aniline+/-) %"}
                                    name="semimatureNucleus"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={`${formatMessage({ id: "immature-nucleus" })}, ${formatMessage({ id: "histones" })}` + " (aniline+) %"}
                                    name="immatureNucleus"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={3} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "dna-fragmentation-test" })}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "fragmentation-sperm" }) + " %"}
                                    name="fragmentationSperm"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "halosperm" })}
                                    name="halosperm"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "acridine-orange" })}
                                    name="acridineOrange"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "scsa" }) + " %"}
                                    name="scsa"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "cma3" }) + " %"}
                                    name="cma3"
                                    control={control}
                                    rules={validationRule.textbox({ type: "numberWithDecimal", min: 0, max: 100 })}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>


                <Grid item lg={3} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "additional-tests" })}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "svs" })}
                                    name="svs"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomSelect
                                    label={formatMessage({ id: "fructose" })}
                                    name="fructose"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomSelect
                                    label={formatMessage({ id: "culture-indication" })}
                                    name="cultureIndication"
                                    control={control}
                                    options={booleanOptions}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <PaperWithLabel label={formatMessage({ id: "diagnosis" })}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "auto-diagnosis" })}
                                    name="autodiagnosis"
                                    control={control}
                                    multiline
                                    rows={2}
                                    rules={validationRule.textbox({maxLength: 200})}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "remarks" })}
                                    name="diagnosisRemarks"
                                    control={control}
                                    multiline
                                    rows={2}
                                    rules={validationRule.textbox({maxLength: 200})}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "diagnosis" })}
                                    name="diagnosisDiagnosis"
                                    control={control}
                                    multiline
                                    rows={2}
                                    rules={validationRule.textbox({maxLength: 200})}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "internal-remarks" })}
                                    name="internalRemarks"
                                    control={control}
                                    multiline
                                    rows={2}
                                    rules={validationRule.textbox({maxLength: 200})}
                                />
                            </Grid>
                        </Grid>
                    </PaperWithLabel>
                </Grid>

            </Grid>
        </Box>
    )
}

export default SpermiogramTab;