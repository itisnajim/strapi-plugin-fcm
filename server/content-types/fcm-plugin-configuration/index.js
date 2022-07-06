'use strict';

const fcmUtil = require('../../../util/fcm');

const uid = 'plugin::strapi-plugin-fcm.fcm-plugin-configuration';
module.exports = {
    schema: require('./schema'),
    lifecycles: {
        afterCreate(event) {
            console.log('afterCreate', event);
            if(event?.module?.uid === uid) {
                fcmUtil.initialize(strapi);
            }
        },
        afterUpdate(event) {
            console.log('afterUpdate', event);
            if(event?.module?.uid === uid) {
                fcmUtil.initialize(strapi);
            }
        }
    },
};