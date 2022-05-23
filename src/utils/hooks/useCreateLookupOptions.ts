import { useMemo } from 'react';
import { SelectOptionsState } from 'utils/types';

interface Params {
    [key: string]: { [key: string]: any }[]
}

export function useCreateLookupOptions(data: Params) {

    const lookupData = useMemo(() => {
        return Object.keys(data).reduce((acc: any, curr) => {
            return (acc[curr] = data[curr]?.filter((option: any) => option.text)?.map((option: any) => ({ label: option.text, value: String(option.value) })), acc)
        }, {})
    }, [data])

    return lookupData;

}

export function useCreateLeadSourceLookupOptions(data: { [key: string]: any }[]) {
    const lookupData = useMemo(() => {
        return data.reduce((acc: any, curr: any) => {
            let option = { label: curr.name, value: String(curr.id) };
            acc[`leadSource${curr.leadSourceOrder}`] = acc?.[`leadSource${curr.leadSourceOrder}`] ? [option, ...acc[`leadSource${curr.leadSourceOrder}`]] : [option];
            return acc;
        }, {});

    }, [data])

    return lookupData;
}

export function useCreateDropdownOptions(data: { [key: string]: any }[], filterKey: string | null = null, filterValue: string | boolean | number | null | undefined = undefined, labelKey: string | null = null): SelectOptionsState[] {
    const lookupData = useMemo(() => {
        let result: any = data;
        if (filterKey && filterValue !== undefined) {
            result = result.filter((d: any) => d[filterKey] === filterValue);
        }
        return result.map((d: any) => ({ label: labelKey ? d[labelKey] : d.name, value: d.id }));
    }, [data])

    return lookupData;

}

export function createDropdownOptions(data: { [key: string]: any }[]) {
    const lookupData = data.map(d => ({ label: d.name, value: d.id }))

    return lookupData;
}