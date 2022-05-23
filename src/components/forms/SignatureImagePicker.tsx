import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';

import { FormErrorMessage } from 'components/forms'
import { images } from 'utils/constants';

export const SignatureImagePicker = ({ register, watch, setValue, clearErrors, errors, imageUrl }: any) => {
  const [preview, setPreview] = useState<any>(imageUrl ?? null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!watch("image")?.[0]) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(watch("image")?.[0])
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl);
  }, [watch("image")]);


  return (
    <div>
      <div style={{ height: "100%" }}>
        <div style={{ width: "100%", height: "110px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", position: "relative" }} >
          <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
            {imageUrl && !preview ?
              <img style={{ height: "100%" }} src={`data:image/image/png;image/jpg;image/jpeg;base64,${imageUrl}`} alt="user signature" />
              :
              <img style={{ height: "100%" }} src={preview ?? images.signatureImage} alt="user signature" />
            }
          </div>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            style={{ marginTop: "5px" }}
            size="small"
          >
            <span>{formatMessage({ id: 'upload-signature' })}</span>
            <input
              type="file"
              hidden
              {...register("image", {
                validate: (value: any) => {
                  const { type, size } = value?.["0"] ?? {};

                  if (type && size) {
                    const isValidSize = +size / 1024 <= 30;
                    if (type && !(type === "image/png" || type === "image/jpg" || type === "image/jpeg")) {
                      return ".png .jpg, and .jpeg supported";
                    } else if (!isValidSize) {
                      return "Maximum size 30 KB";
                    } else {
                      return true;
                    }
                  }

                }
              })}
              accept="image/png, image/jpg, image/jpeg"
            />
          </Button>
          <Typography variant="caption">
            (.png, .jpg, .jpeg supported)
          </Typography>
        </div>
      </div>

      <FormErrorMessage error={errors.image} />
    </div>
  )
}