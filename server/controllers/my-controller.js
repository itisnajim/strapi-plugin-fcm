'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-plugin-fcm')
      .service('myService')
      .getWelcomeMessage();
  },
};
