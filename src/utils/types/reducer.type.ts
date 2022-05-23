import { TableFilterStateType } from './index';

// for object data type response
export interface DefaultReducerObjectType {
    loading: boolean;
    error: boolean;
    data: { [key: string]: any };
}

export interface AuthReducerObjectType {
    loading: boolean;
    error: boolean;
    data: { [key: string]: any };
    status: number;
}

export interface DefaultActionObjectType {
    type: string;
    payload: { [key: string]: any };
}

export interface AuthActionObjectType {
    type: string;
    payload: { [key: string]: any };
    status: number;
}

export interface PaginationActionType {
    type: string;
    payload: {
        modalItems: { [key: string]: any }[];
        totalRecord: number;
    } | { [key: string]: any };
    serviceType: string;
}

// for list(Array) data type response
export interface DefaultReducerListType {
    loading: boolean;
    error: boolean;
    data: { [key: string]: any }[];
}

export interface DefaultActionListType {
    type: string;
    payload: { [key: string]: any }[];
}


// --------------------------------------------
export interface IntlReducerType {
    locale: string;
};

export interface IntlActionType extends IntlReducerType {
    type: string;
};

export interface utilityReducerState {
    selectedClinic: string;
}

// employee list dummy table data
export interface EmployeeData {
    first_name: string;
    last_name: string;
    gender: string;
    age: number;
    date: string;
    country: string;
    salary: number;
    subRowData?: DefaultReducerListType
}

// Pagination reducer type
export interface PaginationReducerType extends DefaultReducerObjectType {
    data: {
        modelItems: { [key: string]: any }[];
        totalRecord: number;
    } | { [key: string]: any }
}


export interface PaginationState {
    items: EmployeeData[];
    pages: number;
    rowsCount: number;
}

export interface SubRowListType {
    loading: boolean;
    error: boolean;
    data: { [key: string]: any }[];
    index: number;
}

export interface EmployeeReducerType {
    loading: boolean;
    error: boolean;
    data: PaginationState;
    subRowData: SubRowListType[];
}

export interface EmployeeActionType {
    type: string;
    payload: { [key: string]: any }[];
    params: TableFilterStateType;
    rowIndex: number;
}