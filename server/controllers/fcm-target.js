'use strict';

/**
 *   controller
 */

const getService = () => {
    return strapi.plugin('strapi-plugin-fcm').service('fcm-target');
}

module.exports = {
    async find(ctx) {
        try {
            ctx.body = await getService().find(ctx.query);
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async count(ctx) {
        try {
            ctx.body = await getService().count(ctx.query);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
};