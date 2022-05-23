import Print from "@material-ui/icons/Print";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { FormattedMessage } from "react-intl";

import { SaveButton, SecondaryButton } from "components/button";
import { TableEditButton, DeleteButton } from "components/button";
import { FormPrimaryHeading } from "components/forms";

const Header = ({ handleSubmit, onSubmit, onSubmitAsDraft, onPrint, onPrevious, onNext, onEdit, onDelete, label, submitLabel }: any) => {

  return (
    <Paper>
      <div className="card-header" style={{ marginBottom: "15px", justifyContent: "center" }}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4} md={4} sm={6} style={{ alignItems: "center", display: "flex" }}>
            <FormPrimaryHeading label={label} />
          </Grid>
          <Grid item xs={12} lg={8} md={4} sm={6}>
            {onPrevious &&
              <Button onClick={onPrevious}>
                <FormattedMessage id={"previous"} />
              </Button>
            }
            {onNext && <>
              |
              <Button onClick={onNext}>
                <FormattedMessage id={"next"} />
              </Button>
            </>
            }
            {onPrint &&
              <SecondaryButton
                label="PRINT"
                endIcon={<Print color="primary" />}
                onClick={onPrint}
                style={{ marginRight: "10px" }}
              />
            }

            {handleSubmit && onSubmit && <SaveButton onClick={handleSubmit(onSubmit)} label={submitLabel} />}
            {handleSubmit && onSubmitAsDraft && <SaveButton onClick={handleSubmit(onSubmitAsDraft)} title="Save As Draft" style={{ marginLeft: "10px" }} label="Draft" />}
            {onEdit &&
              <>
                <TableEditButton
                  onClick={onEdit}
                  style={{ marginLeft: "10px" }}
                />|
              </>}
            {onDelete &&
              <>
                <DeleteButton onDelete={onDelete} style={{ marginLeft: "10px" }} />
              </>
            }
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default Header;
