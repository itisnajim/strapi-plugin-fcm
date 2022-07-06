'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/fcm-plugin-configurations',
        handler: 'fcm-plugin-configuration.find',
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
        path: '/fcm-plugin-configurations/:id',
        handler: 'fcm-plugin-configuration.findOne',
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
        method: 'POST',
        path: '/fcm-plugin-configurations',
        handler: 'fcm-plugin-configuration.create',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.create'],
                    },
                },
            ],
        },
    },
    {
        method: 'PUT',
        path: '/fcm-plugin-configurations/:id',
        handler: 'fcm-plugin-configuration.update',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.update'],
                    },
                },
            ],
        },
    }
];
