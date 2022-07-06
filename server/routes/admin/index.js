'use strict';

const fcmTopic = require('./fcm-topic');
const fcmNotification = require('./fcm-notification');
const fcmTarget = require('./fcm-target');
const fcmPluginConfiguration = require('./fcm-plugin-configuration');


module.exports = {
  type: 'admin',
  routes: [...fcmTopic, ...fcmNotification, ...fcmTarget, ...fcmPluginConfiguration],
};
