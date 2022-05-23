import { AlertProps } from "@material-ui/lab/Alert";
import { AxiosPromise } from 'axios';
import { RouteComponentProps } from "react-router-dom";
export interface SelectOptionsState {
    label: string;
    value: string | number;
}

interface CustomTableFilterState {
    member: string;
    operator: number;
    value: string | number;
}
export interface TableFilterStateType {
    page: number;
    limit: number;
    sortKey?: string;
    sortType: "asc" | "desc" | "";
    columnFilter: CustomTableFilterState[];
    searchColumnFilters: CustomTableFilterState[];
}

export interface DefaultState {
    toastMessage: (message: string, severity?: AlertProps['severity'], duration?: number) => void;
}

export interface ParamsState {
    [key: string]: any
}
export interface ServiceState {
    [key: string]: (body: ParamsState) => AxiosPromise;
}


interface ClinicalSubMenuState {
    label: string;
    to: string;
    subMenu?: ClinicalSubMenuState[];
}

export interface ClinicalMenuState {
    subMenu?: ClinicalSubMenuState[];
    label: string;
    to: string;
}

export interface routeState {
    exact: boolean;
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}