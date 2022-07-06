'use strict';

/**
 *  service.
 */

var fcmUtil = require('../../util/fcm');

const { propOr } = require('lodash/fp');

const {
    getPaginationInfo,
    convertPagedToStartLimit,
    shouldCount,
    transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');

const { getFetchParams } = require('@strapi/strapi/lib/core-api/service');

const {
    hasDraftAndPublish,
    constants: { PUBLISHED_AT_ATTRIBUTE },
} = require('@strapi/utils').contentTypes;

const setPublishedAt = data => {
    data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};

const uid = 'plugin::strapi-plugin-fcm.fcm-plugin-configuration';
module.exports = ({ strapi }) => ({
    async find(params = {}) {

        const fetchParams = getFetchParams(params);
        const paginationInfo = getPaginationInfo(fetchParams);
        const data = await strapi.entityService.findMany(uid, {
            ...fetchParams,
            ...convertPagedToStartLimit(paginationInfo),
        });

        if (shouldCount(fetchParams)) {
            const count = await strapi.entityService.count(uid, { ...fetchParams, ...paginationInfo });

            return {
                data,
                pagination: transformPaginationResponse(paginationInfo, count),
            };
        }

        return {
            data,
            pagination: paginationInfo,
        };
    },

    async findOne(entityId, params) {
        return strapi.entityService.findOne(uid, entityId, getFetchParams(params));
    },

    async create(params = {}) {
        const { data } = params;
        const count = strapi.query(uid).count();
        if (count < 1) {
            return await strapi.entityService.create(uid, { ...params, data });
        } else if (data.id) {
            return await strapi.entityService.update(uid, data.id, { ...params, data });
        }
        return {
            error: 'Only one configuration is allowed, try passing the id to update the existing one.'
        };
    },

    async update(entityId, params = {}) {
        const { data } = params;
        const count = strapi.query(uid).count();
        if (count < 1) {
            return await strapi.entityService.create(uid, { ...params, data });
        } else {
            return await strapi.entityService.update(uid, entityId, { ...params, data });
        }
    }
});