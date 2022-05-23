import {
    SampleCollection,
    SampleDispatch,
    LaboratoryWorkList,
    ResultEntry
} from 'pages';

export const laboratoryRouteList = [
    {
        exact: true,
        path: '/lab/sample-collection',
        component: SampleCollection,
    }, {
        exact: true,
        path: '/lab/sample-dispatch',
        component: SampleDispatch,
    }, {
        exact: true,
        path: '/lab/laboratory-worklist',
        component: LaboratoryWorkList,
    }, {
        exact: true,
        path: '/lab/result-entry',
        component: ResultEntry,
    }
];