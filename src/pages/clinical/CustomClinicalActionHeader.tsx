import { memo, useEffect, useState, ReactElement, ReactNode } from "react";
import { useIntl } from "react-intl";
import {
  useLocation,
  useHistory,
  NavLink
} from "react-router-dom";
import { ButtonProps } from '@material-ui/core/Button';
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { IconButtonProps } from "@material-ui/core/IconButton";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { ButtonGroup, PrimaryButton, SaveButton, DeleteButton } from 'components/button';
import { ClinicalMenuState } from 'utils/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      background: "#FFFFFF",
      boxShadow: "0px 3px 5px #0000001A",
      borderRadius: "0px 0px 7px 7px",
      margin: "0 16px",
      display: "flex",
    },
    subContainer: {
      minHeight: "40px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      width: "100%",
    },
    tabMenu: {
      padding: "0 15px",
      color: "#AEAEAE",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    activeTabMenu: {
      background: '#FFEBEB',
      color: "#000000"
    },
    pageTitle: {
      alignItems: "center",
      display: "flex",
      padding: "0 15px"
    }
  })
);

interface CustomButtonProps extends ButtonProps {
  label?: string
}


interface RightActionProps {
  onSave?: () => void;
  onClickSecondaryButton?: () => void;
  goBack?: () => void;
  backButtonProps?: CustomButtonProps;
  saveButtonProps?: CustomButtonProps;
  secondaryButtonProps?: CustomButtonProps;
  menuList?: ClinicalMenuState[];
  onDelete?: () => void;
  deleteButtonProps?: IconButtonProps;
}

interface Props extends RightActionProps {
  title?: string;
}

const CustomClinicalActionHeader = memo((props: Props) => {
  const { title, ...rest } = props;
  const classes = useStyles();

  return (
    <ClinicalHeaderWrapper>
      <span className={classes.pageTitle + " text-14 font-bold text-uppercase"}>{title}</span>
      <ClinicalRightActions {...rest} />
    </ClinicalHeaderWrapper >
  )
});

export default CustomClinicalActionHeader;


export const ClinicalRightActions = (props: RightActionProps) => {
  const { onSave, goBack, backButtonProps, saveButtonProps, menuList, onClickSecondaryButton, secondaryButtonProps, onDelete, deleteButtonProps } = props;

  const location = useLocation();
  const history = useHistory();
  const { formatMessage } = useIntl();
  let url = location.pathname.split('/').slice(0, 4).join('/');

  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  let expandedMenuList = menuList?.reduce((acc: ClinicalMenuState[], curr: ClinicalMenuState) => {
    let result: ClinicalMenuState[] = [];
    if (curr?.subMenu?.length) {
      curr.subMenu.map(item => {
        if (item.subMenu?.length) {
          result = [...result, ...item.subMenu];
        } else {
          result = [...result, item];
        }
      })
    } else {
      result = [...result, curr]
    }
    return [...acc, ...result];
  }, []) ?? [];

  useEffect(() => {
    if (expandedMenuList?.length && location.pathname) {
      let activeIndex = expandedMenuList.findIndex((list) => `${url}${list.to}` === location.pathname);
      setActiveMenuIndex(activeIndex);
    }
  }, [expandedMenuList, location.pathname]);

  return (
    <div style={{ alignItems: "center", display: "flex", paddingRight: "15px" }}>
      <ButtonGroup>
        {expandedMenuList?.length !== 0 ? (
          <div style={{ display: "flex", alignItems: 'center' }}>
            <PrimaryButton
              size="small"
              label={formatMessage({ id: "previous" })}
              startIcon={<ChevronLeft color="action" style={{ fontSize: "30px" }} />}
              variant="text"
              className="text-14 font-medium"
              style={{ paddingTop: '0px', paddingBottom: "0px" }}
              disabled={activeMenuIndex === 0}
              onClick={() => history.push(url + expandedMenuList[activeMenuIndex - 1].to)}
            />
            <div style={{ width: "1px", height: '15px', background: "#D4D7DF", margin: "0 8px" }} />
            <PrimaryButton
              size="small"
              label={formatMessage({ id: "next" })}
              endIcon={<ChevronRight color="action" style={{ fontSize: "30px" }} />}
              variant="text"
              className="text-14 font-medium"
              style={{ paddingTop: '0px', paddingBottom: "0px" }}
              disabled={activeMenuIndex === (expandedMenuList?.length - 1)}
              onClick={() => history.push(url + expandedMenuList[activeMenuIndex + 1].to)}
            />
          </div>
        ) : null}

        {goBack && (
          <PrimaryButton
            onClick={goBack}
            size="small"
            label={backButtonProps?.label ?? "Back"}
            startIcon={<ChevronLeft color="action" style={{ fontSize: "30px" }} />}
            variant="text"
            className="text-14 font-medium"
            style={{ paddingTop: '0px', paddingBottom: "0px" }}
            {...backButtonProps}
          />
        )}

        {onSave && (
          <SaveButton
            onClick={onSave}
            size="small"
            className="text-12 font-regular"
            {...saveButtonProps}
          />
        )}

        {onClickSecondaryButton && (
          <PrimaryButton
            onClick={onClickSecondaryButton}
            size="small"
            className="text-12 font-regular"
            {...secondaryButtonProps}
          />
        )}

        {onDelete && (
          <DeleteButton
            onDelete={onDelete}
            {...deleteButtonProps}
          />
        )}
      </ButtonGroup>
    </div>
  )
}

export const ClinicalHeaderWrapper = ({ children }: { children: ReactElement[] }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
        {children}
      </div>
    </div>
  )
}

export const CustomClinicalTabActionHeader = memo((props: RightActionProps) => {
  const classes = useStyles();
  const location = useLocation();
  let url = location.pathname.substr(0, location.pathname.lastIndexOf("/"));

  return (
    <ClinicalHeaderWrapper>
      <div style={{ display: "flex" }}>
        {props?.menuList?.map(item => (
          <NavLink
            to={`${url}${item.to}`}
            className={classes.tabMenu + " font-bold text-14"}
            activeClassName={classes.activeTabMenu}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <ClinicalRightActions {...props} />
    </ClinicalHeaderWrapper >
  )
});

export const CustomClinicalActionHeaderWithWrap = memo((props: Props & { children: ReactNode | ReactElement | ReactNode[] | ReactElement[] }) => {
  const { title, children, ...rest } = props;
  const classes = useStyles();

  return (
    <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
      <ClinicalHeaderWrapper>
        <span className={classes.pageTitle + " text-14 font-bold text-uppercase"}>{title}</span>
        <ClinicalRightActions {...rest} />
      </ClinicalHeaderWrapper >

      <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px 16px 20px 16px" }}>
        {children}
      </div>
    </div>
  )
})

export const CustomClinicalTabActionHeaderWithWrap = memo((props: RightActionProps & { children: ReactNode | ReactElement | ReactNode[] | ReactElement[] }) => {
  const { children, ...rest } = props;
  const classes = useStyles();
  const location = useLocation();
  let url = location.pathname.substr(0, location.pathname.lastIndexOf("/"));

  return (
    <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
      <ClinicalHeaderWrapper>
        <div style={{ display: "flex" }}>
          {props?.menuList?.map(item => (
            <NavLink
              to={`${url}${item.to}`}
              className={classes.tabMenu + " font-bold text-14"}
              activeClassName={classes.activeTabMenu}
              key={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <ClinicalRightActions {...rest} />
      </ClinicalHeaderWrapper >

      <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px 16px 20px 16px" }}>
        {children}
      </div>
    </div>
  )
})