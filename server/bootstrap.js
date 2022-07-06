'use strict';

const fcmUtil = require('../util/fcm');


module.exports = ({ strapi }) => {
  // bootstrap phase
  fcmUtil.initialize(strapi);
};
