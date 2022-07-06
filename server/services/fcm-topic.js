'use strict';

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

/**
 *  service.
 */

const uid = 'plugin::strapi-plugin-fcm.fcm-topic';
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

        if (hasDraftAndPublish(contentType)) {
            setPublishedAt(data);
        }

        return strapi.entityService.create(uid, { ...params, data });
    },

    async update(entityId, params = {}) {
        const { data } = params;

        return strapi.entityService.update(uid, entityId, { ...params, data });
    },

    async delete(entityId, params = {}) {
        return strapi.entityService.delete(uid, entityId, params);
    },

    count(params = {}) {
        return strapi.query(uid).count({ where: params });
    },
});