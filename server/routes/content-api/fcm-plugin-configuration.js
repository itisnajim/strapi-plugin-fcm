'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/fcm-plugin-configurations',
        handler: 'fcm-plugin-configuration.find',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/fcm-plugin-configurations/:id',
        handler: 'fcm-plugin-configuration.findOne',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/fcm-plugin-configurations',
        handler: 'fcm-plugin-configuration.create',
        config: {
            policies: [],
        },
    },
    {
        method: 'PUT',
        path: '/fcm-plugin-configurations/:id',
        handler: 'fcm-plugin-configuration.update',
        config: {
            policies: [],
        },
    }
];
