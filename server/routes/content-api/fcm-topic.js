'use strict';

//  router.

module.exports = [
    {
        method: 'GET',
        path: '/fcm-topics/count',
        handler: 'fcm-topic.count',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/fcm-topics',
        handler: 'fcm-topic.find',
        config: {
            policies: [],
        },
    },
    {
        method: 'GET',
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.findOne',
        config: {
            policies: [],
        },
    },
    {
        method: 'POST',
        path: '/fcm-topics',
        handler: 'fcm-topic.create',
        config: {
            policies: [],
        },
    },
    {
        method: 'PUT',
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.update',
        config: {
            policies: [],
        },
    },
    {
        method: 'DELETE',
        path: '/fcm-topics/:id',
        handler: 'fcm-topic.delete',
        config: {
            policies: [],
        },
    },
];