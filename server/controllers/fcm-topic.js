'use strict';

/**
 *   controller
 */

const getService = () => {
    return strapi.plugin('strapi-plugin-fcm').service('fcm-topic');
}

module.exports = {
    async find(ctx) {
        try {
            ctx.body = await getService().find(ctx.query);
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async findOne(ctx) {
        try {
            ctx.body = await getService().findOne(ctx.params.id, ctx.query);
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async delete(ctx) {
        try {
            ctx.body = await getService().delete(ctx.params.id);
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async create(ctx) {
        try {
            ctx.body = await getService().create(ctx.request.body);
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async update(ctx) {
        try {
            ctx.body = await getService().update(ctx.params.id, ctx.request.body);
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
