import {
    User,
    CreateUser,
    UpdateUser,
    ChangePassword,
    Role,
    RolePermission,
    ClinicalUserCrendentialsMapping
} from 'pages';

export const securityRouteList = [
    {
        exact: true,
        path: '/security/user',
        component: User,
    },
    {
        exact: true,
        path: '/security/user/create',
        component: CreateUser,
    },
    {
        exact: true,
        path: '/security/user/update',
        component: UpdateUser,
    }, {
        exact: true,
        path: '/security/change-password',
        component: ChangePassword,
    }, {
        exact: true,
        path: '/security/user-credentials-mapping',
        component: ClinicalUserCrendentialsMapping,
    }, {
        exact: true,
        path: '/security/role',
        component: Role,
    }, {
        exact: true,
        path: '/security/role-permission',
        component: RolePermission,
    }
];