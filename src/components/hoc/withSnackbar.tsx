import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Alert, { AlertProps } from "@material-ui/lab/Alert";
import { DefaultState } from "utils/types";

interface SnackBarProps {
  toastMessage: DefaultState['toastMessage'];
}

// export function withSnackbar<P>(
//   WrappedComponent: React.ComponentType<P>
// ) {
//   const ComponentWithExtraInfo = (props: P & SnackBarProps) => {
//     const [open, setOpen] = useState(false);
//     const [message, setMessage] = useState("");
//     const [duration, setDuration] = useState(2000);
//     const [severity, setSeverity] = useState<AlertProps['severity']>("success");

//     const toastMessage = (message: string, severity: AlertProps['severity'] = "success", duration: number = 2000) => {
//       setMessage(message);
//       setSeverity(severity);
//       setDuration(duration);
//       setOpen(true);
//     };

//     const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
//       if (reason === "clickaway") {
//         return;
//       }
//       setOpen(false);
//     };

//     return (
//       <>
//         <WrappedComponent {...props} toastMessage={toastMessage} />
//         <Snackbar
//           anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "center"
//           }}
//           autoHideDuration={duration}
//           open={open}
//           onClose={handleClose}
//           TransitionComponent={Slide}
//         >
//           <Alert variant="filled" onClose={handleClose} severity={severity}>
//             {message}
//           </Alert>
//         </Snackbar>
//       </>
//     );
//   };

//   return ComponentWithExtraInfo;
// }


type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

const withSnackbar = <P extends SnackBarProps>(Component: React.ComponentType<P>): React.ComponentClass<Omit<P, keyof SnackBarProps>> => {
  // tslint:disable-next-line:max-classes-per-file
  class MyHocClass extends React.Component<Omit<P, keyof SnackBarProps>, {open: boolean, message: string, duration: number, severity: AlertProps['severity']}> {

    constructor(props: any) {
      super(props);
      this.state = {
        message: "",
        severity: "success",
        duration: 2000,
        open: false
      }
    }

    toastMessage = (message: string, severity: AlertProps['severity'] = "success", duration: number = 2000) => {
      this.setState({
        message,
        severity,
        duration,
        open: true
      })
    };

    handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({
        open: false
      })
    };

    public render() {
      const {duration, open, message, severity} = this.state;
      return (
        <>
          <Component {...this.props as P} toastMessage={this.toastMessage} />

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            autoHideDuration={duration}
            open={open}
            onClose={this.handleClose}
            TransitionComponent={Slide}
          >
            <Alert variant="filled" onClose={this.handleClose} severity={severity}>
              {message}
            </Alert>
          </Snackbar>
        </>
      )
    }
  }

  return MyHocClass;
};

export { withSnackbar };