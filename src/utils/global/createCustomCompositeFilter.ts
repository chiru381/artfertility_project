import { filterOperators } from "utils/constants";

export function createCustomCompositeFilter(members: string[], value: string | number, operator: number = filterOperators.contains, isPaginationEnabled: boolean = true) {
    let tableFilterData = members.map(member => ({ member, value, operator }));
    let filterParams: any = {
        CustomCompositeFilters: [
            {
                "logicalOperator": 1,
                "customFilters": tableFilterData
            }
        ],
        sorts: [
            {
                member: "id",
                sortDirection: 1
            }
        ]
    }
    if (isPaginationEnabled) {
        filterParams = {
            ...filterParams,
            "page": 0,
            "pageSize": 20
        }
    }
    return filterParams;
}