import { TableFilterStateType } from "utils/types";

export function getTableParams(tableState: TableFilterStateType | { [key: string]: any } = {}) {
    let params: any = {
        page: 1,
        pageSize: 10
    }

    if (tableState.page) {
        params = {
            ...params,
            page: tableState.page
        }
    }

    if (tableState.limit) {
        params = {
            ...params,
            pageSize: tableState.limit
        }
    }

    if (tableState.sortKey && tableState.sortType) {
        params = {
            ...params,
            sorts: [
                {
                    member: tableState.sortKey,
                    sortDirection: tableState.sortType === "asc" ? 0 : 1
                }
            ]
        }
    } else {
        params = {
            ...params,
            sorts: [
                {
                    member: "id",
                    sortDirection: 1
                }
            ]
        }
    }

    if (tableState.searchColumnFilters?.length) {
        params = {
            ...params,
            CustomCompositeFilters: tableState.searchColumnFilters
        }
    }

    if (tableState.columnFilter?.length) {
        params = {
            ...params,
            customFilters: tableState.columnFilter
        }
    }

    return params;
}