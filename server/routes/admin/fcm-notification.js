'use strict';

module.exports = [
    {
        method: 'POST',
        path: '/fcm-notifications/send',
        handler: 'fcm-notification.send',
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
        method: 'GET',
        path: '/fcm-notifications/count',
        handler: 'fcm-notification.count',
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
        path: '/fcm-notifications',
        handler: 'fcm-notification.find',
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
        path: '/fcm-notifications/:id',
        handler: 'fcm-notification.findOne',
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
        path: '/fcm-notifications',
        handler: 'fcm-notification.create',
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
        path: '/fcm-notifications/:id',
        handler: 'fcm-notification.update',
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
    },
    {
        method: 'DELETE',
        path: '/fcm-notifications/:id',
        handler: 'fcm-notification.delete',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.delete'],
                    },
                },
            ],
        },
    },
];