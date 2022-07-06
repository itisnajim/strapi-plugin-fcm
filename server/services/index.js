'use strict';

const myService = require('./my-service');

module.exports = {
  myService,
  'fcm-target': require('./fcm-target'),
  'fcm-notification': require('./fcm-notification'),
  'fcm-topic': require('./fcm-topic'),
  'fcm-plugin-configuration': require('./fcm-plugin-configuration')
};
