'use strict';

//  router.

module.exports = [
    {
        method: 'GET',
        path: '/fcm-targets/count',
        handler: 'fcm-target.count',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.read'],
                    },
                },
            ],
        },
    },
    {
        method: 'GET',
        path: '/fcm-targets',
        handler: 'fcm-target.find',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.read'],
                    },
                },
            ],
        },
    },
];
