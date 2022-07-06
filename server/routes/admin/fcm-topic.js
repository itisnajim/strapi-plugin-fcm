'use strict';

//  router.

module.exports = [
    {
        method: 'GET',
        path: '/fcm-topics/count',
        handler: 'fcm-topic.count',
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
        path: '/fcm-topics',
        handler: 'fcm-topic.find',
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
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.findOne',
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
        path: '/fcm-topics',
        handler: 'fcm-topic.create',
        config: {
            policies: [
                {
                    name: 'admin::hasPermissions',
                    config: {
                        actions: ['plugin::users-permissions.roles.create'],
                    },
                },
            ],
        }
    },
    {
        method: 'PUT',
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.update',
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
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.delete',
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