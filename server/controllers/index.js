'use strict';

const myController = require('./my-controller');

module.exports = {
  myController,
  'fcm-target': require('./fcm-target'),
  'fcm-topic': require('./fcm-topic'),
  'fcm-notification': require('./fcm-notification'),
  'fcm-plugin-configuration': require('./fcm-plugin-configuration'),
};
