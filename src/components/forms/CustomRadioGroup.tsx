
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { ControllerProps, Controller, FieldError } from 'react-hook-form';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { FormErrorMessage } from '.';
interface Props {
    label?: string;
    name: string;
    control: ControllerProps["control"];
    groupList: { value: string | boolean, label: string }[];
    radioGroupProps?: RadioGroupProps;
    defaultValue?: string;
    rules?: ControllerProps["rules"];
    error?: FieldError;
}

const CustomRadioGroup = ({ label, name, control, groupList, defaultValue, rules, error, radioGroupProps }: Props) => {
    return (
        <FormControl component="fieldset">
            {label && <span className="text-13 font-medium" style={{ marginBottom: "6px" }}>{label}</span>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field }) => (
                    <RadioGroup
                        row
                        aria-label="refund-mode"
                        {...field}
                        value={field.value || ""}
                        style={{ marginLeft: "5px" }}
                        {...radioGroupProps}
                    >
                        {groupList.map((item, index) => (
                            <FormControlLabel
                                key={index}
                                value={item.value}
                                control={<Radio size="small" style={{ padding: "5px" }} />}
                                classes={{ label: "text-12 font-regular" }}
                                label={item.label}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
            <FormErrorMessage error={error} />
        </FormControl>
    )
}

export { CustomRadioGroup };