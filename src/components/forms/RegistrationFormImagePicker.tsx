import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Cancel from '@material-ui/icons/Cancel';

import { FormErrorMessage } from 'components/forms'
import { images } from 'utils/constants';

export const RegistrationFormImagePicker = ({ register, watch, setValue, clearErrors, errors, imageUrl }: any) => {
    const [preview, setPreview] = useState<any>(null);
    const { formatMessage } = useIntl();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!watch("image")?.[0]) {
            setPreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(watch("image")?.[0])
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl);
    }, [watch("image")]);

    useEffect(() => {
        if (imageUrl) {
            setPreview(imageUrl);
        }
    }, [imageUrl]);

    return (
        <div>
            <div style={{ display: "flex", height: "100%", }}>
                <div style={{ width: "150px", height: "150px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", position: "relative" }} >
                    <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={preview ?? images.defaultAvatar} alt="patient-registration-image" />
                    {preview && (
                        <IconButton
                            onClick={() => {
                                setValue("image", null);
                                clearErrors("image");
                            }} size="small"
                            style={{ position: "absolute", top: 0, right: 0 }}
                        >
                            <Cancel color="secondary" />
                        </IconButton>
                    )}
                </div>

                <div style={{ marginLeft: "15px", display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                        {formatMessage({ id: 'choose-picture' })}
                    </Typography>
                    <Typography variant="caption">
                        (.png, .jpg, .jpeg supported)
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        style={{ marginTop: "5px" }}
                        size="small"
                    >
                        <span>{formatMessage({ id: 'browse' })}</span>
                        <input
                            type="file"
                            hidden
                            {...register("image", {
                                validate: (value: any) => {
                                    const { type, size } = value?.["0"] ?? {};
                                    const isValidSize = +size / 1024 / 1024 >= 2;
                                    if (type && !(type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {
                                        return ".png .jpg, and .jpeg supported";
                                    } else if (isValidSize) {
                                        return "Maximum size 2 MB";
                                    } else {
                                        return true;
                                    }
                                }
                            })}
                            accept="image/png, image/jpg, image/jpeg"
                        />
                    </Button>
                </div>
            </div>

            <FormErrorMessage error={errors.image} />
        </div>
    )
}