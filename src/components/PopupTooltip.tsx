import React, { ReactElement, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper, { PopperProps, PopperPlacementType } from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

interface Props {
  content: ReactElement;
  children: ReactElement;
  open: boolean;
  onClose?: () => void;
  arrow?: boolean;
  placement?: PopperPlacementType;
}

const useStyles = makeStyles((theme) => {
  const color = theme.palette.background.paper; // Feel free to customise this like they do in Tooltip
  return {
    popoverRoot: {
      backgroundColor: color,
      // maxWidth: "100%",
    },
    popper: {
      // zIndex: 5000,
      // maxWidth: 1000,

      // border: '1px solid rgba(27,31,35,.15)',
      // boxShadow: '0 3px 12px rgba(27,31,35,.15)',
      // borderRadius: 3,
      // width: 300,
      // zIndex: 1,
      // fontSize: 13,
      // color: '#586069',
      // backgroundColor: '#f6f8fa',

      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: "-0.71em",
        marginLeft: 4,
        marginRight: 4,
        "&::before": {
          transformOrigin: "0 100%"
        }
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: "-0.71em",
        marginLeft: 4,
        marginRight: 4,
        "&::before": {
          transformOrigin: "100% 0"
        }
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "100% 100%"
        }
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: "-0.71em",
        height: "1em",
        width: "0.71em",
        marginTop: 4,
        marginBottom: 4,
        "&::before": {
          transformOrigin: "0 0"
        }
      }
    },
    arrow: {
      overflow: "hidden",
      position: "absolute",
      width: "1em",
      height: "0.71em" /* = width / sqrt(2) = (length of the hypotenuse) */,
      boxSizing: "border-box",
      color,
      "&::before": {
        content: '""',
        margin: "auto",
        display: "block",
        width: "100%",
        height: "100%",
        boxShadow: theme.shadows[1],
        backgroundColor: "currentColor",
        transform: "rotate(45deg)",
      }
    }
  };
});

const PopupTooltip = memo(({
  placement = "bottom-start",
  arrow = true,
  open,
  onClose = () => { },
  content,
  children,
  ...rest
}: Props & PopperProps) => {
  const classes = useStyles();
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  const [childNode, setChildNode] = React.useState<HTMLElement | null>(null);
  const id = open ? 'custom-tooltip-popup' : undefined;

  return (
    <>
      {/* {React.cloneElement(children, { ...children.props, ref: setChildNode })} */}
      <div
        aria-describedby={id}
        ref={setChildNode}
      >
        {children}
      </div>

      <Popper
        id={id}
        open={open}
        anchorEl={childNode}
        placement={placement}
        transition
        className={classes.popper}
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: "window"
          },
          arrow: {
            enabled: arrow,
            element: arrowRef
          }
        }}
        {...rest}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={onClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={3} className={classes.popoverRoot}>
                {arrow ? (
                  <span className={classes.arrow} ref={setArrowRef} />
                ) : null}
                {content}
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
});

export { PopupTooltip };